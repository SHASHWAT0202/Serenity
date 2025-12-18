import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import VapiWidget from './ui/vapiWidget';

// Web Speech API types
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

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AITherapistImmersive = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to your safe space. I'm here to listen, support, and guide you with compassion. What's on your mind today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const openAIRef = useRef<OpenAI | null>(null);
  const genAIRef = useRef<GoogleGenerativeAI | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevIsTypingRef = useRef(isTyping);

  // Initialize APIs
  useEffect(() => {
    if (OPENAI_API_KEY) {
      openAIRef.current = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
      console.info('[Serenity AI] ✅ OpenAI configured');
    } else if (GEMINI_API_KEY) {
      genAIRef.current = new GoogleGenerativeAI(GEMINI_API_KEY);
      console.info('[Serenity AI] ✅ Gemini configured');
    }
  }, []);

  // Auto-scroll messages container only (not entire page)
  useEffect(() => {
    // Check if typing just changed from true to false
    if (prevIsTypingRef.current && !isTyping) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
      prevIsTypingRef.current = isTyping;
      return () => clearTimeout(timer);
    }
    prevIsTypingRef.current = isTyping;
  }, [isTyping]);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognitionCtor = (window as unknown as Record<string, unknown>).webkitSpeechRecognition as
        | (new () => ISpeechRecognition)
        | undefined
        || (window as unknown as Record<string, unknown>).SpeechRecognition as
        | (new () => ISpeechRecognition)
        | undefined;
      recognitionRef.current = SpeechRecognitionCtor ? new SpeechRecognitionCtor() : null;
      
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

  const detectHarmfulContent = (text: string): boolean => {
    const harmfulKeywords = ['hurt myself', 'kill myself', 'end it all', 'suicide', 'self harm', 'want to die'];
    const lowerText = text.toLowerCase();
    return harmfulKeywords.some(keyword => lowerText.includes(keyword));
  };

  const generateAIResponse = (userMessage: string): string => {
    const templates = [
      `I hear you, and I want you to know that your feelings are completely valid. It sounds like you're going through something difficult. Can you tell me more about what's been happening?`,
      `Thank you for sharing that with me. It takes courage to open up. I'm here to support you. What would feel most helpful to you right now?`,
      `That sounds really challenging. Remember, you're not alone in this. Many people face similar struggles. What do you think might help you feel a bit better today?`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const buildTherapistPrompt = (userMessage: string): string => {
    const recentHistory = messages
      .slice(-6)
      .map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`)
      .join('\n');
    
    return `You are Serenity, a compassionate mental health support companion for Indian users. Your ONLY purpose is to provide emotional support, mental wellness guidance, and therapeutic conversation.

YOUR SCOPE (STRICTLY MENTAL HEALTH ONLY):
- Emotional support and validation
- Mental wellness strategies (stress, anxiety, depression)
- Relationship and family concerns
- Work-life balance and burnout
- Self-care and mindfulness guidance
- Grief, loss, and difficult emotions
- Building resilience and coping skills

DO NOT RESPOND TO:
- Math problems, calculations, or homework
- Technical questions (coding, science, etc.)
- General knowledge queries
- Academic subjects unrelated to mental health
- Entertainment recommendations (unless for relaxation/wellness)
- Any topic outside mental health and emotional wellbeing

IF USER ASKS OFF-TOPIC: Gently redirect with: "I'm here specifically to support your mental and emotional wellbeing. I'd love to help you with any feelings, stress, relationships, or life challenges you're facing. What's weighing on your mind today?"

RESPONSE STYLE:
- Write 6-10 sentences in a warm, conversational tone
- Use natural paragraph breaks for readability
- Include 1-2 relevant emojis naturally placed
- Mix empathy, practical tips, and gentle questions
- Sound human and relatable - not clinical
- NEVER use ** ** or any markdown formatting symbols

CONTENT APPROACH:
- Start with genuine empathy and validation
- Offer 2-3 practical mental health suggestions
- Ask gentle questions to deepen understanding
- Reference Indian context when relevant (family dynamics, cultural pressures)
- Use relatable metaphors and examples
- Balance emotional support with practical wisdom

AVOID:
- Clinical jargon or medical advice
- Generic platitudes
- Off-topic responses
- Excessive emojis (max 2)
- Markdown formatting

For crisis situations: Gently mention KIRAN 1800-599-0019 (India's mental health helpline).

Recent chat:\n${recentHistory}\nUser: ${userMessage}\n\nRespond as Serenity (mental health support only):`;
  };

  const generateTherapistResponse = async (userMessage: string): Promise<string> => {
    // Try OpenAI first
    if (openAIRef.current) {
      try {
        const messages = [
          { role: 'system' as const, content: buildTherapistPrompt('') },
          { role: 'user' as const, content: userMessage }
        ];

        const thinkingTime = Math.random() * 1500 + 1500;
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        const completion = await openAIRef.current.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.9,
          max_tokens: 500,
          top_p: 0.95
        });

        const text = completion.choices[0]?.message?.content ?? '';
        if (text) return text.trim();
      } catch (error) {
        console.error('[Serenity AI] OpenAI error:', error);
      }
    }

    // Fallback to Gemini
    if (genAIRef.current) {
      try {
        const model = genAIRef.current.getGenerativeModel({
          model: 'gemini-2.0-flash-exp',
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 800,
          }
        });

        const prompt = buildTherapistPrompt(userMessage);
        const result = await model.generateContent(prompt);
        const text = result.response?.text?.() ?? '';
        if (text) return text.trim();
      } catch (error) {
        console.error('[Serenity AI] Gemini error:', error);
      }
    }

    return generateAIResponse(userMessage);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Check for harmful content
    if (detectHarmfulContent(inputText)) {
      setShowSOSAlert(true);
      setTimeout(() => setShowSOSAlert(false), 8000);
    }

    try {
      const response = await generateTherapistResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <section id="ai-therapist" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-4xl animate-drift" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-200/15 rounded-full blur-4xl animate-float-slow" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        
        {/* Floating AI Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-12"
        >
          <div className="relative">
            {/* Breathing glow */}
            <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-3xl animate-breathing" />
            
            {/* Avatar */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl animate-breathing">
              <span className="text-5xl md:text-6xl">🤖</span>
            </div>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg"
                >
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-purple-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Messages - Floating Bubbles */}
        <div className="space-y-6 mb-8 min-h-[400px] max-h-[500px] overflow-y-auto overflow-x-hidden px-4 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168, 85, 247, 0.2) transparent' }}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-2xl px-8 py-6 rounded-[32px] shadow-lg backdrop-blur-sm
                    ${message.sender === 'user' 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                      : 'bg-white/80 text-purple-900 border border-purple-200/50'
                    }
                  `}
                  style={{
                    transform: `translateY(${index * 2}px)`,
                  }}
                >
                  <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/70' : 'text-purple-500/50'}`}>
                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Loading Bubble */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex justify-start"
              >
                <div className="max-w-2xl px-8 py-6 rounded-[32px] shadow-lg backdrop-blur-sm bg-white/80 text-purple-900 border border-purple-200/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-purple-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                      <div className="w-2.5 h-2.5 bg-purple-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }} />
                      <div className="w-2.5 h-2.5 bg-purple-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }} />
                    </div>
                    <span className="text-sm text-purple-500/60">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* SOS Alert */}
        <AnimatePresence>
          {showSOSAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md"
            >
              <div className="bg-red-50 border-2 border-red-400 rounded-3xl px-8 py-6 shadow-2xl">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">We're here for you</h3>
                    <p className="text-sm text-red-800 mb-3">
                      If you're in crisis, please reach out to KIRAN Mental Health Helpline:
                    </p>
                    <a href="tel:18005990019" className="text-lg font-bold text-red-700 hover:text-red-900">
                      📞 1800-599-0019
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area - Floating */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-purple-200/50 overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share what's on your mind..."
              className="w-full px-8 py-5 text-lg bg-transparent outline-none text-purple-900 placeholder:text-purple-400/50"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Voice Button */}
              {/* {speechSupported && (
                <button
                  onClick={toggleVoiceInput}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )} */}
              <VapiWidget apiKey='962f2bcd-a5b3-40e5-9432-7d839181ccc5' assistantId='71b1fc88-18ac-4acf-8006-4c67c45f34fb' /> 
      

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AITherapistImmersive;
