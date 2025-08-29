
import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AITherapist from '../components/AITherapist';
import FloatingAITherapist from '../components/FloatingAITherapist';
import MoodMusicRecommender from '../components/MoodMusicRecommender';
import WellnessTools from '../components/WellnessTools';
import ConnectDoctor from '../components/ConnectDoctor';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import EBooks from '../components/EBooks';
import BlogFeed from '../components/BlogFeed';
import InspiringStories from '../components/InspiringStories';
import MotivationalQuotes from '../components/MotivationalQuotes';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();

  const handleOpenFullChat = () => {
    // Scroll to AI therapist section
    const element = document.getElementById('ai-therapist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
  {user && <div id="ai-therapist"><AITherapist /></div>}
      <div id="inspiring-stories"><InspiringStories /></div>
      <div id="motivational-quotes"><MotivationalQuotes /></div>
      <div id="mood-music"><MoodMusicRecommender /></div>
      <div id="wellness-tools"><WellnessTools /></div>
      <div id="ebooks"><EBooks /></div>
      <div id="blogs"><BlogFeed /></div>
      <ConnectDoctor />
      <div id="about"><AboutSection /></div>
      <Footer />
      
      {/* Floating AI Therapist - always show when user is logged in */}
      {user && <FloatingAITherapist onOpenFullChat={handleOpenFullChat} />}
    </div>
  );
};

export default Index;
