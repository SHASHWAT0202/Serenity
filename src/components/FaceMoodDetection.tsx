
import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Scan, AlertCircle, Smile, Meh, Frown, Heart } from 'lucide-react';

interface MoodResult {
  emotion: string;
  confidence: number;
  color: string;
  icon: React.ReactNode;
  description: string;
  recommendations: string[];
}

interface FastAPIMoodResponse {
  mood: string;
  recommendations: string[];
}

const FaceMoodDetection = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // FastAPI endpoint
  const FASTAPI_ENDPOINT = import.meta.env.VITE_FASTAPI_ENDPOINT || 'https://face-detection-backend-7x1.onrender.com/analyze-mood';

  const moodMapping: Record<string, { color: string; icon: React.ReactNode; description: string }> = {
    happy: {
      color: 'text-yellow-500',
      icon: <Smile className="text-yellow-500" size={24} />,
      description: 'You appear to be in a positive, joyful state!'
    },
    sad: {
      color: 'text-blue-500',
      icon: <Frown className="text-blue-500" size={24} />,
      description: 'You seem to be feeling down. Consider some uplifting activities.'
    },
    neutral: {
      color: 'text-gray-500',
      icon: <Meh className="text-gray-500" size={24} />,
      description: 'You appear to be in a calm, balanced emotional state.'
    },
    angry: {
      color: 'text-red-500',
      icon: <Frown className="text-red-500" size={24} />,
      description: 'You might be feeling frustrated. Try some breathing exercises.'
    },
    surprised: {
      color: 'text-purple-500',
      icon: <Smile className="text-purple-500" size={24} />,
      description: 'You seem alert and engaged!'
    },
    fear: {
      color: 'text-orange-500',
      icon: <AlertCircle className="text-orange-500" size={24} />,
      description: 'You might be feeling anxious. Take deep breaths and ground yourself.'
    },
    disgust: {
      color: 'text-green-500',
      icon: <Meh className="text-green-500" size={24} />,
      description: 'You seem to be experiencing some discomfort. Consider what might be causing this.'
    }
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setIsLoading(true);
      setError('');
      setMoodResult(null);
      setCapturedImage(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      
      console.log('Camera stream obtained, tracks:', stream.getTracks().length);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Try multiple event handlers to ensure video loads
        const video = videoRef.current;
        
        const onVideoReady = () => {
          console.log('Video is ready to play');
          setCameraActive(true);
          setIsLoading(false);
        };
        
        video.onloadedmetadata = onVideoReady;
        video.onloadeddata = onVideoReady;
        video.oncanplay = onVideoReady;
        
        // Force play the video
        try {
          await video.play();
          console.log('Video playing successfully');
          setCameraActive(true);
          setIsLoading(false);
        } catch (playError) {
          console.log('Auto-play failed, waiting for user interaction');
          // If autoplay fails, wait for the video to be ready
          video.oncanplay = onVideoReady;
        }
        
        video.onerror = (err) => {
          console.error('Video error:', err);
          setError('Video playback error');
          setIsLoading(false);
        };
        
        // Force a state update after a delay
        setTimeout(() => {
          if (video.srcObject && !cameraActive) {
            console.log('Forcing camera state update');
            setCameraActive(true);
            setIsLoading(false);
          }
        }, 2000);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      let errorMessage = 'Failed to access camera. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported by this browser.';
      } else {
        errorMessage += err.message || 'Please check your camera permissions.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Test function to manually set video source
  const testVideo = () => {
    if (videoRef.current) {
      // Create a simple colored canvas as test
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.fillText('TEST VIDEO', 100, 240);
      }
      
      const stream = canvas.captureStream();
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      setIsLoading(false);
      console.log('Test video set');
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setMoodResult(null);
    setCapturedImage(null);
    setError('');
  };

  const captureImage = (): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas not available');
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to base64 string
    try {
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      return imageData;
    } catch (err) {
      console.error('Error converting image to base64:', err);
      return null;
    }
  };

  const analyzeMoodWithAPI = async (imageData: string): Promise<FastAPIMoodResponse> => {
    try {
      // Remove the data:image/jpeg;base64, prefix
      const base64Image = imageData.split(',')[1];
      
      const response = await fetch(FASTAPI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error('Failed to analyze mood. Please check your connection and try again.');
    }
  };

  const analyzeMood = async () => {
    if (!videoRef.current || !cameraActive) {
      console.log('Cannot analyze - no video or camera not active');
      return;
    }
    
    console.log('Starting mood analysis...');
    setIsAnalyzing(true);
    setError('');
    
    try {
      // Capture the current frame
      const imageData = captureImage();
      if (!imageData) {
        throw new Error('Failed to capture image from camera');
      }

      // Store the captured image for display
      setCapturedImage(imageData);

      // Send to FastAPI backend
      const apiResult = await analyzeMoodWithAPI(imageData);
      
      // Map the API result to our component's format
      const moodInfo = moodMapping[apiResult.mood.toLowerCase()] || moodMapping.neutral;
      
      const result: MoodResult = {
        emotion: apiResult.mood.charAt(0).toUpperCase() + apiResult.mood.slice(1),
        confidence: 0.85, // Default confidence since API doesn't provide it
        color: moodInfo.color,
        icon: moodInfo.icon,
        description: moodInfo.description,
        recommendations: apiResult.recommendations
      };
      
      setMoodResult(result);
      console.log('Mood analysis completed:', result);
      
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze mood. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scan className="text-white" size={24} />
          </div>
          <h3 className="text-3xl font-bold text-gradient mb-4">AI Mood Detection</h3>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Our advanced AI analyzes your facial expressions to understand your current emotional state and provide personalized recommendations.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Debug Info */}
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 text-center">
            <p className="text-blue-800 text-sm">
              🔍 Debug: Camera: {cameraActive ? 'ON' : 'OFF'} | Loading: {isLoading ? 'YES' : 'NO'} | Analyzing: {isAnalyzing ? 'YES' : 'NO'}
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Video Ref: {videoRef.current ? 'EXISTS' : 'NULL'} | Stream: {streamRef.current ? 'ACTIVE' : 'NULL'}
            </p>
            <button 
              onClick={() => {
                console.log('Video element:', videoRef.current);
                console.log('Video srcObject:', videoRef.current?.srcObject);
                console.log('Video readyState:', videoRef.current?.readyState);
                console.log('Video currentTime:', videoRef.current?.currentTime);
                console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Debug Video
            </button>
            <button 
              onClick={testVideo}
              className="mt-2 ml-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
            >
              Test Video
            </button>
          </div>
          
          {/* Camera Controls */}
          <div className="text-center mb-6">
            {!cameraActive ? (
              <div className="space-y-4">
                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="text-gray-400" size={48} />
                </div>
                <button
                  onClick={startCamera}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  <Camera size={20} />
                  <span>{isLoading ? 'Starting Camera...' : 'Start Camera'}</span>
                </button>
                <p className="text-sm text-gray-500">
                  📸 Click "Start Camera" to begin mood detection
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Video Feed */}
                <div className="relative max-w-md mx-auto">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-auto rounded-2xl border-4 border-white shadow-lg bg-black"
                    style={{ transform: 'scaleX(-1)', minHeight: '300px', maxHeight: '400px' }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Live indicator */}
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </div>
                  
                  {/* Video info */}
                  <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    {videoRef.current?.videoWidth || 0} x {videoRef.current?.videoHeight || 0}
                  </div>
                </div>

                {/* Analysis Controls */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={analyzeMood}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Scan size={20} />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Mood'}</span>
                  </button>
                  
                  <button
                    onClick={stopCamera}
                    className="bg-gray-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2"
                  >
                    <CameraOff size={20} />
                    <span>Stop Camera</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-700 font-medium">Analysis Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-red-500 text-sm underline mt-2 hover:text-red-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Analysis Loading */}
          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Scan className="text-white" size={24} />
              </div>
              <p className="text-gray-700 font-medium">AI is analyzing your facial expressions...</p>
              <div className="mt-4 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Captured Image Display */}
          {capturedImage && !isAnalyzing && (
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Captured Image</h4>
              <div className="max-w-sm mx-auto">
                <img 
                  src={capturedImage} 
                  alt="Captured for mood analysis" 
                  className="w-full h-auto rounded-xl border-2 border-gray-200 shadow-md"
                />
                <p className="text-sm text-gray-500 mt-2">This image was analyzed by our AI</p>
              </div>
            </div>
          )}

          {/* Mood Results */}
          {moodResult && !isAnalyzing && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {moodResult.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">
                    Detected Mood: <span className={moodResult.color}>{moodResult.emotion}</span>
                  </h4>
                  <div className="bg-white rounded-full px-4 py-2 inline-block mb-4">
                    <span className="text-sm font-medium text-gray-600">
                      Confidence: {(moodResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-gray-600 max-w-md mx-auto">{moodResult.description}</p>
                </div>
              </div>

              {/* AI-Generated Recommendations */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Heart className="w-5 h-5 text-purple-500" />
                    <h5 className="font-semibold text-gray-800">💡 AI Recommendations</h5>
                  </div>
                  <div className="space-y-2">
                    {moodResult.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Try Again Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setMoodResult(null);
                    setCapturedImage(null);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <Scan size={20} />
                  <span>Analyze Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-8 text-center text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
            <h5 className="font-semibold text-gray-700 mb-2">🔒 Your Privacy Matters</h5>
            <p>Images are processed by our AI for mood analysis and are not stored permanently. Your privacy is our priority.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaceMoodDetection;
