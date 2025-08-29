
import { useState } from 'react';
import { Brain, Activity, Pill, Video, FileText, Heart } from 'lucide-react';
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
      description: 'Take a comprehensive quiz to understand your current mental state and get personalized recommendations.',
      icon: <Brain className="text-serenity-600" size={24} />,
      color: 'from-serenity-500 to-blue-500',
      bgColor: 'bg-serenity-50'
    },
    {
      id: 'mood-detection',
      name: 'AI Mood Detection',
      description: 'Use your camera to analyze facial expressions and detect your current emotional state.',
      icon: <Activity className="text-purple-600" size={24} />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'yoga',
      name: 'Yogic Asanas Guide',
      description: 'Discover calming yoga poses with detailed instructions and mental health benefits.',
      icon: <Heart className="text-mint-600" size={24} />,
      color: 'from-mint-500 to-green-500',
      bgColor: 'bg-mint-50'
    },
    {
      id: 'medicine',
      name: 'Wellness Supplements',
      description: 'Get suggestions for natural remedies and supplements that may support mental wellness.',
      icon: <Pill className="text-lavender-600" size={24} />,
      color: 'from-lavender-500 to-purple-500',
      bgColor: 'bg-lavender-50'
    },
    {
      id: 'videos',
      name: 'Curated Wellness Videos',
      description: 'Watch carefully selected videos on meditation, mindfulness, and mental health education.',
      icon: <Video className="text-orange-600" size={24} />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
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
    <section id="wellness-tools" className="py-20 px-4 bg-gradient-to-br from-mint-50 to-serenity-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-mint-500 to-serenity-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathing">
            <FileText className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-4">Wellness Toolkit</h2>
          <p className="text-serenity-700 text-lg max-w-2xl mx-auto">
            Comprehensive tools designed to support your mental health journey. Each tool provides personalized insights and guidance.
          </p>
        </div>

        {activeTool ? (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <button
                onClick={() => setActiveTool(null)}
                className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
              >
                ← Back to Tools
              </button>
            </div>
            {renderActiveTool()}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as ToolType)}
                className="therapeutic-card p-8 text-left hover:scale-105 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:animate-gentle-pulse`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{tool.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{tool.description}</p>
                <div className="flex items-center text-serenity-600 font-medium text-sm">
                  <span>Start Tool</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WellnessTools;
