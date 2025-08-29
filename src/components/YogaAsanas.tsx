
import { useState } from 'react';
import { Heart, Clock, Star, ChevronRight } from 'lucide-react';

interface Asana {
  id: string;
  name: string;
  englishName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  benefits: string[];
  steps: string[];
  mentalHealthBenefits: string;
  imageUrl: string;
  category: 'relaxation' | 'energy' | 'balance' | 'strength';
}

const YogaAsanas = () => {
  const [selectedAsana, setSelectedAsana] = useState<Asana | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const asanas: Asana[] = [
      {
        id: 'surya-namaskar',
        name: 'Surya Namaskar',
        englishName: 'Sun Salutation',
        difficulty: 'Intermediate',
        duration: '5-10 minutes',
        benefits: [
          'Full body warm-up',
          'Improves flexibility',
          'Boosts circulation',
          'Energizes the mind and body'
        ],
        steps: [
          'Pranamasana – Stand with palms together at chest',
          'Hasta Uttanasana – Raise arms overhead, arch back',
          'Padahastasana – Bend forward, hands to feet',
          'Ashwa Sanchalanasana – Step right leg back, look forward',
          'Dandasana – Step back into plank',
          'Ashtanga Namaskara – Lower knees, chest, chin to floor',
          'Bhujangasana – Cobra pose, lift chest',
          'Adho Mukha Svanasana – Downward dog',
          'Ashwa Sanchalanasana – Step left leg forward',
          'Padahastasana – Bend forward, hands to feet',
          'Hasta Uttanasana – Raise arms, arch back',
          'Pranamasana – Return to prayer pose'
        ],
        mentalHealthBenefits: 'Synchronizing breath with movement enhances mindfulness, reduces stress, and uplifts mood.',
        imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop',
        category: 'energy'
      },
      {
        id: 'bhujangasana',
        name: 'Bhujangasana',
        englishName: 'Cobra Pose',
        difficulty: 'Beginner',
        duration: '30-60 seconds',
        benefits: [
          'Strengthens spine',
          'Opens chest and lungs',
          'Relieves fatigue',
          'Improves posture'
        ],
        steps: [
          'Lie prone with palms beside shoulders',
          'Inhale and lift chest upward',
          'Keep elbows close to body',
          'Look slightly upward',
          'Hold and breathe evenly'
        ],
        mentalHealthBenefits: 'Opens the heart space and combats mild depression, creating feelings of positivity.',
        imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
        category: 'strength'
      },
      {
        id: 'downward-dog',
        name: 'Adho Mukha Svanasana',
        englishName: 'Downward Facing Dog',
        difficulty: 'Beginner',
        duration: '1-3 minutes',
        benefits: [
          'Stretches hamstrings and calves',
          'Strengthens arms and shoulders',
          'Calms the brain',
          'Energizes the body'
        ],
        steps: [
          'Start on hands and knees',
          'Tuck toes and lift hips upward',
          'Straighten legs and arms',
          'Press heels toward floor',
          'Relax head between arms'
        ],
        mentalHealthBenefits: 'Reverses blood flow to the brain, improving focus and reducing anxiety.',
        imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
        category: 'energy'
      },
      {
        id: 'paschimottanasana',
        name: 'Paschimottanasana',
        englishName: 'Seated Forward Bend',
        difficulty: 'Intermediate',
        duration: '1-5 minutes',
        benefits: [
          'Stretches spine and hamstrings',
          'Calms the mind',
          'Relieves stress',
          'Improves digestion'
        ],
        steps: [
          'Sit with legs extended forward',
          'Inhale, lengthen spine',
          'Exhale, fold forward from hips',
          'Hold feet or ankles',
          'Relax head and breathe deeply'
        ],
        mentalHealthBenefits: 'Creates a soothing inward focus, helping quiet overthinking and anxiety.',
        imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9c03b7d?w=400&h=300&fit=crop',
        category: 'relaxation'
      },
      {
        id: 'shirshasana',
        name: 'Shirshasana',
        englishName: 'Headstand',
        difficulty: 'Advanced',
        duration: '30-120 seconds',
        benefits: [
          'Improves blood flow to brain',
          'Builds core strength',
          'Enhances balance',
          'Boosts concentration'
        ],
        steps: [
          'Kneel and interlace fingers, place forearms on floor',
          'Place crown of head on mat between hands',
          'Lift hips and walk feet toward head',
          'Slowly lift legs overhead',
          'Engage core and balance'
        ],
        mentalHealthBenefits: 'Inversions refresh the mind, improve focus, and relieve mild depression.',
        imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&h=300&fit=crop',
        category: 'balance'
      },
      {
        id: 'halasana',
        name: 'Halasana',
        englishName: 'Plow Pose',
        difficulty: 'Intermediate',
        duration: '30-60 seconds',
        benefits: [
          'Stretches spine and shoulders',
          'Calms the nervous system',
          'Stimulates thyroid',
          'Relieves fatigue'
        ],
        steps: [
          'Lie on back, arms at sides',
          'Lift legs over head into plow position',
          'Keep chin tucked',
          'Hold and breathe deeply'
        ],
        mentalHealthBenefits: 'Encourages deep relaxation and introspection, easing insomnia and anxiety.',
        imageUrl: 'https://images.unsplash.com/photo-1594737625785-caa86f3ccdf4?w=400&h=300&fit=crop',
        category: 'relaxation'
      },
      {
        id: 'dhanurasana',
        name: 'Dhanurasana',
        englishName: 'Bow Pose',
        difficulty: 'Intermediate',
        duration: '20-40 seconds',
        benefits: [
          'Strengthens back and abdomen',
          'Opens chest and shoulders',
          'Improves posture',
          'Boosts energy'
        ],
        steps: [
          'Lie prone and bend knees',
          'Hold ankles with hands',
          'Inhale and lift chest and legs upward',
          'Look forward and hold'
        ],
        mentalHealthBenefits: 'Stimulates adrenal glands, reducing stress and fatigue while promoting optimism.',
        imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
        category: 'energy'
      },
      {
        id: 'matsyasana',
        name: 'Matsyasana',
        englishName: 'Fish Pose',
        difficulty: 'Intermediate',
        duration: '30-60 seconds',
        benefits: [
          'Opens chest and throat',
          'Relieves respiratory issues',
          'Energizes the body',
          'Improves posture'
        ],
        steps: [
          'Lie on back, legs extended',
          'Place hands under hips',
          'Lift chest and arch back',
          'Tilt head backward, crown on floor'
        ],
        mentalHealthBenefits: 'Opens the heart chakra, encouraging emotional release and mental clarity.',
        imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop',
        category: 'strength'
      },
      {
        id: 'ustrasana',
        name: 'Ustrasana',
        englishName: 'Camel Pose',
        difficulty: 'Intermediate',
        duration: '20-40 seconds',
        benefits: [
          'Improves spinal flexibility',
          'Opens chest and lungs',
          'Stimulates digestion',
          'Reduces fatigue'
        ],
        steps: [
          'Kneel with knees hip-width apart',
          'Place hands on heels',
          'Push hips forward and arch back',
          'Drop head back gently'
        ],
        mentalHealthBenefits: 'Opens emotional blocks in the heart area, promoting courage and positivity.',
        imageUrl: 'https://images.unsplash.com/photo-1594737625785-caa86f3ccdf4?w=400&h=300&fit=crop',
        category: 'strength'
      },
    
    
    {
      id: 'child-pose',
      name: 'Balasana',
      englishName: 'Child\'s Pose',
      difficulty: 'Beginner',
      duration: '1-3 minutes',
      benefits: ['Calms the mind', 'Relieves stress', 'Reduces anxiety', 'Stretches back and hips'],
      steps: [
        'Kneel on the floor with knees hip-width apart',
        'Sit back on your heels',
        'Fold forward, bringing your forehead to the ground',
        'Extend arms forward or rest them alongside your body',
        'Breathe deeply and hold the position'
      ],
      mentalHealthBenefits: 'This grounding pose helps quiet mental chatter and provides a sense of safety and security. Perfect for anxiety relief.',
      imageUrl: 'https://images.unsplash.com/photo-1506629905607-ece2ef0bf5bb?w=400&h=300&fit=crop',
      category: 'relaxation'
    },
    {
      id: 'tree-pose',
      name: 'Vrikshasana',
      englishName: 'Tree Pose',
      difficulty: 'Beginner',
      duration: '30 seconds - 1 minute each side',
      benefits: ['Improves balance', 'Strengthens legs', 'Enhances focus', 'Builds confidence'],
      steps: [
        'Stand tall with feet hip-width apart',
        'Shift weight to left foot',
        'Place right foot on inner left thigh or calf (avoid the knee)',
        'Bring palms together at heart center',
        'Focus on a point ahead for balance',
        'Repeat on other side'
      ],
      mentalHealthBenefits: 'Builds mental focus and confidence while promoting a sense of grounding and stability.',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      category: 'balance'
    },
    {
      id: 'lotus-pose',
      name: 'Padmasana',
      englishName: 'Lotus Pose',
      difficulty: 'Intermediate',
      duration: '5-10 minutes',
      benefits: ['Calms the mind', 'Improves posture', 'Enhances concentration', 'Reduces stress'],
      steps: [
        'Sit cross-legged on the floor',
        'Place right foot on left thigh',
        'Place left foot on right thigh',
        'Rest hands on knees with mudra of choice',
        'Keep spine straight and shoulders relaxed',
        'Breathe deeply and meditate'
      ],
      mentalHealthBenefits: 'The ultimate meditation pose that promotes inner peace and spiritual awareness. Excellent for reducing depression and anxiety.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      category: 'relaxation'
    },
    {
      id: 'warrior-one',
      name: 'Virabhadrasana I',
      englishName: 'Warrior I',
      difficulty: 'Intermediate',
      duration: '30 seconds - 1 minute each side',
      benefits: ['Builds strength', 'Improves focus', 'Boosts confidence', 'Energizes the body'],
      steps: [
        'Step left foot back about 3-4 feet',
        'Turn left foot out 45 degrees',
        'Bend right knee over ankle',
        'Raise arms overhead',
        'Square hips forward',
        'Hold and breathe, then switch sides'
      ],
      mentalHealthBenefits: 'Builds inner strength and courage while boosting self-confidence and determination.',
      imageUrl: 'https://images.unsplash.com/photo-1506629905607-ece2ef0bf5bb?w=400&h=300&fit=crop',
      category: 'strength'
    },
    {
      id: 'corpse-pose',
      name: 'Savasana',
      englishName: 'Corpse Pose',
      difficulty: 'Beginner',
      duration: '5-15 minutes',
      benefits: ['Deep relaxation', 'Stress relief', 'Mental clarity', 'Emotional balance'],
      steps: [
        'Lie flat on your back',
        'Let arms rest at sides, palms up',
        'Allow feet to fall open naturally',
        'Close eyes and relax entire body',
        'Focus on natural breath',
        'Let go of all tension and thoughts'
      ],
      mentalHealthBenefits: 'The ultimate relaxation pose that resets the nervous system and provides deep mental rest. Essential for anxiety and stress management.',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      category: 'relaxation'
    },
    {
      id: 'mountain-pose',
      name: 'Tadasana',
      englishName: 'Mountain Pose',
      difficulty: 'Beginner',
      duration: '1-2 minutes',
      benefits: ['Improves posture', 'Builds awareness', 'Grounds energy', 'Enhances focus'],
      steps: [
        'Stand with feet hip-width apart',
        'Distribute weight evenly on both feet',
        'Engage leg muscles and lift kneecaps',
        'Lengthen spine and relax shoulders',
        'Let arms hang naturally at sides',
        'Breathe deeply and stand tall'
      ],
      mentalHealthBenefits: 'Creates a sense of stability and presence, helping to ground anxious energy and build self-awareness.',
      imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop',
      category: 'balance'
    },
    {
      id: 'cat-cow',
      name: 'Marjaryasana-Bitilasana',
      englishName: 'Cat-Cow Pose',
      difficulty: 'Beginner',
      duration: '1-2 minutes',
      benefits: ['Releases tension', 'Improves flexibility', 'Calms the mind', 'Energizes the spine'],
      steps: [
        'Start on hands and knees',
        'Inhale, arch back and look up (Cow)',
        'Exhale, round spine and tuck chin (Cat)',
        'Continue flowing between poses',
        'Move with your breath',
        'Keep movements smooth and controlled'
      ],
      mentalHealthBenefits: 'The flowing movement helps release emotional tension and creates a meditative state that calms racing thoughts.',
      imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
      category: 'energy'
    },
    {
      id: 'bridge-pose',
      name: 'Setu Bandhasana',
      englishName: 'Bridge Pose',
      difficulty: 'Beginner',
      duration: '30 seconds - 1 minute',
      benefits: ['Opens heart', 'Strengthens back', 'Energizes body', 'Relieves mild depression'],
      steps: [
        'Lie on back with knees bent',
        'Place feet hip-width apart, close to buttocks',
        'Press feet down and lift hips',
        'Interlace fingers under back',
        'Keep knees parallel',
        'Breathe deeply in the pose'
      ],
      mentalHealthBenefits: 'Heart-opening pose that combats depression and fatigue while building emotional resilience and inner strength.',
      imageUrl: 'https://images.unsplash.com/photo-1506629905607-ece2ef0bf5bb?w=400&h=300&fit=crop',
      category: 'energy'
    },
    {
      id: 'legs-up-wall',
      name: 'Viparita Karani',
      englishName: 'Legs Up the Wall',
      difficulty: 'Beginner',
      duration: '5-15 minutes',
      benefits: ['Reduces anxiety', 'Improves circulation', 'Calms nervous system', 'Relieves fatigue'],
      steps: [
        'Lie on back near a wall',
        'Scoot buttocks close to wall',
        'Extend legs up the wall',
        'Rest arms at sides, palms up',
        'Close eyes and relax',
        'Breathe naturally and deeply'
      ],
      mentalHealthBenefits: 'Deeply restorative pose that activates the parasympathetic nervous system, providing instant anxiety relief and mental calm.',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      category: 'relaxation'
    },
    {
      id: 'eagle-pose',
      name: 'Garudasana',
      englishName: 'Eagle Pose',
      difficulty: 'Intermediate',
      duration: '30 seconds - 1 minute each side',
      benefits: ['Improves focus', 'Builds balance', 'Relieves tension', 'Enhances concentration'],
      steps: [
        'Stand in Mountain Pose',
        'Bend knees slightly',
        'Lift right leg and wrap around left',
        'Cross right arm under left arm',
        'Wrap forearms and press palms together',
        'Find balance and breathe, then switch sides'
      ],
      mentalHealthBenefits: 'Requires intense focus that quiets mental chatter and builds concentration while releasing tension in shoulders and back.',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      category: 'balance'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Poses', color: 'bg-gray-100' },
    { id: 'relaxation', name: 'Relaxation', color: 'bg-serenity-100' },
    { id: 'energy', name: 'Energy', color: 'bg-orange-100' },
    { id: 'balance', name: 'Balance', color: 'bg-mint-100' },
    { id: 'strength', name: 'Strength', color: 'bg-lavender-100' }
  ];

  const filteredAsanas = selectedCategory === 'all' 
    ? asanas 
    : asanas.filter(asana => asana.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-orange-600 bg-orange-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (selectedAsana) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <button
            onClick={() => setSelectedAsana(null)}
            className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
          >
            ← Back to Poses
          </button>
        </div>

        <div className="therapeutic-card p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="space-y-4">
              <img 
                src={selectedAsana.imageUrl} 
                alt={selectedAsana.englishName}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedAsana.difficulty)}`}>
                  {selectedAsana.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">{selectedAsana.duration}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedAsana.englishName}</h3>
                <p className="text-lg text-serenity-600 font-medium mb-4">{selectedAsana.name}</p>
                <p className="text-gray-600">{selectedAsana.mentalHealthBenefits}</p>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Benefits</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAsana.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Star className="text-mint-500" size={16} />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Step-by-Step Instructions</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {selectedAsana.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-serenity-500 to-mint-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-serenity-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">💡 Mental Health Tips</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Focus on your breath throughout the pose</li>
              <li>• Listen to your body and don't force the position</li>
              <li>• Use this time to quiet your mind and be present</li>
              <li>• Practice regularly for maximum mental health benefits</li>
              <li>• Consider combining with meditation or mindfulness</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gradient mb-4">Yogic Asanas for Mental Wellness</h3>
        <p className="text-serenity-700 text-lg max-w-2xl mx-auto">
          Discover ancient yoga poses specifically chosen for their mental health benefits. Each asana includes detailed instructions and therapeutic insights.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-serenity-500 text-white shadow-lg'
                : `${category.color} text-gray-700 hover:shadow-md`
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Asanas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAsanas.map((asana) => (
          <button
            key={asana.id}
            onClick={() => setSelectedAsana(asana)}
            className="therapeutic-card p-0 overflow-hidden text-left hover:scale-105 transition-all duration-300 group"
          >
            <img 
              src={asana.imageUrl} 
              alt={asana.englishName}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(asana.difficulty)}`}>
                  {asana.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock size={14} />
                  <span className="text-xs">{asana.duration}</span>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{asana.englishName}</h4>
              <p className="text-sm text-serenity-600 font-medium mb-3">{asana.name}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{asana.mentalHealthBenefits}</p>
              
              <div className="flex items-center text-serenity-600 font-medium text-sm">
                <span>Learn More</span>
                <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* General Yoga Tips */}
      <div className="mt-12 therapeutic-card p-8 text-center">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">🧘‍♀️ Getting Started with Yoga for Mental Health</h4>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-800">🌅 Best Times to Practice</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Early morning for energy and clarity</li>
              <li>• Evening for relaxation and stress relief</li>
              <li>• Anytime you feel anxious or overwhelmed</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-800">💡 Tips for Beginners</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Start with 10-15 minutes daily</li>
              <li>• Focus on breathing over perfect form</li>
              <li>• Use props like blocks or straps</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-gray-800">🎯 Mental Health Focus</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Practice mindfulness during poses</li>
              <li>• Set intentions before starting</li>
              <li>• End with gratitude or reflection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YogaAsanas;
