import { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCw, Loader2, Activity } from 'lucide-react';

interface MoodResult {
  mood: string;
  recommendations: string[];
}

const FaceMoodDetection = () => {
  const [cameraStarted, setCameraStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null);
  const [error, setError] = useState<string>('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // API endpoint
  const API_ENDPOINT = 'https://face-detection-meon.onrender.com/analyze';
  const HEALTH_ENDPOINT = 'https://face-detection-meon.onrender.com/health';

  // Get camera devices
  const getCameraDevices = async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error getting devices:', err);
    }
  };

  // Warm up server
  const warmUpServer = async () => {
    try {
      await fetch(HEALTH_ENDPOINT);
      console.log('Server warmed up');
    } catch (err) {
      console.log('Server warmup failed');
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setError('');
      await getCameraDevices();

      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId } }
          : true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStarted(true);
      }

      warmUpServer();
    } catch (err: any) {
      setError(err.message || 'Failed to access camera');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraStarted(false);
    setMoodResult(null);
    setError('');
  };

  // Flip camera
  const flipCamera = async () => {
    stopCamera();
    setTimeout(() => startCamera(), 100);
  };

  // Capture image
  const captureImage = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const maxWidth = 640;
    const scale = maxWidth / video.videoWidth;
    canvas.width = maxWidth;
    canvas.height = video.videoHeight * scale;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Analyze mood
  const analyzeMood = async () => {
    if (!cameraStarted) {
      setError('Please start the camera first');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const imageData = captureImage();
      if (!imageData) throw new Error('Failed to capture image');

      const base64Image = imageData.split(',')[1];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data: MoodResult = await response.json();
      setMoodResult(data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        setError(err.message || 'Failed to analyze mood');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Change device
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (cameraStarted) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  // Load devices on mount
  useEffect(() => {
    getCameraDevices();
    return () => stopCamera();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Activity className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI Mood Detection
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Discover your emotional state through advanced facial expression analysis. 
            Our AI analyzes your face and provides personalized recommendations.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-100">
          {/* Camera Selection - Show when camera not started */}
          {!cameraStarted && devices.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Camera
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => handleDeviceChange(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Camera not started - Show start button */}
          {!cameraStarted ? (
            <div className="text-center py-12">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Camera className="text-purple-500" size={64} />
              </div>
              <button
                onClick={startCamera}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <Camera size={24} />
                <span>Start Camera</span>
              </button>
            </div>
          ) : (
            /* Camera started - Show video and controls */
            <div className="space-y-6">
              {/* Video Feed */}
              <div className="relative max-w-2xl mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-2xl shadow-xl"
                  style={{ transform: 'scaleX(-1)', minHeight: '300px' }}
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Live Badge */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={analyzeMood}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isAnalyzing ? (
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

                <button
                  onClick={flipCamera}
                  className="bg-purple-100 text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-purple-200 transition-all duration-300 flex items-center space-x-2"
                >
                  <RotateCw size={20} />
                  <span>Flip Camera</span>
                </button>

                <button
                  onClick={stopCamera}
                  className="bg-red-100 text-red-700 px-6 py-3 rounded-full font-semibold hover:bg-red-200 transition-all duration-300 flex items-center space-x-2"
                >
                  <X size={20} />
                  <span>Stop Camera</span>
                </button>
              </div>
            </div>
          )}

          {/* Mood Results */}
          {moodResult && (
            <div className="mt-8 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-purple-700 mb-2">
                  Detected Mood: {moodResult.mood}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </div>

              {moodResult.recommendations && moodResult.recommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Recommendations for you:
                  </h3>
                  <ul className="space-y-3">
                    {moodResult.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 flex-1">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Your privacy matters. All images are processed securely and not stored on our servers.
          </p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-purple-600 hover:text-purple-700 underline">
              Privacy Policy
            </a>
            <a href="#" className="text-purple-600 hover:text-purple-700 underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceMoodDetection;