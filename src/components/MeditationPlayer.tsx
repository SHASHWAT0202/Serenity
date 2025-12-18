import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Star } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  duration: string;
  mood: string;
  color: string;
  gradient: string;
  audioUrl: string;
}

const MeditationPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks: Track[] = [
    {
      id: 1,
      title: 'Ocean Waves',
      duration: '10:00',
      mood: 'Calm',
      color: 'from-cyan-400 to-blue-500',
      gradient: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 2,
      title: 'Forest Whispers',
      duration: '15:00',
      mood: 'Peaceful',
      color: 'from-green-400 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: 3,
      title: 'Sunrise Meditation',
      duration: '12:00',
      mood: 'Energizing',
      color: 'from-orange-400 to-pink-500',
      gradient: 'bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
      id: 4,
      title: 'Night Sky',
      duration: '20:00',
      mood: 'Relaxing',
      color: 'from-purple-400 to-indigo-500',
      gradient: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    }
  ];

  const track = tracks[currentTrack];

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(track.audioUrl);
    audioRef.current.volume = volume / 100;
    audioRef.current.loop = true;

    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
      }
    };

    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('loadedmetadata', updateProgress);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', updateProgress);
      }
    };
  }, [track.audioUrl, volume]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error('Audio play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setProgress(0);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-x-hidden ${track.gradient} transition-all duration-1000 py-12 md:py-20`}>
      
      {/* Seamless Gradient Blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
      
      {/* Dynamic Background Blobs */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        key={currentTrack}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1 }}
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br ${track.color} rounded-full blur-3xl`}
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`absolute bottom-0 -right-40 w-[700px] h-[700px] bg-gradient-to-tl ${track.color} rounded-full blur-3xl`}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${track.color} opacity-40`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">
        
        {/* Animated Breathing Ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-16"
        >
          <div className="relative">
            {/* Outer breathing ring */}
            <motion.div
              animate={isPlaying ? { 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              } : {}}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${track.color} blur-2xl`}
            />
            
            {/* Middle ring */}
            <motion.div
              animate={isPlaying ? { 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4]
              } : {}}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className={`absolute inset-4 rounded-full bg-gradient-to-br ${track.color} blur-xl`}
            />

            {/* Inner circle */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-white/40 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-2xl border-4 sm:border-6 md:border-8 border-white/60">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className={`w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-gradient-to-br ${track.color} rounded-full flex items-center justify-center shadow-xl`}
              >
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl">🧘</span>
              </motion.div>
            </div>

            {/* Favorite Star */}
            <motion.button
              whileHover={{ scale: 1.2, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute -top-4 -right-4 p-4 bg-white/80 backdrop-blur-xl rounded-full shadow-lg"
            >
              <Star 
                className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Track Info */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${track.color} bg-clip-text text-transparent`}>
                {track.title}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-2">{track.mood} • {track.duration}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative h-2 bg-white/40 backdrop-blur-xl rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${track.color} rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-center gap-6 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="p-3 sm:p-4 bg-white/60 backdrop-blur-xl rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className={`p-6 sm:p-8 bg-gradient-to-br ${track.color} rounded-full shadow-2xl hover:shadow-3xl transition-shadow`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="p-3 sm:p-4 bg-white/60 backdrop-blur-xl rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </motion.button>
        </motion.div>

        {/* Volume Control */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center justify-center gap-3 sm:gap-4 max-w-xs mx-auto px-4"
        >
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-2 bg-white/40 backdrop-blur-xl rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${track.color} 0%, ${track.color} ${volume}%, rgba(255,255,255,0.4) ${volume}%, rgba(255,255,255,0.4) 100%)`
            }}
          />
          <span className="text-sm text-gray-600 w-12">{volume}%</span>
        </motion.div>

        {/* Playlist */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-4"
        >
          {tracks.map((t, index) => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsPlaying(false);
                setCurrentTrack(index);
                setProgress(0);
                setTimeout(() => setIsPlaying(true), 100);
              }}
              className={`p-3 sm:p-4 rounded-2xl backdrop-blur-xl shadow-lg transition-all ${
                index === currentTrack
                  ? `bg-gradient-to-br ${t.color} text-white`
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              <p className="font-semibold text-xs sm:text-sm mb-1">{t.title}</p>
              <p className={`text-xs ${index === currentTrack ? 'text-white/80' : 'text-gray-500'}`}>
                {t.duration}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MeditationPlayer;
