import { BilateralAnalysis } from '@/types/intelligence';

export interface BilateralCalculationOptions {
  testCode: string;
  testName: string;
  leftValue: number;
  rightValue: number;
  unit: string;
  higherIsBetter?: boolean;
  normalVarianceThresholdPercent?: number; // Default 10%
}

/**
 * Calculates bilateral asymmetry and functional deficit with exact directionality.
 * Relative Deficit Formula: ((Right - Left) / max(Left, Right)) * 100 for higher-is-better
 * or ((Left - Right) / min(Left, Right)) * 100 for lower-is-better (e.g. contact times)
 * Never automatically labels asymmetry as injury risk.
 */
export function calculateBilateralAsymmetry(options: BilateralCalculationOptions): BilateralAnalysis {
  const {
    testCode,
    testName,
    leftValue,
    rightValue,
    unit,
    higherIsBetter = true,
    normalVarianceThresholdPercent = 10,
  } = options;

  const absoluteDiff = Math.round(Math.abs(rightValue - leftValue) * 100) / 100;

  let relativeDeficitPercent = 0;
  let weakerSide: 'left' | 'right' | 'symmetric' = 'symmetric';

  if (higherIsBetter) {
    const maxVal = Math.max(leftValue, rightValue);
    if (maxVal > 0) {
      // Positive deficit indicates right is stronger (left has a deficit)
      // Negative deficit indicates left is stronger (right has a deficit)
      relativeDeficitPercent = Math.round(((rightValue - leftValue) / maxVal) * 1000) / 10;
    }

    if (relativeDeficitPercent > 1.0) {
      weakerSide = 'left';
    } else if (relativeDeficitPercent < -1.0) {
      weakerSide = 'right';
    } else {
      weakerSide = 'symmetric';
    }
  } else {
    // Lower is better (e.g. single leg ground contact time or unilateral jump test duration)
    const minVal = Math.min(leftValue, rightValue);
    if (minVal > 0) {
      relativeDeficitPercent = Math.round(((leftValue - rightValue) / minVal) * 1000) / 10;
    }
    if (leftValue > rightValue) {
      weakerSide = 'left'; // Higher time on left side = slower / weaker
    } else if (rightValue > leftValue) {
      weakerSide = 'right';
    } else {
      weakerSide = 'symmetric';
    }
  }

  const absPercent = Math.abs(relativeDeficitPercent);
  const isWithinNormalVariance = absPercent <= normalVarianceThresholdPercent;

  let coachingObservation = '';
  if (isWithinNormalVariance) {
    coachingObservation = `Symmetry is balanced within acceptable normative athletic threshold (±${normalVarianceThresholdPercent}%). Variance of ${absPercent.toFixed(1)}% is consistent with dominant limb preference in track & field disciplines.`;
  } else if (absPercent <= 15) {
    coachingObservation = `Moderate asymmetry noted (${absPercent.toFixed(1)}% deficit on ${weakerSide} limb). Recommend targeted unilateral resistance and neuromuscular drills during warm-up phase.`;
  } else {
    coachingObservation = `Marked asymmetry of ${absPercent.toFixed(1)}% with deficit on ${weakerSide} limb. Warranting coach technical review and physiotherapist screen prior to maximal plyometric volume.`;
  }

  return {
    testCode,
    testName,
    leftValue,
    rightValue,
    unit,
    absoluteDiff,
    relativeDeficitPercent,
    weakerSide,
    isWithinNormalVariance,
    coachingObservation,
  };
}
