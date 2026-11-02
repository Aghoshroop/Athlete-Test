import { BenchmarkStatus, RatingLabel } from './benchmark';
import { FitnessCategory } from './fitness';

export type AssessmentStatus = 'draft' | 'validated' | 'finalized';

export interface TestResultEntry {
  testId: string;
  testCode: string;
  testName: string;
  category: FitnessCategory;
  unit: string;
  measurementDirection: 'higher_is_better' | 'lower_is_better';
  
  // Attempts
  attempts: number[];
  
  // Bilateral attempts if applicable
  isBilateral: boolean;
  leftAttempts?: number[];
  rightAttempts?: number[];
  leftResult?: number;
  rightResult?: number;
  asymmetryPercent?: number; // e.g. -6.2% deficit on left side
  dominantSideAdvantage?: 'left' | 'right' | 'symmetric';
  
  // Aggregate Final Raw Value
  finalRawValue?: number; // Calculated according to protocol (best / average / etc.)
  
  // Norm & Scoring Results
  benchmarkStatus: BenchmarkStatus;
  benchmarkSourceId?: string;
  benchmarkSourceTitle?: string;
  percentile?: number; // 0 to 100, undefined if benchmarkStatus === 'none'
  rating?: RatingLabel;
  
  // Historical Comparison with previous assessment
  previousRawValue?: number;
  rawDelta?: number;
  previousPercentile?: number;
  percentileDelta?: number;
  
  // Flags & Notes
  isExcludedFromOverall: boolean; // e.g. if unbenchmarked
  isMissing: boolean;
  coachNotes?: string;
  limitationNote?: string;
}

export interface CategoryScoreResult {
  category: FitnessCategory;
  categoryScorePercentile: number; // 0 - 100 average of valid tests
  rating: RatingLabel;
  validTestsCount: number;
  totalTestsCount: number;
  weightPercent: number;
  previousScorePercentile?: number;
  scoreDelta?: number;
  strongestTestCode?: string;
  weakestTestCode?: string;
}

export interface Assessment {
  id: string;
  organizationId: string;
  athleteId: string;
  athleteCode: string;
  athleteName: string;
  athleteAge: number; // Exact age on testing date
  sex: 'male' | 'female';
  eventGroup: string;
  primaryEvent: string;
  batteryId: string;
  batteryName: string;
  coachId: string;
  coachName: string;
  assessmentDate: string; // YYYY-MM-DD
  status: AssessmentStatus;
  
  // Test Results Map & List
  testResults: TestResultEntry[];
  
  // Category-level aggregated scores
  categoryScores: Record<FitnessCategory, CategoryScoreResult>;
  
  // Overall Fitness Score
  overallFitnessScore?: number; // 0 - 100
  overallRating?: RatingLabel;
  coveragePercentage: number;
  meetsMinimumCoverage: boolean;
  
  // Insights generated
  topStrengths: string[];
  areasToImprove: string[];
  bilateralAsymmetries: {
    testName: string;
    asymmetryPercent: number;
    description: string;
  }[];
  
  // Metadata
  revision: number;
  scoringConfigVersion: string;
  coachGeneralComments?: string;
  finalizedAt?: string;
  finalizedByCoachId?: string;
  createdAt: string;
  updatedAt: string;
}
