'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AthleteProfile, calculateAge } from '@/types/athlete';
import { TestDefinition, FitnessCategory, FITNESS_CATEGORIES_INFO } from '@/types/fitness';
import { Assessment, TestResultEntry } from '@/types/assessment';
import { evaluateTestBenchmark } from '@/lib/scoring/benchmark-engine';
import { calculateFitnessScores } from '@/lib/scoring/fitness-scoring';
import { db } from '@/lib/storage/local-storage-db';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  CheckCircle2,
  Save,
  Layers,
  Search,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Users,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  RefreshCw,
  Trophy,
  SlidersHorizontal,
  X,
  UserMinus,
} from 'lucide-react';

interface SquadBatchTestingMatrixProps {
  athletes: AthleteProfile[];
  coachName?: string;
  onSaveBatchAssessments: (assessments: Assessment[]) => void;
  onOpenCombinedReport?: (includedAthleteIds?: string[]) => void;
  onSwitchToIndividual?: (athleteId?: string) => void;
}

export function SquadBatchTestingMatrix({
  athletes,
  coachName,
  onSaveBatchAssessments,
  onOpenCombinedReport,
  onSwitchToIndividual,
}: SquadBatchTestingMatrixProps) {
  const [testingDate, setTestingDate] = useState<string>('2026-11-22');
  const [testDefinitions, setTestDefinitions] = useState<TestDefinition[]>([]);

  useEffect(() => {
    setTestingDate(new Date().toISOString().split('T')[0]);
  }, []);
  
  // Default selected trial events: 5 classic high-performance events
  const [selectedTestIds, setSelectedTestIds] = useState<Set<string>>(
    new Set([
      'test-sprint-10m',
      'test-sprint-30m',
      'test-cooper-12min',
      'test-cmj',
      'test-handgrip',
    ])
  );

  // Matrix results: matrixValues[athleteId][testId] = string
  const [matrixValues, setMatrixValues] = useState<Record<string, Record<string, string>>>({});
  const [athleteComments, setAthleteComments] = useState<Record<string, string>>({});
  const [selectedSquad, setSelectedSquad] = useState<string>('all');
  const [searchAthlete, setSearchAthlete] = useState<string>('');
  const [isEventSelectorOpen, setIsEventSelectorOpen] = useState<boolean>(false);
  const [eventSearchQuery, setEventSearchQuery] = useState<string>('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  // Excluded athletes from current trial session
  const [excludedAthleteIds, setExcludedAthleteIds] = useState<Set<string>>(new Set());
  const [athleteToExclude, setAthleteToExclude] = useState<AthleteProfile | null>(null);

  // Load test definitions and initialize matrix values from latest assessments
  useEffect(() => {
    const tDefs = db.getTestDefinitions();
    setTestDefinitions(tDefs);

    // Pre-populate matrix with latest values from existing assessments
    const initialMatrix: Record<string, Record<string, string>> = {};
    for (const ath of athletes) {
      initialMatrix[ath.id] = {};
      const latestAss = db.getAssessmentsForAthlete(ath.id)[0];
      if (latestAss && latestAss.testResults) {
        for (const tr of latestAss.testResults) {
          if (!tr.isMissing && tr.finalRawValue !== undefined) {
            initialMatrix[ath.id][tr.testId] = String(tr.finalRawValue);
          }
        }
      }
    }
    setMatrixValues(initialMatrix);
  }, [athletes]);

  // Squads list
  const squads = useMemo(() => {
    const set = new Set<string>();
    athletes.forEach((a) => {
      if (a.trainingSquad) set.add(a.trainingSquad);
    });
    return Array.from(set);
  }, [athletes]);

  // Filtered athletes based on squad & search query
  const filteredAthletes = useMemo(() => {
    return athletes.filter((a) => {
      const matchSquad = selectedSquad === 'all' || a.trainingSquad === selectedSquad;
      const matchSearch =
        a.fullName.toLowerCase().includes(searchAthlete.toLowerCase()) ||
        a.athleteCode.toLowerCase().includes(searchAthlete.toLowerCase()) ||
        a.primaryEventName.toLowerCase().includes(searchAthlete.toLowerCase());
      return matchSquad && matchSearch;
    });
  }, [athletes, selectedSquad, searchAthlete]);

  // Active athletes participating in this batch trial session (excluding manual exclusions)
  const activeTrialAthletes = useMemo(() => {
    return filteredAthletes.filter((a) => !excludedAthleteIds.has(a.id));
  }, [filteredAthletes, excludedAthleteIds]);

  // Excluded athletes list for quick restoration
  const excludedAthletesList = useMemo(() => {
    return athletes.filter((a) => excludedAthleteIds.has(a.id));
  }, [athletes, excludedAthleteIds]);

  const handleConfirmExclusion = () => {
    if (!athleteToExclude) return;
    setExcludedAthleteIds((prev) => new Set(prev).add(athleteToExclude.id));
    setNotification({
      type: 'warning',
      message: `${athleteToExclude.fullName} (${athleteToExclude.athleteCode}) excluded from trial session.`,
    });
    setAthleteToExclude(null);
  };

  const handleRestoreAthlete = (athleteId: string) => {
    setExcludedAthleteIds((prev) => {
      const next = new Set(prev);
      next.delete(athleteId);
      return next;
    });
    const ath = athletes.find((a) => a.id === athleteId);
    if (ath) {
      setNotification({
        type: 'success',
        message: `${ath.fullName} restored to trial session matrix.`,
      });
    }
  };

  const handleRestoreAllAthletes = () => {
    setExcludedAthleteIds(new Set());
    setNotification({
      type: 'success',
      message: 'All excluded athletes restored to trial session.',
    });
  };

  // Selected test objects in order
  const selectedTests = useMemo(() => {
    return Array.from(selectedTestIds)
      .map((id) => testDefinitions.find((t) => t.id === id))
      .filter((t): t is TestDefinition => Boolean(t));
  }, [selectedTestIds, testDefinitions]);

  // Filtered available tests for event picker
  const filteredAvailableTests = useMemo(() => {
    return testDefinitions.filter((t) => {
      const matchCat = eventCategoryFilter === 'all' || t.category === eventCategoryFilter;
      const matchSearch =
        t.name.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(eventSearchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [testDefinitions, eventCategoryFilter, eventSearchQuery]);

  // Handle cell value change
  const handleCellChange = (athleteId: string, testId: string, val: string) => {
    setMatrixValues((prev) => ({
      ...prev,
      [athleteId]: {
        ...(prev[athleteId] || {}),
        [testId]: val,
      },
    }));
  };

  // Toggle test in selection
  const handleToggleTest = (testId: string) => {
    setSelectedTestIds((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
      }
      return next;
    });
  };

  // Remove test column
  const handleRemoveTestColumn = (testId: string) => {
    setSelectedTestIds((prev) => {
      const next = new Set(prev);
      next.delete(testId);
      return next;
    });
  };

  // Preset loaders
  const handleApplyPreset = (testIds: string[], name: string) => {
    setSelectedTestIds(new Set(testIds));
    setNotification({ type: 'success', message: `Loaded ${name} (${testIds.length} events)` });
  };

  // Evaluate cell performance
  const evaluateCell = (athlete: AthleteProfile, test: TestDefinition, rawValStr?: string) => {
    if (!rawValStr || rawValStr.trim() === '') return null;
    const val = parseFloat(rawValStr);
    if (isNaN(val) || val <= 0) return null;

    const normDataset = db.getNormDatasetForTest(test.code);
    const age = calculateAge(athlete.dateOfBirth, testingDate);
    const evalRes = evaluateTestBenchmark(val, normDataset, age, athlete.sex);

    return {
      rawValue: val,
      percentile: evalRes.percentile,
      rating: evalRes.rating,
      status: evalRes.status,
      sourceCitation: evalRes.sourceCitation,
      sourceId: evalRes.benchmarkSourceId,
    };
  };

  // Build assessment record for an athlete
  const buildAssessmentForAthlete = (
    athlete: AthleteProfile,
    status: 'draft' | 'finalized'
  ): Assessment => {
    const athleteVals = matrixValues[athlete.id] || {};
    const age = calculateAge(athlete.dateOfBirth, testingDate);

    const testResults: TestResultEntry[] = selectedTests.map((t) => {
      const rawStr = athleteVals[t.id];
      const cellEval = evaluateCell(athlete, t, rawStr);

      return {
        testId: t.id,
        testCode: t.code,
        testName: t.name,
        category: t.category,
        unit: t.unit,
        measurementDirection: t.measurementDirection,
        attempts: cellEval ? [cellEval.rawValue] : [],
        isBilateral: false,
        finalRawValue: cellEval ? cellEval.rawValue : undefined,
        benchmarkStatus: cellEval?.status ?? 'none',
        benchmarkSourceId: cellEval?.sourceId,
        benchmarkSourceTitle: cellEval?.sourceCitation,
        percentile: cellEval?.percentile,
        rating: cellEval?.rating,
        isMissing: !cellEval,
        isExcludedFromOverall: cellEval?.status === 'none',
        coachNotes: '',
      };
    });

    const scoringConfig = db.getScoringConfig();
    const fitnessScores = calculateFitnessScores(testResults, scoringConfig);

    return {
      id: `ass-${athlete.id}-${testingDate}-${Date.now().toString().slice(-4)}`,
      organizationId: athlete.organizationId,
      athleteId: athlete.id,
      athleteCode: athlete.athleteCode,
      athleteName: athlete.fullName,
      athleteAge: age,
      sex: athlete.sex,
      eventGroup: athlete.eventGroup,
      primaryEvent: athlete.primaryEventName,
      batteryId: 'battery-squad-matrix-session',
      batteryName: `Squad Trial Session (${selectedTests.length} Events)`,
      coachId: 'coach-lead',
      coachName: coachName || (typeof window !== 'undefined' ? localStorage.getItem('athletics_active_coach') || 'Lead Coach' : 'Lead Coach'),
      assessmentDate: testingDate,
      status,
      testResults,
      categoryScores: fitnessScores.categoryScores,
      overallFitnessScore: fitnessScores.overallFitnessScore,
      overallRating: fitnessScores.overallRating,
      coveragePercentage: fitnessScores.coveragePercentage,
      meetsMinimumCoverage: fitnessScores.meetsMinimumCoverage,
      topStrengths: fitnessScores.topStrengths,
      areasToImprove: fitnessScores.areasToImprove,
      bilateralAsymmetries: [],
      revision: 1,
      scoringConfigVersion: scoringConfig.name,
      coachGeneralComments: athleteComments[athlete.id] || 'Squad batch trial protocol session.',
      finalizedAt: status === 'finalized' ? new Date().toISOString() : undefined,
      finalizedByCoachId: status === 'finalized' ? 'coach-rudra-roy' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Save all active trial athletes as draft
  const handleSaveAllDrafts = () => {
    if (selectedTests.length === 0) {
      setNotification({ type: 'warning', message: 'Please select at least one event column.' });
      return;
    }
    if (activeTrialAthletes.length === 0) {
      setNotification({ type: 'warning', message: 'No active athletes in this trial session to save.' });
      return;
    }

    const saved: Assessment[] = [];
    for (const ath of activeTrialAthletes) {
      const ass = buildAssessmentForAthlete(ath, 'draft');
      db.saveAssessment(ass);
      saved.push(ass);
    }
    onSaveBatchAssessments(saved);
    setNotification({
      type: 'warning',
      message: `Saved draft trial assessments for ${saved.length} active squad athletes!`,
    });
  };

  // Save and finalize all active trial assessments
  const handleSaveAllReports = () => {
    if (selectedTests.length === 0) {
      setNotification({ type: 'warning', message: 'Please select at least one event column.' });
      return;
    }
    if (activeTrialAthletes.length === 0) {
      setNotification({ type: 'warning', message: 'No active athletes in this trial session to save.' });
      return;
    }

    const finalizedList: Assessment[] = [];
    for (const ath of activeTrialAthletes) {
      const ass = buildAssessmentForAthlete(ath, 'finalized');
      db.saveAssessment(ass);
      finalizedList.push(ass);
    }

    onSaveBatchAssessments(finalizedList);
    setNotification({
      type: 'success',
      message: `All reports saved successfully for ${finalizedList.length} trial athletes! You can download official PDF reports in the A4 Reports Generator.`,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black shadow-md shadow-red-950/40">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Squad Batch Testing Matrix
                </h2>
                <span className="text-[10px] bg-red-950/40 text-rose-300 font-bold px-2 py-0.5 rounded border border-red-500/40">
                  Trackside Multi-Athlete Entry
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                  Active: {activeTrialAthletes.length}/{athletes.length}
                </span>
                {excludedAthleteIds.size > 0 && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded border border-rose-500/30">
                    {excludedAthleteIds.size} excluded
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Enter trial results for all squad athletes together in one grid • Real-time norm calculation & batch report saving
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveAllDrafts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save All Drafts
            </button>
            <button
              type="button"
              onClick={handleSaveAllReports}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white transition shadow-md shadow-red-950/50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save All Reports
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Testing Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-rose-500" /> Trial Session Date
            </label>
            <input
              type="date"
              value={testingDate}
              onChange={(e) => setTestingDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Squad Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="w-3 h-3 text-rose-500" /> Squad Filter
            </label>
            <select
              value={selectedSquad}
              onChange={(e) => setSelectedSquad(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-red-500"
            >
              <option value="all">All Squads ({athletes.length} Athletes)</option>
              {squads.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Athlete Search */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Search className="w-3 h-3 text-rose-500" /> Search Athletes
            </label>
            <input
              type="text"
              placeholder="Search by name, code or event..."
              value={searchAthlete}
              onChange={(e) => setSearchAthlete(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* EVENT COLUMNS CONFIGURATION BAR */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Trial Event Columns:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[11px]">
              {selectedTests.length} Events Selected
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (These appear as top columns in the matrix)
            </span>
          </div>

          {/* Quick Trial Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleApplyPreset(
                  ['test-sprint-10m', 'test-sprint-30m', 'test-flying-10m-max-vel', 'test-cmj'],
                  'Olympic Sprint Trials'
                )
              }
              className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              ⚡ Sprint Trials (4)
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset(
                  ['test-cooper-12min', 'test-lactate-tolerance-6x400', 'test-yoyo-ir2', 'test-shuttle-20m'],
                  'Distance & VO2max Trials'
                )
              }
              className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              🏃 Distance Trials (4)
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset(
                  ['test-reactive-strength-index', 'test-bomst-overhead-medball', 'test-cmj', 'test-slj'],
                  'Jumps & Power Trials'
                )
              }
              className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              🚀 Jumps & Power (4)
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset(
                  [
                    'test-sprint-10m',
                    'test-sprint-30m',
                    'test-cmj',
                    'test-slj',
                    'test-handgrip',
                    'test-sit-and-reach',
                    'test-cooper-12min',
                  ],
                  'Standard 7-Event Combine'
                )
              }
              className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm transition"
            >
              📋 Standard Combine (7)
            </button>
            <button
              type="button"
              onClick={() => setIsEventSelectorOpen(!isEventSelectorOpen)}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition"
            >
              <SlidersHorizontal className="w-3 h-3" />
              {isEventSelectorOpen ? 'Close Event Picker' : 'Customize Events'}
            </button>
          </div>
        </div>

        {/* Collapsible Event Picker Grid */}
        {isEventSelectorOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter events (e.g. 10m, 30m, cooper, lactate, squat)..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                <button
                  type="button"
                  onClick={() => setEventCategoryFilter('all')}
                  className={`px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                    eventCategoryFilter === 'all'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  All ({testDefinitions.length})
                </button>
                {(['acceleration', 'speed', 'explosive_power', 'strength', 'endurance', 'agility'] as FitnessCategory[]).map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEventCategoryFilter(c)}
                      className={`px-2 py-0.5 rounded font-bold whitespace-nowrap capitalize ${
                        eventCategoryFilter === c
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Event checkboxes grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
              {filteredAvailableTests.map((t) => {
                const isSelected = selectedTestIds.has(t.id);
                const catInfo = FITNESS_CATEGORIES_INFO[t.category];

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleToggleTest(t.id)}
                    className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-left transition ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs truncate">{t.name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className="text-[9px] font-bold px-1 rounded uppercase"
                          style={{
                            color: catInfo?.color ?? '#f43f5e',
                            backgroundColor: `${catInfo?.color ?? '#f43f5e'}20`,
                          }}
                        >
                          {catInfo?.label ?? t.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {t.unit}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'border-slate-700 bg-slate-950 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-white hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Excluded Athletes Restore Banner */}
      {excludedAthleteIds.size > 0 && (
        <div className="bg-amber-950/20 border-b border-amber-900/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-200">
            <UserMinus className="w-4 h-4 text-amber-400" />
            <span>
              <strong>{excludedAthleteIds.size} athlete{excludedAthleteIds.size > 1 ? 's' : ''} excluded</strong> from this trial session:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 ml-1">
              {excludedAthletesList.map((ath) => (
                <span
                  key={ath.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
                >
                  {ath.fullName}
                  <button
                    type="button"
                    onClick={() => handleRestoreAthlete(ath.id)}
                    className="hover:text-emerald-400 font-bold ml-0.5 text-slate-400"
                    title={`Restore ${ath.fullName} to trial`}
                  >
                    +
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRestoreAllAthletes}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
          >
            Restore All
          </button>
        </div>
      )}

      {/* THE SPREADSHEET MATRIX TABLE */}
      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          {/* Header Row: Top Columns */}
          <thead className="bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider sticky top-0 z-20 shadow-xs border-b border-slate-200">
            <tr>
              {/* Athlete Column (Sticky Left) */}
              <th className="py-3 px-4 sticky left-0 z-30 bg-slate-100 min-w-[220px] border-r border-slate-200">
                Squad Athlete
              </th>

              {/* Event Columns */}
              {selectedTests.map((t) => {
                const catInfo = FITNESS_CATEGORIES_INFO[t.category];
                return (
                  <th key={t.id} className="py-2.5 px-3 min-w-[150px] border-r border-slate-200 bg-white">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="text-xs font-black text-slate-900 truncate" title={t.name}>
                          {t.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 font-normal">
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase"
                            style={{
                              color: catInfo?.color ?? '#eab308',
                              backgroundColor: `${catInfo?.color ?? '#eab308'}15`,
                              border: `1px solid ${catInfo?.color ?? '#eab308'}40`,
                            }}
                          >
                            {catInfo?.label ?? t.category}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 font-semibold bg-slate-100 px-1 rounded">
                            {t.unit}
                          </span>
                        </div>
                      </div>

                      {/* Remove column button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveTestColumn(t.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                        title="Remove event column"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </th>
                );
              })}

              {/* Summary Columns */}
              <th className="py-3 px-3 text-center min-w-[120px] bg-slate-100 border-r border-slate-200">
                Overall Score
              </th>
              <th className="py-3 px-3 text-center min-w-[100px] bg-slate-100">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body Rows: Each Athlete */}
          <tbody className="divide-y divide-slate-200 text-xs bg-white">
            {activeTrialAthletes.map((ath, rowIndex) => {
              const athVals = matrixValues[ath.id] || {};
              const age = calculateAge(ath.dateOfBirth, testingDate);

              // Calculate row athlete fitness score live
              const rowTestResults: TestResultEntry[] = selectedTests.map((t) => {
                const cellEval = evaluateCell(ath, t, athVals[t.id]);
                return {
                  testId: t.id,
                  testCode: t.code,
                  testName: t.name,
                  category: t.category,
                  unit: t.unit,
                  measurementDirection: t.measurementDirection,
                  attempts: cellEval ? [cellEval.rawValue] : [],
                  isBilateral: false,
                  finalRawValue: cellEval ? cellEval.rawValue : undefined,
                  benchmarkStatus: cellEval?.status ?? 'none',
                  percentile: cellEval?.percentile,
                  rating: cellEval?.rating,
                  isMissing: !cellEval,
                  isExcludedFromOverall: cellEval?.status === 'none',
                };
              });

              const scoringConfig = db.getScoringConfig();
              const scoreCalc = calculateFitnessScores(rowTestResults, scoringConfig);
              const validCount = rowTestResults.filter((r) => !r.isMissing).length;

              return (
                <tr
                  key={ath.id}
                  className={`hover:bg-red-950/20 transition ${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                  }`}
                >
                  {/* Athlete Info (Sticky Left) */}
                  <td className="py-3 px-4 sticky left-0 z-10 bg-inherit border-r border-slate-200 font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAthleteToExclude(ath)}
                        className="w-5 h-5 rounded hover:bg-red-100 hover:text-red-700 text-slate-400 flex items-center justify-center transition shrink-0"
                        title={`Exclude ${ath.fullName} from trial session`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {ath.photoUrl ? (
                        <img
                          src={ath.photoUrl}
                          alt={ath.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-rose-500 font-bold flex items-center justify-center text-xs shrink-0 ring-1 ring-red-500/30">
                          {ath.fullName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{ath.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {ath.athleteCode} • {ath.primaryEventName} ({age}y {ath.sex === 'male' ? 'M' : 'F'})
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cell Inputs for Each Selected Event */}
                  {selectedTests.map((t) => {
                    const cellVal = athVals[t.id] || '';
                    const cellEval = evaluateCell(ath, t, cellVal);

                    return (
                      <td key={t.id} className="py-2 px-3 border-r border-slate-200 align-middle">
                        <div className="space-y-1">
                          <input
                            type="number"
                            step="0.01"
                            placeholder={`${t.unit}`}
                            value={cellVal}
                            onChange={(e) => handleCellChange(ath.id, t.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center shadow-2xs"
                          />

                          {/* Live Benchmark Evaluation Pill */}
                          <div className="h-4 flex items-center justify-center">
                            {cellEval && cellEval.percentile !== undefined ? (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                  cellEval.percentile >= 90
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : cellEval.percentile >= 75
                                    ? 'bg-teal-100 text-teal-800'
                                    : cellEval.percentile >= 50
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {cellEval.percentile.toFixed(0)}%ile • {cellEval.rating}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {t.measurementDirection === 'lower_is_better' ? '↓ lower' : '↑ higher'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}

                  {/* Athlete Overall Score Summary */}
                  <td className="py-3 px-3 text-center border-r border-slate-200 bg-slate-50/50">
                    {scoreCalc.overallFitnessScore !== undefined ? (
                      <div>
                        <div className="text-base font-black text-slate-900">
                          {scoreCalc.overallFitnessScore.toFixed(1)}
                        </div>
                        <Badge variant="red" size="sm">
                          {scoreCalc.overallRating}
                        </Badge>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[11px] text-slate-400 font-mono italic">
                          {validCount}/{selectedTests.length} tested
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Individual Actions */}
                  <td className="py-3 px-3 text-center">
                    {onSwitchToIndividual && (
                      <button
                        type="button"
                        onClick={() => onSwitchToIndividual(ath.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-bold underline"
                        title="Open individual testing view for detailed bilateral/attempt breakdown"
                      >
                        Single View
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Summary & Hero Finalize Button */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white">
        <div className="text-slate-400">
          Showing <span className="font-bold text-white">{activeTrialAthletes.length}</span> active athletes across{' '}
          <span className="font-bold text-white">{selectedTests.length}</span> trial events. Data auto-validates against peer-reviewed normative models.
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAllReports}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-black rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-950/50 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save All Reports
          </button>
        </div>
      </div>

      {/* Exclusion Confirmation Dialog */}
      {athleteToExclude && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
                <UserMinus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Exclude Athlete from Trial?</h3>
                <p className="text-xs text-slate-400">Confirmation Required</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to exclude <strong className="text-white font-semibold">{athleteToExclude.fullName}</strong> ({athleteToExclude.athleteCode}) from this trial session?
            </p>
            <p className="text-xs text-slate-400">
              Their row will be removed from this testing matrix and excluded from batch draft and final report saving. You can restore them anytime using the restore bar at the top of the matrix.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAthleteToExclude(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExclusion}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950/40 transition"
              >
                Confirm Exclusion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
