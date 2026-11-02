'use client';

import React, { useState, useEffect } from 'react';
import { AthleteProfile, calculateAge } from '@/types/athlete';
import { FitnessCategory, FITNESS_CATEGORIES_INFO, TestDefinition, TestingBattery } from '@/types/fitness';
import { Assessment, TestResultEntry } from '@/types/assessment';
import { evaluateTestBenchmark } from '@/lib/scoring/benchmark-engine';
import { calculateFitnessScores } from '@/lib/scoring/fitness-scoring';
import { calculateBilateralAsymmetry } from '@/lib/scoring/bilateral';
import { db } from '@/lib/storage/local-storage-db';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  CheckCircle2,
  Save,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
} from 'lucide-react';

interface CoachTestingEntryProps {
  athletes: AthleteProfile[];
  initialAthleteId?: string;
  onSaveAssessment: (assessment: Assessment) => void;
  onClose?: () => void;
  onOpenReport?: (assessment: Assessment) => void;
}

interface TestEntryState {
  test: TestDefinition;
  attempts: string[];
  isBilateral: boolean;
  leftAttempts: string[];
  rightAttempts: string[];
  coachNotes: string;
}

export function CoachTestingEntry({
  athletes,
  initialAthleteId,
  onSaveAssessment,
  onClose,
  onOpenReport,
}: CoachTestingEntryProps) {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(
    initialAthleteId || athletes[0]?.id || ''
  );
  const [testingDate, setTestingDate] = useState<string>('2024-10-15');
  const [batteries, setBatteries] = useState<TestingBattery[]>([]);
  const [selectedBatteryId, setSelectedBatteryId] = useState<string>('');
  const [testDefinitions, setTestDefinitions] = useState<TestDefinition[]>([]);
  const [testEntries, setTestEntries] = useState<Record<string, TestEntryState>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    speed: true,
    acceleration: true,
    explosive_power: true,
    strength: true,
    agility: true,
    flexibility: true,
  });
  const [coachGeneralComments, setCoachGeneralComments] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  // Load batteries and tests
  useEffect(() => {
    setTestingDate(new Date().toISOString().split('T')[0]);
    const bList = db.getTestingBatteries();
    setBatteries(bList);
    if (bList.length > 0) {
      setSelectedBatteryId(bList[0].id);
    }
    const tDefs = db.getTestDefinitions();
    setTestDefinitions(tDefs);
  }, []);

  // Sync test entries when battery or athlete changes
  useEffect(() => {
    if (!selectedBatteryId) return;
    const battery = batteries.find((b) => b.id === selectedBatteryId);
    if (!battery) return;

    const initialEntries: Record<string, TestEntryState> = {};
    for (const testId of battery.testIds) {
      const t = testDefinitions.find((def) => def.id === testId);
      if (t) {
        initialEntries[t.id] = {
          test: t,
          attempts: Array(t.permittedAttempts).fill(''),
          isBilateral: t.isBilateral,
          leftAttempts: t.isBilateral ? Array(t.permittedAttempts).fill('') : [],
          rightAttempts: t.isBilateral ? Array(t.permittedAttempts).fill('') : [],
          coachNotes: '',
        };
      }
    }
    setTestEntries(initialEntries);
  }, [selectedBatteryId, batteries, testDefinitions]);

  const selectedAthlete = athletes.find((a) => a.id === selectedAthleteId);
  const athleteAge = selectedAthlete ? calculateAge(selectedAthlete.dateOfBirth, testingDate) : 20;

  // Toggle category collapse
  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Update single attempt
  const handleAttemptChange = (testId: string, index: number, value: string) => {
    setTestEntries((prev) => {
      const entry = prev[testId];
      if (!entry) return prev;
      const newAttempts = [...entry.attempts];
      newAttempts[index] = value;
      return { ...prev, [testId]: { ...entry, attempts: newAttempts } };
    });
  };

  // Update bilateral attempt
  const handleBilateralChange = (
    testId: string,
    side: 'left' | 'right',
    index: number,
    value: string
  ) => {
    setTestEntries((prev) => {
      const entry = prev[testId];
      if (!entry) return prev;
      if (side === 'left') {
        const newLeft = [...entry.leftAttempts];
        newLeft[index] = value;
        return { ...prev, [testId]: { ...entry, leftAttempts: newLeft } };
      } else {
        const newRight = [...entry.rightAttempts];
        newRight[index] = value;
        return { ...prev, [testId]: { ...entry, rightAttempts: newRight } };
      }
    });
  };

  // Aggregate raw value for a test entry
  const computeRawValue = (entry: TestEntryState): number | undefined => {
    const { test } = entry;
    if (test.isBilateral) {
      const validLeft = entry.leftAttempts.map(Number).filter((v) => !isNaN(v) && v > 0);
      const validRight = entry.rightAttempts.map(Number).filter((v) => !isNaN(v) && v > 0);
      if (validLeft.length === 0 && validRight.length === 0) return undefined;
      const bestLeft = validLeft.length > 0 ? (test.measurementDirection === 'lower_is_better' ? Math.min(...validLeft) : Math.max(...validLeft)) : undefined;
      const bestRight = validRight.length > 0 ? (test.measurementDirection === 'lower_is_better' ? Math.min(...validRight) : Math.max(...validRight)) : undefined;
      if (bestLeft !== undefined && bestRight !== undefined) {
        return Math.round(((bestLeft + bestRight) / 2) * 100) / 100;
      }
      return bestRight ?? bestLeft;
    } else {
      const validAttempts = entry.attempts.map(Number).filter((v) => !isNaN(v) && v > 0);
      if (validAttempts.length === 0) return undefined;
      if (test.resultAggregation === 'best') {
        return test.measurementDirection === 'lower_is_better'
          ? Math.min(...validAttempts)
          : Math.max(...validAttempts);
      } else if (test.resultAggregation === 'average') {
        return Math.round((validAttempts.reduce((a, b) => a + b, 0) / validAttempts.length) * 100) / 100;
      }
      return validAttempts[0];
    }
  };

  // Compute live test results with scientific norm percentiles
  const evaluatedResults: TestResultEntry[] = Object.values(testEntries).map((entry) => {
    const rawVal = computeRawValue(entry);
    const normDataset = db.getNormDatasetForTest(entry.test.code);

    let normEval = evaluateTestBenchmark(
      rawVal,
      normDataset,
      athleteAge,
      selectedAthlete?.sex ?? 'male'
    );

    let leftResult: number | undefined;
    let rightResult: number | undefined;
    let asymmetryPercent: number | undefined;
    let dominantSideAdvantage: 'left' | 'right' | 'symmetric' | undefined;

    if (entry.test.isBilateral) {
      const validLeft = entry.leftAttempts.map(Number).filter((v) => !isNaN(v) && v > 0);
      const validRight = entry.rightAttempts.map(Number).filter((v) => !isNaN(v) && v > 0);
      if (validLeft.length > 0 && validRight.length > 0) {
        leftResult = entry.test.measurementDirection === 'lower_is_better' ? Math.min(...validLeft) : Math.max(...validLeft);
        rightResult = entry.test.measurementDirection === 'lower_is_better' ? Math.min(...validRight) : Math.max(...validRight);
        const asym = calculateBilateralAsymmetry({
          testCode: entry.test.code,
          testName: entry.test.name,
          leftValue: leftResult,
          rightValue: rightResult,
          unit: entry.test.unit,
          higherIsBetter: entry.test.measurementDirection === 'higher_is_better',
        });
        asymmetryPercent = asym.relativeDeficitPercent;
        dominantSideAdvantage = asym.relativeDeficitPercent > 1 ? 'right' : asym.relativeDeficitPercent < -1 ? 'left' : 'symmetric';
      }
    }

    return {
      testId: entry.test.id,
      testCode: entry.test.code,
      testName: entry.test.name,
      category: entry.test.category,
      unit: entry.test.unit,
      measurementDirection: entry.test.measurementDirection,
      attempts: entry.attempts.map(Number).filter((v) => !isNaN(v)),
      isBilateral: entry.test.isBilateral,
      leftAttempts: entry.leftAttempts.map(Number).filter((v) => !isNaN(v)),
      rightAttempts: entry.rightAttempts.map(Number).filter((v) => !isNaN(v)),
      leftResult,
      rightResult,
      asymmetryPercent,
      dominantSideAdvantage,
      finalRawValue: rawVal,
      benchmarkStatus: normEval.status,
      benchmarkSourceId: normEval.benchmarkSourceId,
      benchmarkSourceTitle: normEval.sourceCitation,
      percentile: normEval.percentile,
      rating: normEval.rating,
      isMissing: rawVal === undefined,
      isExcludedFromOverall: normEval.status === 'none',
      coachNotes: entry.coachNotes,
      limitationNote: normEval.limitations,
    };
  });

  // Calculate overall category scores & score
  const scoringConfig = db.getScoringConfig();
  const fitnessScoreCalc = calculateFitnessScores(evaluatedResults, scoringConfig);

  // Group tests by category
  const categoriesPresent = Array.from(new Set(evaluatedResults.map((r) => r.category)));

  // Build finalized Assessment object
  const buildAssessmentRecord = (status: 'draft' | 'validated' | 'finalized'): Assessment => {
    return {
      id: `ass-${selectedAthlete?.id}-${testingDate}-${Date.now().toString().slice(-4)}`,
      organizationId: selectedAthlete?.organizationId ?? 'org-nahpc',
      athleteId: selectedAthlete?.id ?? '',
      athleteCode: selectedAthlete?.athleteCode ?? '',
      athleteName: selectedAthlete?.fullName ?? '',
      athleteAge,
      sex: selectedAthlete?.sex ?? 'male',
      eventGroup: selectedAthlete?.eventGroup ?? 'sprints',
      primaryEvent: selectedAthlete?.primaryEventName ?? '100m',
      batteryId: selectedBatteryId,
      batteryName: batteries.find((b) => b.id === selectedBatteryId)?.name ?? 'Battery',
      coachId: 'coach-david-miller',
      coachName: 'Coach David Miller',
      assessmentDate: testingDate,
      status,
      testResults: evaluatedResults,
      categoryScores: fitnessScoreCalc.categoryScores,
      overallFitnessScore: fitnessScoreCalc.overallFitnessScore,
      overallRating: fitnessScoreCalc.overallRating,
      coveragePercentage: fitnessScoreCalc.coveragePercentage,
      meetsMinimumCoverage: fitnessScoreCalc.meetsMinimumCoverage,
      topStrengths: fitnessScoreCalc.topStrengths,
      areasToImprove: fitnessScoreCalc.areasToImprove,
      bilateralAsymmetries: evaluatedResults
        .filter((r) => r.isBilateral && r.asymmetryPercent !== undefined)
        .map((r) => ({
          testName: r.testName,
          asymmetryPercent: r.asymmetryPercent!,
          description: `${Math.abs(r.asymmetryPercent!).toFixed(1)}% variance favoring ${r.dominantSideAdvantage} side.`,
        })),
      revision: 1,
      scoringConfigVersion: scoringConfig.name,
      coachGeneralComments,
      finalizedAt: status === 'finalized' ? new Date().toISOString() : undefined,
      finalizedByCoachId: status === 'finalized' ? 'coach-david-miller' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSaveDraft = () => {
    const record = buildAssessmentRecord('draft');
    db.saveAssessment(record);
    onSaveAssessment(record);
    setNotification({ type: 'warning', message: 'Draft assessment saved successfully. Ready for further testing.' });
  };

  const handleFinalize = () => {
    const record = buildAssessmentRecord('finalized');
    db.saveAssessment(record);
    onSaveAssessment(record);
    setNotification({ type: 'success', message: 'Official Athletics Assessment FINALIZED! Score locked.' });
    if (onOpenReport) {
      setTimeout(() => onOpenReport(record), 800);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Physical Fitness Assessment Engine
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/40">
                  Published Norm Calibrated
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                High-speed data entry with multi-attempt aggregation & bilateral symmetry index
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </button>
            <button
              onClick={handleFinalize}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalize Assessment
            </button>
            {onClose && (
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Selection Bar: Athlete, Date, Battery */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Select Athlete */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Athlete Profile
            </label>
            <select
              value={selectedAthleteId}
              onChange={(e) => setSelectedAthleteId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.fullName} ({a.athleteCode}) - {a.primaryEventName}
                </option>
              ))}
            </select>
          </div>

          {/* Testing Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" /> Testing Date (Age: {athleteAge}y)
            </label>
            <input
              type="date"
              value={testingDate}
              onChange={(e) => setTestingDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
            </input>
          </div>

          {/* Testing Battery */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" /> Battery
            </label>
            <select
              value={selectedBatteryId}
              onChange={(e) => setSelectedBatteryId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
              {batteries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.testIds.length} tests)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Real-time Calculation Summary Bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Overall Fitness Score</div>
            <div className="text-xl font-black text-slate-900 flex items-center gap-2">
              {fitnessScoreCalc.overallFitnessScore !== undefined ? (
                <>
                  <span>{fitnessScoreCalc.overallFitnessScore.toFixed(1)}</span>
                  <Badge variant="yellow" size="sm">
                    {fitnessScoreCalc.overallRating}
                  </Badge>
                </>
              ) : (
                <span className="text-sm font-semibold text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Coverage {fitnessScoreCalc.coveragePercentage}% (Min {scoringConfig.minimumDataCoveragePercent}% req)
                </span>
              )}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div className="hidden sm:block">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Valid Tests</div>
            <div className="text-sm font-bold text-slate-800">
              {evaluatedResults.filter((r) => !r.isMissing && r.benchmarkStatus === 'valid').length} / {evaluatedResults.length} completed
            </div>
          </div>
        </div>

        {notification && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950">
            {notification.message}
          </div>
        )}
      </div>

      {/* Tests Grouped by Fitness Category */}
      <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
        {categoriesPresent.map((category) => {
          const catInfo = FITNESS_CATEGORIES_INFO[category as FitnessCategory];
          const testsInCat = evaluatedResults.filter((r) => r.category === category);
          const isExpanded = expandedCategories[category] ?? true;
          const catScore = fitnessScoreCalc.categoryScores[category as FitnessCategory];

          return (
            <div
              key={category}
              className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between hover:bg-slate-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-8 rounded-full"
                    style={{ backgroundColor: catInfo?.color ?? '#eab308' }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{catInfo?.label}</h4>
                      <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                        — {catInfo?.description}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {testsInCat.length} test{testsInCat.length > 1 ? 's' : ''} in category
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {catScore && catScore.validTestsCount > 0 ? (
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900">
                        {catScore.categoryScorePercentile.toFixed(0)}th percentile
                      </span>
                      <div className="text-[10px] text-slate-500">{catScore.rating}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No valid test data</span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Tests Table */}
              {isExpanded && (
                <div className="divide-y divide-slate-200 p-2 sm:p-4 space-y-3">
                  {testsInCat.map((item) => {
                    const entry = testEntries[item.testId];
                    if (!entry) return null;

                    return (
                      <div
                        key={item.testId}
                        className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Test Info */}
                          <div className="min-w-0 max-w-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{item.testName}</span>
                              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {item.unit}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {entry.test.protocol}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {/* Benchmark Status */}
                              {item.benchmarkStatus === 'valid' && (
                                <Badge variant="emerald" size="sm">
                                  Valid Benchmark: {item.benchmarkSourceTitle}
                                </Badge>
                              )}
                              {item.benchmarkStatus === 'limited' && (
                                <Badge variant="yellow" size="sm">
                                  Limited Norm Data
                                </Badge>
                              )}
                              {item.benchmarkStatus === 'none' && (
                                <Badge variant="gray" size="sm">
                                  No Validated Benchmark (Excluded from Score)
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Data Entry Fields */}
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Bilateral Inputs */}
                            {entry.isBilateral ? (
                              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                    Left Limb ({item.unit})
                                  </label>
                                  <div className="flex gap-1.5">
                                    {entry.leftAttempts.map((val, idx) => (
                                      <input
                                        key={idx}
                                        type="number"
                                        step="0.01"
                                        placeholder={`L${idx + 1}`}
                                        value={val}
                                        onChange={(e) =>
                                          handleBilateralChange(item.testId, 'left', idx, e.target.value)
                                        }
                                        className="w-16 px-2 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded text-center focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="h-8 w-px bg-slate-300" />
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                    Right Limb ({item.unit})
                                  </label>
                                  <div className="flex gap-1.5">
                                    {entry.rightAttempts.map((val, idx) => (
                                      <input
                                        key={idx}
                                        type="number"
                                        step="0.01"
                                        placeholder={`R${idx + 1}`}
                                        value={val}
                                        onChange={(e) =>
                                          handleBilateralChange(item.testId, 'right', idx, e.target.value)
                                        }
                                        className="w-16 px-2 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded text-center focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Standard Multiple Attempts */
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                  Attempts ({entry.test.permittedAttempts} allowed) - {entry.test.resultAggregation.toUpperCase()}
                                </label>
                                <div className="flex gap-1.5">
                                  {entry.attempts.map((att, idx) => (
                                    <input
                                      key={idx}
                                      type="number"
                                      step="0.01"
                                      placeholder={`#${idx + 1}`}
                                      value={att}
                                      onChange={(e) =>
                                        handleAttemptChange(item.testId, idx, e.target.value)
                                      }
                                      className="w-20 px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded text-center focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Live Result Display */}
                            <div className="min-w-[130px] p-2 bg-slate-50 rounded-lg border border-slate-200 text-right">
                              <div className="text-[10px] text-slate-500 font-bold uppercase">
                                Final Raw:
                              </div>
                              <div className="text-base font-black text-slate-900">
                                {item.finalRawValue !== undefined ? `${item.finalRawValue} ${item.unit}` : '—'}
                              </div>
                              {item.percentile !== undefined && (
                                <div className="text-xs font-bold text-amber-600">
                                  {item.percentile.toFixed(1)}th %ile ({item.rating})
                                </div>
                              )}
                              {item.asymmetryPercent !== undefined && (
                                <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">
                                  Asymmetry: {item.asymmetryPercent > 0 ? `+${item.asymmetryPercent}% (R)` : `${item.asymmetryPercent}% (L)`}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Coach Note field for this test */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add specific testing notes, wind, or technique remarks..."
                            value={entry.coachNotes}
                            onChange={(e) =>
                              setTestEntries((prev) => ({
                                ...prev,
                                [item.testId]: { ...prev[item.testId], coachNotes: e.target.value },
                              }))
                            }
                            className="w-full text-xs px-2.5 py-1 text-slate-600 bg-transparent border-0 border-b border-dashed border-slate-200 focus:ring-0 focus:border-amber-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Coach General Comments */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-500" />
            General Coach Assessment Observations & Prescriptions
          </label>
          <textarea
            rows={3}
            placeholder="Document overall athlete condition, block cycle goals, readiness for upcoming competitions..."
            value={coachGeneralComments}
            onChange={(e) => setCoachGeneralComments(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}
