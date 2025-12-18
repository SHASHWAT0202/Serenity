import { useState, useEffect } from 'react';
import { Sparkles, Shield, Brain, Heart, Zap, Waves, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 150]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-ocean-light via-purple-50/30 to-pink-50/30">
      
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient mesh */}
        <motion.div 
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15) 0%, transparent 50%)`,
          }}
        />
        
        {/* Large animated blobs */}
        <motion.div 
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-lavender-300/25 to-purple-300/25 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-tr from-pink-200/30 to-lavender-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Floating geometric shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className={`absolute ${i % 2 === 0 ? 'w-20 h-20' : 'w-16 h-16'} border-2 border-purple-300/20 rounded-lg backdrop-blur-sm`}
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}

        {/* Sparkling particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Animated waves */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
          style={{ y: y2 }}
        >
          <Waves className="w-full h-full text-purple-400" strokeWidth={0.5} />
        </motion.div>
      </div>

      {/* Content Container */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ opacity, y: y1 }}
      >
        
        {/* Floating badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 mb-6 shadow-lg border border-purple-200/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trusted by 10,000+ users
          </span>
        </motion.div>

        {/* Main Headline with staggered animation */}
        <div className="mb-6">
          {['Your', 'Safe', 'Space', 'for', 'Healing'].map((word, i) => (
            <motion.span
              key={i}
              className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-lavender-500 to-pink-500 bg-clip-text text-transparent mr-4"
              initial={{ opacity: 0, y: 50, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subheading with typing effect feel */}
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-purple-700/80 mb-12 max-w-3xl mx-auto px-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Your safe space for mental wellness, available{' '}
          <motion.span
            className="inline-block font-semibold text-purple-600"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            24/7
          </motion.span>
        </motion.p>

        {/* CTA Button with enhanced effects */}
        <motion.div
          className="mb-16 relative inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.button
            onClick={() => {
              const aiSection = document.querySelector('#ai-therapist');
              aiSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white px-12 py-5 rounded-full text-lg font-semibold shadow-2xl overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <span className="relative flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Start Your Journey
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        {/* Trust Pills - Enhanced Feature Badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { icon: Shield, label: '100% Anonymous', color: 'from-blue-500 to-cyan-500' },
            { icon: Brain, label: 'AI-Powered', color: 'from-purple-500 to-pink-500' },
            { icon: Heart, label: '24/7 Support', color: 'from-red-500 to-pink-500' },
            { icon: Zap, label: 'Instant Relief', color: 'from-yellow-500 to-orange-500' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="group relative bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 border border-purple-200/50 shadow-lg overflow-hidden"
              whileHover={{ scale: 1.08, y: -5 }}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                delay: 1.1 + i * 0.1,
                type: "spring",
                stiffness: 200
              }}
            >
              {/* Hover gradient background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              />
              
              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  <feature.icon className={`w-5 h-5 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                </motion.div>
                <span className="text-sm font-semibold text-gray-700">{feature.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator with enhanced animation */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="flex flex-col items-center cursor-pointer group"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
            }}
          >
            <div className="relative w-7 h-12 border-2 border-purple-300/50 rounded-full flex justify-center p-2 group-hover:border-purple-400 transition-colors">
              <motion.div
                className="w-2 h-2 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"
                animate={{ 
                  y: [0, 16, 0],
                  opacity: [1, 0.3, 1],
                  scale: [1, 0.8, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-purple-400/20 rounded-full blur-md"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <motion.p 
              className="text-xs mt-3 text-purple-600/70 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Scroll to explore
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
