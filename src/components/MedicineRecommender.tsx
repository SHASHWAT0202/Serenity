
import { useState } from 'react';
import { Pill, AlertTriangle, Heart, Leaf, Star, Info } from 'lucide-react';

interface Supplement {
  id: string;
  name: string;
  type: 'herb' | 'vitamin' | 'mineral' | 'amino_acid' | 'natural';
  description: string;
  benefits: string[];
  dosage: string;
  precautions: string[];
  researchLevel: 'Strong' | 'Moderate' | 'Preliminary';
  category: 'anxiety' | 'depression' | 'sleep' | 'stress' | 'focus';
  price: string;
}

const MedicineRecommender = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);

  const supplements: Supplement[] = [
    {
      id: 'ashwagandha',
      name: 'Ashwagandha',
      type: 'herb',
      description: 'An adaptogenic herb that helps the body manage stress and promotes calm energy.',
      benefits: [
        'Reduces cortisol levels',
        'Decreases anxiety and stress',
        'Improves sleep quality',
        'Boosts energy and vitality',
        'Supports immune function'
      ],
      dosage: '300-600mg daily with meals',
      precautions: [
        'May interact with thyroid medications',
        'Avoid during pregnancy and breastfeeding',
        'May lower blood sugar levels',
        'Discontinue 2 weeks before surgery'
      ],
      researchLevel: 'Strong',
      category: 'stress',
      price: '$15-25 monthly'
    },
    {
      id: 'magnesium',
      name: 'Magnesium Glycinate',
      type: 'mineral',
      description: 'A highly absorbable form of magnesium that supports nervous system function and relaxation.',
      benefits: [
        'Promotes better sleep',
        'Reduces muscle tension',
        'Calms nervous system',
        'Supports heart health',
        'May reduce migraines'
      ],
      dosage: '200-400mg before bedtime',
      precautions: [
        'May cause digestive upset in high doses',
        'Can interact with certain antibiotics',
        'Start with lower dose to assess tolerance',
        'Consult doctor if you have kidney issues'
      ],
      researchLevel: 'Strong',
      category: 'sleep',
      price: '$10-20 monthly'
    },
    {
      id: 'omega3',
      name: 'Omega-3 Fatty Acids',
      type: 'natural',
      description: 'Essential fatty acids that support brain health and mood regulation.',
      benefits: [
        'Supports brain function',
        'May reduce depression symptoms',
        'Anti-inflammatory properties',
        'Improves heart health',
        'Supports cognitive function'
      ],
      dosage: '1000-2000mg EPA/DHA daily',
      precautions: [
        'May increase bleeding risk',
        'Can interact with blood thinners',
        'Choose high-quality, tested supplements',
        'May cause fishy aftertaste'
      ],
      researchLevel: 'Strong',
      category: 'depression',
      price: '$15-30 monthly'
    },
    {
      id: 'vitamin-d',
      name: 'Vitamin D3',
      type: 'vitamin',
      description: 'Essential vitamin that supports mood regulation and overall mental health.',
      benefits: [
        'Supports mood regulation',
        'May reduce seasonal depression',
        'Boosts immune function',
        'Supports bone health',
        'Improves energy levels'
      ],
      dosage: '1000-4000 IU daily',
      precautions: [
        'Test blood levels before supplementing',
        'May interact with certain medications',
        'Too much can cause toxicity',
        'Take with fat for better absorption'
      ],
      researchLevel: 'Strong',
      category: 'depression',
      price: '$8-15 monthly'
    },
    {
      id: 'ltheanine',
      name: 'L-Theanine',
      type: 'amino_acid',
      description: 'Amino acid found in tea that promotes relaxation without drowsiness.',
      benefits: [
        'Promotes calm alertness',
        'Reduces anxiety',
        'Improves focus',
        'Supports better sleep',
        'No sedative effects'
      ],
      dosage: '100-200mg daily or as needed',
      precautions: [
        'Generally very safe',
        'May enhance effects of sedatives',
        'Start with lower dose',
        'Can be taken multiple times daily'
      ],
      researchLevel: 'Moderate',
      category: 'anxiety',
      price: '$12-20 monthly'
    },
    {
      id: 'rhodiola',
      name: 'Rhodiola Rosea',
      type: 'herb',
      description: 'Adaptogenic herb that helps combat fatigue and supports mental performance.',
      benefits: [
        'Reduces mental fatigue',
        'Improves stress resilience',
        'Enhances cognitive function',
        'Supports mood balance',
        'Boosts physical endurance'
      ],
      dosage: '200-400mg on empty stomach',
      precautions: [
        'May cause jitteriness in some people',
        'Take earlier in day to avoid sleep issues',
        'Quality varies between brands',
        'May interact with diabetes medications'
      ],
      researchLevel: 'Moderate',
      category: 'stress',
      price: '$20-35 monthly'
    },
    {
      id: 'gaba',
      name: 'GABA',
      type: 'amino_acid',
      description: 'Neurotransmitter that promotes relaxation and reduces anxiety.',
      benefits: [
        'Promotes relaxation',
        'May reduce anxiety',
        'Supports better sleep',
        'Calms nervous system',
        'May improve mood'
      ],
      dosage: '500-750mg daily',
      precautions: [
        'Effectiveness when taken orally is debated',
        'May interact with anxiety medications',
        'Start with lower dose',
        'Best taken on empty stomach'
      ],
      researchLevel: 'Preliminary',
      category: 'anxiety',
      price: '$15-25 monthly'
    },
    {
      id: 'valerian',
      name: 'Valerian Root',
      type: 'herb',
      description: 'Traditional herb used for centuries to promote relaxation and sleep.',
      benefits: [
        'Promotes deep sleep',
        'Reduces sleep latency',
        'Natural sedative effect',
        'May reduce anxiety',
        'Non-habit forming'
      ],
      dosage: '300-600mg 1-2 hours before bed',
      precautions: [
        'May cause morning grogginess',
        'Strong smell and taste',
        'May interact with sedatives',
        'Not recommended for long-term use'
      ],
      researchLevel: 'Moderate',
      category: 'sleep',
      price: '$10-18 monthly'
    },
    {
      id: 'bacopa',
      name: 'Bacopa Monnieri',
      type: 'herb',
      description: 'Ayurvedic herb traditionally used to enhance memory and cognitive function.',
      benefits: [
        'Improves memory and learning',
        'Reduces anxiety',
        'Enhances cognitive function',
        'May reduce ADHD symptoms',
        'Supports brain health'
      ],
      dosage: '300-600mg daily with meals',
      precautions: [
        'May cause digestive upset initially',
        'Effects build over 6-12 weeks',
        'May interact with thyroid medications',
        'Take with fat for better absorption'
      ],
      researchLevel: 'Moderate',
      category: 'focus',
      price: '$12-22 monthly'
    },
    {
      id: 'passionflower',
      name: 'Passionflower',
      type: 'herb',
      description: 'Gentle herb traditionally used for anxiety and sleep support.',
      benefits: [
        'Reduces anxiety and worry',
        'Promotes restful sleep',
        'Calms nervous tension',
        'May help with withdrawal symptoms',
        'Gentle and well-tolerated'
      ],
      dosage: '250-500mg or 1-2 cups tea daily',
      precautions: [
        'May enhance sedative effects',
        'Avoid during pregnancy',
        'May cause drowsiness',
        'Quality varies in tea form'
      ],
      researchLevel: 'Moderate',
      category: 'anxiety',
      price: '$8-15 monthly'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Supplements', icon: <Pill size={16} />, color: 'bg-gray-100' },
    { id: 'anxiety', name: 'Anxiety Relief', icon: <Heart size={16} />, color: 'bg-serenity-100' },
    { id: 'depression', name: 'Mood Support', icon: <Star size={16} />, color: 'bg-lavender-100' },
    { id: 'sleep', name: 'Sleep Support', icon: <Leaf size={16} />, color: 'bg-mint-100' },
    { id: 'stress', name: 'Stress Management', icon: <AlertTriangle size={16} />, color: 'bg-orange-100' },
    { id: 'focus', name: 'Focus & Clarity', icon: <Info size={16} />, color: 'bg-purple-100' }
  ];

  const filteredSupplements = selectedCategory === 'all' 
    ? supplements 
    : supplements.filter(supplement => supplement.category === selectedCategory);

  const getResearchColor = (level: string) => {
    switch (level) {
      case 'Strong': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-orange-600 bg-orange-100';
      case 'Preliminary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'herb': return '🌿';
      case 'vitamin': return '💊';
      case 'mineral': return '⚡';
      case 'amino_acid': return '🧬';
      case 'natural': return '🐟';
      default: return '💊';
    }
  };

  if (selectedSupplement) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <button
            onClick={() => setSelectedSupplement(null)}
            className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
          >
            ← Back to Supplements
          </button>
        </div>

        <div className="therapeutic-card p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{getTypeIcon(selectedSupplement.type)}</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedSupplement.name}</h3>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getResearchColor(selectedSupplement.researchLevel)}`}>
                {selectedSupplement.researchLevel} Research Evidence
              </span>
              <span className="text-lg font-semibold text-serenity-600">{selectedSupplement.price}</span>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{selectedSupplement.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Benefits */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Star className="text-mint-500" size={20} />
                  <span>Potential Benefits</span>
                </h4>
                <ul className="space-y-2">
                  {selectedSupplement.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-mint-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-serenity-50 rounded-xl p-6">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <Pill className="text-serenity-600" size={18} />
                  <span>Recommended Dosage</span>
                </h5>
                <p className="text-gray-700">{selectedSupplement.dosage}</p>
              </div>
            </div>

            {/* Precautions */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="text-orange-500" size={20} />
                  <span>Important Precautions</span>
                </h4>
                <ul className="space-y-2">
                  {selectedSupplement.precautions.map((precaution, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-red-600 mt-0.5" size={20} />
              <div>
                <h5 className="font-semibold text-red-800 mb-2">Important Medical Disclaimer</h5>
                <p className="text-red-700 text-sm">
                  This information is for educational purposes only and is not intended to replace professional medical advice. 
                  Always consult with a healthcare provider before starting any supplement regimen, especially if you have 
                  existing health conditions or take medications. Supplements can interact with medications and may not be 
                  suitable for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gradient mb-4">Natural Wellness Supplements</h3>
        <p className="text-serenity-700 text-lg max-w-2xl mx-auto">
          Explore evidence-based natural supplements that may support your mental health journey. Always consult with healthcare professionals before starting any supplement regimen.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-serenity-500 text-white shadow-lg'
                : `${category.color} text-gray-700 hover:shadow-md`
            }`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Supplements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredSupplements.map((supplement) => (
          <button
            key={supplement.id}
            onClick={() => setSelectedSupplement(supplement)}
            className="therapeutic-card p-6 text-left hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{getTypeIcon(supplement.type)}</div>
              <h4 className="text-lg font-semibold text-gray-800">{supplement.name}</h4>
              <div className="flex justify-center items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResearchColor(supplement.researchLevel)}`}>
                  {supplement.researchLevel} Evidence
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{supplement.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="text-xs text-gray-500">Key Benefits:</div>
              <ul className="text-xs text-gray-600">
                {supplement.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-mint-500 rounded-full"></div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-serenity-600">{supplement.price}</span>
              <span className="text-serenity-600 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* General Guidelines */}
      <div className="therapeutic-card p-8">
        <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">🌟 Supplement Safety Guidelines</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <h5 className="font-semibold text-gray-800 mb-2">Consult Healthcare Providers</h5>
            <p className="text-sm text-gray-600">Always discuss supplements with your doctor, especially if you take medications or have health conditions.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-serenity-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="text-serenity-600" size={20} />
            </div>
            <h5 className="font-semibold text-gray-800 mb-2">Quality Matters</h5>
            <p className="text-sm text-gray-600">Choose third-party tested supplements from reputable manufacturers for purity and potency.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="text-mint-600" size={20} />
            </div>
            <h5 className="font-semibold text-gray-800 mb-2">Start Slowly</h5>
            <p className="text-sm text-gray-600">Begin with lower doses and introduce one supplement at a time to monitor effects.</p>
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Remember:</strong> Supplements are meant to complement, not replace, professional mental health treatment. 
            They work best as part of a comprehensive approach including therapy, lifestyle changes, and medical care when needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicineRecommender;
