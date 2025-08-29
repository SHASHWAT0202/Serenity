import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, AlertTriangle, Heart, Bot, User, Sparkles, Shield, Clock } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Minimal Web Speech types to avoid `any`
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
  isTyping?: boolean;
}

const AITherapist = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm Serenity, your compassionate AI companion.\n\nThis is your safe space - no judgment, just understanding. I'm here to:\n• Listen with my whole heart 💙\n• Help you process emotions\n• Offer gentle guidance\n• Support you 24/7\n\nWhat's weighing on your mind today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSOSAlert, setShowSOSAlert] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognitionCtor = (window as unknown as Record<string, unknown>).webkitSpeechRecognition as
        | (new () => ISpeechRecognition)
        | undefined
        || (window as unknown as Record<string, unknown>).SpeechRecognition as
        | (new () => ISpeechRecognition)
        | undefined;
      recognitionRef.current = SpeechRecognitionCtor ? (new SpeechRecognitionCtor() as ISpeechRecognition) : null;
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN';
      }

      if (recognitionRef.current) {
        recognitionRef.current.onresult = (event: RecognitionResultEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: { error: string }) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const detectHarmfulContent = (text: string): boolean => {
    const harmfulKeywords = [
      'hurt myself', 'kill myself', 'end it all', 'suicide', 'self harm',
      'want to die', 'better off dead', 'no point living', 'harm others'
    ];
    
    const lowerText = text.toLowerCase();
    return harmfulKeywords.some(keyword => lowerText.includes(keyword));
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = {
      greeting: [
        "Hey! 😊 So good to see you here.\n\nI can already sense you're being brave by reaching out. That takes real courage! 💪\n\n• Take a deep breath with me\n• Remember you're not alone\n• We'll figure this out together\n\nWhat's been on your heart lately?",
        "Welcome, beautiful soul! ✨\n\nI'm genuinely glad you're here. This space is all about you - your feelings, your pace, your healing.\n\n• No pressure to be perfect\n• Share what feels right\n• I'm listening without judgment\n\nWhat would feel good to talk about first?",
        "Hello there! 🌸\n\nYour presence here shows such self-awareness and strength. I'm honored you chose to connect.\n\n• This is your safe haven\n• Every feeling is valid here\n• We can go as slow as you need\n\nWhat's stirring in your world today?"
      ],
      sad: [
        "I can feel the weight you're carrying right now. 💙 That heaviness is so real, and it makes complete sense.\n\n**Let's try some gentle support:**\n• Place your hand on your heart\n• Notice you're not alone in this\n• Sadness shows how deeply you care\n\n**Small comfort ideas:**\n• Warm tea or your favorite drink\n• Soft music or nature sounds\n• A cozy blanket or gentle walk\n\nWhat usually brings you even tiny moments of peace?",
        "Oh, friend. 🫂 I hear you, and your sadness is so valid. Sometimes our hearts just need to feel heavy for a while.\n\n**Gentle reminders:**\n• This feeling won't last forever\n• You're stronger than you know\n• It's okay to not be okay today\n\n**Tiny steps that might help:**\n• Text a friend who gets it\n• Watch something comforting\n• Do one small thing for yourself\n\nWhat's one thing that usually makes you feel a little lighter?",
        "Sending you the gentlest hug. 🌿 Your sadness tells a story of love - for people, dreams, or parts of yourself that matter deeply.\n\n**What I want you to know:**\n• Your feelings are completely natural\n• You don't have to carry this alone\n• Every sunset is followed by sunrise\n\n**Gentle suggestions:**\n• Journal for 5 minutes\n• Look at old photos that spark joy\n• Do something creative, however small\n\nWhat's one memory that still makes you smile?"
      ],
      anxious: [
        "I can sense that anxious energy - like everything is moving too fast and too loud. 🫁 Let's slow this down together.\n\n**Quick grounding technique:**\n• 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste\n\n**Breathe with me:**\n• In for 4 counts... hold for 2... out for 6\n• Your nervous system is just trying to protect you\n\nWhat's the biggest worry swirling around right now?",
        "That anxious buzz is so exhausting, isn't it? 😮‍💨 Your mind is working overtime to keep you safe - we can appreciate that and also help it calm down.\n\n**Instant anxiety soothers:**\n• Cold water on your wrists\n• Name your worry out loud\n• Do 10 jumping jacks (really!)\n• Progressive muscle relaxation\n\n**Mindset shifts:**\n• \"What if\" → \"What is\"\n• Future fears → Present moment\n• Worst case → Most likely case\n\nWhich anxiety trigger is hitting hardest today?",
        "Anxiety can make everything feel urgent and overwhelming. 🌊 But you're safe right now, in this moment.\n\n**Let's anchor you:**\n• Feel your feet on the ground\n• Notice the temperature around you\n• Soften your shoulders and jaw\n• Remind yourself: \"I am safe right now\"\n\n**Practical anxiety busters:**\n• Write down the worry, then write 3 solutions\n• Talk to your anxiety like a worried friend\n• Do something with your hands (draw, knit, cook)\n\nWhat does your anxiety usually try to tell you?"
      ],
      stressed: [
        "Oof, I can feel that stress energy through the screen! 😤 When everything feels urgent and heavy, even small tasks become mountains.\n\n**Stress emergency kit:**\n• One thing off your plate right NOW\n• 60-second dance break\n• Delegate one task if possible\n• Say \"no\" to something today\n\n**Perspective shifters:**\n• What will matter in 5 years?\n• What's truly urgent vs. what feels urgent?\n• Where can you be \"good enough\" instead of perfect?\n\nWhat's the heaviest thing on your shoulders today?",
        "That overwhelmed feeling is so real! 🌀 Like you're drowning in responsibilities while everyone expects you to swim gracefully.\n\n**Quick stress relievers:**\n• Step outside for 2 minutes\n• Do 20 deep belly breaths\n• Text someone who always gets it\n• Listen to one favorite song\n\n**Boundaries to consider:**\n• \"I need to check my schedule\"\n• \"That doesn't work for me\"\n• \"I can do X but not Y\"\n\nWhat would happen if you gave yourself permission to do less today?",
        "Stress is your system's way of saying \"This is too much!\" 🚨 And you know what? It's probably right.\n\n**Immediate stress busters:**\n• Brain dump everything on paper\n• Pick the top 3 priorities only\n• Ask for help with something\n• Take a hot shower or bath\n\n**Remember:**\n• You're not a machine\n• Rest is productive\n• Done is better than perfect\n• Your worth isn't your productivity\n\nIf you could wave a magic wand, what would you remove from your plate?"
      ],
      default: [
        "Thank you for trusting me with whatever you're carrying. 💫 There's something powerful about putting our inner world into words.\n\n**I'm here to help with:**\n• Processing difficult emotions\n• Finding coping strategies that work\n• Offering fresh perspectives\n• Just listening without judgment\n\n**No pressure approach:**\n• Share what feels comfortable\n• We can explore different angles\n• Every small step counts\n\nWhat feels most alive or pressing for you right now?",
        "I'm so glad you're here, taking this moment for yourself. 🌟 Whatever brought you here today - big or small - it matters.\n\n**This space offers:**\n• Genuine understanding\n• Practical tools and insights\n• Emotional validation\n• A place to think out loud\n\n**We can explore:**\n• What's working and what isn't\n• New ways to handle challenges\n• Your strengths and resources\n\nWhat would be most helpful to unpack together?",
        "Every conversation here is sacred - including this one with you. 🕯️ You don't need perfect words or clarity to start.\n\n**Let's meet you where you are:**\n• Confused? We'll explore together\n• Stuck? We'll find new paths\n• Tired? We'll make space for rest\n• Hopeful? We'll nurture that spark\n\n**You might want to share:**\n• Something that's been bothering you\n• A pattern you've noticed\n• A decision you're facing\n\nWhat part of your inner world wants some attention today?"
      ]
    };

    const userLower = userMessage.toLowerCase();
    
    if (userLower.includes('sad') || userLower.includes('depressed') || userLower.includes('down') || userLower.includes('crying')) {
      return responses.sad[Math.floor(Math.random() * responses.sad.length)];
    } else if (userLower.includes('anxious') || userLower.includes('worried') || userLower.includes('nervous') || userLower.includes('panic')) {
      return responses.anxious[Math.floor(Math.random() * responses.anxious.length)];
    } else if (userLower.includes('stressed') || userLower.includes('overwhelmed') || userLower.includes('pressure') || userLower.includes('busy')) {
      return responses.stressed[Math.floor(Math.random() * responses.stressed.length)];
    } else if (userLower.includes('hello') || userLower.includes('hi') || userLower.includes('hey') || userLower.includes('good morning')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  // Gemini client init (browser)
  const STATIC_GEMINI_API_KEY = 'AIzaSyBkQXZXu2M4gd_2M8zBS2Hs2SZeP4kMXUA';
  const envVars = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  const GEMINI_API_KEY =
    envVars?.VITE_GEMINI_API_KEY ||
    envVars?.VITE_GOOGLE_API_KEY ||
    envVars?.VITE_GOOGLE_GENAI_API_KEY ||
    envVars?.VITE_GOOGLE_GEMINI_API_KEY ||
    envVars?.VITE_GENAI_API_KEY ||
    envVars?.VITE_GEN_AI_API_KEY ||
    STATIC_GEMINI_API_KEY;

  const genAIRef = useRef<GoogleGenerativeAI | null>(null);

  useEffect(() => {
    if (GEMINI_API_KEY) {
      genAIRef.current = new GoogleGenerativeAI(GEMINI_API_KEY);
      console.info('[Serenity AI] Gemini API key detected:', true);
    } else {
      console.warn('[Serenity AI] Gemini API key not found. Using template responses.');
    }
  }, [GEMINI_API_KEY]);

  const buildTherapistPrompt = (userMessage: string): string => {
    const recentHistory = messages
      .slice(-6)
      .map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.text}`)
      .join('\n');
    return `You are Serenity, a warm, modern AI therapy companion for Indian users. You're like that wise friend who always knows what to say.

RESPONSE STYLE (VERY IMPORTANT):
- Write 6-10 sentences in a conversational, friendly tone
- Use natural paragraph breaks and bullet points to make it scannable
- Include 1-2 relevant emojis naturally placed
- Mix validation, practical tips, and gentle questions
- Sound human, warm, and relatable - not clinical
- Use section headers with ** ** for better formatting when helpful
- Keep responses engaging but not overwhelming

CONTENT APPROACH:
- Start with genuine empathy and validation
- Offer 2-3 practical, actionable suggestions
- Include gentle questions to continue the conversation  
- Reference Indian context when relevant (family dynamics, cultural pressures, etc.)
- Use relatable metaphors and examples
- Balance emotional support with practical wisdom

AVOID:
- Long clinical paragraphs
- Medical disclaimers or jargon  
- Generic responses
- Being overly formal
- Excessive emojis (max 2)

For crisis situations: Gently mention KIRAN 1800-599-0019 (India's mental health helpline).

Recent chat:\n${recentHistory}\nUser: ${userMessage}\n\nRespond as Serenity following the style guide exactly:`;
  };

  const formatTherapistText = (raw: string): string => {
    let text = (raw || '').trim();
    text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
    text = text.replace(/(^|\n)as an ai[^\n]*\.?/gi, '').trim();
    
    // Allow medium-length responses for better engagement
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    text = lines.slice(0, 15).join('\n');
    
    // Limit emojis to 2 max for professional feel
    const supportiveEmojis = ['💙', '🌿', '🫂', '✨', '🌸', '🍃', '🫁', '🤗', '🕊️', '😊', '💫', '🌟', '🌊', '💪', '🔥'];
    let emojiCount = 0;
    text = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, (m) => {
      if (supportiveEmojis.includes(m)) {
        emojiCount += 1;
        return emojiCount <= 2 ? m : '';
      }
      return m;
    });
    
    // Ensure at least one emoji for warmth
    const hasEmoji = supportiveEmojis.some(e => text.includes(e));
    if (!hasEmoji && text.length > 0) {
      text = text + ' 💙';
    }
    return text;
  };

  const generateTherapistResponse = async (userMessage: string): Promise<string> => {
    if (!genAIRef.current) {
      console.info('[Serenity AI] Using fallback template (no Gemini client).');
      return generateAIResponse(userMessage);
    }
    try {
      const availableModels = [
        'gemini-2.0-flash-exp',
        'gemini-2.0-flash', 
        'gemini-1.5-pro',
        'gemini-1.5-flash'
      ];
      
      let model;
      let modelName = '';
      
      for (const modelId of availableModels) {
        try {
          model = genAIRef.current.getGenerativeModel({
            model: modelId,
            generationConfig: {
              temperature: 0.9,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 800,
              candidateCount: 1,
            },
          });
          modelName = modelId;
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (!model) {
        throw new Error('No available models found');
      }
      
      const prompt = buildTherapistPrompt(userMessage);
      
      // Natural thinking time
      const thinkingTime = Math.random() * 1500 + 1500; // 1.5-3 seconds
      await new Promise(resolve => setTimeout(resolve, thinkingTime));
      
      const result = await model.generateContent(prompt);
      const text = result.response?.text?.() ?? '';
      const cleaned = formatTherapistText(text);
      if (cleaned) {
        return cleaned;
      }
      return generateAIResponse(userMessage);
    } catch (error) {
      console.error('[Serenity AI] Model error:', error);
      return generateAIResponse(userMessage);
    }
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
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const minTypingTime = 2000;
      const typingStart = Date.now();
      
      const aiText = await generateTherapistResponse(currentInput);
      
      const elapsed = Date.now() - typingStart;
      if (elapsed < minTypingTime) {
        await new Promise(resolve => setTimeout(resolve, minTypingTime - elapsed));
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full blur opacity-60 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Sparkles className="text-white w-8 h-8" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Serenity AI Companion
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Your 24/7 mental wellness companion. Powered by advanced AI, designed with empathy, 
              created for your peace of mind.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-white/20">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                100% Anonymous
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-white/20">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                Available 24/7
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-white/20">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Judgment Free
              </span>
            </div>
          </div>

          {/* SOS Alert Modal */}
          {showSOSAlert && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-scale-in">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">We're Here for You</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    It sounds like you're going through a really tough time. You're not alone, and professional help is available right now.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => window.open('tel:18005990019', '_self')}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                    >
                      🇮🇳 KIRAN Helpline (24/7) 1800-599-0019
                    </button>
                    <button
                      onClick={() => window.open('tel:+919152987821', '_self')}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                    >
                      📞 iCALL Counselling 91529 87821
                    </button>
                    <button
                      onClick={() => window.open('tel:+919820466726', '_self')}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                    >
                      🕊️ AASRA Helpline 9820466726
                    </button>
                    <button 
                      onClick={() => setShowSOSAlert(false)}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200"
                    >
                      Continue Our Conversation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">Serenity AI</h3>
                    <p className="text-purple-100 text-sm">Your compassionate companion • Always listening 💙</p>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2 text-white/80 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={messagesContainerRef} 
                className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white/20 to-white/40"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 transparent'
                }}
              >
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`flex items-start space-x-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      }`}>
                        {message.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={`px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                          : 'bg-white/80 text-gray-800'
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex items-start space-x-3 max-w-2xl">
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm text-gray-600">Serenity is thinking</div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Taking time to understand you deeply 💙</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white/60 backdrop-blur-sm border-t border-white/20">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share what's on your mind... I'm here to listen 💙"
                      className="w-full p-4 text-base bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-lg placeholder-gray-500"
                      rows={3}
                      style={{ minHeight: '80px' }}
                    />
                    {isListening && (
                      <div className="absolute top-2 right-2 flex items-center space-x-2 bg-red-100 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-600 font-medium">Listening...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={toggleVoiceInput}
                      className={`p-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white shadow-lg ${
                        isListening 
                          ? 'bg-gradient-to-r from-red-400 to-pink-400 animate-pulse' 
                          : 'bg-gradient-to-r from-green-400 to-emerald-400'
                      } ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!speechSupported}
                      title={speechSupported ? (isListening ? 'Stop recording' : 'Start voice input') : 'Voice input not supported'}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {isListening && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full">
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
                        <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-8 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-red-600 font-medium">🎤 Speak your heart out...</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Completely Private & Anonymous</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>AI-Powered Emotional Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">100% Anonymous</h3>
                </div>
                <p className="text-sm text-gray-600">No sign-ups, no data collection. Your conversations stay completely private.</p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">AI-Powered</h3>
                </div>
                <p className="text-sm text-gray-600">Advanced AI trained on therapeutic techniques and emotional intelligence.</p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">24/7 Available</h3>
                </div>
                <p className="text-sm text-gray-600">Whenever you need support, I'm here. No appointments, no waiting.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in-up 0.3s ease-out forwards;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AITherapist;