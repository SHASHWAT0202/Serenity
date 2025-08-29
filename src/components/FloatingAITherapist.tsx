
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';

interface FloatingAITherapistProps {
  onOpenFullChat: () => void;
}

const FloatingAITherapist = ({ onOpenFullChat }: FloatingAITherapistProps) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const miniChatRef = useRef<HTMLDivElement>(null);

  // Close mini chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (miniChatRef.current && !miniChatRef.current.contains(event.target as Node)) {
        setIsMinimized(true);
      }
    };

    if (!isMinimized) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMinimized]);

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
            <button
              onClick={() => {
                setIsMinimized(true);
                onOpenFullChat();
              }}
              className="bg-gradient-to-r from-serenity-500 to-lavender-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Conversation
            </button>
            <a
              href="/voice-assist.html"
              className="ml-3 inline-block bg-white border border-gray-200 text-serenity-700 px-4 py-3 rounded-full text-sm font-semibold hover:shadow transition-all duration-300"
            >
              Voice Assist
            </a>
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
