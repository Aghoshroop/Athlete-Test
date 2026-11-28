import { AthleteProfile } from '@/types/athlete';
import { Assessment } from '@/types/assessment';
import { EvaluationStandard } from '@/types/benchmark';
import { SportZone } from '@/types/zone';
import { createDefaultAssessmentForAthlete } from './generate-athlete-assessment';
import { SEED_ATHLETES } from './seed-athletes';

export interface DemoReportBundle {
  athlete: AthleteProfile;
  assessment: Assessment;
  previousAssessment: Assessment;
}

const MULTI_SPORT_DEMO_ATHLETES: AthleteProfile[] = [
  {
    id: 'demo-ms-football',
    organizationId: 'org-nahpc',
    athleteCode: 'MSP-2026-101',
    fullName: 'Aarav Nair',
    dateOfBirth: '2003-04-19',
    sex: 'male',
    sportZone: 'multi_sports',
    sportName: 'Football (Soccer)',
    club: 'Bengaluru Elite FC Reserve',
    coachId: 'coach-demo',
    coachName: 'Lead Conditioning Coach',
    trainingSquad: 'Multi-Sport Combine Group A',
    dominantHand: 'right',
    dominantFoot: 'right',
    primaryEventId: 'evt-football-winger',
    primaryEventName: 'Winger / Attacking Midfielder',
    eventGroup: 'sprints',
    secondaryEventIds: [],
    secondaryEventNames: [],
    status: 'active',
    currentMeasurements: {
      id: 'demo-meas-1',
      athleteId: 'demo-ms-football',
      date: '2026-10-20',
      heightCm: 176.4,
      weightKg: 70.5,
      armSpanCm: 180.0,
      bodyFatPercent: 8.6,
    },
    measurementHistory: [],
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-10-20T09:00:00Z',
  },
  {
    id: 'demo-ms-badminton',
    organizationId: 'org-nahpc',
    athleteCode: 'MSP-2026-104',
    fullName: 'Meera Kulkarni',
    dateOfBirth: '2004-09-08',
    sex: 'female',
    sportZone: 'multi_sports',
    sportName: 'Badminton',
    club: 'Hyderabad National Badminton Wing',
    coachId: 'coach-demo',
    coachName: 'Lead Conditioning Coach',
    trainingSquad: 'Court Agility & Power Squad',
    dominantHand: 'right',
    dominantFoot: 'left',
    primaryEventId: 'evt-badminton-singles',
    primaryEventName: 'Singles Specialist',
    eventGroup: 'combined',
    secondaryEventIds: [],
    secondaryEventNames: [],
    status: 'active',
    currentMeasurements: {
      id: 'demo-meas-2',
      athleteId: 'demo-ms-badminton',
      date: '2026-10-18',
      heightCm: 170.2,
      weightKg: 58.4,
      armSpanCm: 173.5,
      bodyFatPercent: 12.1,
    },
    measurementHistory: [],
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z',
  },
];

const DEMO_POOL: AthleteProfile[] = [
  ...SEED_ATHLETES,
  ...MULTI_SPORT_DEMO_ATHLETES,
];

const EVALUATION_STANDARDS_POOL: EvaluationStandard[] = [
  'indian_national',
  'world_athletics',
  'olympic',
  'standard',
];

function createSeededPrng(seed: number): () => number {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getRatingFromPercentile(pct: number): 'Poor' | 'Below Average' | 'Average' | 'Good' | 'Excellent' {
  if (pct >= 90) return 'Excellent';
  if (pct >= 75) return 'Good';
  if (pct >= 50) return 'Average';
  if (pct >= 25) return 'Below Average';
  return 'Poor';
}

function roundTo(val: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

/**
 * Generates a realistic, fully populated Random Demo Report (Current + Previous Baseline)
 * across Track & Field and Multi-Sports athletes using a pure seeded PRNG.
 */
export function generateRandomDemoReport(
  seed: number,
  options?: { coachName?: string; preferredZone?: SportZone }
): DemoReportBundle {
  const rand = createSeededPrng(seed);

  const filteredPool = options?.preferredZone
    ? DEMO_POOL.filter((a) => (a.sportZone ?? 'track_and_field') === options.preferredZone)
    : DEMO_POOL;
  const pool = filteredPool.length > 0 ? filteredPool : DEMO_POOL;
  const baseAthlete = pool[Math.floor(rand() * pool.length) % pool.length];

  const athlete: AthleteProfile = {
    ...baseAthlete,
    coachName: options?.coachName?.trim() || baseAthlete.coachName,
  };

  const evalStandard =
    EVALUATION_STANDARDS_POOL[Math.floor(rand() * EVALUATION_STANDARDS_POOL.length)];

  const baseCurrent = createDefaultAssessmentForAthlete(athlete, '2026-10-22');
  const basePrevious = createDefaultAssessmentForAthlete(athlete, '2026-07-12');

  // Apply realistic random performance shifts across categories & bilateral asymmetry
  const shiftedCategoryScores = { ...baseCurrent.categoryScores };
  const shiftedTestResults = (baseCurrent.testResults || []).map((test) => {
    const pctDelta = (rand() - 0.35) * 14; // [-4.9, +9.1] realistic progression variance
    const nextPct = Math.max(42, Math.min(98.5, roundTo((test.percentile ?? 80) + pctDelta, 1)));

    // Keep raw metric direction scientifically consistent with percentile shift
    const rawScale =
      test.measurementDirection === 'lower_is_better'
        ? 1 - (nextPct - (test.percentile ?? 80)) * 0.0045
        : 1 + (nextPct - (test.percentile ?? 80)) * 0.0045;
    const nextRaw = roundTo((test.finalRawValue ?? 10) * rawScale, test.unit === 's' ? 2 : 1);

    let leftResult = test.leftResult;
    let rightResult = test.rightResult;
    let asymmetryPercent = test.asymmetryPercent;
    let dominantSideAdvantage = test.dominantSideAdvantage;

    if (test.isBilateral && leftResult !== undefined && rightResult !== undefined) {
      const asymMag = roundTo(1.8 + rand() * 7.2, 1);
      const rightDominant = rand() >= 0.45;
      rightResult = nextRaw;
      leftResult = roundTo(nextRaw * (rightDominant ? 1 - asymMag / 100 : 1 + asymMag / 100), 1);
      asymmetryPercent = asymMag;
      dominantSideAdvantage = rightDominant ? 'right' : 'left';
    }

    if (shiftedCategoryScores[test.category]) {
      shiftedCategoryScores[test.category] = {
        ...shiftedCategoryScores[test.category]!,
        categoryScorePercentile: nextPct,
        rating: getRatingFromPercentile(nextPct),
      };
    }

    return {
      ...test,
      attempts: test.attempts?.length > 1 ? [roundTo(nextRaw * 1.015, test.unit === 's' ? 2 : 1), nextRaw] : [nextRaw],
      finalRawValue: nextRaw,
      percentile: nextPct,
      rating: getRatingFromPercentile(nextPct),
      leftResult,
      rightResult,
      leftAttempts: leftResult !== undefined ? [leftResult] : undefined,
      rightAttempts: rightResult !== undefined ? [rightResult] : undefined,
      asymmetryPercent,
      dominantSideAdvantage,
    };
  });

  const validTests = shiftedTestResults.filter((t) => typeof t.percentile === 'number');
  const avgScore =
    validTests.length > 0
      ? roundTo(
          validTests.reduce((sum, t) => sum + (t.percentile ?? 0), 0) / validTests.length,
          1
        )
      : 86.2;

  const sortedCategories = Object.entries(shiftedCategoryScores)
    .sort(([, a], [, b]) => b.categoryScorePercentile - a.categoryScorePercentile)
    .map(
      ([cat, res]) =>
        `${cat.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} (${res.categoryScorePercentile.toFixed(0)}th %ile)`
    );

  const bilateralSummary = shiftedTestResults
    .filter((t) => t.isBilateral && t.asymmetryPercent !== undefined)
    .map((t) => ({
      testName: t.testName,
      asymmetryPercent: t.asymmetryPercent ?? 0,
      leftValue: t.leftResult,
      rightValue: t.rightResult,
      unit: t.unit,
      description:
        (t.asymmetryPercent ?? 0) <= 5
          ? 'Balanced bilateral symmetry inside optimal < 5% tolerance.'
          : `${t.dominantSideAdvantage === 'left' ? 'Left' : 'Right'} dominant (${t.asymmetryPercent}% asymmetry, within safe threshold).`,
    }));

  // Build matching previous baseline (~4-8 points lower for vivid progress comparison)
  const previousTestResults = (basePrevious.testResults || []).map((prevT, idx) => {
    const currT = shiftedTestResults[idx];
    const basePct = currT ? Math.max(35, roundTo((currT.percentile ?? 75) - (3.5 + rand() * 6), 1)) : prevT.percentile;
    return {
      ...prevT,
      percentile: basePct,
      rating: getRatingFromPercentile(basePct ?? 75),
    };
  });

  const previousAssessment: Assessment = {
    ...basePrevious,
    id: `demo-prev-${athlete.id}-${seed}`,
    coachName: athlete.coachName,
    evaluationStandard: evalStandard,
    overallFitnessScore: roundTo(Math.max(45, avgScore - (3.2 + rand() * 4.5)), 1),
    testResults: previousTestResults,
  };

  const assessment: Assessment = {
    ...baseCurrent,
    id: `demo-curr-${athlete.id}-${seed}`,
    coachName: athlete.coachName,
    evaluationStandard: evalStandard,
    overallFitnessScore: avgScore,
    overallRating: getRatingFromPercentile(avgScore),
    categoryScores: shiftedCategoryScores,
    testResults: shiftedTestResults,
    topStrengths: sortedCategories.slice(0, 3),
    areasToImprove: sortedCategories.slice(-2),
    bilateralAsymmetries: bilateralSummary,
    coachGeneralComments:
      `[Demo Sample #${seed}] ${athlete.fullName} (${athlete.sportName || athlete.primaryEventName}) achieved a composite fitness index of ${avgScore.toFixed(1)}/100. Peak output observed in ${sortedCategories[0] || 'Speed'}, with targeted conditioning block recommended for ${sortedCategories[sortedCategories.length - 1] || 'Mobility'}.`,
  };

  return { athlete, assessment, previousAssessment };
}
