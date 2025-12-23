
import { Heart, Shield, Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'AI Therapist', href: '#ai-therapist' },
    { name: 'Stories', href: '#inspiring-stories' },
    { name: 'Quotes', href: '#motivational-quotes' },
    { name: 'Music Therapy', href: '#mood-music' },
    { name: 'Wellness Tools', href: '#wellness-tools' },
    { name: 'Connect Doctor', href: '#connect-doctor' },
    { name: 'About Us', href: '#about' }
  ];

  const resources = [
    { name: 'Crisis Helplines', href: '#crisis' },
    { name: 'Mental Health Education', href: '#education' },
    { name: 'Self-Help Guides', href: '#guides' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' }
  ];

  const crisisResources = [
    { name: 'KIRAN Mental Health Helpline', number: '1800-599-0019', country: 'India' },
    { name: 'AASRA Helpline', number: '9820466726', country: 'India' },
    { name: 'Vandrevala Foundation Helpline', number: '1860-2662-345', country: 'India' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-serenity-900 via-lavender-900 to-purple-900 text-white overflow-hidden">
      {/* Gradient Overlay for seamless blend */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-ocean-light/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Crisis Support Banner */}
      <div className="bg-red-600 py-3 sm:py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="font-semibold text-xs sm:text-sm md:text-base leading-relaxed">
            🆘 In Crisis? You're not alone. Call KIRAN 1800-599-0019 (India) 24/7 or your local emergency services. Help is available.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-serenity-400 to-lavender-400 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl">🧘</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Serenity</h3>
                <p className="text-xs sm:text-sm text-serenity-200">Your Mental Wellness Sanctuary</p>
              </div>
            </div>
            <p className="text-serenity-200 text-xs sm:text-sm">
              A safe, anonymous space for mental health support, available 24/7. 
              Your journey to wellness starts here.
            </p>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Shield size={16} />
                <span>100% Private</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe size={16} />
                <span>Always Available</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(link.href)}
                    className="text-serenity-200 hover:text-white transition-colors hover:underline"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">Resources</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.href} className="text-serenity-200 hover:text-white transition-colors hover:underline">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Crisis Support */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold flex items-center space-x-2">
              <Heart className="text-red-400" size={16} />
              <span>Crisis Support</span>
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {crisisResources.map((resource, index) => (
                <li key={index} className="space-y-1">
                  <div className="font-medium text-white">{resource.name}</div>
                  <div className="text-serenity-200">{resource.number}</div>
                  <div className="text-xs text-serenity-300">{resource.country}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company Credits */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-serenity-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
          <p className="text-xs sm:text-sm text-serenity-200">
            Built with 💙 by <span className="font-semibold text-white">Código Maestro</span>
          </p>
          <div className="mt-2 text-[10px] sm:text-xs text-serenity-300 space-y-0.5">
            <div>Plot 8, 11 Techzone 2, Greater Noida</div>
            <div>Phone: +91 97941 77498</div>
            <div>Email: codigomaestro07@gmail.com</div>
          </div>
              <p className="text-[10px] sm:text-xs text-serenity-300 mt-1">
                Passionate about mental health technology and accessibility
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 text-xs sm:text-sm text-serenity-200">
              <div className="flex items-center space-x-1">
                <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-xs">codigomaestro07@gmail.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-xs">Greater Noida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-serenity-700 text-center">
          <p className="text-xs sm:text-sm text-serenity-300">
            © {currentYear} Serenity by Código Maestro. All rights reserved.
          </p>
          <p className="text-[10px] sm:text-xs text-serenity-400 mt-2 px-4">
            This platform provides educational and supportive content only. 
            Not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>

        {/* Core Values Icons */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-[10px] sm:text-xs px-4">
          <div className="flex items-center space-x-1 text-serenity-300">
            <Shield size={14} className="sm:w-4 sm:h-4" />
            <span>Privacy First</span>
          </div>
          <div className="flex items-center space-x-1 text-serenity-300">
            <Heart size={14} className="sm:w-4 sm:h-4" />
            <span>Compassion Driven</span>
          </div>
          <div className="flex items-center space-x-1 text-serenity-300">
            <Globe size={14} className="sm:w-4 sm:h-4" />
            <span>Universally Accessible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
