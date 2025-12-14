
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Bot, Phone } from 'lucide-react';
import { VapiClient } from '@vapi-ai/server-sdk';
console.log(import.meta.env.VITE_VAPI_API_KEY);
const vapi = new VapiClient({ token: import.meta.env.VITE_VAPI_API_KEY! });


interface FloatingAITherapistProps {
  onOpenFullChat: () => void;
}

const FloatingAITherapist = ({ onOpenFullChat }: FloatingAITherapistProps) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const miniChatRef = useRef<HTMLDivElement>(null);

  // Close mini chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (miniChatRef.current && !miniChatRef.current.contains(event.target as Node)) {
        setIsMinimized(true);
        setShowPhoneInput(false);
      }
    };

    if (!isMinimized) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMinimized]);

  const handleVoiceCallClick = () => {
    setShowPhoneInput(true);
  };

  const startCall = async () => {
    if (!phoneNumber.trim()) {
      alert('Please enter a phone number');
      return;
    }

    setIsCallInProgress(true);
    try {
      const call = await vapi.calls.create({ 
        assistantId: 'ce5fe09a-ff18-4c58-be57-382879dac614',
        phoneNumberId: 'f3cf295d-4d54-4709-b5a8-d6e9172ae236',
        customer: { number: phoneNumber },
      });
      console.log('Call initiated:', call.id);
      alert('Call initiated successfully! You will receive a call shortly.');
      setShowPhoneInput(false);
      setPhoneNumber('');
    } catch (error) {
      console.error('Call failed:', error);
      alert('Failed to initiate call. Please try again.');
    } finally {
      setIsCallInProgress(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <button
            onClick={() => setIsMinimized(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-16 h-16 bg-gradient-to-br from-serenity-500 to-lavender-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-pulse"
          >
            <Bot size={24} className="group-hover:animate-pulse" />
          </button>
          <div className={`absolute -top-12 right-0 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            Chat with AI Therapist
          </div>
        </div>
      )}

      {/* Mini Chat Window */}
      {!isMinimized && (
        <div ref={miniChatRef} className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-serenity-500 to-lavender-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-sm">AI Companion</h4>
                <p className="text-xs text-serenity-100">Here to listen 💙</p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-serenity-100 to-lavender-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="text-serenity-600" size={24} />
            </div>
            <h5 className="font-semibold text-gray-800 mb-2">Ready to chat?</h5>
            <p className="text-sm text-gray-600 mb-4">
              I'm here to provide a safe space for your thoughts and feelings.
            </p>
            
            {!showPhoneInput ? (
              <div className="flex flex-col gap-3 w-full px-4">
                <button
                  onClick={() => {
                    setIsMinimized(true);
                    onOpenFullChat();
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 w-full"
                >
                  💬 Start Text Chat
                </button>
                <button
                  onClick={handleVoiceCallClick}
                  className="group bg-white border-2 border-purple-300 hover:border-purple-500 text-purple-600 px-6 py-3 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 w-full flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Start Voice Call
                </button>
              </div>
            ) : (
              <div className="w-full px-4 space-y-3">
                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Enter your phone number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowPhoneInput(false);
                      setPhoneNumber('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startCall}
                    disabled={isCallInProgress || !phoneNumber.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCallInProgress ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Calling...
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        Call Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

  <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
  `}</style>
    </>
  );
};

export default FloatingAITherapist;
