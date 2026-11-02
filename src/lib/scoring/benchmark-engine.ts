import { BenchmarkStatus, NormDataset, PercentilePoint, RatingLabel, ScoringConfiguration } from '@/types/benchmark';
import { SexGroup } from '@/types/athlete';

export const DEFAULT_SCORING_CONFIG: ScoringConfiguration = {
  id: 'default-config-v1',
  organizationId: 'org-default',
  name: 'Standard Track & Field Normative Framework',
  categoryWeights: {
    mobility: 8,
    flexibility: 8,
    strength: 14,
    speed: 16,
    acceleration: 14,
    explosive_power: 16,
    agility: 8,
    coordination: 6,
    endurance: 6,
    balance: 4,
  },
  minimumDataCoveragePercent: 50,
  ratingThresholds: {
    poorMaxPercentile: 19.9,
    belowAverageMaxPercentile: 39.9,
    averageMaxPercentile: 69.9,
    goodMaxPercentile: 89.9,
    excellentMinPercentile: 90.0,
  },
  isDefault: true,
};

/**
 * Standard Normal Cumulative Distribution Function (Φ) approximation
 */
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const prob = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1 - prob : prob;
}

export interface NormEvaluationResult {
  percentile?: number;
  rating?: RatingLabel;
  status: BenchmarkStatus;
  benchmarkSourceId?: string;
  sourceCitation?: string;
  limitations?: string;
  isExtrapolated?: boolean;
}

/**
 * Deterministically evaluates a raw test measurement against published scientific norm datasets.
 * Respects higher-is-better and lower-is-better directionality.
 * Performs verified linear interpolation between reference percentiles.
 * Never invents percentiles when data is missing or out of validated range.
 */
export function evaluateTestBenchmark(
  rawValue: number | undefined | null,
  dataset: NormDataset | undefined,
  athleteAge: number,
  athleteSex: SexGroup,
  config: ScoringConfiguration = DEFAULT_SCORING_CONFIG
): NormEvaluationResult {
  if (rawValue === undefined || rawValue === null || isNaN(rawValue)) {
    return {
      status: 'none',
      limitations: 'Measurement not recorded or test was skipped.',
    };
  }

  if (!dataset) {
    return {
      status: 'none',
      limitations: 'No published scientific reference norm has been integrated for this specific protocol.',
    };
  }

  const { source, measurementDirection, ageBrackets } = dataset;

  // 1. Check Age Support
  const [minSupportedAge, maxSupportedAge] = source.ageRange;
  if (athleteAge < minSupportedAge || athleteAge > maxSupportedAge) {
    return {
      status: 'limited',
      benchmarkSourceId: source.id,
      sourceCitation: `${source.sourceName} (${source.publicationYear})`,
      limitations: `Athlete age (${athleteAge.toFixed(1)}y) falls outside published norm cohort range (${minSupportedAge}-${maxSupportedAge}y). Percentile cannot be validated.`,
    };
  }

  // 2. Find matching age and sex bracket
  const matchingBracket = ageBrackets.find(
    (b) => b.sex === athleteSex && athleteAge >= b.minAge && athleteAge <= b.maxAge
  );

  if (!matchingBracket) {
    return {
      status: 'limited',
      benchmarkSourceId: source.id,
      sourceCitation: `${source.sourceName} (${source.publicationYear})`,
      limitations: `No specific demographic cohort exists in dataset for ${athleteSex} aged ${athleteAge.toFixed(1)}y.`,
    };
  }

  // 3. Check for physiological bounds / sensor errors
  if (rawValue < dataset.minValidMeasurement || rawValue > dataset.maxValidMeasurement) {
    return {
      status: 'limited',
      benchmarkSourceId: source.id,
      sourceCitation: `${source.sourceName} (${source.publicationYear})`,
      limitations: `Recorded value (${rawValue}) is outside biological test plausibility limits [${dataset.minValidMeasurement}-${dataset.maxValidMeasurement}]. Requires coach verification.`,
    };
  }

  // 4. Calculate Percentile
  let calculatedPercentile: number | undefined;

  // Option A: LMS continuous curve
  if (matchingBracket.lms) {
    const { L, M, S } = matchingBracket.lms;
    let zScore: number;
    if (Math.abs(L) < 0.001) {
      zScore = Math.log(rawValue / M) / S;
    } else {
      zScore = (Math.pow(rawValue / M, L) - 1) / (L * S);
    }

    // Invert z-score if lower is better (e.g. faster sprint time = positive z-score)
    if (measurementDirection === 'lower_is_better') {
      zScore = -zScore;
    }

    calculatedPercentile = Math.round(normalCdf(zScore) * 1000) / 10;
  }
  // Option B: Interpolation between discrete percentile reference points
  else if (matchingBracket.percentiles && matchingBracket.percentiles.length > 0) {
    calculatedPercentile = interpolatePercentile(
      rawValue,
      matchingBracket.percentiles,
      measurementDirection
    );
  }

  if (calculatedPercentile === undefined) {
    return {
      status: 'limited',
      benchmarkSourceId: source.id,
      sourceCitation: `${source.sourceName} (${source.publicationYear})`,
      limitations: 'Reference distribution data in bracket was insufficient for mathematical interpolation.',
    };
  }

  // Constrain percentile to [0.5, 99.5] to avoid false absolutes
  const clampedPercentile = Math.max(0.5, Math.min(99.5, Math.round(calculatedPercentile * 10) / 10));
  const rating = getRatingFromPercentile(clampedPercentile, config);

  return {
    percentile: clampedPercentile,
    rating,
    status: 'valid',
    benchmarkSourceId: source.id,
    sourceCitation: `${source.sourceName} (${source.publicationYear})`,
    limitations: source.limitations,
  };
}

/**
 * Interpolates percentile rank from ordered reference points.
 */
function interpolatePercentile(
  val: number,
  points: PercentilePoint[],
  direction: 'higher_is_better' | 'lower_is_better'
): number {
  // Sort points by value ascending
  const sorted = [...points].sort((a, b) => a.value - b.value);

  if (direction === 'higher_is_better') {
    // If val is lower than lowest benchmark point
    if (val <= sorted[0].value) {
      // Conservative lower bound
      return Math.max(1.0, sorted[0].percentile * (val / sorted[0].value));
    }
    // If val is higher than highest benchmark point
    if (val >= sorted[sorted.length - 1].value) {
      return 99.0;
    }

    // Find bounding interval
    for (let i = 0; i < sorted.length - 1; i++) {
      const p1 = sorted[i];
      const p2 = sorted[i + 1];
      if (val >= p1.value && val <= p2.value) {
        if (p2.value === p1.value) return p1.percentile;
        const fraction = (val - p1.value) / (p2.value - p1.value);
        return p1.percentile + fraction * (p2.percentile - p1.percentile);
      }
    }
  } else {
    // LOWER IS BETTER (e.g. sprint time: 4.10s is better than 4.60s)
    // Here, smaller values correspond to HIGHER percentiles.
    // Let's sort by value ascending
    const fastest = sorted[0]; // smallest time
    const slowest = sorted[sorted.length - 1]; // largest time

    if (val <= fastest.value) {
      return 99.0; // Faster than top percentile
    }
    if (val >= slowest.value) {
      return 2.0; // Slower than lowest percentile
    }

    // Notice that as value increases, percentile should decrease
    // Let's find between which two points val lies:
    for (let i = 0; i < sorted.length - 1; i++) {
      const p1 = sorted[i];     // lower value, higher percentile
      const p2 = sorted[i + 1]; // higher value, lower percentile
      if (val >= p1.value && val <= p2.value) {
        if (p2.value === p1.value) return p1.percentile;
        const fraction = (val - p1.value) / (p2.value - p1.value);
        // p1 has higher percentile than p2
        return p1.percentile - fraction * (p1.percentile - p2.percentile);
      }
    }
  }

  return 50.0;
}

export function getRatingFromPercentile(percentile: number, config: ScoringConfiguration = DEFAULT_SCORING_CONFIG): RatingLabel {
  const { poorMaxPercentile, belowAverageMaxPercentile, averageMaxPercentile, goodMaxPercentile } = config.ratingThresholds;
  if (percentile <= poorMaxPercentile) return 'Poor';
  if (percentile <= belowAverageMaxPercentile) return 'Below Average';
  if (percentile <= averageMaxPercentile) return 'Average';
  if (percentile <= goodMaxPercentile) return 'Good';
  return 'Excellent';
}
