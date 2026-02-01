export type RiskLevel = 'stable' | 'elevated' | 'high';

export type DriftStatus = 'stable' | 'drifting-later' | 'drifting-earlier' | 'high-variance';

export interface HealthSignal {
  id: string;
  type: 'sleep' | 'activity' | 'recovery';
  value: string;
  label: string;
  quality?: number;
}

export interface RiskDriftData {
  status: RiskLevel;
  message: string;
  description: string;
  daysAnalyzed: number;
}

export interface ChangePoint {
  detected: boolean;
  description: string;
}

export interface TrendData {
  metric: string;
  label: string;
  status: DriftStatus;
  statusLabel: string;
  data: number[];
  changePoint?: ChangePoint;
  description?: string;
}

export interface PatternInsight {
  id: string;
  title: string;
  description: string;
  signals: string[];
  riskChange: number;
  timeframe: string;
  correlation: string;
  explanation: string;
  communityComparison?: string;
}

export interface ContributingFactor {
  text: string;
  detail: string;
}

export interface CommunityTrend {
  id: string;
  title: string;
  description: string;
  change: string;
  status: 'rising' | 'emerging' | 'improving' | 'stable';
  chart?: string;
}
