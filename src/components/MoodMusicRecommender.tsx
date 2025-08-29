
import { useState } from 'react';
import { Music, Play, Heart, Smile, Meh, Frown, Sun, Cloud, CloudRain } from 'lucide-react';
import { searchYouTube } from '@/services/youtube';

interface MoodOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface MusicRecommendation {
  title: string;
  artist: string;
  videoId: string;
  mood: string;
  description: string;
}

const MoodMusicRecommender = () => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [currentRecommendations, setCurrentRecommendations] = useState<MusicRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useDynamic, setUseDynamic] = useState(true);

  const moods: MoodOption[] = [
    {
      id: 'happy',
      name: 'Happy & Energetic',
      icon: <Sun className="text-yellow-500" size={24} />,
      color: 'from-yellow-400 to-orange-400',
      description: 'Feeling great and want uplifting music'
    },
    {
      id: 'calm',
      name: 'Calm & Peaceful',
      icon: <Heart className="text-serenity-500" size={24} />,
      color: 'from-serenity-400 to-mint-400',
      description: 'Need to relax and find inner peace'
    },
    {
      id: 'sad',
      name: 'Sad & Reflective',
      icon: <CloudRain className="text-blue-500" size={24} />,
      color: 'from-blue-400 to-purple-400',
      description: 'Processing emotions and seeking comfort'
    },
    {
      id: 'anxious',
      name: 'Anxious & Worried',
      icon: <Cloud className="text-gray-500" size={24} />,
      color: 'from-gray-400 to-serenity-400',
      description: 'Feeling overwhelmed and need grounding'
    },
    {
      id: 'motivated',
      name: 'Need Motivation',
      icon: <Smile className="text-green-500" size={24} />,
      color: 'from-green-400 to-mint-400',
      description: 'Want inspiring and empowering music'
    },
    {
      id: 'nostalgic',
      name: 'Nostalgic & Thoughtful',
      icon: <Meh className="text-lavender-500" size={24} />,
      color: 'from-lavender-400 to-purple-400',
      description: 'Reflecting on memories and life'
    }
  ];

  const musicDatabase: Record<string, MusicRecommendation[]> = {
    happy: [
      {
        title: "Here Comes The Sun",
        artist: "The Beatles",
        videoId: "KQetemT1sWc",
        mood: "happy",
        description: "Classic uplifting song that brings warmth and joy"
      },
      {
        title: "Good Vibrations",
        artist: "The Beach Boys",
        videoId: "Eab_beh07HU",
        mood: "happy",
        description: "Feel-good vibes that instantly lift your spirits"
      },
      {
        title: "Happy",
        artist: "Pharrell Williams",
        videoId: "ZbZSe6N_BXs",
        mood: "happy",
        description: "Pure happiness in musical form"
      }
    ],
    calm: [
      {
        title: "Weightless",
        artist: "Marconi Union",
        videoId: "UfcAVejslrU",
        mood: "calm",
        description: "Scientifically designed to reduce anxiety by 65%"
      },
      {
        title: "River",
        artist: "Eminem ft. Ed Sheeran",
        videoId: "7bJdWJSS76Q",
        mood: "calm",
        description: "Gentle and flowing, perfect for meditation"
      },
      {
        title: "Clair de Lune",
        artist: "Claude Debussy",
        videoId: "CvFH_6DNRCY",
        mood: "calm",
        description: "Beautiful classical piece for deep relaxation"
      }
    ],
    sad: [
      {
        title: "Mad World",
        artist: "Gary Jules",
        videoId: "4N3N1MlvVc4",
        mood: "sad",
        description: "Hauntingly beautiful for processing difficult emotions"
      },
      {
        title: "The Sound of Silence",
        artist: "Simon & Garfunkel",
        videoId: "4fWyzwo1xg0",
        mood: "sad",
        description: "Contemplative and comforting during tough times"
      },
      {
        title: "Hurt",
        artist: "Johnny Cash",
        videoId: "8AHCfZTRGiI",
        mood: "sad",
        description: "Raw and honest expression of pain and healing"
      }
    ],
    anxious: [
      {
        title: "Aqueous Transmission",
        artist: "Incubus",
        videoId: "3k0-sGqxIiQ",
        mood: "anxious",
        description: "Long, flowing instrumental that calms racing thoughts"
      },
      {
        title: "Om Mani Padme Hum",
        artist: "Tibetan Monks",
        videoId: "hz6xFiAxb5k",
        mood: "anxious",
        description: "Ancient chanting for grounding and centering"
      },
      {
        title: "Breathing Me",
        artist: "Sia",
        videoId: "SFGvmrJ5rjM",
        mood: "anxious",
        description: "Gentle rhythm that matches deep breathing"
      }
    ],
    motivated: [
      {
        title: "Eye of the Tiger",
        artist: "Survivor",
        videoId: "btPJPFnesV4",
        mood: "motivated",
        description: "Classic motivational anthem for building confidence"
      },
      {
        title: "Stronger",
        artist: "Kelly Clarkson",
        videoId: "Xn676-fLq7I",
        mood: "motivated",
        description: "Empowering message about overcoming challenges"
      },
      {
        title: "Rise Up",
        artist: "Andra Day",
        videoId: "lwgr_IMeEgA",
        mood: "motivated",
        description: "Inspiring anthem about resilience and hope"
      }
    ],
    nostalgic: [
      {
        title: "The Way You Look Tonight",
        artist: "Frank Sinatra",
        videoId: "h9ZGKALMMuc",
        mood: "nostalgic",
        description: "Timeless classic that evokes warm memories"
      },
      {
        title: "Yesterday",
        artist: "The Beatles",
        videoId: "wXTJBr9tt8Q",
        mood: "nostalgic",
        description: "Reflective ballad about times gone by"
      },
      {
        title: "Time After Time",
        artist: "Cyndi Lauper",
        videoId: "VdQY7BusJNU",
        mood: "nostalgic",
        description: "Gentle reminder of enduring connections"
      }
    ]
  };

  const handleMoodSelection = async (moodId: string) => {
    setSelectedMood(moodId);
    setIsLoading(true);
    
    if (useDynamic) {
      // Build AI-guided query heuristics (serverless-friendly for now)
      const moodToQuery: Record<string, string> = {
        happy: 'uplifting happy songs playlist',
        calm: 'calming meditation music instrumental',
        sad: 'soothing songs for sadness comfort',
        anxious: 'anxiety relief breathing calming music',
        motivated: 'motivational workout focus music',
        nostalgic: 'nostalgic classics timeless songs',
      };
      const query = moodToQuery[moodId] || 'calming music for mental health';
      const results = await searchYouTube(query, { maxResults: 6, regionCode: 'IN', safeSearch: 'strict' });
      const recs = results.map(r => ({
        title: r.title,
        artist: r.channelTitle,
        videoId: r.videoId,
        mood: moodId,
        description: r.description || 'Recommended for your mood'
      }));
      setCurrentRecommendations(recs.length ? recs : (musicDatabase[moodId] || []));
      setIsLoading(false);
      return;
    }
    
    // Fallback to static list
    setTimeout(() => {
      setCurrentRecommendations(musicDatabase[moodId] || []);
      setIsLoading(false);
    }, 800);
  };

  return (
    <section id="mood-music" className="py-20 px-4 bg-gradient-to-br from-lavender-50 to-mint-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-lavender-500 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-breathing">
            <Music className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-4">Mood-Based Music Therapy</h2>
          <p className="text-serenity-700 text-lg max-w-2xl mx-auto">
            Let music heal your soul. Choose your current mood and discover curated songs that support your emotional journey.
          </p>
        </div>

        {/* Mood Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelection(mood.id)}
              className={`therapeutic-card p-6 text-left transition-all duration-300 ${
                selectedMood === mood.id 
                  ? 'ring-2 ring-serenity-400 shadow-xl scale-105' 
                  : 'hover:scale-102'
              }`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${mood.color} rounded-full flex items-center justify-center mb-4`}>
                {mood.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{mood.name}</h3>
              <p className="text-sm text-gray-600">{mood.description}</p>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-serenity-400 to-lavender-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-breathing">
              <Music className="text-white animate-pulse" size={24} />
            </div>
            <p className="text-serenity-700">Curating the perfect music for your mood...</p>
          </div>
        )}

        {/* Toggle Dynamic vs Static */}
        <div className="flex justify-end mb-4">
          <label className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <input type="checkbox" checked={useDynamic} onChange={async (e) => {
              const next = e.target.checked;
              setUseDynamic(next);
              if (next && selectedMood) {
                await handleMoodSelection(selectedMood);
              }
            }} />
            <span>Use AI-powered recommendations</span>
          </label>
        </div>

        {/* Music Recommendations */}
        {currentRecommendations.length > 0 && !isLoading && (
          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold text-center text-serenity-800 mb-8">
              Music for Your {moods.find(m => m.id === selectedMood)?.name} Mood
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRecommendations.map((song, index) => (
                <div key={index} className="therapeutic-card p-6 group">
                  {/* YouTube Thumbnail */}
                  <div className="relative mb-4 rounded-xl overflow-hidden">
                    <img 
                      src={`https://img.youtube.com/vi/${song.videoId}/maxresdefault.jpg`}
                      alt={song.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => window.open(`https://youtube.com/watch?v=${song.videoId}`, '_blank')}
                        className="bg-white/90 hover:bg-white text-serenity-600 p-3 rounded-full transition-all duration-300 hover:scale-110"
                      >
                        <Play size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Song Info */}
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{song.title}</h4>
                  <p className="text-serenity-600 font-medium mb-3">{song.artist}</p>
                  <p className="text-sm text-gray-600 mb-4">{song.description}</p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => window.open(`https://youtube.com/watch?v=${song.videoId}`, '_blank')}
                      className="flex-1 bg-gradient-to-r from-serenity-500 to-lavender-500 text-white py-2 px-4 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
                    >
                      <Play size={16} />
                      <span>Listen</span>
                    </button>
                    <button className="bg-white border border-serenity-300 text-serenity-600 p-2 rounded-full hover:bg-serenity-50 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="mt-12 text-center">
              <div className="therapeutic-card p-8 max-w-2xl mx-auto">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">🎵 Music Therapy Tips</h4>
                <div className="text-left space-y-3 text-gray-600">
                  <p>• <strong>Listen mindfully:</strong> Focus on the lyrics, instruments, and how the music makes you feel</p>
                  <p>• <strong>Match your energy:</strong> Start with music that matches your current mood, then gradually shift</p>
                  <p>• <strong>Create playlists:</strong> Build collections for different emotional states</p>
                  <p>• <strong>Breathe with the rhythm:</strong> Use the music's tempo to guide your breathing</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MoodMusicRecommender;
