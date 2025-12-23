
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Bot, Phone } from 'lucide-react';
import { VapiClient } from '@vapi-ai/server-sdk';
console.log(import.meta.env.VITE_VAPI_PRIVATE_KEY);
const vapi = new VapiClient({ token: import.meta.env.VITE_VAPI_PRIVATE_KEY! });


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
        assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID!,
        phoneNumberId: import.meta.env.VITE_VAPI_PHONE_NUMBER_ID!,
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
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 animate-bounce">
          <button
            onClick={() => setIsMinimized(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-serenity-500 to-lavender-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-pulse"
          >
            <Bot size={20} className="sm:w-6 sm:h-6 group-hover:animate-pulse" />
          </button>
          <div className={`absolute -top-12 right-0 bg-black/80 text-white px-3 py-1 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            Chat with AI Therapist
          </div>
        </div>
      )}

      {/* Mini Chat Window */}
      {!isMinimized && (
        <div ref={miniChatRef} className="fixed bottom-20 right-4 left-4 sm:bottom-6 sm:right-6 sm:left-auto w-auto sm:w-80 h-[500px] sm:h-96 max-w-md bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-serenity-500 to-lavender-500 text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={14} className="sm:w-4 sm:h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm">AI Companion</h4>
                <p className="text-[10px] sm:text-xs text-serenity-100">Here to listen 💙</p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center items-center text-center overflow-y-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-serenity-100 to-lavender-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Bot className="text-serenity-600" size={20} />
            </div>
            <h5 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Ready to chat?</h5>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 px-2">
              I'm here to provide a safe space for your thoughts and feelings.
            </p>
            
            {!showPhoneInput ? (
              <div className="flex flex-col gap-2 sm:gap-3 w-full px-2 sm:px-4">
                <button
                  onClick={() => {
                    setIsMinimized(true);
                    onOpenFullChat();
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 w-full active:scale-95"
                >
                  💬 Start Text Chat
                </button>
                <button
                  onClick={handleVoiceCallClick}
                  className="group bg-white border-2 border-purple-300 hover:border-purple-500 text-purple-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 w-full flex items-center justify-center gap-2 active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
                  Start Voice Call
                </button>
              </div>
            ) : (
              <div className="w-full px-2 sm:px-4 space-y-2 sm:space-y-3">
                <div className="text-left">
                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Enter your phone number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowPhoneInput(false);
                      setPhoneNumber('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-300 transition-all duration-300 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startCall}
                    disabled={isCallInProgress || !phoneNumber.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95"
                  >
                    {isCallInProgress ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] sm:text-xs">Calling...</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
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
