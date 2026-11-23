'use client';

import React, { useState, useEffect } from 'react';
import { AthleteProfile, calculateAge } from '@/types/athlete';
import { FitnessCategory, FITNESS_CATEGORIES_INFO, TestDefinition, TestingBattery } from '@/types/fitness';
import { Assessment, TestResultEntry } from '@/types/assessment';
import { EvaluationStandard, EVALUATION_STANDARDS_INFO } from '@/types/benchmark';
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
  Search,
  Check,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  Filter,
  Award,
} from 'lucide-react';

interface CoachTestingEntryProps {
  athletes: AthleteProfile[];
  initialAthleteId?: string;
  coachName?: string;
  onSaveAssessment: (assessment: Assessment) => void;
  onClose?: () => void;
  onOpenReport?: (assessment: Assessment) => void;
  isModal?: boolean;
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
  coachName,
  onSaveAssessment,
  onClose,
  onOpenReport,
  isModal,
}: CoachTestingEntryProps) {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(
    initialAthleteId || athletes[0]?.id || ''
  );
  const [testingDate, setTestingDate] = useState<string>('2026-11-22');
  const [batteries, setBatteries] = useState<TestingBattery[]>([]);
  const [selectedBatteryId, setSelectedBatteryId] = useState<string>('');
  const [testDefinitions, setTestDefinitions] = useState<TestDefinition[]>([]);
  
  // Dynamic user selection: starts completely BLANK as requested
  const [selectedTestIds, setSelectedTestIds] = useState<Set<string>>(new Set());
  const [testEntries, setTestEntries] = useState<Record<string, TestEntryState>>({});
  
  // Event Picker controls
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    speed: true,
    acceleration: true,
    explosive_power: true,
    strength: true,
    agility: true,
    flexibility: true,
    mobility: true,
    coordination: true,
    endurance: true,
    balance: true,
  });
  const [evaluationStandard, setEvaluationStandard] = useState<EvaluationStandard>('indian_national');
  const [coachGeneralComments, setCoachGeneralComments] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  // Load batteries and test definitions from database
  useEffect(() => {
    setTestingDate(new Date().toISOString().split('T')[0]);
    const bList = db.getTestingBatteries();
    setBatteries(bList);
    const tDefs = db.getTestDefinitions();
    setTestDefinitions(tDefs);
    // Note: Starts with an empty selection (blank form) per user request
  }, []);

  const selectedAthlete = athletes.find((a) => a.id === selectedAthleteId);
  const athleteAge = selectedAthlete ? calculateAge(selectedAthlete.dateOfBirth, testingDate) : 20;

  // Toggle category collapse in the testing form
  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Helper to ensure testEntry exists
  const ensureEntryExists = (testId: string, currentEntries: Record<string, TestEntryState>): TestEntryState => {
    if (currentEntries[testId]) return currentEntries[testId];
    const t = testDefinitions.find((def) => def.id === testId);
    if (!t) {
      throw new Error(`Test definition not found: ${testId}`);
    }
    return {
      test: t,
      attempts: Array(t.permittedAttempts).fill(''),
      isBilateral: t.isBilateral,
      leftAttempts: t.isBilateral ? Array(t.permittedAttempts).fill('') : [],
      rightAttempts: t.isBilateral ? Array(t.permittedAttempts).fill('') : [],
      coachNotes: '',
    };
  };

  // Toggle single test on or off
  const handleToggleTest = (testId: string) => {
    setSelectedTestIds((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
        // Ensure test entry is initialized
        setTestEntries((prevEntries) => {
          if (prevEntries[testId]) return prevEntries;
          return {
            ...prevEntries,
            [testId]: ensureEntryExists(testId, prevEntries),
          };
        });

        // Ensure category is expanded so coach sees it immediately
        const t = testDefinitions.find((def) => def.id === testId);
        if (t) {
          setExpandedCategories((prevExp) => ({ ...prevExp, [t.category]: true }));
        }
      }
      return next;
    });
  };

  // Remove test directly from form card
  const handleRemoveTest = (testId: string) => {
    setSelectedTestIds((prev) => {
      const next = new Set(prev);
      next.delete(testId);
      return next;
    });
  };

  // Clear all selected tests (back to blank form)
  const handleClearAll = () => {
    setSelectedTestIds(new Set());
    setSelectedBatteryId('');
    setNotification({ type: 'warning', message: 'Testing sheet cleared to blank state.' });
  };

  // Select all available tests
  const handleSelectAll = () => {
    const allIds = new Set(testDefinitions.map((t) => t.id));
    setSelectedTestIds(allIds);
    setTestEntries((prevEntries) => {
      const updated = { ...prevEntries };
      for (const t of testDefinitions) {
        if (!updated[t.id]) {
          updated[t.id] = {
            test: t,
            attempts: Array(t.permittedAttempts).fill(''),
            isBilateral: t.isBilateral,
            leftAttempts: t.isBilateral ? Array(t.permittedAttempts).fill('') : [],
            rightAttempts: t.isBilateral ? Array(t.permittedAttempts).fill('') : [],
            coachNotes: '',
          };
        }
      }
      return updated;
    });
    setNotification({ type: 'success', message: `All ${testDefinitions.length} events loaded into form.` });
  };

  // Apply a preset testing battery
  const handleApplyPreset = (batteryId: string) => {
    const battery = batteries.find((b) => b.id === batteryId);
    if (!battery) return;
    setSelectedBatteryId(battery.id);
    const nextIds = new Set(battery.testIds);
    setSelectedTestIds(nextIds);

    setTestEntries((prevEntries) => {
      const updated = { ...prevEntries };
      for (const testId of battery.testIds) {
        if (!updated[testId]) {
          const t = testDefinitions.find((def) => def.id === testId);
          if (t) {
            updated[t.id] = {
              test: t,
              attempts: Array(t.permittedAttempts).fill(''),
              isBilateral: t.isBilateral,
              leftAttempts: t.isBilateral ? Array(t.permittedAttempts).fill('') : [],
              rightAttempts: t.isBilateral ? Array(t.permittedAttempts).fill('') : [],
              coachNotes: '',
            };
          }
        }
      }
      return updated;
    });

    setNotification({
      type: 'success',
      message: `Loaded ${battery.name} (${battery.testIds.length} tests).`,
    });
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
      const validLeft = entry.leftAttempts
        .map((s) => s.trim())
        .filter((s) => s !== '' && !isNaN(Number(s)))
        .map(Number);
      const validRight = entry.rightAttempts
        .map((s) => s.trim())
        .filter((s) => s !== '' && !isNaN(Number(s)))
        .map(Number);
      if (validLeft.length === 0 && validRight.length === 0) return undefined;
      const bestLeft = validLeft.length > 0 ? (test.measurementDirection === 'lower_is_better' ? Math.min(...validLeft) : Math.max(...validLeft)) : undefined;
      const bestRight = validRight.length > 0 ? (test.measurementDirection === 'lower_is_better' ? Math.min(...validRight) : Math.max(...validRight)) : undefined;
      if (bestLeft !== undefined && bestRight !== undefined) {
        return Math.round(((bestLeft + bestRight) / 2) * 100) / 100;
      }
      return bestRight ?? bestLeft;
    } else {
      const validAttempts = entry.attempts
        .map((s) => s.trim())
        .filter((s) => s !== '' && !isNaN(Number(s)))
        .map(Number);
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

  // Scoring configuration must be retrieved before computing test benchmarks
  const scoringConfig = db.getScoringConfig();

  // Compute live test results ONLY for currently selected tests
  const evaluatedResults: TestResultEntry[] = Array.from(selectedTestIds)
    .map((testId) => testEntries[testId])
    .filter((entry): entry is TestEntryState => Boolean(entry))
    .map((entry) => {
      const rawVal = computeRawValue(entry);
      const normDataset = db.getNormDatasetForTest(entry.test.code);

      const normEval = evaluateTestBenchmark(
        rawVal,
        normDataset,
        athleteAge,
        selectedAthlete?.sex ?? 'male',
        scoringConfig,
        evaluationStandard
      );

      let leftResult: number | undefined;
      let rightResult: number | undefined;
      let asymmetryPercent: number | undefined;
      let dominantSideAdvantage: 'left' | 'right' | 'symmetric' | undefined;

      if (entry.test.isBilateral) {
        const validLeft = entry.leftAttempts
          .map((s) => s.trim())
          .filter((s) => s !== '' && !isNaN(Number(s)))
          .map(Number);
        const validRight = entry.rightAttempts
          .map((s) => s.trim())
          .filter((s) => s !== '' && !isNaN(Number(s)))
          .map(Number);
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
        evaluationStandard,
        percentile: normEval.percentile,
        rating: normEval.rating,
        isMissing: rawVal === undefined,
        isExcludedFromOverall: normEval.status === 'none',
        coachNotes: entry.coachNotes,
        limitationNote: normEval.limitations,
      };
    });

  // Calculate overall category scores & score dynamically
  const fitnessScoreCalc = calculateFitnessScores(evaluatedResults, scoringConfig);

  // Group tests by category - ONLY categories that have at least one test selected!
  const categoriesPresent = Array.from(
    new Set(evaluatedResults.map((r) => r.category))
  ) as FitnessCategory[];

  // Filter available test definitions in event picker
  const filteredAvailableTests = testDefinitions.filter((t) => {
    const matchCat = selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
    const matchSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Build finalized Assessment object
  const buildAssessmentRecord = (status: 'draft' | 'validated' | 'finalized'): Assessment => {
    const batteryObj = batteries.find((b) => b.id === selectedBatteryId);
    const batteryName = batteryObj
      ? batteryObj.name
      : `Custom Testing Session (${selectedTestIds.size} Events)`;

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
      batteryId: selectedBatteryId || 'battery-custom-session',
      batteryName,
      coachId: 'coach-lead',
      coachName: coachName || (typeof window !== 'undefined' ? localStorage.getItem('athletics_active_coach') || 'Lead Coach' : 'Lead Coach'),
      assessmentDate: testingDate,
      status,
      evaluationStandard,
      testResults: evaluatedResults,
      categoryScores: fitnessScoreCalc.categoryScores,
      overallFitnessScore: fitnessScoreCalc.overallFitnessScore,
      overallRating: fitnessScoreCalc.overallRating,
      coveragePercentage: fitnessScoreCalc.coveragePercentage,
      meetsMinimumCoverage: fitnessScoreCalc.meetsMinimumCoverage,
      topStrengths: fitnessScoreCalc.topStrengths,
      areasToImprove: fitnessScoreCalc.areasToImprove,
      bilateralAsymmetries: evaluatedResults
        .filter((r) => r.isBilateral && r.asymmetryPercent !== undefined && r.leftResult !== undefined && r.rightResult !== undefined)
        .map((r) => ({
          testName: r.testName,
          asymmetryPercent: r.asymmetryPercent!,
          description: `${Math.abs(r.asymmetryPercent!).toFixed(1)}% variance favoring ${r.dominantSideAdvantage} side.`,
          leftValue: r.leftResult,
          rightValue: r.rightResult,
          unit: r.unit,
        })),
      revision: 1,
      scoringConfigVersion: scoringConfig.name,
      coachGeneralComments,
      finalizedAt: status === 'finalized' ? new Date().toISOString() : undefined,
      finalizedByCoachId: status === 'finalized' ? 'coach-rudra-roy' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSaveDraft = () => {
    if (selectedTestIds.size === 0) {
      setNotification({ type: 'warning', message: 'Please select at least one event/test before saving.' });
      return;
    }
    const record = buildAssessmentRecord('draft');
    db.saveAssessment(record);
    onSaveAssessment(record);
    setNotification({ type: 'warning', message: 'Draft assessment saved successfully. Ready for further testing.' });
  };

  const handleFinalize = () => {
    if (selectedTestIds.size === 0) {
      setNotification({ type: 'error', message: 'Please select and record at least one event/test before finalizing.' });
      return;
    }
    const record = buildAssessmentRecord('finalized');
    db.saveAssessment(record);
    onSaveAssessment(record);
    setNotification({
      type: 'success',
      message: 'Official Athletics Assessment FINALIZED! Score locked. Official reports can be viewed and downloaded in the A4 Reports Generator.',
    });
    if (onOpenReport) {
      setTimeout(() => onOpenReport(record), 800);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col w-full max-w-full min-w-0 ${isModal || onClose ? 'h-full max-h-full' : ''}`}>
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-5 border-b border-slate-800 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                  Fitness Diagnostics Form
                </h2>
                <span className="text-[9px] bg-red-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded border border-red-500/40">
                  Published Norms
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Select specific events/tests to assess • Automatic category routing & live percentile scoring
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Draft</span>
            </button>
            <button
              onClick={handleFinalize}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-950/40 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Finalize</span>
            </button>
            {onClose && (
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Athlete & Date Header Row */}
        <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* Select Athlete */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Athlete Profile
            </label>
            <select
              value={selectedAthleteId}
              onChange={(e) => setSelectedAthleteId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 sm:py-2 text-xs font-semibold text-white focus:outline-hidden focus:ring-2 focus:ring-red-500 truncate"
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
              <Calendar className="w-3 h-3 text-rose-400" /> Testing Date (Age: {athleteAge}y)
            </label>
            <input
              type="date"
              value={testingDate}
              onChange={(e) => setTestingDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 sm:py-2 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* COACH EVALUATION BENCHMARK STANDARD SELECTOR */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Select Evaluation Standard for Scoring & Percentiles
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Choose the performance cohort to calculate athlete percentiles, tier ratings, and overall fitness index:
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-amber-500/30 font-bold shrink-0 self-start sm:self-auto">
              Current: {EVALUATION_STANDARDS_INFO[evaluationStandard].flag} {EVALUATION_STANDARDS_INFO[evaluationStandard].shortLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {(['indian_national', 'world_athletics', 'olympic', 'standard'] as EvaluationStandard[]).map((stdKey) => {
              const std = EVALUATION_STANDARDS_INFO[stdKey];
              const isSelected = evaluationStandard === stdKey;
              return (
                <button
                  key={stdKey}
                  type="button"
                  onClick={() => setEvaluationStandard(stdKey)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/40'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-base">{std.flag}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected ? '✓ Active' : 'Select'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">
                    {std.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {std.cohort}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* EVENT & TEST SELECTION DECK */}
      <div className="bg-slate-900 border-b border-slate-800 text-white p-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-rose-400 border border-red-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Select Events & Tests To Run
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[11px]">
                  {selectedTestIds.size} Selected
                </span>
                {selectedTestIds.size === 0 && (
                  <span className="text-[11px] text-rose-400/80 italic">
                    (Form is currently blank — choose events below)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click any event to add it. It will automatically route into its specific category (e.g. 10m → Acceleration, 30m → Speed, Cooper → Endurance).
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons & Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => handleApplyPreset('battery-olympic-sprint-velocity')}
                className="text-[10px] font-semibold px-2 py-1 rounded hover:bg-slate-800 text-slate-300 transition whitespace-nowrap"
                title="Select 10m, 30m, Flying 10m, Wingate 30s, RSI, CMJ, Relative Squat 1RM"
              >
                ⚡ Sprint Preset
              </button>
              <button
                onClick={() => handleApplyPreset('battery-olympic-endurance-vo2max')}
                className="text-[10px] font-semibold px-2 py-1 rounded hover:bg-slate-800 text-slate-300 transition whitespace-nowrap"
                title="Select Cooper 12-Min, 6x400m Lactate, Yo-Yo IR2, CMJ, 20m Beep Test"
              >
                🏃 Distance Preset
              </button>
              <button
                onClick={() => handleApplyPreset('battery-olympic-jumps-power')}
                className="text-[10px] font-semibold px-2 py-1 rounded hover:bg-slate-800 text-slate-300 transition whitespace-nowrap"
                title="Select RSI Drop Jump, BOMST Medball, CMJ, Broad Jump, Triple Hop"
              >
                🚀 Jumps Preset
              </button>
              <button
                onClick={handleSelectAll}
                className="text-[10px] font-semibold px-2 py-1 rounded hover:bg-slate-800 text-rose-400 transition whitespace-nowrap"
              >
                Select All
              </button>
              <button
                onClick={handleClearAll}
                className="text-[10px] font-semibold px-2 py-1 rounded hover:bg-rose-950/60 text-rose-300 transition whitespace-nowrap"
              >
                Clear (Blank)
              </button>
            </div>

            <button
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              {isPickerOpen ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-rose-400" />
                  Hide Event Catalog
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-rose-400" />
                  Browse & Pick Events ({selectedTestIds.size})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Event Selection Grid */}
        {isPickerOpen && (
          <div className="mt-3 pt-2 space-y-3">
            {/* Search and Category Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events (e.g. 10m, 30m, cooper, lactate, squat, drop jump)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-[10px]">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All ({testDefinitions.length})
                </button>
                {(['acceleration', 'speed', 'explosive_power', 'strength', 'endurance', 'agility', 'flexibility', 'mobility'] as FitnessCategory[]).map(
                  (cat) => {
                    const info = FITNESS_CATEGORIES_INFO[cat];
                    const count = testDefinitions.filter((t) => t.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition ${
                          selectedCategoryFilter === cat
                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {info?.label ?? cat} ({count})
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Test Cards Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-950/70 rounded-xl border border-slate-800">
              {filteredAvailableTests.map((t) => {
                const isSelected = selectedTestIds.has(t.id);
                const catInfo = FITNESS_CATEGORIES_INFO[t.category];

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleToggleTest(t.id)}
                    className={`flex items-start justify-between gap-2 p-2.5 rounded-lg border text-left transition ${
                      isSelected
                        ? 'bg-red-500/15 border-red-500/80 text-white shadow-xs ring-1 ring-red-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-white truncate">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                          style={{
                            backgroundColor: `${catInfo?.color ?? '#eab308'}25`,
                            color: catInfo?.color ?? '#eab308',
                            border: `1px solid ${catInfo?.color ?? '#eab308'}50`,
                          }}
                        >
                          {catInfo?.label ?? t.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                          {t.unit}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? 'bg-red-600 border-red-500 text-slate-950'
                          : 'border-slate-700 bg-slate-950 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile / Quick Action Footer inside Picker */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>
                Showing {filteredAvailableTests.length} of {testDefinitions.length} events
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearAll}
                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold underline"
                >
                  Clear Selection (Blank Form)
                </button>
                <button
                  onClick={handleSelectAll}
                  className="text-rose-400 hover:text-rose-300 text-xs font-semibold underline"
                >
                  Select All Events
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Calculation Summary Bar */}
      <div className="bg-red-500/10 border-b border-red-500/20 px-3.5 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 sm:gap-4 shrink-0 w-full max-w-full min-w-0">
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
                <span className="text-sm font-semibold text-red-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Coverage {fitnessScoreCalc.coveragePercentage}% (Min {scoringConfig.minimumDataCoveragePercent}% req)
                </span>
              )}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div className="hidden sm:block">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Active Testing Protocol</div>
            <div className="text-sm font-bold text-slate-800">
              {selectedTestIds.size} event{selectedTestIds.size !== 1 ? 's' : ''} selected across {categoriesPresent.length} categor{categoriesPresent.length === 1 ? 'y' : 'ies'}
            </div>
          </div>
        </div>

        {notification && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white">
            {notification.message}
          </div>
        )}
      </div>

      {/* Main Testing Body */}
      <div className={`space-y-4 sm:space-y-6 w-full max-w-full min-w-0 ${isModal || onClose ? 'flex-1 min-h-0 overflow-y-auto p-3 sm:p-6' : 'p-3 sm:p-6 max-h-[65vh] overflow-y-auto'}`}>
        {/* BLANK FORM EMPTY STATE */}
        {selectedTestIds.size === 0 ? (
          <div className="py-12 px-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/70">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Testing Sheet is Blank</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              No physical tests have been selected yet. Select the events you want to test above. Each selected event will automatically route under its physiological category (e.g. 10m Sprint → Acceleration, 30m Sprint → Speed, Cooper 12-Min → Endurance).
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleApplyPreset('battery-olympic-sprint-velocity')}
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
              >
                ⚡ Load Olympic Sprint & Velocity (7 Tests)
              </button>
              <button
                onClick={() => handleApplyPreset('battery-olympic-endurance-vo2max')}
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
              >
                🏃 Load Olympic Endurance & VO2max (7 Tests)
              </button>
              <button
                onClick={() => handleApplyPreset('battery-olympic-jumps-power')}
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
              >
                🚀 Load Olympic Jumps & Power (7 Tests)
              </button>
              <button
                onClick={() => setIsPickerOpen(true)}
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-950/40 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 inline mr-1" />
                Browse All Events
              </button>
            </div>
          </div>
        ) : (
          /* AUTOMATICALLY CATEGORIZED SELECTED TESTS */
          categoriesPresent.map((category) => {
            const catInfo = FITNESS_CATEGORIES_INFO[category as FitnessCategory];
            const testsInCat = evaluatedResults.filter((r) => r.category === category);
            const isExpanded = expandedCategories[category] ?? true;
            const catScore = fitnessScoreCalc.categoryScores[category as FitnessCategory];

            return (
              <div
                key={category}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-xs"
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
                        <span className="font-semibold text-slate-800">{testsInCat.length} event{testsInCat.length > 1 ? 's' : ''}</span> selected in this category
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

                {/* Tests in Category */}
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
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTest(item.testId)}
                                  className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-0.5 ml-1 transition"
                                  title="Remove from session"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span className="hidden sm:inline">Remove</span>
                                </button>
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
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                                  <span>{EVALUATION_STANDARDS_INFO[evaluationStandard].flag}</span>
                                  <span>{EVALUATION_STANDARDS_INFO[evaluationStandard].shortLabel}</span>
                                </span>
                              </div>
                            </div>

                            {/* Data Entry Fields - Fully Responsive */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full lg:w-auto min-w-0">
                              {/* Bilateral Inputs */}
                              {entry.isBilateral ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200 w-full sm:w-auto overflow-hidden">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                                      Left Limb ({item.unit})
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
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
                                          className="w-13 sm:w-16 px-1.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded text-center focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="hidden sm:block h-7 w-px bg-slate-300" />
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                                      Right Limb ({item.unit})
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
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
                                          className="w-13 sm:w-16 px-1.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded text-center focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* Standard Multiple Attempts */
                                <div className="w-full sm:w-auto min-w-0">
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                                    Attempts ({entry.test.permittedAttempts} allowed) - {entry.test.resultAggregation.toUpperCase()}
                                  </label>
                                  <div className="flex flex-wrap gap-1.5">
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
                                        className="w-14 sm:w-16 px-1.5 sm:px-2 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded text-center focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Live Result Display */}
                              <div className="w-full sm:w-auto min-w-0 sm:min-w-[120px] p-2 bg-slate-50 rounded-lg border border-slate-200 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start shrink-0">
                                <div>
                                  <div className="text-[9px] text-slate-500 font-bold uppercase">
                                    Result:
                                  </div>
                                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                                    {item.finalRawValue !== undefined ? `${item.finalRawValue} ${item.unit}` : '—'}
                                  </div>
                                </div>
                                <div className="text-right sm:mt-1">
                                  {item.percentile !== undefined && (
                                    <div className="flex flex-col items-end">
                                      <div className="text-xs font-black text-red-600 leading-tight">
                                        {item.percentile.toFixed(1)}th %ile
                                      </div>
                                      <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                                        <span>{EVALUATION_STANDARDS_INFO[evaluationStandard].flag}</span>
                                        <span>{item.rating}</span>
                                      </div>
                                    </div>
                                  )}
                                  {item.asymmetryPercent !== undefined && (
                                    <div className="text-[9px] text-indigo-700 font-semibold mt-0.5">
                                      Asym: {item.asymmetryPercent > 0 ? `+${item.asymmetryPercent}% R` : `${item.asymmetryPercent}% L`}
                                    </div>
                                  )}
                                </div>
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
                              className="w-full text-xs px-2.5 py-1 text-slate-600 bg-transparent border-0 border-b border-dashed border-slate-200 focus:ring-0 focus:border-red-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Coach General Comments */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-rose-500" />
            General Coach Assessment Observations & Prescriptions
          </label>
          <textarea
            rows={3}
            placeholder="Document overall athlete condition, block cycle goals, readiness for upcoming competitions..."
            value={coachGeneralComments}
            onChange={(e) => setCoachGeneralComments(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}
