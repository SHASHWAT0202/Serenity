import { useState, useEffect } from 'react';
import { Sparkles, Shield, Brain, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const headlines = [
    "Find Your Inner Peace",
    "Transform Your Mental Wellness",
    "Your Safe Space for Healing"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      
      {/* Ambient Background - Floating Organic Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large flowing orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-drift" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-lavender-200/20 rounded-full blur-4xl animate-float-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-100/30 rounded-full blur-4xl animate-wave" style={{ animationDelay: '1.5s' }} />
        
        {/* Particle field */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/30 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Rotating Headline */}
        <motion.h1 
          key={currentHeadline}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-lavender-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          {headlines[currentHeadline]}
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-purple-700/70 mb-10 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Your safe space for mental wellness, available 24/7
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={() => {
            const aiSection = document.querySelector('#ai-therapist');
            aiSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 mb-16"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Start Your Journey
          </span>
        </motion.button>

        {/* Trust Pills - Feature Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {[
            { icon: Shield, label: '100% Anonymous' },
            { icon: Brain, label: 'AI-Powered' },
            { icon: Heart, label: '24/7 Support' },
            { icon: Zap, label: 'Instant Relief' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white/80 backdrop-blur-md rounded-full px-4 py-2 border border-purple-200/50 shadow-lg"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="flex items-center gap-2 text-purple-600">
                <feature.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-purple-500/60"
          >
            <div className="w-6 h-10 border-2 border-purple-300/40 rounded-full flex justify-center p-2">
              <motion.div
                className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <p className="text-xs mt-2">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
