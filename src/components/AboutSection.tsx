
import { useState } from 'react';
import { Heart, Shield, Globe, Users, Award, Mail, Github, Linkedin } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  emoji: string;
  quote: string;
  expertise: string[];
  funFact: string;
}

const AboutSection = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Shashwat Ranjan',
      role: 'Founder & CEO • Tech Lead',
      photo: '/images/team/shashwat.jpg',
      emoji: '🚀',
      quote: "Every project we build is a step towards meaningful impact and innovation.",
      expertise: [
        'Full-Stack Development',
        'Java & C++',
        'Next.js & Node.js',
        'AI Integrations',
        'Project Strategy & Client Coordination'
      ],
      funFact: 'Can switch between coding and public speaking without missing a beat.'
    },
    {
      id: '2',
      name: 'Sabhya Rajvanshi',
      role: 'Co-Lead & Content Strategist',
      photo: '/images/team/sabhya.jpg',
      emoji: '📝',
      quote: "A project’s story matters as much as its code — clarity inspires action.",
      expertise: [
        'Content Planning & Documentation',
        'Research & Structure',
        'Presentations & Storytelling',
        'UI/UX Refinement'
      ],
      funFact: 'Writes research docs like novels — engaging from start to end.'
    },
    {
      id: '3',
      name: 'Swasti Shukla',
      role: 'Design & UI Lead',
      photo: '/images/team/swasti.jpg',
      emoji: '🎨',
      quote: "Design is the bridge between technology and people — make it beautiful and easy.",
      expertise: [
        'UI/UX Design with Tailwind CSS',
        'Responsive & Accessible Interfaces',
        'Branding & Prototyping',
        'User-Centric Design Flows'
      ],
      funFact: 'Turns wireframes into art faster than you can say “Figma”.'
    },
    {
      id: '4',
      name: 'Swayam Agarwal',
      role: 'AI Lead',
      photo: '/images/team/swayam.jpg',
      emoji: '🤖',
      quote: "AI isn’t just about models — it’s about making them work for people.",
      expertise: [
        'AI Strategy & Model Selection',
        'Serenity, Smart Soil, Study Buddy AI Features',
        'Accuracy & Scalability Optimization',
        'Deployment & Maintenance'
      ],
      funFact: 'Loves debugging ML pipelines almost as much as building them.'
    },
    {
      id: '5',
      name: 'Divyansh Srivastava',
      role: 'AI/ML Engineer',
      photo: '/images/team/divyansh.jpg',
      emoji: '📊',
      quote: "Good models are trained, great models are refined endlessly.",
      expertise: [
        'Machine Learning Model Development',
        'Model Optimization & Accuracy Improvement',
        'Collaborating with AI Lead',
        'Deployment Strategies'
      ],
      funFact: 'Can explain backpropagation using food metaphors.'
    }
  ];
  const companyValues = [
    {
      icon: <Heart className="text-red-500" size={24} />,
      title: 'Compassion First',
      description: 'Every decision we make is guided by empathy and understanding for those seeking mental health support.'
    },
    {
      icon: <Shield className="text-serenity-500" size={24} />,
      title: 'Privacy by Design',
      description: 'Your mental health data is sacred. We build privacy protection into every feature from day one.'
    },
    {
      icon: <Globe className="text-mint-500" size={24} />,
      title: 'Universal Access',
      description: 'Mental health support should be available to everyone, regardless of location, background, or financial situation.'
    },
    {
      icon: <Award className="text-lavender-500" size={24} />,
      title: 'Evidence-Based',
      description: 'All our tools and recommendations are grounded in scientific research and clinical best practices.'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-br from-serenity-50 to-purple-50">
      <div className="container mx-auto max-w-6xl">
        {/* Main About Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-serenity-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathing">
            <Users className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-6">About Serenity</h2>
          <div className="max-w-3xl mx-auto text-lg text-gray-700 space-y-4">
            <p>
              Serenity was born from a simple belief: <strong>everyone deserves access to mental health support, 
              without barriers, judgment, or compromise to their privacy.</strong>
            </p>
            <p>
              In a world where mental health challenges are increasingly common, we recognized the need for 
              immediate, accessible, and anonymous support. Traditional therapy, while invaluable, isn't always 
              available when someone needs help at 3 AM, or when someone can't afford regular sessions.
            </p>
            <p>
              That's why we created Serenity - a comprehensive digital sanctuary that combines cutting-edge AI, 
              evidence-based therapeutic techniques, and human compassion to provide 24/7 mental wellness support.
            </p>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <div key={index} className="therapeutic-card p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{value.title}</h4>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="therapeutic-card p-8 mb-16 text-center bg-gradient-to-r from-serenity-50 to-lavender-50">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto italic">
            "To democratize mental health support by creating a safe, private, and accessible digital sanctuary 
            where anyone can find immediate help, healing tools, and hope - no matter where they are in their 
            mental health journey."
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Meet Código Maestro</h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We're a passionate team of developers, mental health professionals, and advocates united by the mission 
            to make mental wellness support accessible to everyone.
          </p>

          {selectedMember ? (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <div className="text-center mb-8">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
                >
                  ← Back to Team
                </button>
              </div>

              <div className="therapeutic-card p-8">
                <div className="text-center mb-8">
                  <img 
                    src={selectedMember.photo} 
                    alt={selectedMember.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
                  />
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{selectedMember.name}</h4>
                  <p className="text-lg text-serenity-600 font-medium mb-4">{selectedMember.role}</p>
                  <div className="text-4xl mb-4">{selectedMember.emoji}</div>
                  <blockquote className="text-lg text-gray-700 italic max-w-2xl mx-auto">
                    "{selectedMember.quote}"
                  </blockquote>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-3">Expertise</h5>
                    <ul className="space-y-2">
                      {selectedMember.expertise.map((skill, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-serenity-500 rounded-full"></div>
                          <span className="text-gray-700">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-3">Fun Fact</h5>
                    <p className="text-gray-700">{selectedMember.funFact}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="therapeutic-card p-6 text-center hover:scale-105 transition-all duration-300 group"
                >
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                  <div className="text-3xl mb-2">{member.emoji}</div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{member.name}</h4>
                  <p className="text-serenity-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 italic line-clamp-2">"{member.quote}"</p>
                  <div className="mt-4 text-serenity-600 font-medium text-sm">
                    <span>Learn More →</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Impact Stats */}
        <div className="therapeutic-card p-8 mb-16 bg-gradient-to-r from-mint-50 to-serenity-50">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Our Impact (Projected)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-serenity-600 mb-2">24/7</div>
              <p className="text-gray-600">Availability</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint-600 mb-2">100%</div>
              <p className="text-gray-600">Anonymous</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-lavender-600 mb-2">0</div>
              <p className="text-gray-600">Data Stored</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
              <p className="text-gray-600">Hope Shared</p>
            </div>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Connect with Código Maestro</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking to improve Serenity and help more people. Reach out with feedback, 
            partnership opportunities, or just to say hello!
          </p>
          
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:codigomaestro07@gmail.com" 
              className="flex items-center space-x-2 bg-serenity-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
            >
              <Mail size={20} />
              <span>Email Us</span>
            </a>
            <a 
              href="https://github.com/codigo-maestro" 
              className="flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/company/c%C3%B3digo-maestro/?viewAsMember=true" 
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
