import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, Phone } from 'lucide-react';

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  config?: Record<string, unknown>;
  className?: string;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ 
  apiKey, 
  assistantId, 
  config = {},
  className = ''
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string}>>([]);

  useEffect(() => {
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsConnected(true);
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        setTranscript(prev => [...prev, {
          role: message.role,
          text: message.transcript
        }]);
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, [apiKey]);

  const startCall = () => {
    if (vapi) {
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return (
    <button 
      onClick={isConnected ? endCall : startCall}
      className={`p-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white shadow-lg relative ${
        isConnected 
          ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
          : 'bg-gradient-to-r from-purple-500 to-pink-500'
      } ${className}`}
      title={isConnected ? 'End Voice Call' : 'Start Voice Call'}
    >
      {isConnected ? <Phone className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      {isConnected && (
        <span 
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
            isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
          }`}
        />
      )}
    </button>
  );
};

export default VapiWidget;

// Usage in your app (inline with other buttons):
// <VapiWidget 
//   apiKey="your_public_api_key" 
//   assistantId="your_assistant_id"
//   className="optional-additional-classes" 
// />
