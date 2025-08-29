import { useState, useEffect } from 'react';
import { CheckCircle, ChevronRight, Brain, AlertCircle, Heart, Star, TrendingUp, Calendar, Download, BarChart3, Shield, Clock, Users, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Question {
  id: number;
  text: string;
  category: 'depression' | 'anxiety' | 'stress' | 'sleep' | 'social' | 'lifestyle' | 'cognitive' | 'physical';
  options: Array<{
    text: string;
    score: number;
  }>;
  weight: number; // Weight for importance of question
}

interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  label: string;
  color: string;
}

interface QuizResult {
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
  overallCategory: string;
  description: string;
  recommendations: string[];
  categoryScores: CategoryScore[];
  riskLevel: 'low' | 'mild' | 'moderate' | 'high' | 'severe';
  color: string;
  icon: React.ReactNode;
  emergencyContact: boolean;
  followUpDays: number;
}

interface QuizHistory {
  date: string;
  score: number;
  percentage: number;
  category: string;
}

const MentalHealthQuiz = () => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [userName, setUserName] = useState('');
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Load history from memory (in a real app, this would be from a database)
    const savedHistory = JSON.parse(localStorage.getItem('mentalHealthHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const questions: Question[] = [
    // Depression (PHQ-9 inspired)
    {
      id: 1,
      text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
      category: 'depression',
      weight: 1.2,
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 }
      ]
    },
    {
      id: 2,
      text: "How often have you had little interest or pleasure in doing things?",
      category: 'depression',
      weight: 1.2,
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 }
      ]
    },
    {
      id: 3,
      text: "How often have you felt tired or had little energy?",
      category: 'depression',
      weight: 1.0,
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 }
      ]
    },
    {
      id: 4,
      text: "How often have you had thoughts that you would be better off dead or hurting yourself?",
      category: 'depression',
      weight: 2.0, // Highest weight for safety
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 2 },
        { text: "More than half the days", score: 4 },
        { text: "Nearly every day", score: 6 }
      ]
    },
    
    // Anxiety (GAD-7 inspired)
    {
      id: 5,
      text: "Over the past two weeks, how often have you felt nervous, anxious, or on edge?",
      category: 'anxiety',
      weight: 1.2,
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 }
      ]
    },
    {
      id: 6,
      text: "How often have you not been able to stop or control worrying?",
      category: 'anxiety',
      weight: 1.1,
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 }
      ]
    },
    {
      id: 7,
      text: "How often have you been afraid that something awful might happen?",
      category: 'anxiety',
      weight: 1.0,
      options: [
        { text: "Not at all", score: 0 },
        { text: "Several days", score: 1 },
        { text: "More than half the days", score: 2 },
        { text: "Nearly every day", score: 3 }
      ]
    },

    // Stress
    {
      id: 8,
      text: "How would you rate your current stress level?",
      category: 'stress',
      weight: 1.1,
      options: [
        { text: "Very low - I feel relaxed most of the time", score: 0 },
        { text: "Moderate - Manageable daily stress", score: 1 },
        { text: "High - Often feeling overwhelmed", score: 2 },
        { text: "Extremely high - Constant overwhelming stress", score: 3 }
      ]
    },
    {
      id: 9,
      text: "How often do you feel like you can't cope with daily demands?",
      category: 'stress',
      weight: 1.0,
      options: [
        { text: "Never", score: 0 },
        { text: "Rarely", score: 1 },
        { text: "Often", score: 2 },
        { text: "Always", score: 3 }
      ]
    },

    // Sleep
    {
      id: 10,
      text: "How has your sleep quality been over the past two weeks?",
      category: 'sleep',
      weight: 1.0,
      options: [
        { text: "Excellent - 7-9 hours of restful sleep", score: 0 },
        { text: "Good - Mostly sleeping well", score: 1 },
        { text: "Poor - Frequent sleep issues", score: 2 },
        { text: "Very poor - Severe sleep problems", score: 3 }
      ]
    },
    {
      id: 11,
      text: "How often do you have trouble falling asleep or staying asleep?",
      category: 'sleep',
      weight: 0.9,
      options: [
        { text: "Never", score: 0 },
        { text: "1-2 nights per week", score: 1 },
        { text: "3-5 nights per week", score: 2 },
        { text: "Almost every night", score: 3 }
      ]
    },

    // Social Connection
    {
      id: 12,
      text: "How connected do you feel to friends, family, or your community?",
      category: 'social',
      weight: 1.0,
      options: [
        { text: "Very connected - Strong support network", score: 0 },
        { text: "Somewhat connected - Some supportive relationships", score: 1 },
        { text: "Not very connected - Limited social support", score: 2 },
        { text: "Very isolated - No meaningful connections", score: 3 }
      ]
    },
    {
      id: 13,
      text: "How often do you engage in meaningful social activities?",
      category: 'social',
      weight: 0.8,
      options: [
        { text: "Several times a week", score: 0 },
        { text: "Once a week", score: 1 },
        { text: "A few times a month", score: 2 },
        { text: "Rarely or never", score: 3 }
      ]
    },

    // Lifestyle & Self-Care
    {
      id: 14,
      text: "How often do you engage in activities you enjoy or find meaningful?",
      category: 'lifestyle',
      weight: 0.9,
      options: [
        { text: "Daily", score: 0 },
        { text: "Several times a week", score: 1 },
        { text: "Rarely", score: 2 },
        { text: "Never", score: 3 }
      ]
    },
    {
      id: 15,
      text: "How would you rate your overall physical health and energy?",
      category: 'physical',
      weight: 0.8,
      options: [
        { text: "Excellent - High energy and vitality", score: 0 },
        { text: "Good - Generally energetic", score: 1 },
        { text: "Fair - Low to moderate energy", score: 2 },
        { text: "Poor - Very low energy or health issues", score: 3 }
      ]
    },

    // Cognitive Function
    {
      id: 16,
      text: "How often do you have trouble concentrating or making decisions?",
      category: 'cognitive',
      weight: 1.0,
      options: [
        { text: "Never", score: 0 },
        { text: "Sometimes", score: 1 },
        { text: "Often", score: 2 },
        { text: "Almost always", score: 3 }
      ]
    }
  ];

  const calculateCategoryScores = (answers: number[]): CategoryScore[] => {
    const categories = ['depression', 'anxiety', 'stress', 'sleep', 'social', 'lifestyle', 'cognitive', 'physical'];
    const categoryData: { [key: string]: { score: number; maxScore: number; label: string; color: string } } = {
      depression: { score: 0, maxScore: 0, label: 'Depression', color: 'text-blue-600' },
      anxiety: { score: 0, maxScore: 0, label: 'Anxiety', color: 'text-orange-600' },
      stress: { score: 0, maxScore: 0, label: 'Stress', color: 'text-red-600' },
      sleep: { score: 0, maxScore: 0, label: 'Sleep Quality', color: 'text-purple-600' },
      social: { score: 0, maxScore: 0, label: 'Social Connection', color: 'text-green-600' },
      lifestyle: { score: 0, maxScore: 0, label: 'Lifestyle', color: 'text-teal-600' },
      cognitive: { score: 0, maxScore: 0, label: 'Cognitive Function', color: 'text-indigo-600' },
      physical: { score: 0, maxScore: 0, label: 'Physical Health', color: 'text-pink-600' }
    };

    questions.forEach((question, index) => {
      if (answers[index] !== undefined) {
        const weightedScore = answers[index] * question.weight;
        const maxWeightedScore = Math.max(...question.options.map(opt => opt.score)) * question.weight;
        
        categoryData[question.category].score += weightedScore;
        categoryData[question.category].maxScore += maxWeightedScore;
      }
    });

    return categories
      .filter(cat => categoryData[cat].maxScore > 0)
      .map(category => ({
        category,
        score: categoryData[category].score,
        maxScore: categoryData[category].maxScore,
        percentage: (categoryData[category].score / categoryData[category].maxScore) * 100,
        label: categoryData[category].label,
        color: categoryData[category].color
      }));
  };

  const calculateResult = (answers: number[]): QuizResult => {
    const categoryScores = calculateCategoryScores(answers);
    
    // Calculate weighted total score
    let totalScore = 0;
    let maxTotalScore = 0;
    
    questions.forEach((question, index) => {
      if (answers[index] !== undefined) {
        totalScore += answers[index] * question.weight;
        maxTotalScore += Math.max(...question.options.map(opt => opt.score)) * question.weight;
      }
    });

    const percentage = (totalScore / maxTotalScore) * 100;
    
    // Check for high-risk indicators
    const suicidalThoughtsScore = answers[3] || 0; // Question 4 (suicidal thoughts)
    const emergencyContact = suicidalThoughtsScore >= 2;

    let riskLevel: 'low' | 'mild' | 'moderate' | 'high' | 'severe';
    let overallCategory: string;
    let description: string;
    let recommendations: string[];
    let color: string;
    let icon: React.ReactNode;
    let followUpDays: number;

    if (emergencyContact || percentage >= 80) {
      riskLevel = 'severe';
      overallCategory = "Severe Mental Health Concerns - Immediate Support Needed";
      description = "Your responses indicate significant mental health challenges that require immediate professional attention. Please reach out for help - you deserve support and care.";
      recommendations = [
        "Contact a mental health crisis line immediately (988 in US)",
        "Go to your nearest emergency room if having thoughts of self-harm",
        "Contact your doctor or a mental health professional today",
        "Reach out to trusted family or friends for immediate support",
        "Consider intensive outpatient or inpatient treatment options"
      ];
      color = "text-red-700";
      icon = <AlertCircle className="text-red-700" size={28} />;
      followUpDays = 1;
    } else if (percentage >= 65) {
      riskLevel = 'high';
      overallCategory = "High Mental Health Concerns";
      description = "You're experiencing significant mental health challenges that would benefit greatly from professional support and comprehensive care strategies.";
      recommendations = [
        "Schedule an appointment with a mental health professional within the week",
        "Consider therapy (CBT, DBT, or other evidence-based approaches)",
        "Discuss medication options with a psychiatrist if appropriate",
        "Create a daily structure and routine for stability",
        "Build a strong support network and use it regularly"
      ];
      color = "text-red-600";
      icon = <AlertCircle className="text-red-600" size={26} />;
      followUpDays = 3;
    } else if (percentage >= 45) {
      riskLevel = 'moderate';
      overallCategory = "Moderate Mental Health Concerns";
      description = "You're facing some significant mental health challenges. Professional support combined with self-care strategies can help you feel better.";
      recommendations = [
        "Consider scheduling a consultation with a therapist or counselor",
        "Practice daily stress-reduction techniques (meditation, deep breathing)",
        "Maintain regular sleep schedule and healthy lifestyle habits",
        "Stay connected with supportive friends and family",
        "Monitor your symptoms and seek help if they worsen"
      ];
      color = "text-orange-600";
      icon = <Brain className="text-orange-600" size={24} />;
      followUpDays = 7;
    } else if (percentage >= 25) {
      riskLevel = 'mild';
      overallCategory = "Mild Mental Health Concerns";
      description = "You're experiencing some mental health challenges that are manageable with the right strategies and occasional support.";
      recommendations = [
        "Practice regular self-care and stress management techniques",
        "Maintain healthy lifestyle habits (exercise, nutrition, sleep)",
        "Stay socially connected and engage in meaningful activities",
        "Consider preventive counseling or support groups",
        "Monitor your mental health and seek help if symptoms increase"
      ];
      color = "text-yellow-600";
      icon = <Heart className="text-yellow-600" size={24} />;
      followUpDays = 14;
    } else {
      riskLevel = 'low';
      overallCategory = "Excellent Mental Wellness";
      description = "You're doing very well mentally and emotionally! Your responses suggest strong mental health with effective coping strategies and good life balance.";
      recommendations = [
        "Continue your current positive mental health practices",
        "Maintain regular exercise, healthy nutrition, and good sleep habits",
        "Keep nurturing your social relationships and support network",
        "Consider sharing your wellness strategies to help others",
        "Stay vigilant for any changes in your mental health"
      ];
      color = "text-green-600";
      icon = <Star className="text-green-600" size={24} />;
      followUpDays = 30;
    }

    return {
      totalScore,
      maxTotalScore,
      percentage,
      overallCategory,
      description,
      recommendations,
      categoryScores,
      riskLevel,
      color,
      icon,
      emergencyContact,
      followUpDays
    };
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      
      // Save to history
      const result = calculateResult(newAnswers);
      const newHistoryEntry: QuizHistory = {
        date: new Date().toISOString().split('T')[0],
        score: result.totalScore,
        percentage: result.percentage,
        category: result.overallCategory
      };
      
      const updatedHistory = [...history, newHistoryEntry];
      setHistory(updatedHistory);
      localStorage.setItem('mentalHealthHistory', JSON.stringify(updatedHistory));
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setStartTime(new Date());
    setShowHistory(false);
  };

  const startQuiz = () => {
    setShowIntro(false);
    setStartTime(new Date());
  };

  const exportResults = (result: QuizResult) => {
    const completionTime = Math.round((new Date().getTime() - startTime.getTime()) / 60000);
    
    const report = {
      name: userName || 'Anonymous',
      date: new Date().toLocaleDateString(),
      completionTime: `${completionTime} minutes`,
      overallScore: {
        score: result.totalScore.toFixed(1),
        maxScore: result.maxTotalScore.toFixed(1),
        percentage: result.percentage.toFixed(1) + '%'
      },
      riskLevel: result.riskLevel.toUpperCase(),
      category: result.overallCategory,
      categoryBreakdown: result.categoryScores.map(cat => ({
        category: cat.label,
        percentage: cat.percentage.toFixed(1) + '%',
        score: `${cat.score.toFixed(1)}/${cat.maxScore.toFixed(1)}`
      })),
      recommendations: result.recommendations,
      followUpRecommended: `${result.followUpDays} days`,
      emergencyContact: result.emergencyContact ? 'YES - Immediate support recommended' : 'NO',
      disclaimer: "This assessment is for educational purposes only and does not replace professional medical advice. If experiencing a mental health crisis, contact emergency services or a crisis hotline immediately."
    };
    
    // Create formatted text report
    const textReport = `
MENTAL HEALTH ASSESSMENT REPORT
================================

PARTICIPANT: ${report.name}
DATE: ${report.date}
COMPLETION TIME: ${report.completionTime}

OVERALL RESULTS:
- Score: ${report.overallScore.score}/${report.overallScore.maxScore} (${report.overallScore.percentage})
- Risk Level: ${report.riskLevel}
- Category: ${report.category}
- Emergency Contact Needed: ${report.emergencyContact}
- Recommended Follow-up: ${report.followUpRecommended}

CATEGORY BREAKDOWN:
${report.categoryBreakdown.map(cat => `- ${cat.category}: ${cat.percentage} (${cat.score})`).join('\n')}

RECOMMENDATIONS:
${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

DISCLAIMER:
${report.disclaimer}

Generated on: ${new Date().toLocaleString()}
    `.trim();
    
    // Create and download the file
    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mental_health_assessment_${new Date().toISOString().split('T')[0]}.txt`;
    
    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const result = showResult ? calculateResult(answers) : null;

  if (showIntro) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <div className="mb-6">
            <Brain className="mx-auto text-blue-600 mb-4" size={48} />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Mental Health Assessment</h2>
            <p className="text-lg text-gray-600">A comprehensive evaluation of your mental wellness</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Clock className="mx-auto text-blue-500 mb-3" size={24} />
              <h4 className="font-semibold text-gray-800 mb-2">5-7 Minutes</h4>
              <p className="text-sm text-gray-600">Comprehensive 16-question assessment</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Shield className="mx-auto text-green-500 mb-3" size={24} />
              <h4 className="font-semibold text-gray-800 mb-2">100% Private</h4>
              <p className="text-sm text-gray-600">Anonymous & secure evaluation</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <BarChart3 className="mx-auto text-purple-500 mb-3" size={24} />
              <h4 className="font-semibold text-gray-800 mb-2">Detailed Results</h4>
              <p className="text-sm text-gray-600">Category breakdown & recommendations</p>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <span>Begin Assessment</span>
            <ChevronRight size={20} />
          </button>

          {history.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2 mx-auto"
              >
                <TrendingUp size={16} />
                <span>View Progress History ({history.length} assessments)</span>
              </button>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500 bg-white rounded-xl p-4">
            <p><strong>Important:</strong> This assessment is based on validated mental health screening tools but is for educational purposes only. It does not replace professional medical diagnosis or treatment.</p>
          </div>
        </div>

        {showHistory && history.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Assessment History</h3>
            <div className="space-y-3">
              {history.slice(-5).reverse().map((entry, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-800">{entry.date}</span>
                    <span className="ml-3 text-sm text-gray-600">{entry.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-800">{entry.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">{result.icon}</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{result.overallCategory}</h3>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 mb-4">
              <p className="text-2xl font-bold text-gray-800">Overall Score: {result.percentage.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">({result.totalScore.toFixed(1)} out of {result.maxTotalScore.toFixed(1)} points)</p>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{result.description}</p>
          </div>

          {/* Emergency Alert */}
          {result.emergencyContact && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="text-red-600" size={24} />
                <h4 className="text-xl font-semibold text-red-800">Immediate Support Needed</h4>
              </div>
              <p className="text-red-700 mb-4">Your responses indicate you may be having thoughts of self-harm. Please reach out for immediate support:</p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:988" className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors">
                  📞 Call 988 (Crisis Lifeline)
                </a>
                <a href="sms:741741" className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors">
                  💬 Text HOME to 741741
                </a>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          <div className="mb-8">
            <h4 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Category Breakdown</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.categoryScores.map((category, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                  <h5 className={`font-semibold ${category.color} mb-2`}>{category.label}</h5>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-800">{category.percentage.toFixed(0)}%</span>
                    <span className="text-sm text-gray-600">{category.score.toFixed(1)}/{category.maxScore.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color.replace('text-', 'bg-')}`}
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations and Actions */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={24} />
                <span>Recommended Actions</span>
              </h4>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Zap className="text-blue-500" size={24} />
                <span>Available Resources</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Users className="text-blue-500" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">AI Therapy Chat</p>
                    <p className="text-sm text-gray-600">24/7 supportive conversation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Heart className="text-pink-500" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Mood-based Music</p>
                    <p className="text-sm text-gray-600">Therapeutic playlists</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Brain className="text-purple-500" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Guided Meditation</p>
                    <p className="text-sm text-gray-600">Mindfulness exercises</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <Calendar className="text-green-500" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">Professional Directory</p>
                    <p className="text-sm text-gray-600">Find local therapists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up and Export */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Follow-up & Tracking</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <Calendar className="mx-auto text-blue-500 mb-2" size={32} />
                <p className="font-medium text-gray-800">Next Check-in</p>
                <p className="text-sm text-gray-600">Recommended in {result.followUpDays} days</p>
              </div>
              <div className="text-center">
                <TrendingUp className="mx-auto text-green-500 mb-2" size={32} />
                <p className="font-medium text-gray-800">Progress Tracking</p>
                <p className="text-sm text-gray-600">Monitor your mental health journey</p>
              </div>
              <div className="text-center">
                <Download className="mx-auto text-purple-500 mb-2" size={32} />
                <p className="font-medium text-gray-800">Export Results</p>
                <p className="text-sm text-gray-600">Share with healthcare provider</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={restartQuiz}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Take Assessment Again
            </button>
            <button
              onClick={() => exportResults(result)}
              className="border-2 border-purple-400 text-purple-700 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export Results</span>
            </button>
            <button
              onClick={(event) => {
                if (user) {
                  // User is logged in, scroll to AI therapist
                  console.log('User is logged in, scrolling to AI therapist...');
                  
                  // Add visual feedback
                  const button = event.target as HTMLButtonElement;
                  if (button) {
                    button.textContent = 'Scrolling...';
                    button.disabled = true;
                  }
                  
                  const scrollToAITherapist = () => {
                    // Try multiple ways to find the element
                    let element = document.getElementById('ai-therapist');
                    
                    // If not found by ID, try to find by other means
                    if (!element) {
                      // Try to find by class or content
                      const allDivs = document.querySelectorAll('div');
                      for (const div of allDivs) {
                        if (div.textContent?.includes('AI Companion') || div.textContent?.includes('Serenity AI')) {
                          element = div;
                          console.log('Found AI therapist element by content:', div);
                          break;
                        }
                      }
                    }
                    
                    if (element) {
                      // Check if element is actually visible and in the DOM
                      const rect = element.getBoundingClientRect();
                      const isVisible = rect.width > 0 && rect.height > 0;
                      
                      // Debug element position and scrollability
                      console.log('Element details:', {
                        id: element.id,
                        tagName: element.tagName,
                        className: element.className,
                        rect: rect,
                        isVisible: isVisible,
                        offsetTop: element.offsetTop,
                        scrollTop: element.scrollTop,
                        parentScrollTop: element.parentElement?.scrollTop
                      });
                      
                      if (!isVisible) {
                        console.log('Element exists but not visible, waiting...');
                        return false;
                      }
                      
                      console.log('Element found and visible, scrolling...');
                      
                      // Try multiple scroll methods for better compatibility
                      try {
                        // Method 1: scrollIntoView with smooth behavior
                        element.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start',
                          inline: 'nearest'
                        });
                        return true;
                      } catch (error) {
                        console.log('Method 1 failed, trying alternative:', error);
                        try {
                          // Method 2: scrollTo with smooth behavior
                          const scrollTop = window.pageYOffset + rect.top - 100;
                          window.scrollTo({
                            top: scrollTop,
                            behavior: 'smooth'
                          });
                          return true;
                        } catch (error2) {
                          console.log('Method 2 failed, using instant scroll:', error2);
                          // Method 3: Instant scroll as fallback
                          element.scrollIntoView();
                          return true;
                        }
                      }
                    } else {
                      console.log('AI therapist element not found by any method');
                      return false;
                    }
                  };
                  
                  // Try scrolling with multiple attempts
                  let scrollSuccess = false;
                  let attempts = 0;
                  const maxAttempts = 5;
                  
                  // First, check if the page is ready
                  let pageReadyAttempts = 0;
                  const maxPageReadyAttempts = 20; // 10 seconds max
                  
                  const checkPageReady = () => {
                    pageReadyAttempts++;
                    const element = document.getElementById('ai-therapist');
                    if (element) {
                      console.log('Page is ready, starting scroll attempts');
                      attemptScroll();
                    } else if (pageReadyAttempts < maxPageReadyAttempts) {
                      console.log(`Page not ready yet, waiting... (${pageReadyAttempts}/${maxPageReadyAttempts})`);
                      setTimeout(checkPageReady, 500);
                    } else {
                      console.log('Page never became ready, giving up');
                      if (button) {
                        button.textContent = 'Scroll Failed - Click to Try Again';
                        button.disabled = false;
                      }
                    }
                  };
                  
                  const attemptScroll = () => {
                    if (attempts >= maxAttempts) {
                      console.log('Max scroll attempts reached, trying direct navigation');
                      // Fallback: try to navigate to the AI therapist section directly
                      try {
                        const element = document.getElementById('ai-therapist');
                        if (element) {
                          // Force scroll to top of the element
                          const offsetTop = element.offsetTop;
                          window.scrollTo(0, offsetTop - 100);
                          console.log('Direct navigation successful');
                          if (button) {
                            button.textContent = 'Success! Scrolling...';
                            setTimeout(() => {
                              button.textContent = 'Scroll Failed - Click to Try Again';
                              button.disabled = false;
                              // Add retry functionality
                              button.onClick = (event) => {
                                event.preventDefault();
                                button.textContent = 'Scrolling...';
                                button.disabled = true;
                                // Reset attempts and try again
                                attempts = 0;
                                pageReadyAttempts = 0;
                                checkPageReady();
                              };
                            }, 1000);
                          }
                          return;
                        }
                      } catch (error) {
                        console.log('Direct navigation also failed:', error);
                      }
                      
                      if (button) {
                        button.textContent = 'Scroll Failed - Click to Try Again';
                        button.disabled = false;
                        // Add retry functionality
                        button.onClick = (event) => {
                          event.preventDefault();
                          button.textContent = 'Scrolling...';
                          button.disabled = true;
                          // Reset attempts and try again
                          attempts = 0;
                          pageReadyAttempts = 0;
                          checkPageReady();
                        };
                      }
                      return;
                    }
                    
                    attempts++;
                    console.log(`Scroll attempt ${attempts}/${maxAttempts}`);
                    
                    if (scrollToAITherapist()) {
                      scrollSuccess = true;
                      console.log('Scroll successful!');
                      if (button) {
                        button.textContent = 'Success! Scrolling...';
                        setTimeout(() => {
                          button.textContent = 'Scroll Failed - Click to Try Again';
                          button.disabled = false;
                          // Add retry functionality
                          button.onClick = (event) => {
                            event.preventDefault();
                            button.textContent = 'Scrolling...';
                            button.disabled = true;
                            // Reset attempts and try again
                            attempts = 0;
                            pageReadyAttempts = 0;
                            checkPageReady();
                          };
                        }, 1000);
                      }
                    } else {
                      // Try again after a delay
                      setTimeout(attemptScroll, 300);
                    }
                  };
                  
                  // Start the process
                  checkPageReady();
                  
                  // Also add a fallback message after a longer delay
                  setTimeout(() => {
                    if (button && button.textContent === 'Scrolling...') {
                      button.textContent = 'Scroll Failed - Click to Try Again';
                      button.disabled = false;
                      // Add retry functionality
                      button.onClick = (event) => {
                        event.preventDefault();
                        button.textContent = 'Scrolling...';
                        button.disabled = true;
                        // Reset attempts and try again
                        attempts = 0;
                        pageReadyAttempts = 0;
                        checkPageReady();
                      };
                    }
                  }, 15000); // 15 seconds fallback
                } else {
                  // User is not logged in, redirect to login
                  console.log('User not logged in, redirecting to login...');
                  window.location.href = '/auth';
                }
              }}
              className="border-2 border-blue-400 text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {user ? 'Chat with AI Therapist' : 'Login to Chat with AI Therapist'}
            </button>
          </div>

          {/* Assessment Details */}
          <div className="mt-8 text-center text-sm text-gray-500 bg-gray-50 rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="font-medium text-gray-700">Assessment Time</p>
                <p>{Math.round((new Date().getTime() - startTime.getTime()) / 60000)} minutes</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Questions Answered</p>
                <p>{questions.length} of {questions.length}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Risk Level</p>
                <p className={`capitalize ${result.color}`}>{result.riskLevel}</p>
              </div>
            </div>
            <p><strong>Disclaimer:</strong> This assessment uses evidence-based screening tools but is for educational purposes only. It does not replace professional mental health diagnosis, treatment, or medical advice. If you're experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Mental Health Assessment</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</p>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Start</span>
              <span>Complete</span>
            </div>
          </div>

          {/* Category Indicator */}
          <div className="mt-4 text-center">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {questions[currentQuestion].category.charAt(0).toUpperCase() + questions[currentQuestion].category.slice(1)}
            </span>
          </div>
        </div>

        {/* Question Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {questions[currentQuestion].text}
            </h3>
            {questions[currentQuestion].weight > 1.0 && (
              <div className="mt-3 flex items-center space-x-2">
                <AlertCircle className="text-orange-500" size={16} />
                <span className="text-sm text-orange-700">This question is weighted as particularly important for assessment accuracy</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 group ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50 animate-scale-in"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-lg">{option.text}</span>
                    {selectedAnswer === index && (
                      <div className="mt-1">
                        <span className="text-sm text-blue-600">Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setSelectedAnswer(null);
                // Remove the last answer
                setAnswers(answers.slice(0, -1));
              }
            }}
            disabled={currentQuestion === 0}
            className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>~{Math.ceil((questions.length - currentQuestion) * 0.5)} min remaining</span>
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>{currentQuestion + 1 === questions.length ? 'Complete Assessment' : 'Next Question'}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Privacy & Security Notice */}
      <div className="mt-6 text-center text-sm text-gray-500 bg-green-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Shield className="text-green-600" size={16} />
          <span className="font-medium text-green-800">Your Privacy is Protected</span>
        </div>
        <p>All responses are anonymous and processed locally. No personal data is transmitted or stored on external servers. This assessment follows HIPAA-compliant privacy standards.</p>
      </div>

      {/* Question Help */}
      <div className="mt-4 text-center">
        <button
          onClick={() => alert('This assessment is based on validated mental health screening tools including PHQ-9 (depression), GAD-7 (anxiety), and other evidence-based questionnaires. Each question helps evaluate different aspects of your mental wellness.')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ℹ️ Why are these questions being asked?
        </button>
      </div>
    </div>
  );
};

export default MentalHealthQuiz;