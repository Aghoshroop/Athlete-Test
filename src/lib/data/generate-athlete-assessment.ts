import { Assessment, CategoryScoreResult, TestResultEntry } from '@/types/assessment';
import { AthleteProfile, calculateAge } from '@/types/athlete';
import { FitnessCategory } from '@/types/fitness';

export function createDefaultAssessmentForAthlete(
  athlete: AthleteProfile,
  assessmentDate: string = '2024-10-15'
): Assessment {
  const age = calculateAge(athlete.dateOfBirth);
  const isFemale = athlete.sex === 'female';
  const group = athlete.eventGroup;

  // Tailored baseline scores depending on event group & sex
  let baseOverall = 85.0;
  let speedPct = 85.0;
  let accelPct = 84.0;
  let powerPct = 86.0;
  let strengthPct = 82.0;
  let endurancePct = 76.0;
  let agilityPct = 84.0;
  let flexPct = 75.0;
  let mobPct = 78.0;
  let coordPct = 82.0;
  let balancePct = 82.0;

  let sprint30mVal = isFemale ? 4.15 : 3.86;
  let sprint10mVal = isFemale ? 1.76 : 1.68;
  let cmjVal = isFemale ? 48.0 : 64.0;
  let sljVal = isFemale ? 255.0 : 305.0;
  let handgripVal = isFemale ? 42.0 : 64.0;
  let sitReachVal = 32.0;
  let ankleLungeVal = 13.5;
  let tTestVal = isFemale ? 10.2 : 9.75;
  let shuttleLapsVal = isFemale ? 88 : 98;
  let plateTapVal = 9.0;
  let singleLegStanceVal = 45.0;

  if (group === 'combined' || athlete.primaryEventName.toLowerCase().includes('heptathlon')) {
    baseOverall = 91.2;
    powerPct = 93.0;
    flexPct = 91.0;
    speedPct = 90.0;
    accelPct = 89.0;
    agilityPct = 89.0;
    strengthPct = 88.0;
    endurancePct = 85.0;
    mobPct = 90.0;
    coordPct = 91.0;
    balancePct = 92.0;
    cmjVal = 51.5;
    sljVal = 262.0;
    sitReachVal = 38.0;
  } else if (group === 'jumps') {
    baseOverall = 88.5;
    powerPct = 95.0;
    speedPct = 93.0;
    accelPct = 91.0;
    agilityPct = 88.0;
    strengthPct = 84.0;
    coordPct = 85.0;
    balancePct = 88.0;
    mobPct = 82.0;
    flexPct = 74.0;
    endurancePct = 75.0;
    cmjVal = 66.5;
    sljVal = 315.0;
  } else if (group === 'middle_distance' || group === 'long_distance') {
    baseOverall = 86.8;
    endurancePct = 96.0;
    balancePct = 93.0;
    agilityPct = 90.0;
    mobPct = 88.0;
    flexPct = 88.0;
    coordPct = 86.0;
    speedPct = 80.0;
    accelPct = 78.0;
    powerPct = 81.0;
    strengthPct = 76.0;
    shuttleLapsVal = isFemale ? 120 : 135;
    cmjVal = 42.0;
    sljVal = 235.0;
  } else if (group === 'throws') {
    baseOverall = 84.6;
    strengthPct = 96.0;
    coordPct = 88.0;
    powerPct = 86.0;
    accelPct = 82.0;
    balancePct = 82.0;
    agilityPct = 79.0;
    speedPct = 78.0;
    mobPct = 74.0;
    flexPct = 65.0;
    endurancePct = 68.0;
    handgripVal = isFemale ? 56.0 : 74.5;
    cmjVal = 58.0;
    sljVal = 285.0;
  }

  const getRating = (pct: number): 'Poor' | 'Below Average' | 'Average' | 'Good' | 'Excellent' => {
    if (pct >= 90) return 'Excellent';
    if (pct >= 75) return 'Good';
    if (pct >= 50) return 'Average';
    if (pct >= 25) return 'Below Average';
    return 'Poor';
  };

  const categoryScores: Record<FitnessCategory, CategoryScoreResult> = {
    speed: {
      category: 'speed',
      categoryScorePercentile: speedPct,
      rating: getRating(speedPct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 16,
    },
    acceleration: {
      category: 'acceleration',
      categoryScorePercentile: accelPct,
      rating: getRating(accelPct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 14,
    },
    explosive_power: {
      category: 'explosive_power',
      categoryScorePercentile: powerPct,
      rating: getRating(powerPct),
      validTestsCount: 2,
      totalTestsCount: 2,
      weightPercent: 16,
    },
    strength: {
      category: 'strength',
      categoryScorePercentile: strengthPct,
      rating: getRating(strengthPct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 14,
    },
    agility: {
      category: 'agility',
      categoryScorePercentile: agilityPct,
      rating: getRating(agilityPct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 8,
    },
    flexibility: {
      category: 'flexibility',
      categoryScorePercentile: flexPct,
      rating: getRating(flexPct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 8,
    },
    mobility: {
      category: 'mobility',
      categoryScorePercentile: mobPct,
      rating: getRating(mobPct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 8,
    },
    coordination: {
      category: 'coordination',
      categoryScorePercentile: coordPct,
      rating: getRating(coordPct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 6,
    },
    endurance: {
      category: 'endurance',
      categoryScorePercentile: endurancePct,
      rating: getRating(endurancePct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 6,
    },
    balance: {
      category: 'balance',
      categoryScorePercentile: balancePct,
      rating: getRating(balancePct),
      validTestsCount: 1,
      totalTestsCount: 1,
      weightPercent: 4,
    },
  };

  const testResults: TestResultEntry[] = [
    {
      testId: 'test-sprint-30m',
      testCode: 'SPRINT_30M',
      testName: '30m Sprint (Standing Start)',
      category: 'speed',
      unit: 's',
      measurementDirection: 'lower_is_better',
      attempts: [sprint30mVal + 0.05, sprint30mVal],
      finalRawValue: sprint30mVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-sprint-haugen-2012',
      benchmarkSourceTitle: 'Haugen, Tonnessen & Seiler (IJSPP 2012)',
      percentile: speedPct,
      rating: getRating(speedPct),
      isBilateral: false,
      isMissing: false,
      isExcludedFromOverall: false,
      coachNotes: 'Solid sprint velocity curve over measured 30m distance.',
    },
    {
      testId: 'test-sprint-10m',
      testCode: 'SPRINT_10M',
      testName: '10m Sprint (Acceleration)',
      category: 'acceleration',
      unit: 's',
      measurementDirection: 'lower_is_better',
      attempts: [sprint10mVal + 0.03, sprint10mVal],
      finalRawValue: sprint10mVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-sprint-haugen-2012',
      benchmarkSourceTitle: 'Haugen, Tonnessen & Seiler (IJSPP 2012)',
      percentile: accelPct,
      rating: getRating(accelPct),
      isBilateral: false,
      isMissing: false,
      isExcludedFromOverall: false,
    },
    {
      testId: 'test-cmj',
      testCode: 'CMJ_HEIGHT',
      testName: 'Countermovement Jump (CMJ)',
      category: 'explosive_power',
      unit: 'cm',
      measurementDirection: 'higher_is_better',
      attempts: [cmjVal - 1.5, cmjVal],
      finalRawValue: cmjVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-cmj-mcmahon-2018',
      benchmarkSourceTitle: 'McMahon et al. & Eurofit Elite Jump Curves (2018)',
      percentile: powerPct,
      rating: getRating(powerPct),
      isBilateral: false,
      isMissing: false,
      isExcludedFromOverall: false,
    },
    {
      testId: 'test-standing-long-jump',
      testCode: 'STANDING_LONG_JUMP',
      testName: 'Standing Broad Jump',
      category: 'explosive_power',
      unit: 'cm',
      measurementDirection: 'higher_is_better',
      attempts: [sljVal - 4, sljVal],
      finalRawValue: sljVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-standing-long-jump-eurofit',
      benchmarkSourceTitle: 'Eurofit Committee for Sports Development (N > 22,000)',
      percentile: Math.min(99, powerPct + 1),
      rating: getRating(powerPct),
      isBilateral: false,
      isMissing: false,
      isExcludedFromOverall: false,
    },
    {
      testId: 'test-handgrip',
      testCode: 'HANDGRIP_STRENGTH',
      testName: 'Handgrip Dynamometry',
      category: 'strength',
      unit: 'kg',
      measurementDirection: 'higher_is_better',
      attempts: [handgripVal],
      isBilateral: true,
      leftAttempts: [handgripVal - 2.5],
      rightAttempts: [handgripVal],
      leftResult: handgripVal - 2.5,
      rightResult: handgripVal,
      asymmetryPercent: 4.8,
      dominantSideAdvantage: 'right',
      finalRawValue: handgripVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-handgrip-dodds-2014',
      benchmarkSourceTitle: 'Dodds et al. & Eurofit Global Norms (Lancet 2014)',
      percentile: strengthPct,
      rating: getRating(strengthPct),
      isMissing: false,
      isExcludedFromOverall: false,
    },
    {
      testId: 'test-sit-and-reach',
      testCode: 'SIT_AND_REACH',
      testName: 'Sit and Reach (Trunk Flexion)',
      category: 'flexibility',
      unit: 'cm',
      measurementDirection: 'higher_is_better',
      attempts: [sitReachVal - 1.0, sitReachVal],
      finalRawValue: sitReachVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-sit-and-reach-eurofit',
      benchmarkSourceTitle: 'Eurofit & ACSM (2017)',
      percentile: flexPct,
      rating: getRating(flexPct),
      isBilateral: false,
      isMissing: false,
      isExcludedFromOverall: false,
    },
    {
      testId: 'test-ankle-dorsiflexion',
      testCode: 'ANKLE_DORSIFLEXION',
      testName: 'Weight-Bearing Ankle Lunge (WBLT)',
      category: 'mobility',
      unit: 'cm',
      measurementDirection: 'higher_is_better',
      attempts: [ankleLungeVal],
      isBilateral: true,
      leftAttempts: [ankleLungeVal - 0.5],
      rightAttempts: [ankleLungeVal],
      leftResult: ankleLungeVal - 0.5,
      rightResult: ankleLungeVal,
      asymmetryPercent: 3.7,
      dominantSideAdvantage: 'right',
      finalRawValue: ankleLungeVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-ankle-lunge-powden-2015',
      benchmarkSourceTitle: 'Powden et al. Reliability and Normative WBLT Values (2015)',
      percentile: mobPct,
      rating: getRating(mobPct),
      isMissing: false,
      isExcludedFromOverall: false,
    },
    {
      testId: 'test-t-test',
      testCode: 'T_TEST_AGILITY',
      testName: 'T-Test Agility',
      category: 'agility',
      unit: 's',
      measurementDirection: 'lower_is_better',
      attempts: [tTestVal + 0.1, tTestVal],
      finalRawValue: tTestVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-t-test-pauole-2000',
      benchmarkSourceTitle: 'Pauole et al. (JSCR 2000)',
      percentile: agilityPct,
      rating: getRating(agilityPct),
      isBilateral: false,
      isMissing: false,
      isExcludedFromOverall: false,
    },
    {
      testId: 'test-shuttle-20m',
      testCode: 'SHUTTLE_20M',
      testName: '20m Multi-Stage Shuttle Run',
      category: 'endurance',
      unit: 'laps',
      measurementDirection: 'higher_is_better',
      attempts: [shuttleLapsVal],
      finalRawValue: shuttleLapsVal,
      benchmarkStatus: 'valid',
      benchmarkSourceId: 'src-shuttle-tomkinson-2017',
      benchmarkSourceTitle: 'Tomkinson et al. (BJSM 2017)',
      percentile: endurancePct,
      rating: getRating(endurancePct),
      isBilateral: false,
      isMissing: false,
      isExcludedFromOverall: false,
    },
  ];

  // Pick top 3 categories by percentile
  const sortedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b.categoryScorePercentile - a.categoryScorePercentile)
    .map(([cat, res]) => `${cat.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} (${res.categoryScorePercentile}th percentile)`);

  const topStrengths = sortedCategories.slice(0, 3);
  const areasToImprove = sortedCategories.slice(-2);

  return {
    id: `ass-${athlete.id}-2024-10`,
    organizationId: athlete.organizationId,
    athleteId: athlete.id,
    athleteCode: athlete.athleteCode,
    athleteName: athlete.fullName,
    athleteAge: age,
    sex: athlete.sex,
    eventGroup: athlete.eventGroup,
    primaryEvent: athlete.primaryEventName,
    batteryId: 'battery-performance-standard',
    batteryName: `${athlete.primaryEventName} Performance Testing Battery`,
    coachId: athlete.coachId,
    coachName: athlete.coachName,
    assessmentDate,
    status: 'finalized',
    coveragePercentage: 100,
    meetsMinimumCoverage: true,
    overallFitnessScore: baseOverall,
    overallRating: getRating(baseOverall),
    revision: 1,
    scoringConfigVersion: 'default-config-v1',
    coachGeneralComments: `Official completed fitness battery protocol for ${athlete.fullName}. Demonstrated high technical execution across all 10 physical dimensions.`,
    topStrengths,
    areasToImprove,
    bilateralAsymmetries: [
      {
        testName: 'Handgrip Dynamometry',
        asymmetryPercent: 4.8,
        description: 'Slight right-side dominant advantage, within standard normative symmetry tolerance (< 10%).',
      },
    ],
    categoryScores,
    testResults,
    createdAt: `${assessmentDate}T10:00:00Z`,
    updatedAt: `${assessmentDate}T12:00:00Z`,
    finalizedAt: `${assessmentDate}T12:00:00Z`,
    finalizedByCoachId: athlete.coachId,
  };
}
