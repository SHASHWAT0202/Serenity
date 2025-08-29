
import { useState, useEffect } from 'react';
import { Play, Star, Clock, Heart, User } from 'lucide-react';
import { searchYouTube } from '@/services/youtube';

interface Video {
  id: string;
  title: string;
  creator: string;
  duration: string;
  description: string;
  category: 'meditation' | 'therapy' | 'education' | 'breathing' | 'motivation';
  videoId: string;
  rating: number;
  views: string;
  tags: string[];
}

const CuratedVideos = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dynamicVideos, setDynamicVideos] = useState<Video[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // All videos are now fetched from the YouTube API. No hardcoded list.

  const categories = [
    { id: 'all', name: 'All Videos', icon: '📺', color: 'bg-gray-100' },
    { id: 'meditation', name: 'Meditation', icon: '🧘', color: 'bg-serenity-100' },
    { id: 'therapy', name: 'Therapy', icon: '💬', color: 'bg-lavender-100' },
    { id: 'education', name: 'Education', icon: '📚', color: 'bg-mint-100' },
    { id: 'breathing', name: 'Breathing', icon: '🫁', color: 'bg-orange-100' },
    { id: 'motivation', name: 'Motivation', icon: '⚡', color: 'bg-purple-100' }
  ];

  const filteredDynamic = dynamicVideos ? (
    selectedCategory === 'all' ? dynamicVideos : dynamicVideos.filter(v => v.category === selectedCategory)
  ) : null;

  const fetchDynamic = async (category: string) => {
    setIsLoading(true);
    const categoryToQuery: Record<string, string> = {
      meditation: 'guided meditation anxiety relief India',
      therapy: 'therapist explains coping strategies mental health',
      education: 'mental health education basics explained',
      breathing: '4-7-8 breathing technique reduce stress',
      motivation: 'morning motivation mental health positivity',
      all: 'mental health meditation therapy breathing motivation India'
    };
    const query = categoryToQuery[category] || categoryToQuery['all'];
    const res = await searchYouTube(query, { maxResults: 9, regionCode: 'IN', safeSearch: 'moderate' });
    const mapped: Video[] = res.map((r, idx) => ({
      id: `d-${idx}-${r.videoId}`,
      title: r.title,
      creator: r.channelTitle,
      duration: '—',
      description: r.description,
      category: (category === 'all' ? 'education' : (category as Video['category'])),
      videoId: r.videoId,
      rating: 4.7,
      views: '—',
      tags: ['dynamic', 'ai', 'yt']
    }));
    setDynamicVideos(mapped.length ? mapped : null);
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    fetchDynamic('all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategory = async (category: string) => {
    setSelectedCategory(category);
    await fetchDynamic(category);
  };

  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const openVideo = (videoId: string) => {
    window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gradient mb-4">Curated Wellness Videos</h3>
        <p className="text-serenity-700 text-lg max-w-2xl mx-auto">
          Discover videos tailored to your needs. Use dynamic AI-powered results or stick with our hand-picked collection.
        </p>
      </div>

      {/* No toggle – always AI-powered */}

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-serenity-500 text-white shadow-lg'
                : `${category.color} text-gray-700 hover:shadow-md`
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-600">Fetching fresh videos for you...</div>
      )}

      {!isLoading && (!filteredDynamic || filteredDynamic.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No videos found right now. Please try another category.
        </div>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(filteredDynamic ?? []).map((video) => (
          <div key={video.id} className="therapeutic-card p-0 overflow-hidden group">
            {/* Video Thumbnail */}
            <div className="relative">
              <img 
                src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <button 
                  onClick={() => openVideo(video.videoId)}
                  className="bg-white/90 hover:bg-white text-serenity-600 p-4 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Play size={24} />
                </button>
              </div>
              
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                <Clock size={12} />
                <span>{video.duration}</span>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(video.id)}
                className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
                  favorites.includes(video.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart size={16} fill={favorites.includes(video.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h4>
              
              <div className="flex items-center space-x-2 mb-3">
                <User className="text-gray-500" size={14} />
                <span className="text-sm text-gray-600">{video.creator}</span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{video.description}</p>

              {/* Rating and Views */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-500" size={16} fill="currentColor" />
                  <span className="text-sm font-medium text-gray-700">{video.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{video.views} views</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {video.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Watch Button */}
              <button
                onClick={() => openVideo(video.videoId)}
                className="w-full bg-gradient-to-r from-serenity-500 to-lavender-500 text-white py-2 px-4 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Play size={16} />
                <span>Watch Video</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Playlist Tips */}
      <div className="mt-12 therapeutic-card p-8">
        <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">📱 How to Use These Videos</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🌅</div>
            <h5 className="font-semibold text-gray-800 mb-2">Morning Routine</h5>
            <p className="text-sm text-gray-600">Start your day with meditation or motivational videos to set a positive tone.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⏱️</div>
            <h5 className="font-semibold text-gray-800 mb-2">Stress Breaks</h5>
            <p className="text-sm text-gray-600">Use breathing exercises and short meditations during stressful moments.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🌙</div>
            <h5 className="font-semibold text-gray-800 mb-2">Evening Wind-down</h5>
            <p className="text-sm text-gray-600">End your day with relaxation videos and sleep-focused content.</p>
          </div>
        </div>

        <div className="mt-8 bg-serenity-50 rounded-xl p-6 text-center">
          <h5 className="font-semibold text-gray-800 mb-2">💡 Pro Tip</h5>
          <p className="text-gray-600">
            Create a personal playlist by favoriting videos that resonate with you. 
            Regular practice with the same content can deepen the therapeutic benefits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CuratedVideos;
