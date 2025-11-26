import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Music, Palette, Type, Moon, Sun, Sparkles } from 'lucide-react';

const JournalStudio = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const handleSave = () => {
    // Save logic here
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const themeColors = {
    light: {
      bg: 'from-ocean-light via-white to-ocean-mist',
      text: 'text-ocean-deep',
      placeholder: 'placeholder:text-ocean-primary/40',
      card: 'bg-white/60',
      border: 'border-ocean-aqua/20'
    },
    dark: {
      bg: 'from-slate-900 via-ocean-deep to-slate-800',
      text: 'text-ocean-light',
      placeholder: 'placeholder:text-ocean-light/40',
      card: 'bg-white/5',
      border: 'border-ocean-aqua/30'
    }
  };

  const currentTheme = themeColors[theme];

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br ${currentTheme.bg} py-20`}>
      
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-ocean-aqua/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-ocean-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            x: [-20, 20, -20]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Toolbar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
      >
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-full px-6 py-3 border ${currentTheme.border} shadow-2xl flex items-center gap-4`}>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`p-2 rounded-full hover:bg-ocean-aqua/20 transition-colors ${currentTheme.text}`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </motion.button>
          
          <div className={`w-px h-6 ${currentTheme.border}`} />
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className={`p-2 rounded-full hover:bg-ocean-aqua/20 transition-colors ${currentTheme.text} ${isMusicPlaying ? 'text-ocean-primary' : ''}`}
          >
            <Music className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full hover:bg-ocean-aqua/20 transition-colors ${currentTheme.text}`}
          >
            <Palette className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full hover:bg-ocean-aqua/20 transition-colors ${currentTheme.text}`}
          >
            <Type className="w-5 h-5" />
          </motion.button>
          
          <div className={`w-px h-6 ${currentTheme.border}`} />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ocean-primary to-ocean-aqua text-white rounded-full hover:shadow-lg transition-shadow"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Save</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Saved Notification */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-32 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Saved!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Journal Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl"
      >
        <div className={`${currentTheme.card} backdrop-blur-2xl rounded-[40px] border ${currentTheme.border} shadow-2xl p-12 md:p-16 min-h-[600px]`}>
          
          {/* Title Input */}
          <motion.input
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Entry..."
            className={`w-full text-4xl md:text-5xl font-light mb-8 bg-transparent border-none outline-none ${currentTheme.text} ${currentTheme.placeholder} focus:placeholder:opacity-50 transition-all`}
          />

          {/* Date & Word Count */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`flex items-center gap-6 mb-8 text-sm ${currentTheme.text} opacity-60`}
          >
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>{wordCount} words</span>
          </motion.div>

          {/* Content Textarea */}
          <motion.textarea
            ref={textareaRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Begin your reflection journey here... Let your thoughts flow freely."
            className={`w-full min-h-[400px] text-lg md:text-xl leading-relaxed bg-transparent border-none outline-none resize-none ${currentTheme.text} ${currentTheme.placeholder} focus:placeholder:opacity-50 transition-all`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          />

          {/* Breathing Indicator */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 right-8 w-3 h-3 bg-ocean-aqua rounded-full blur-sm"
          />
        </div>

        {/* Inspirational Quote */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className={`text-sm ${currentTheme.text} opacity-60 italic`}>
            "Writing is the painting of the voice." — Voltaire
          </p>
        </motion.div>
      </motion.div>

      {/* Background Music Indicator */}
      <AnimatePresence>
        {isMusicPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 left-8 flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 border border-ocean-aqua/30 shadow-2xl"
          >
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-ocean-primary rounded-full"
                  animate={{ 
                    height: [8, 16, 8],
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-ocean-deep font-medium">Ambient Sounds</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default JournalStudio;
