// Sample data for testing and development

const sampleHealthData = [
  { date: '2026-01-22', steps: 10000, sleep_hours: 8.0, heart_rate: 68, hrv: 55 },
  { date: '2026-01-23', steps: 9500, sleep_hours: 7.8, heart_rate: 70, hrv: 54 },
  { date: '2026-01-24', steps: 9800, sleep_hours: 7.9, heart_rate: 69, hrv: 56 },
  { date: '2026-01-25', steps: 10200, sleep_hours: 8.1, heart_rate: 67, hrv: 58 },
  { date: '2026-01-26', steps: 9900, sleep_hours: 7.7, heart_rate: 71, hrv: 53 },
  { date: '2026-01-27', steps: 8500, sleep_hours: 6.5, heart_rate: 75, hrv: 50 },
  { date: '2026-01-28', steps: 7000, sleep_hours: 5.5, heart_rate: 78, hrv: 48 },
  { date: '2026-01-29', steps: 6500, sleep_hours: 5.0, heart_rate: 80, hrv: 45 },
  { date: '2026-01-30', steps: 6000, sleep_hours: 4.8, heart_rate: 82, hrv: 43 },
  { date: '2026-01-31', steps: 5800, sleep_hours: 4.5, heart_rate: 84, hrv: 42 },
  { date: '2026-02-01', steps: 5500, sleep_hours: 4.2, heart_rate: 85, hrv: 40 },
];

const samplePatternInsights = [
  {
    id: 'insight-1',
    title: 'Sleep Quality Decline Detected',
    description: 'Your sleep patterns show a significant decrease over the past week. Late-night screen exposure may be contributing to this trend.',
    signals: ['Fatigue', 'Morning Stiffness', 'Late-night Screen', 'Focus Drift', 'Energy Dips', 'REM Interruption'],
    riskChange: 12,
    timeframe: 'Last 7 days',
    confidence: 0.85,
    recommendations: [
      'Reduce screen time 2 hours before bed',
      'Maintain consistent sleep schedule',
      'Consider meditation or relaxation techniques'
    ]
  },
  {
    id: 'insight-2',
    title: 'Activity Level Reduction',
    description: 'Daily step count has dropped by 40% compared to your baseline. This correlates with increased fatigue reports.',
    signals: ['Fatigue', 'Energy Dips'],
    riskChange: 8,
    timeframe: 'Last 5 days',
    confidence: 0.78,
    recommendations: [
      'Start with short 10-minute walks',
      'Schedule movement breaks every hour',
      'Track energy levels throughout the day'
    ]
  }
];

const sampleCommunityTrends = [
  {
    id: 'trend-1',
    category: 'Sleep Health',
    title: 'Late Sleep Onset',
    description: 'Users in your age group reporting bedtime shifting 45+ minutes later',
    affectedUsers: 2847,
    timeframe: 'Last 14 days',
    similarity: 0.82
  },
  {
    id: 'trend-2',
    category: 'Physical Activity',
    title: 'Reduced Morning Activity',
    description: 'Decline in morning exercise routines among similar profiles',
    affectedUsers: 1923,
    timeframe: 'Last 7 days',
    similarity: 0.75
  },
  {
    id: 'trend-3',
    category: 'Recovery',
    title: 'HRV Variance Increase',
    description: 'Higher than normal heart rate variability fluctuations detected',
    affectedUsers: 1456,
    timeframe: 'Last 10 days',
    similarity: 0.68
  }
];

const sampleSymptomHistory = [
  {
    id: 'sym-1',
    date: '2026-02-01',
    symptoms: [
      { raw: 'headache', normalized: 'cephalgia', confidence: 0.92 },
      { raw: 'feeling dizzy', normalized: 'dizziness', confidence: 0.88 }
    ],
    analysis: {
      severity: 'moderate',
      correlations: ['sleep deprivation', 'dehydration']
    }
  },
  {
    id: 'sym-2',
    date: '2026-01-30',
    symptoms: [
      { raw: 'fatigue', normalized: 'chronic fatigue', confidence: 0.85 },
      { raw: 'back pain', normalized: 'lower back pain', confidence: 0.90 }
    ],
    analysis: {
      severity: 'mild',
      correlations: ['poor posture', 'reduced activity']
    }
  }
];

// In-memory database simulation
const db = {
  users: {
    'default-user': {
      id: 'default-user',
      name: 'Alex',
      email: 'alex@example.com',
      healthData: sampleHealthData,
      symptomHistory: sampleSymptomHistory,
      createdAt: new Date('2026-01-01')
    }
  },
  insights: samplePatternInsights,
  communityTrends: sampleCommunityTrends
};

module.exports = {
  sampleHealthData,
  samplePatternInsights,
  sampleCommunityTrends,
  sampleSymptomHistory,
  db
};
