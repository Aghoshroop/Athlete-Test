import { FitnessCategory } from './fitness';

export interface LongitudinalPoint {
  date: string;
  assessmentId: string;
  overallScore?: number;
  categoryScores: Partial<Record<FitnessCategory, number>>;
  testValues: Record<string, number>; // testCode -> raw value
}

export interface ProgressSummary {
  athleteId: string;
  firstAssessmentDate: string;
  latestAssessmentDate: string;
  totalAssessments: number;
  overallScoreTrajectory: { date: string; score: number }[];
  categoryImprovements: {
    category: FitnessCategory;
    initialScore: number;
    currentScore: number;
    delta: number;
    trend: 'improved' | 'declined' | 'stable';
  }[];
  significantFindings: {
    type: 'positive' | 'warning' | 'alert' | 'pb';
    title: string;
    description: string;
    metric?: string;
  }[];
}

export interface AthleteComparisonGroup {
  id: string;
  name: string;
  criteria: {
    sex?: 'male' | 'female';
    ageMin?: number;
    ageMax?: number;
    eventGroup?: string;
  };
  sampleSize: number;
  isEquivalent: boolean;
  notes?: string;
}

export interface BilateralAnalysis {
  testCode: string;
  testName: string;
  leftValue: number;
  rightValue: number;
  unit: string;
  absoluteDiff: number;
  relativeDeficitPercent: number; // Positive = Right side stronger, Negative = Left side stronger
  weakerSide: 'left' | 'right' | 'symmetric';
  isWithinNormalVariance: boolean; // Typically within +- 10% is athletic normal variance
  coachingObservation: string;
}
