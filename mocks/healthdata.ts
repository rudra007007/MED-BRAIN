import { HealthSignal, RiskDriftData, TrendData, PatternInsight, CommunityTrend, ContributingFactor } from '../types/health';

export const currentHealthSignals: HealthSignal[] = [
  { id: '1', type: 'sleep', label: 'Sleep', value: '82% Quality', quality: 82 },
  { id: '2', type: 'activity', label: 'Activity', value: '6.4k steps' },
  { id: '3', type: 'recovery', label: 'Recovery', value: '55ms HRV' },
];

export const riskDriftData: RiskDriftData = {
  status: 'stable',
  message: 'Your signals are looking stable today.',
  description: 'Your lifestyle patterns show minimal deviation from your healthy baseline over the last 7 days.',
  daysAnalyzed: 7,
};

export const trendDataList: TrendData[] = [
  {
    metric: 'sleepConsistency',
    label: 'Sleep Consistency',
    status: 'drifting-later',
    statusLabel: 'DRIFTING LATER',
    data: [0.5, 0.52, 0.7, 0.85, 0.75, 0.6, 0.45],
    changePoint: {
      detected: true,
      description: 'Your sleep pattern shifted vs baseline: Sleep onset has drifted 45 minutes later over the last 4 days.',
    },
  },
  {
    metric: 'physicalLoad',
    label: 'Physical Load',
    status: 'stable',
    statusLabel: 'STABLE',
    data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    description: 'Movement volume remains within 5% of your 90-day baseline.',
  },
  {
    metric: 'circadianConsistency',
    label: 'Circadian Consistency',
    status: 'high-variance',
    statusLabel: 'HIGH VARIANCE',
    data: [0.4, 0.25, 0.6, 0.35, 0.7, 0.4, 0.8],
    changePoint: {
      detected: true,
      description: 'Variance in meal times and light exposure has increased by 18% compared to last month.',
    },
  },
];

export const patternInsights: PatternInsight[] = [
  {
    id: '1',
    title: 'Circadian Disruption',
    description: 'Our intelligence engine has identified a recurring pattern in your sleep-wake cycle over the last 14 days.',
    signals: ['Fatigue', 'Morning Stiffness', 'Late-night Screen', 'Focus Drift', 'Energy Dips', 'REM Interruption'],
    riskChange: 12,
    timeframe: '7-Day Trend',
    correlation: 'late-night screen time and next-day energy dips',
    explanation: "This isn't a diagnosis, but a pattern often seen when blue light exposure suppresses melatonin production, causing your body's internal clock to shift.",
    communityComparison: '32% of users in your area are reporting similar seasonal shift patterns this week.',
  },
];

export const communityTrends: CommunityTrend[] = [
  {
    id: '1',
    title: 'Seasonal Allergy Signals',
    description: 'Rising +12% in your current region over last 48h.',
    change: '+12%',
    status: 'rising',
    chart: 'allergy',
  },
  {
    id: '2',
    title: 'Sleep Quality Drift',
    description: 'Community sleep duration down 15 min avg.',
    change: '-15min',
    status: 'emerging',
    chart: 'sleep',
  },
  {
    id: '3',
    title: 'Respiratory Signal Load',
    description: 'Decreased signal density across South London.',
    change: '↓ 8%',
    status: 'improving',
  },
];

export const contributingFactors: ContributingFactor[] = [
  {
    text: '20% decrease in deep sleep',
    detail: 'Trend deviating from 14-day baseline',
  },
  {
    text: 'Increased Heart Rate Variability',
    detail: 'Slight drift in autonomic stress response',
  },
  {
    text: 'Sedentary time +4.2 hours',
    detail: 'Relative to average weekday activity',
  },
];

export const recentIntelligence = {
  message: 'Your recovery is slightly lower today, likely due to a shorter deep sleep phase last night.',
  suggestion: 'Consider shifting your evening meal 30 minutes earlier to improve metabolic rest during sleep.',
};

export function generateMockTimeSeriesData(days: number, baseline: number = 0.5, variance: number = 0.1): number[] {
  const data: number[] = [];
  for (let i = 0; i < days; i++) {
    const noise = (Math.random() - 0.5) * variance;
    data.push(Math.max(0, Math.min(1, baseline + noise)));
  }
  return data;
}
