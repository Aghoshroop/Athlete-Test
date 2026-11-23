import { SexGroup } from './athlete';
import { EventGroup } from './athletics';

export type BenchmarkStatus = 'valid' | 'limited' | 'none';

export type RatingLabel = 'Poor' | 'Below Average' | 'Average' | 'Good' | 'Excellent';

export type EvaluationStandard =
  | 'indian_national'     // 🇮🇳 Indian National Standard (AFI Senior/Junior National Performance Benchmarks)
  | 'world_athletics'     // 🌍 World Athletics Standard (WA Global Senior Competitive Scoring Tables)
  | 'olympic'             // 🥇 Olympic Standard (Olympic Games Entry Standards & Finalists)
  | 'standard';           // 📊 Standard High Performance (Eurofit / Published Scientific Norms)

export interface EvaluationStandardMeta {
  id: EvaluationStandard;
  name: string;
  shortLabel: string;
  flag: string;
  description: string;
  cohort: string;
  authority: string;
  badgeVariant: 'yellow' | 'red' | 'emerald' | 'gray';
}

export const EVALUATION_STANDARDS_INFO: Record<EvaluationStandard, EvaluationStandardMeta> = {
  indian_national: {
    id: 'indian_national',
    name: 'Indian National Standard',
    shortLabel: 'Indian National (AFI)',
    flag: '🇮🇳',
    description: 'Calibrated to Athletics Federation of India (AFI) National Records, Senior Inter-State & National Open podium marks, and SAI National Camp benchmarks.',
    cohort: 'AFI National Squads & Camp Athletes',
    authority: 'Athletics Federation of India (AFI)',
    badgeVariant: 'yellow',
  },
  world_athletics: {
    id: 'world_athletics',
    name: 'World Athletics Standard',
    shortLabel: 'World Athletics (WA)',
    flag: '🌍',
    description: 'Calibrated to official World Athletics scoring tables and international senior competitive curves.',
    cohort: 'Global WA Senior Competitors',
    authority: 'World Athletics (WA)',
    badgeVariant: 'red',
  },
  olympic: {
    id: 'olympic',
    name: 'Olympic Standard',
    shortLabel: 'Olympic Standards',
    flag: '🥇',
    description: 'Calibrated against Olympic Games (Paris 2024 / Tokyo 2020) qualifying entry marks & Olympic final podium percentiles.',
    cohort: 'Olympic & World Championship Finalists',
    authority: 'International Olympic Committee (IOC)',
    badgeVariant: 'emerald',
  },
  standard: {
    id: 'standard',
    name: 'Standard Scientific Norms',
    shortLabel: 'Standard (Eurofit)',
    flag: '📊',
    description: 'Calibrated against published peer-reviewed collegiate and academy sports science testing cohorts (Eurofit / Dodds / McMahon).',
    cohort: 'Collegiate & Academy Track Athletes',
    authority: 'European Sports Science & Academic Lit.',
    badgeVariant: 'gray',
  },
};

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
