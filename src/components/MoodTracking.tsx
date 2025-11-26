import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Smile, Frown, Meh, Heart, Zap } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  intensity: number;
  note: string;
}

const MoodTracking = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const moodData: MoodEntry[] = [
    { date: 'Mon', mood: 'good', intensity: 75, note: 'Productive day at work' },
    { date: 'Tue', mood: 'great', intensity: 90, note: 'Meditation session helped' },
    { date: 'Wed', mood: 'okay', intensity: 60, note: 'Feeling a bit tired' },
    { date: 'Thu', mood: 'good', intensity: 80, note: 'Good sleep last night' },
    { date: 'Fri', mood: 'great', intensity: 95, note: 'Amazing therapy session' },
    { date: 'Sat', mood: 'good', intensity: 85, note: 'Relaxing weekend' },
    { date: 'Sun', mood: 'good', intensity: 70, note: 'Preparing for the week' }
  ];

  const moodColors = {
    great: { color: 'from-green-400 to-emerald-500', emoji: '😊', text: 'Great' },
    good: { color: 'from-cyan-400 to-blue-500', emoji: '🙂', text: 'Good' },
    okay: { color: 'from-yellow-400 to-orange-400', emoji: '😐', text: 'Okay' },
    bad: { color: 'from-orange-400 to-red-400', emoji: '😟', text: 'Bad' },
    terrible: { color: 'from-red-500 to-pink-500', emoji: '😢', text: 'Terrible' }
  };

  const averageMood = moodData.reduce((acc, entry) => acc + entry.intensity, 0) / moodData.length;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-ocean-light via-white to-ocean-mist py-20">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-ocean-aqua/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-ocean-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            x: [-20, 20, -20]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-ocean-deep via-ocean-primary to-ocean-aqua bg-clip-text text-transparent">
            Mood Journey
          </h2>
          <p className="text-lg text-ocean-primary/70">
            Track your emotional wellness over time
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-ocean-aqua/30 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-ocean-aqua to-ocean-primary">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-ocean-deep/60 font-medium">Average Mood</span>
            </div>
            <div className="text-4xl font-bold text-ocean-primary">{Math.round(averageMood)}%</div>
            <div className="text-sm text-ocean-deep/60 mt-1">This week</div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-ocean-aqua/30 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-ocean-deep/60 font-medium">Great Days</span>
            </div>
            <div className="text-4xl font-bold text-green-500">
              {moodData.filter(e => e.mood === 'great').length}
            </div>
            <div className="text-sm text-ocean-deep/60 mt-1">Out of 7 days</div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-ocean-aqua/30 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-ocean-deep/60 font-medium">Streak</span>
            </div>
            <div className="text-4xl font-bold text-purple-500">5</div>
            <div className="text-sm text-ocean-deep/60 mt-1">Days tracked</div>
          </div>
        </motion.div>

        {/* Timeframe Toggle */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-full p-2 border border-ocean-aqua/30 shadow-lg flex gap-2">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                timeframe === 'week'
                  ? 'bg-gradient-to-r from-ocean-primary to-ocean-aqua text-white shadow-lg'
                  : 'text-ocean-deep/60 hover:text-ocean-primary'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                timeframe === 'month'
                  ? 'bg-gradient-to-r from-ocean-primary to-ocean-aqua text-white shadow-lg'
                  : 'text-ocean-deep/60 hover:text-ocean-primary'
              }`}
            >
              Month
            </button>
          </div>
        </motion.div>

        {/* Mood Graph */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-ocean-aqua/30 shadow-2xl mb-8"
        >
          <h3 className="text-2xl font-bold text-ocean-deep mb-8">Your Mood Curve</h3>
          
          {/* Graph */}
          <div className="relative h-64 mb-8">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px bg-ocean-primary/10" />
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute -left-12 inset-y-0 flex flex-col justify-between text-xs text-ocean-deep/60">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {/* Mood curve */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(168, 228, 224, 0.4)" />
                  <stop offset="100%" stopColor="rgba(168, 228, 224, 0.05)" />
                </linearGradient>
              </defs>
              
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d={`M 0 ${256 - (moodData[0].intensity * 2.56)} ${moodData.map((entry, i) => {
                  const x = (i / (moodData.length - 1)) * 100;
                  const y = 256 - (entry.intensity * 2.56);
                  return `L ${x}% ${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="url(#oceanGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                d={`M 0 ${256 - (moodData[0].intensity * 2.56)} ${moodData.map((entry, i) => {
                  const x = (i / (moodData.length - 1)) * 100;
                  const y = 256 - (entry.intensity * 2.56);
                  return `L ${x}% ${y}`;
                }).join(' ')} L 100% 256 L 0 256 Z`}
                fill="url(#moodGradient)"
              />

              <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#326B70" />
                  <stop offset="50%" stopColor="#A8E4E0" />
                  <stop offset="100%" stopColor="#326B70" />
                </linearGradient>
              </defs>
            </svg>

            {/* Data points */}
            <div className="absolute inset-0 flex justify-between items-end px-2">
              {moodData.map((entry, index) => (
                <motion.button
                  key={index}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(index)}
                  className="relative"
                  style={{ bottom: `${entry.intensity}%` }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${moodColors[entry.mood].color} shadow-lg flex items-center justify-center text-lg border-2 border-white`}
                    animate={selectedDay === index ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.6, repeat: selectedDay === index ? Infinity : 0 }}
                  >
                    {moodColors[entry.mood].emoji}
                  </motion.div>
                  
                  {/* Tooltip */}
                  {selectedDay === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl border border-ocean-aqua/30 whitespace-nowrap z-10"
                    >
                      <div className="text-xs font-semibold text-ocean-deep mb-1">{entry.date}</div>
                      <div className={`text-sm font-bold bg-gradient-to-r ${moodColors[entry.mood].color} bg-clip-text text-transparent mb-1`}>
                        {moodColors[entry.mood].text} ({entry.intensity}%)
                      </div>
                      <div className="text-xs text-ocean-deep/70">{entry.note}</div>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between px-2 text-sm font-medium text-ocean-deep/70">
            {moodData.map((entry, index) => (
              <span key={index}>{entry.date}</span>
            ))}
          </div>
        </motion.div>

        {/* Mood Legend */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {Object.entries(moodColors).map(([mood, data]) => (
            <div key={mood} className="bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 border border-ocean-aqua/30 shadow-lg flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center text-lg shadow-lg`}>
                {data.emoji}
              </div>
              <span className="text-sm font-medium text-ocean-deep">{data.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MoodTracking;
