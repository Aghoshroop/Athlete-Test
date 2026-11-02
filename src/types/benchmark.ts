import { SexGroup } from './athlete';
import { EventGroup } from './athletics';

export type BenchmarkStatus = 'valid' | 'limited' | 'none';

export type RatingLabel = 'Poor' | 'Below Average' | 'Average' | 'Good' | 'Excellent';

export interface PercentilePoint {
  percentile: number; // e.g. 10, 20, 30, 40, 50, 60, 70, 80, 90, 95
  value: number;
}

export interface NormAgeBracket {
  minAge: number;
  maxAge: number; // e.g. 15 to 16
  sex: SexGroup;
  percentiles: PercentilePoint[]; // Sorted by percentile ascending
  mean?: number;
  sd?: number;
  // LMS parameters if continuous distribution
  lms?: {
    L: number; // Box-Cox power
    M: number; // Median
    S: number; // Coefficient of variation
  };
}

export interface NormSource {
  id: string;
  sourceName: string; // e.g. "Eurofit Testing Handbook" or "Tomkinson et al. (2017) BJSM"
  publicationTitle: string;
  authors: string[];
  doiOrUrl: string;
  publicationYear: number;
  datasetVersion: string;
  studyPopulation: string; // e.g. "European youth and collegiate track athletes"
  sampleSize: number;
  ageRange: [number, number];
  sexGroups: SexGroup[];
  applicableEventGroups?: EventGroup[];
  countryOrRegion: string;
  testProtocolSummary: string;
  measurementUnits: string;
  statisticalMethod: 'percentile_ranks' | 'lms_growth_curves' | 'polynomial_regression' | 'standard_deviation_brackets';
  limitations: string;
  licenseOrUsageInfo: string;
}

export interface NormDataset {
  id: string;
  testCode: string; // e.g. "CMJ", "SPRINT_30M", "SHUTTLE_20M", "HANDGRIP"
  sourceId: string;
  source: NormSource;
  measurementDirection: 'higher_is_better' | 'lower_is_better';
  ageBrackets: NormAgeBracket[];
  sportSpecificModifiers?: Record<string, number>; // Optional track & field event modifiers
  minValidMeasurement: number;
  maxValidMeasurement: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScoringConfiguration {
  id: string;
  organizationId: string;
  name: string;
  categoryWeights: Record<string, number>; // Weights sum to 100
  minimumDataCoveragePercent: number; // Minimum % of tests in battery required to produce overall score
  ratingThresholds: {
    poorMaxPercentile: number;         // default < 20
    belowAverageMaxPercentile: number; // default 20 - 39
    averageMaxPercentile: number;      // default 40 - 69
    goodMaxPercentile: number;         // default 70 - 89
    excellentMinPercentile: number;    // default >= 90
  };
  isDefault: boolean;
}
