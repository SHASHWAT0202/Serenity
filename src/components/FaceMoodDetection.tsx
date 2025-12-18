import { useEffect, useRef, useState } from "react";
import { Camera, X, RotateCw, Activity, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE = "https://face-detection-backend-main.onrender.com";
const API_ANALYZE_URL = `${API_BASE}/analyze`;
const API_HEALTH_URL = `${API_BASE}/health`;

const MAX_WIDTH = 640;
const JPEG_QUALITY = 0.85;
const REQUEST_TIMEOUT_MS = 20000;

const FaceMoodDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);

  const [mood, setMood] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [usingUserFacing, setUsingUserFacing] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  /* ---------------- Helpers ---------------- */

  const setStatusMsg = (msg: string, error = false) => {
    setStatus(msg);
    setIsError(error);
  };

  const listCameras = async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    const cams = all.filter(d => d.kind === "videoinput");
    setDevices(cams);
    if (!selectedDeviceId && cams.length > 0) {
      setSelectedDeviceId(cams[0].deviceId);
    }
  };

  const startCamera = async (deviceId?: string) => {
    try {
      stopCamera();
      
      console.log('Starting camera...', deviceId ? `Device: ${deviceId}` : 'Default device');
      
      // Set camera started FIRST so video element is rendered
      setCameraStarted(true);
      
      // Wait for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 100));

      const constraints: MediaStreamConstraints = deviceId
        ? { video: { deviceId: { exact: deviceId } } }
        : { video: { facingMode: usingUserFacing ? "user" : "environment" } };

      console.log('Requesting camera with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got stream:', stream);
      console.log('Video tracks:', stream.getVideoTracks().length);
      
      streamRef.current = stream;

      if (videoRef.current) {
        console.log('Setting srcObject...');
        videoRef.current.srcObject = stream;
        
        // Force properties
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        // Wait for the video to load metadata
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              console.log('✅ Video metadata loaded');
              console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
              console.log('Video readyState:', videoRef.current?.readyState);
              resolve();
            };
            setTimeout(() => {
              console.log('⚠️ Timeout reached, continuing anyway');
              resolve();
            }, 2000);
          } else {
            resolve();
          }
        });
        
        // Play the video
        console.log('Attempting to play video...');
        await videoRef.current.play();
        console.log('✅ Video playing successfully');
        console.log('Final dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
      } else {
        console.error('❌ videoRef.current is still null after waiting!');
        setCameraStarted(false);
        throw new Error('Video element not available');
      }

      await listCameras();
      setStatusMsg("Camera ready.");
    } catch (err: unknown) {
      const error = err as Error;
      console.error('❌ Camera error:', error);
      setStatusMsg(`Camera error: ${error.message}`, true);
      setCameraStarted(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraStarted(false);
    setMood(null);
    setRecommendations([]);
    setStatusMsg("Camera stopped.");
  };

  const flipCamera = () => {
    setUsingUserFacing(v => !v);
    startCamera();
  };

  const drawFrame = (): boolean => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return false;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return false;

    const scale = vw > MAX_WIDTH ? MAX_WIDTH / vw : 1;
    canvas.width = vw * scale;
    canvas.height = vh * scale;

    canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
    return true;
  };

  const canvasToBlob = (): Promise<Blob> =>
    new Promise((resolve, reject) => {
      canvasRef.current?.toBlob(
        b => (b ? resolve(b) : reject("Blob failed")),
        "image/jpeg",
        JPEG_QUALITY
      );
    });

  const fetchWithTimeout = async (url: string, options: RequestInit) => {
    const controller = new AbortController();
    controllerRef.current?.abort();
    controllerRef.current = controller;

    const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  };

  /* ---------------- Analyze ---------------- */

  const analyzeMood = async () => {
    const maxRetries = 2;
    let attempt = 0;
    
    try {
      setLoading(true);
      setMood(null);
      setRecommendations([]);
      setStatusMsg("Capturing frame…");

      if (!drawFrame()) {
        setStatusMsg("Video not ready. Try again.", true);
        return;
      }

      const blob = await canvasToBlob();
      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");

      while (attempt <= maxRetries) {
        attempt++;
        
        try {
          if (attempt === 1) {
            setStatusMsg("Analyzing mood…");
          } else {
            setStatusMsg(`Retrying... (attempt ${attempt}/${maxRetries + 1})`);
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 5000));
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000);

          const res = await fetch(API_ANALYZE_URL, {
            method: "POST",
            body: formData,
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            setMood(data.mood ?? "Unknown");
            setRecommendations(data.recommendations ?? []);
            setStatusMsg("Analysis complete!");
            return; // Success, exit
          }
          
          // Handle specific status codes
          if (res.status === 503) {
            if (attempt <= maxRetries) {
              console.log(`Server unavailable (503), retrying in 5 seconds... (${attempt}/${maxRetries + 1})`);
              continue; // Retry
            } else {
              throw new Error("Server is still starting up. Please wait a minute and try again.");
            }
          }
          
          // Other errors
          const errorText = await res.text().catch(() => '');
          throw new Error(`Server error ${res.status}: ${errorText || res.statusText}`);
          
        } catch (fetchError: unknown) {
          const error = fetchError as Error;
          
          // If it's an AbortError or network error and we have retries left, continue
          if ((error.name === "AbortError" || error.message.includes('Failed to fetch')) && attempt <= maxRetries) {
            console.log(`Request failed, retrying... (${attempt}/${maxRetries + 1})`);
            continue;
          }
          
          // No more retries or different error
          throw error;
        }
      }
      
      // If we exhausted all retries
      throw new Error("Server is not responding after multiple attempts. The server may be waking up. Please wait 30 seconds and try again.");
      
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Analysis error:', error);
      
      let errorMessage = "Analysis failed.";
      
      if (error.message.includes('Server is still starting') || error.message.includes('not responding after multiple')) {
        errorMessage = error.message;
      } else if (error.name === "AbortError") {
        errorMessage = "Request timed out. The server may be sleeping. Please wait 30 seconds and try again.";
      } else if (error.message.includes('503') || error.message.includes('Service Unavailable')) {
        errorMessage = "Server is starting up (this is normal after inactivity). Please wait 30 seconds and try again.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Cannot connect to server. It may be starting up. Please wait 30-60 seconds and try again.";
      } else {
        errorMessage = error.message || "Analysis failed. Please try again.";
      }
      
      setStatusMsg(errorMessage, true);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Lifecycle ---------------- */

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatusMsg("Camera not supported", true);
      return;
    }
    startCamera();
    return stopCamera;
    // eslint-disable-next-line
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Activity className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Mood Detection
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Discover your emotional state through advanced facial expression analysis
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-purple-100">
          
          {/* Camera Selection */}
          {devices.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Camera
              </label>
              <select
                value={selectedDeviceId}
                onChange={e => {
                  setSelectedDeviceId(e.target.value);
                  startCamera(e.target.value);
                }}
                disabled={loading}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:opacity-50"
              >
                {devices.map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Message */}
          {status && (
            <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${
              isError 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              {isError ? (
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              ) : (
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              )}
              <p className={`text-sm font-medium ${isError ? 'text-red-700' : 'text-green-700'}`}>
                {status}
              </p>
            </div>
          )}

          {/* Camera Section */}
          {!cameraStarted ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Camera className="text-purple-500" size={64} />
              </div>
              <button
                onClick={() => startCamera()}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Camera size={24} />
                <span>Start Camera</span>
              </button>
              
              <div className="mt-10 text-sm text-gray-600 max-w-md mx-auto space-y-2">
                <p className="flex items-center justify-center space-x-2">
                  <span>📷</span>
                  <span>Ensure your camera is connected</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span>🔒</span>
                  <span>Allow camera permissions when prompted</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span>💡</span>
                  <span>Good lighting improves accuracy</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Video Feed */}
              <div className="relative w-full flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white" style={{ maxWidth: '640px', width: '100%', backgroundColor: '#1a1a1a' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transform: 'scaleX(-1)',
                      minHeight: '400px',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Debug info overlay */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Camera: {cameraStarted ? 'Active' : 'Inactive'}
                  </div>
                  
                  {/* Live Badge */}
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>

                  {/* Analyzing Overlay */}
                  {loading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl">
                        <Loader2 size={48} className="animate-spin text-purple-600" />
                        <p className="text-gray-800 font-semibold text-lg">Analyzing your mood...</p>
                        <p className="text-gray-600 text-sm">This may take a few seconds</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Helpful Hint */}
              <p className="text-center text-sm text-gray-600">
                👤 Position your face in center • 💡 Ensure good lighting • 😊 Relax naturally
              </p>

              {/* Control Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={analyzeMood}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Activity size={20} />
                      <span>Analyze Mood</span>
                    </>
                  )}
                </button>

                {devices.length > 1 && (
                  <button
                    onClick={flipCamera}
                    disabled={loading}
                    className="bg-purple-100 text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-purple-200 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <RotateCw size={20} />
                    <span>Switch Camera</span>
                  </button>
                )}

                <button
                  onClick={stopCamera}
                  disabled={loading}
                  className="bg-red-100 text-red-700 px-6 py-3 rounded-full font-semibold hover:bg-red-200 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                >
                  <X size={20} />
                  <span>Stop Camera</span>
                </button>
              </div>
            </div>
          )}

          {/* Mood Results */}
          {mood && (
            <div className="mt-8 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                  <Activity className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-purple-700 mb-2 capitalize">
                  {mood}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-4"></div>
              </div>

              {recommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    💡 Personalized Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 flex-1 pt-1">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Try Again Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={analyzeMood}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 inline-flex items-center space-x-2"
                >
                  <RotateCw size={18} />
                  <span>Analyze Again</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle size={16} className="text-green-600" />
            <p className="font-medium text-gray-700">
              🔒 Your privacy matters. All images are processed securely and not stored.
            </p>
          </div>
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> AI mood detection provides algorithmic insights based on visual analysis. 
            Results may vary and should not replace professional mental health advice. 
            For professional support, please consult a qualified expert.
          </p>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default FaceMoodDetection;
