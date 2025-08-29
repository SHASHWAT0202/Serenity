
import { useState, useEffect } from 'react';
import { Sparkles, Shield, Heart } from 'lucide-react';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);
  const texts = [
    "Welcome to Serenity — a safe space for your mind.",
    "Your mental wellness journey starts here.",
    "Anonymous, private, and always supportive."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToAITherapist = () => {
    const element = document.getElementById('ai-therapist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-serenity-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-lavender-200/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-mint-200/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-serenity-400 via-lavender-400 to-mint-400 rounded-full flex items-center justify-center shadow-xl animate-breathing gentle-glow">
              <span className="text-6xl">🧘</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-fade-in-up">
            Serenity
          </h1>
          
          {/* Subheading */}
          <div className="h-16 mb-8 flex items-center justify-center">
            <p className="text-xl md:text-2xl text-serenity-700 animate-fade-in" key={currentText}>
              {texts[currentText]}
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Shield className="text-serenity-600" size={20} />
              <span className="text-serenity-800 text-sm font-medium">100% Anonymous</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Heart className="text-lavender-600" size={20} />
              <span className="text-serenity-800 text-sm font-medium">AI-Powered Support</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="text-mint-600" size={20} />
              <span className="text-serenity-800 text-sm font-medium">24/7 Available</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button 
              onClick={scrollToAITherapist}
              className="bg-gradient-to-r from-serenity-500 to-lavender-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start Your Journey</span>
              <Sparkles size={20} />
            </button>
            
            <button 
              onClick={() => document.getElementById('wellness-tools')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-serenity-400 text-serenity-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-serenity-50 hover:scale-105 transition-all duration-300"
            >
              Explore Tools
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <p className="text-sm text-serenity-600 mb-4">Trusted by thousands for mental wellness support</p>
            <div className="flex justify-center items-center space-x-8 text-serenity-500">
              <div className="flex items-center space-x-1">
                <span className="text-lg">🔒</span>
                <span className="text-xs">Privacy First</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">🏥</span>
                <span className="text-xs">Medical Grade</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">🌟</span>
                <span className="text-xs">Evidence Based</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
