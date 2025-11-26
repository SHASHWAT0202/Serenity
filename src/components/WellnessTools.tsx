
import { useState } from 'react';
import { Brain, Activity, Pill, Video, BookOpen, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import MentalHealthQuiz from './MentalHealthQuiz';
import YogaAsanas from './YogaAsanas';
import MedicineRecommender from './MedicineRecommender';
import CuratedVideos from './CuratedVideos';
import FaceMoodDetection from './FaceMoodDetection';

type ToolType = 'quiz' | 'yoga' | 'medicine' | 'videos' | 'mood-detection' | null;

const WellnessTools = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  const tools = [
    {
      id: 'quiz',
      name: 'Mental Health Assessment',
      description: 'Understand your current state with a comprehensive, science-backed assessment',
      icon: <Brain size={32} />,
      gradient: 'from-ocean-primary to-ocean-aqua',
      hoverShadow: 'hover:shadow-ocean-primary/20'
    },
    {
      id: 'mood-detection',
      name: 'AI Mood Detection',
      description: 'Discover your emotional state through advanced facial expression analysis',
      icon: <Activity size={32} />,
      gradient: 'from-purple-500 to-pink-500',
      hoverShadow: 'hover:shadow-purple-500/20'
    },
    {
      id: 'yoga',
      name: 'Yoga & Mindfulness',
      description: 'Guided poses and breathing exercises for inner calm and balance',
      icon: <Heart size={32} />,
      gradient: 'from-mint-500 to-emerald-500',
      hoverShadow: 'hover:shadow-mint-500/20'
    },
    {
      id: 'medicine',
      name: 'Wellness Supplements',
      description: 'Natural remedies and supplements to support your mental wellness journey',
      icon: <Pill size={32} />,
      gradient: 'from-lavender-500 to-violet-500',
      hoverShadow: 'hover:shadow-lavender-500/20'
    },
    {
      id: 'videos',
      name: 'Guided Sessions',
      description: 'Curated meditation, mindfulness, and educational content',
      icon: <Video size={32} />,
      gradient: 'from-orange-400 to-rose-500',
      hoverShadow: 'hover:shadow-orange-500/20'
    }
  ];

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'quiz':
        return <MentalHealthQuiz />;
      case 'mood-detection':
        return <FaceMoodDetection />;
      case 'yoga':
        return <YogaAsanas />;
      case 'medicine':
        return <MedicineRecommender />;
      case 'videos':
        return <CuratedVideos />;
      default:
        return null;
    }
  };

  return (
    <section id="wellness-tools" className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-ocean-light/30 via-white to-ocean-mist/30">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-ocean-aqua/10 rounded-full blur-4xl animate-drift" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-ocean-primary/5 rounded-full blur-4xl animate-float-slow" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-ocean-primary to-ocean-aqua rounded-full flex items-center justify-center animate-breathing shadow-lg">
              <BookOpen className="text-white" size={28} />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-4">
            <span className="bg-gradient-to-r from-ocean-deep to-ocean-primary bg-clip-text text-transparent font-semibold">
              Wellness Toolkit
            </span>
          </h2>
          <p className="text-xl text-ocean-primary/70 font-light max-w-2xl mx-auto">
            Comprehensive tools for your mental wellness journey
          </p>
        </motion.div>

        {activeTool ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <button
                onClick={() => setActiveTool(null)}
                className="px-8 py-4 bg-gradient-to-r from-ocean-primary to-ocean-aqua text-white rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                ← Back to Tools
              </button>
            </div>
            {renderActiveTool()}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                onClick={() => setActiveTool(tool.id as ToolType)}
                className={`group relative p-10 bg-white/70 backdrop-blur-xl rounded-[40px] border border-ocean-aqua/20 shadow-xl ${tool.hoverShadow} hover:shadow-2xl transition-all duration-500 text-left overflow-hidden`}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[40px]`} />
                
                {/* Icon */}
                <div className={`relative w-20 h-20 bg-gradient-to-br ${tool.gradient} rounded-3xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {tool.icon}
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-semibold text-ocean-deep mb-3 group-hover:text-ocean-primary transition-colors duration-300">
                    {tool.name}
                  </h3>
                  <p className="text-ocean-primary/60 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  
                  {/* CTA */}
                  <div className="flex items-center text-ocean-primary font-medium">
                    <span>Explore</span>
                    <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WellnessTools;
