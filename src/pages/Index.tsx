
import { lazy, Suspense } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import { useAuth } from '@/context/AuthContext';

// Lazy load components for better performance
const AITherapistImmersive = lazy(() => import('../components/AITherapistImmersive'));
const FloatingAITherapist = lazy(() => import('../components/FloatingAITherapist'));
const MoodMusicRecommender = lazy(() => import('../components/MoodMusicRecommender'));
const WellnessTools = lazy(() => import('../components/WellnessTools'));
const ConnectDoctor = lazy(() => import('../components/ConnectDoctor'));
const AboutSection = lazy(() => import('../components/AboutSection'));
const Footer = lazy(() => import('../components/Footer'));
const EBooks = lazy(() => import('../components/EBooks'));
const BlogFeed = lazy(() => import('../components/BlogFeed'));
const InspiringStories = lazy(() => import('../components/InspiringStories'));
const MotivationalQuotes = lazy(() => import('../components/MotivationalQuotes'));
const MeditationPlayer = lazy(() => import('../components/MeditationPlayer'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20 bg-gradient-to-br from-ocean-light via-white to-ocean-mist">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-ocean-primary/30 border-t-ocean-primary rounded-full animate-spin" />
      <p className="text-ocean-primary/70 text-lg font-medium">Loading...</p>
    </div>
  </div>
);

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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-ocean-light via-purple-50/20 to-pink-50/20">
      <Header />
      <HeroSection />
      
      <Suspense fallback={<LoadingFallback />}>
        {user && <AITherapistImmersive />}
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <div id="wellness-tools"><WellnessTools /></div>
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <div id="meditation"><MeditationPlayer /></div>
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <div id="inspiring-stories"><InspiringStories /></div>
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <div id="motivational-quotes"><MotivationalQuotes /></div>
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <div id="mood-music"><MoodMusicRecommender /></div>
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <div id="ebooks"><EBooks /></div>
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <div id="blogs"><BlogFeed /></div>
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <ConnectDoctor />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <div id="about"><AboutSection /></div>
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
      
      {/* Floating AI Therapist - always show when user is logged in */}
      <Suspense fallback={null}>
        {user && <FloatingAITherapist onOpenFullChat={handleOpenFullChat} />}
      </Suspense>
    </div>
  );
};

export default Index;
