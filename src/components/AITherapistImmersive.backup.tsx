import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, AlertTriangle, Sparkles, Shield, Heart, Clock } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';
import OpenAI from 'openai';
import AnimatedAvatar from './AnimatedAvatar';
import ParticleField from './ParticleField';
import VoiceWaveform from './VoiceWaveform';
import ThoughtBubble from './ThoughtBubble';

interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AITherapistImmersive = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm Serenity, your compassionate AI companion.\n\nThis is your safe space - no judgment, just understanding. What's on your mind today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'empathetic' | 'listening'>('neutral');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // API setup
  const envVars = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  const GEMINI_API_KEY = envVars?.VITE_GEMINI_API_KEY;
  const OPENAI_API_KEY = envVars?.VITE_OPENAI_API_KEY;
  
  const genAIRef = useRef<GoogleGenerativeAI | null>(null);
  const openAIRef = useRef<OpenAI | null>(null);

  useEffect(() => {
    if (GEMINI_API_KEY) {
      genAIRef.current = new GoogleGenerativeAI(GEMINI_API_KEY);
    }
    if (OPENAI_API_KEY) {
      openAIRef.current = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    }
  }, [GEMINI_API_KEY, OPENAI_API_KEY]);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognitionCtor = (window as unknown as Record<string, unknown>).webkitSpeechRecognition as (new () => ISpeechRecognition) | undefined || (window as unknown as Record<string, unknown>).SpeechRecognition as (new () => ISpeechRecognition) | undefined;
      recognitionRef.current = new SpeechRecognitionCtor();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN';
        
        recognitionRef.current.onresult = (event: RecognitionResultEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = () => setIsListening(false);
      }
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const detectHarmfulContent = (text: string): boolean => {
    const harmfulKeywords = [
      'hurt myself', 'kill myself', 'end it all', 'suicide', 'self harm',
      'want to die', 'better off dead', 'no point living'
    ];
    return harmfulKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const generateFallbackResponse = (userMessage: string): string => {
    const responses = {
      sad: "I can feel the weight you're carrying right now. 💙 That heaviness is so real.\n\n**Let's try some gentle support:**\n• Place your hand on your heart\n• Remember you're not alone\n• This feeling won't last forever\n\nWhat usually brings you even tiny moments of peace?",
      anxious: "I can sense that anxious energy. 🫁 Let's slow this down together.\n\n**Quick grounding:**\n• 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n\nWhat's the biggest worry right now?",
      stressed: "That overwhelmed feeling is so real! 🌀\n\n**Quick stress relievers:**\n• Step outside for 2 minutes\n• Do 20 deep breaths\n• One thing off your plate NOW\n\nWhat would you remove from your plate if you could?",
      default: "Thank you for sharing that with me. 💫\n\n**I'm here to help with:**\n• Processing emotions\n• Finding coping strategies\n• Fresh perspectives\n\nWhat feels most important to explore right now?"
    };

    const userLower = userMessage.toLowerCase();
    if (userLower.includes('sad') || userLower.includes('depressed')) return responses.sad;
    if (userLower.includes('anxious') || userLower.includes('worried')) return responses.anxious;
    if (userLower.includes('stressed') || userLower.includes('overwhelmed')) return responses.stressed;
    return responses.default;
  };

  const generateTherapistResponse = async (userMessage: string): Promise<string> => {
    // Try Gemini first (free)
    if (genAIRef.current) {
      try {
        const model = genAIRef.current.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent(`You are Serenity, a warm AI therapy companion. Write 6-10 sentences in a conversational tone. Include 1-2 emojis. User says: "${userMessage}"`);
        const text = result.response?.text?.() ?? '';
        if (text) return text.trim();
      } catch (error) {
        console.warn('Gemini unavailable');
      }
    }
    
    // Try OpenAI (paid backup)
    if (openAIRef.current) {
      try {
        const completion = await openAIRef.current.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are Serenity, a warm, empathetic AI therapy companion. Write 6-10 sentences.' },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.9,
          max_tokens: 500
        });
        const text = completion.choices[0]?.message?.content || '';
        if (text) return text.trim();
      } catch (error) {
        console.error('OpenAI error');
      }
    }
    
    return generateFallbackResponse(userMessage);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    if (detectHarmfulContent(inputText)) {
      setShowSOSAlert(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setAvatarEmotion('listening');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const aiText = await generateTherapistResponse(userMessage.text);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setAvatarEmotion(aiText.includes('💙') ? 'empathetic' : 'neutral');
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!speechSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle particles */}
      <ParticleField />

      {/* SOS Alert */}
      <AnimatePresence>
        {showSOSAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md shadow-2xl"
            >
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">We're Here for You</h3>
                <p className="text-gray-600 mb-6">Professional help is available right now.</p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.open('tel:18005990019')}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold"
                  >
                    🇮🇳 KIRAN Helpline: 1800-599-0019
                  </button>
                  <button 
                    onClick={() => setShowSOSAlert(false)}
                    className="w-full border-2 border-gray-200 py-3 rounded-xl font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Central Robot Avatar */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <AnimatedAvatar 
            isThinking={isTyping}
            isSpeaking={isTyping}
            emotion={avatarEmotion}
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              Serenity AI
            </h1>
            <p className="text-white/70">Your compassionate companion • Always listening 💙</p>
          </motion.div>
        </motion.div>

        {/* Thought Bubbles Container */}
        <div 
          ref={messagesContainerRef}
          className="max-w-5xl mx-auto space-y-8 mb-8 max-h-[500px] overflow-y-auto px-4"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139, 92, 246, 0.5) transparent' }}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <ThoughtBubble
                key={message.id}
                text={message.text}
                timestamp={message.timestamp}
                isUser={message.sender === 'user'}
              />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 px-6 py-4">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-3 h-3 bg-purple-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Voice Waveform */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <VoiceWaveform isActive={isListening} />
          </motion.div>
        )}

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-4 shadow-2xl">
            <div className="flex gap-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Share what's on your mind... 💭"
                className="flex-1 bg-transparent text-white placeholder-white/50 px-4 py-3 resize-none focus:outline-none min-h-[60px] max-h-[120px]"
                rows={2}
              />
              
              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl text-white disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
                
                {speechSupported && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVoiceInput}
                    className={`p-4 rounded-2xl text-white ${
                      isListening ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Info Pills */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {[
              { icon: Shield, text: '100% Private', color: 'text-green-400' },
              { icon: Sparkles, text: 'AI-Powered', color: 'text-purple-400' },
              { icon: Heart, text: 'Always Here', color: 'text-red-400' }
            ].map((pill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
              >
                <pill.icon className={`w-4 h-4 ${pill.color}`} />
                <span className="text-white/70 text-sm">{pill.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AITherapistImmersive;
