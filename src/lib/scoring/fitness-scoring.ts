import { FitnessCategory, FITNESS_CATEGORIES_INFO } from '@/types/fitness';
import { ScoringConfiguration } from '@/types/benchmark';
import { CategoryScoreResult, TestResultEntry } from '@/types/assessment';
import { DEFAULT_SCORING_CONFIG, getRatingFromPercentile } from './benchmark-engine';

export interface FitnessScoringCalculationResult {
  categoryScores: Record<FitnessCategory, CategoryScoreResult>;
  overallFitnessScore?: number;
  overallRating?: 'Poor' | 'Below Average' | 'Average' | 'Good' | 'Excellent';
  coveragePercentage: number;
  meetsMinimumCoverage: boolean;
  topStrengths: string[];
  areasToImprove: string[];
  summaryMessage: string;
}

/**
 * Aggregates individual test results into categories and overall fitness index.
 * Rule 1: Exclude tests with benchmarkStatus === 'none' from percentile aggregation.
 * Rule 2: Support missing measurements without treating them as zero.
 * Rule 3: Enforce minimum coverage threshold before calculating overall score.
 */
export function calculateFitnessScores(
  testResults: TestResultEntry[],
  config: ScoringConfiguration = DEFAULT_SCORING_CONFIG
): FitnessScoringCalculationResult {
  const categories: FitnessCategory[] = Object.keys(FITNESS_CATEGORIES_INFO) as FitnessCategory[];
  const categoryScores: Partial<Record<FitnessCategory, CategoryScoreResult>> = {};

  let weightedPercentileSum = 0;
  let activeWeightsSum = 0;
  let totalEvaluatedTests = 0;
  let totalValidTests = 0;

  for (const cat of categories) {
    const testsInCat = testResults.filter((t) => t.category === cat);
    const validTests = testsInCat.filter(
      (t) => !t.isMissing && t.benchmarkStatus === 'valid' && t.percentile !== undefined
    );

    totalEvaluatedTests += testsInCat.length;
    totalValidTests += validTests.length;

    const catWeight = config.categoryWeights[cat] ?? 10;

    if (validTests.length === 0) {
      categoryScores[cat] = {
        category: cat,
        categoryScorePercentile: 0,
        rating: 'Below Average',
        validTestsCount: 0,
        totalTestsCount: testsInCat.length,
        weightPercent: catWeight,
      };
      continue;
    }

    // Average percentile across valid tests in this category
    const catPercentileAvg =
      validTests.reduce((acc, t) => acc + (t.percentile ?? 50), 0) / validTests.length;
    const roundedCatPercentile = Math.round(catPercentileAvg * 10) / 10;

    // Find strongest and weakest tests
    const sorted = [...validTests].sort((a, b) => (b.percentile ?? 0) - (a.percentile ?? 0));
    const strongestTestCode = sorted[0]?.testCode;
    const weakestTestCode = sorted[sorted.length - 1]?.testCode;

    categoryScores[cat] = {
      category: cat,
      categoryScorePercentile: roundedCatPercentile,
      rating: getRatingFromPercentile(roundedCatPercentile, config),
      validTestsCount: validTests.length,
      totalTestsCount: testsInCat.length,
      weightPercent: catWeight,
      strongestTestCode,
      weakestTestCode,
    };

    weightedPercentileSum += roundedCatPercentile * catWeight;
    activeWeightsSum += catWeight;
  }

  // Calculate Coverage Percentage based on active categories with at least 1 valid test
  const categoriesWithValidTests = categories.filter(
    (cat) => (categoryScores[cat]?.validTestsCount ?? 0) > 0
  ).length;
  const coveragePercentage = Math.round((categoriesWithValidTests / categories.length) * 100);

  const meetsMinimumCoverage = coveragePercentage >= config.minimumDataCoveragePercent;

  let overallFitnessScore: number | undefined;
  let overallRating: 'Poor' | 'Below Average' | 'Average' | 'Good' | 'Excellent' | undefined;

  if (meetsMinimumCoverage && activeWeightsSum > 0) {
    overallFitnessScore = Math.round((weightedPercentileSum / activeWeightsSum) * 10) / 10;
    overallRating = getRatingFromPercentile(overallFitnessScore, config);
  }

  // Identify top strengths and areas to improve
  const scoredCategories = categories
    .filter((cat) => (categoryScores[cat]?.validTestsCount ?? 0) > 0)
    .map((cat) => categoryScores[cat]!)
    .sort((a, b) => b.categoryScorePercentile - a.categoryScorePercentile);

  const topStrengths = scoredCategories
    .filter((c) => c.categoryScorePercentile >= 65)
    .slice(0, 3)
    .map((c) => `${FITNESS_CATEGORIES_INFO[c.category].label} (${c.categoryScorePercentile.toFixed(0)}th percentile)`);

  const areasToImprove = scoredCategories
    .filter((c) => c.categoryScorePercentile < 50)
    .reverse()
    .slice(0, 3)
    .map((c) => `${FITNESS_CATEGORIES_INFO[c.category].label} (${c.categoryScorePercentile.toFixed(0)}th percentile)`);

  const summaryMessage = meetsMinimumCoverage
    ? `Overall fitness calculated from ${categoriesWithValidTests}/${categories.length} categories (${totalValidTests} validated tests) meeting the ${config.minimumDataCoveragePercent}% minimum coverage threshold.`
    : `Overall fitness score suppressed: ${coveragePercentage}% coverage is below the required ${config.minimumDataCoveragePercent}% threshold. Additional category assessments required.`;

  return {
    categoryScores: categoryScores as Record<FitnessCategory, CategoryScoreResult>,
    overallFitnessScore,
    overallRating,
    coveragePercentage,
    meetsMinimumCoverage,
    topStrengths,
    areasToImprove,
    summaryMessage,
  };
}
