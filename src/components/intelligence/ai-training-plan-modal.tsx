'use client';

import React, { useState } from 'react';
import { AthleteProfile } from '@/types/athlete';
import { Assessment } from '@/types/assessment';
import { AiTrainingPlan } from '@/types/ai-training-plan';
import { db } from '@/lib/storage/local-storage-db';
import {
  Sparkles,
  Zap,
  Scale,
  Calendar,
  CheckCircle2,
  Copy,
  Printer,
  X,
  Dumbbell,
  Clock,
  Activity,
  AlertTriangle,
  Brain,
  Quote,
  Flame,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AiTrainingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete?: AthleteProfile;
  assessment?: Assessment;
  coachName?: string;
  onUpdateAssessmentCoachNotes?: (notes: string) => void;
}

export function AiTrainingPlanModal({
  isOpen,
  onClose,
  athlete,
  assessment,
  coachName,
  onUpdateAssessmentCoachNotes,
}: AiTrainingPlanModalProps) {
  // Safe resolution if athlete profile is optional
  const effectiveAthlete: AthleteProfile = athlete || {
    id: assessment?.athleteId || 'ath-generic',
    athleteCode: assessment?.athleteCode || 'ATH-001',
    organizationId: 'org-nahpc',
    fullName: assessment?.athleteName || 'Athlete',
    dateOfBirth: '2004-01-01',
    sex: 'male',
    club: 'National Athletics Center',
    coachId: 'coach-lead',
    coachName: coachName || 'Lead Coach',
    trainingSquad: 'Sprint & Hurdle Squad',
    dominantHand: 'right',
    primaryEventId: 'ev-sprint',
    primaryEventName: 'Athletics Sprint / Jump',
    eventGroup: 'sprints',
    secondaryEventIds: [],
    secondaryEventNames: [],
    status: 'active',
    currentMeasurements: {
      id: 'm-fallback',
      athleteId: assessment?.athleteId || 'ath-generic',
      date: '2026-11-22',
      heightCm: 178,
      weightKg: 72,
    },
    measurementHistory: [],
    createdAt: '2026-11-22T00:00:00.000Z',
    updatedAt: '2026-11-22T00:00:00.000Z',
  };

  const activeCoach =
    coachName ||
    effectiveAthlete.coachName ||
    (typeof window !== 'undefined' ? localStorage.getItem('athletics_active_coach') || '' : '') ||
    'Lead Coach';

  // Goal and duration state
  const [focusGoal, setFocusGoal] = useState<string>(
    'Peak Sprint Velocity & Neural Acceleration'
  );
  const [cycleDuration, setCycleDuration] = useState<string>('4-Week Mesocycle');
  const [coachNotes, setCoachNotes] = useState<string>('');

  // Generation state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plan, setPlan] = useState<AiTrainingPlan | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const goalPresets = [
    {
      id: 'Peak Sprint Velocity & Neural Acceleration',
      label: '⚡ Maximum Velocity & Neural Acceleration',
      desc: '0-30m drive phase mechanics, high rate of force development & vMax sprint turnover',
    },
    {
      id: 'Bilateral Asymmetry Correction & Tendon Pre-Hab',
      label: '⚖️ Bilateral Asymmetry Correction & Pre-Hab',
      desc: 'Eliminates left/right unilateral force discrepancies, protects hamstrings & adductors',
    },
    {
      id: 'Speed-Endurance & Glycolytic Lactate Buffer',
      label: '🔋 Speed-Endurance & Lactate Buffer',
      desc: 'Late-race velocity preservation and aerobic/anaerobic glycolytic capacity',
    },
    {
      id: 'State / National Championship Taper & Peaking',
      label: '🏆 Championship Taper & Technical Peaking',
      desc: 'Supercompensation peak volume reduction with high-intensity neuromuscular potentiation',
    },
    {
      id: 'Olympic Explosive Power & Triple Extension',
      label: '💥 Explosive Power & Triple Extension',
      desc: 'CMJ vertical displacement, reactive strength (RSI), and horizontal bounding force',
    },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setCopySuccess(false);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/ai/training-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete: {
            id: effectiveAthlete.id,
            fullName: effectiveAthlete.fullName,
            athleteCode: effectiveAthlete.athleteCode,
            dateOfBirth: effectiveAthlete.dateOfBirth,
            sex: effectiveAthlete.sex,
            primaryEventName: effectiveAthlete.primaryEventName,
            eventGroup: effectiveAthlete.eventGroup,
            trainingSquad: effectiveAthlete.trainingSquad,
            club: effectiveAthlete.club,
          },
          assessment: assessment
            ? {
                id: assessment.id,
                overallFitnessScore: assessment.overallFitnessScore,
                overallRating: assessment.overallRating,
                assessmentDate: assessment.assessmentDate,
                testResults: assessment.testResults,
                categoryScores: assessment.categoryScores,
                topStrengths: assessment.topStrengths,
                areasToImprove: assessment.areasToImprove,
                bilateralAsymmetries: assessment.bilateralAsymmetries,
              }
            : undefined,
          focusGoal,
          cycleDuration,
          coachName: activeCoach,
          coachCustomNotes: coachNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        setSelectedDayIdx(0);
        db.saveTrainingPlan(data.plan);
      }
    } catch (err) {
      console.error('Failed to generate training plan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToCoachNotes = () => {
    if (!plan) return;
    const notesSummary = `AI Biomechanical Prescription (${plan.cycleDuration} • ${plan.focusGoal}): ${plan.executiveSummary}\n\nKey Focus: ${plan.keyDeficitAddressed}\n\nCoach Rudra Field Cues:\n${plan.coachRudraFieldCues.map((c) => `• ${c}`).join('\n')}`;

    if (onUpdateAssessmentCoachNotes) {
      onUpdateAssessmentCoachNotes(notesSummary);
    }
    navigator.clipboard.writeText(notesSummary);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleSaveToProfile = () => {
    if (!plan) return;
    db.saveTrainingPlan(plan);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-print"
    >
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden my-auto flex flex-col h-[92vh] max-h-[900px]">
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black shadow-lg shadow-red-950/40">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Athletics AI Training Prescription Engine
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600/30 text-rose-300 border border-red-500/30">
                  GPT-4o Sports Science
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Grounded in World Athletics (IAAF) biomechanics & {activeCoach} testing metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* 1. Athlete Snapshot Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                {effectiveAthlete.fullName
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base">{effectiveAthlete.fullName}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {effectiveAthlete.athleteCode}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  <span className="text-rose-400 font-bold">{effectiveAthlete.primaryEventName}</span>
                  <span> • {effectiveAthlete.trainingSquad}</span>
                  <span> • Coach: {activeCoach}</span>
                </div>
              </div>
            </div>

            {/* Assessment Quick Stats */}
            {assessment && (
              <div className="flex items-center gap-4 text-xs font-mono border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Fitness Index</span>
                  <span className="font-black text-rose-400 text-sm">
                    {assessment.overallFitnessScore?.toFixed(1) || '—'} / 100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Tested</span>
                  <span className="font-bold text-slate-300">{assessment.assessmentDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Asymmetries</span>
                  <span
                    className={`font-bold ${
                      (assessment.bilateralAsymmetries?.filter((b) => Math.abs(b.asymmetryPercent) > 10).length || 0) > 0
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {(assessment.bilateralAsymmetries?.filter((b) => Math.abs(b.asymmetryPercent) > 10).length || 0) > 0
                      ? `${assessment.bilateralAsymmetries?.filter((b) => Math.abs(b.asymmetryPercent) > 10).length} Discrepancies`
                      : '✓ Optimal Balance'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Configuration Controls (Before Generating) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left: Focus Goal Selector (7 Cols) */}
            <div className="md:col-span-7 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-red-500" /> 1. Select Training Prescription Goal
              </label>

              <div className="space-y-2">
                {goalPresets.map((goal) => {
                  const isSelected = focusGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setFocusGoal(goal.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-red-500 bg-red-950/30 ring-1 ring-red-500/50'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-white">{goal.label}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{goal.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Duration & Coach Custom Notes (5 Cols) */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                  <Calendar className="w-4 h-4 text-red-500" /> 2. Cycle Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1-Week Microcycle', '4-Week Mesocycle', '8-Week Macrocycle'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCycleDuration(d)}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition ${
                        cycleDuration === d
                          ? 'border-white bg-slate-800 text-white ring-1 ring-red-500/50'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {d.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Quote className="w-4 h-4 text-red-500" /> 3. Coach Rudra's Technical Notes
                </label>
                <textarea
                  rows={3}
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  placeholder="e.g. Focus on block clearance angle and first 3 strides. Monitor left hamstring stiffness."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm shadow-xl shadow-red-950/60 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Biomechanics & Synthesizing Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Training Plan (GPT-4o)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Generated Plan Display */}
          {plan && (
            <div className="pt-6 border-t border-slate-800 space-y-5 animate-in fade-in duration-300">
              {/* Plan Banner & Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">
                      {plan.focusGoal}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white">
                      {plan.cycleDuration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Engineered by: <strong className="text-slate-200">{plan.modelUsed}</strong> • Coach: {activeCoach}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyToCoachNotes}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-200 transition flex items-center gap-1.5"
                  >
                    {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copySuccess ? 'Copied to Notes!' : 'Copy to Coach Comments'}</span>
                  </button>

                  <button
                    onClick={handleSaveToProfile}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-200 transition flex items-center gap-1.5"
                  >
                    {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{saveSuccess ? 'Saved!' : 'Save Plan'}</span>
                  </button>
                </div>
              </div>

              {/* Executive Summary & Key Deficit Addressed */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-xs space-y-1.5">
                  <div className="font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-red-500" />
                    Executive Biomechanical Assessment
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {plan.executiveSummary}
                  </p>
                </div>

                <div className="md:col-span-4 p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs space-y-1.5">
                  <div className="font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Target Bottleneck Resolved
                  </div>
                  <p className="text-slate-300 leading-relaxed font-mono">
                    {plan.keyDeficitAddressed}
                  </p>
                </div>
              </div>

              {/* Coach Rudra Technical Field Cues */}
              {plan.coachRudraFieldCues && plan.coachRudraFieldCues.length > 0 && (
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs space-y-2">
                  <div className="font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    {activeCoach} Field Cues (Track-Side Reminders)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {plan.coachRudraFieldCues.map((cue, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/90 text-slate-200 italic font-medium leading-relaxed"
                      >
                        {cue}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bilateral Correctives Checklist */}
              {plan.bilateralInterventions && plan.bilateralInterventions.length > 0 && (
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs space-y-2">
                  <div className="font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-amber-400" />
                    Bilateral Symmetry & Injury Pre-Hab Interventions
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plan.bilateralInterventions.map((item, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-200 font-mono text-[11px]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-by-Day Schedule Tabs */}
              {plan.days && plan.days.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-black uppercase text-xs tracking-wider text-white flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4 text-red-500" />
                      Day-by-Day Workout Schedule
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {plan.days.length} Structured Training Blocks
                    </span>
                  </div>

                  {/* Day Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {plan.days.map((day, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDayIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                          selectedDayIdx === idx
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>Day {day.dayNumber || idx + 1}</span>
                        <span className="text-[10px] opacity-75 hidden sm:inline truncate max-w-[120px]">
                          {day.dayName.split(':')[1] || day.dayName}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Active Day Content */}
                  {plan.days[selectedDayIdx] && (
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
                      {/* Day Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-800">
                        <div>
                          <h4 className="font-black text-sm text-white">
                            {plan.days[selectedDayIdx].dayName}
                          </h4>
                          <p className="text-xs text-rose-400 font-medium">
                            Focus: {plan.days[selectedDayIdx].focus}
                          </p>
                        </div>
                      </div>

                      {/* Warmup Protocol */}
                      {plan.days[selectedDayIdx].warmupProtocol && (
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                          <span className="font-black uppercase text-[10px] tracking-wider text-slate-400 block">
                            Warm-Up & Neural Preparation Protocol:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-300 font-medium">
                            {plan.days[selectedDayIdx].warmupProtocol.map((w, wi) => (
                              <li key={wi}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Drills Table */}
                      <div className="overflow-x-auto rounded-lg border border-slate-800">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                              <th className="p-2.5">Exercise / Drill</th>
                              <th className="p-2.5 text-center">Volume</th>
                              <th className="p-2.5">Intensity</th>
                              <th className="p-2.5">Rest Interval</th>
                              <th className="p-2.5">Technical Biomechanical Cue</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                            {plan.days[selectedDayIdx].drills.map((drill, di) => (
                              <tr key={di} className="hover:bg-slate-900/50 transition">
                                <td className="p-2.5 font-bold text-white">
                                  {drill.name}
                                </td>
                                <td className="p-2.5 text-center text-slate-300">
                                  {drill.sets} sets × {drill.reps}
                                </td>
                                <td className="p-2.5 text-rose-300 font-semibold">
                                  {drill.intensity}
                                </td>
                                <td className="p-2.5 text-slate-400">
                                  {drill.rest}
                                </td>
                                <td className="p-2.5 text-slate-300 font-sans italic text-xs">
                                  "{drill.technicalCue}"
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Correctives & Recovery Footer */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {plan.days[selectedDayIdx].correctivesAndPrehab && (
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="font-bold text-amber-400 block text-[10px] uppercase mb-1">
                              Post-Workout Correctives:
                            </span>
                            <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                              {plan.days[selectedDayIdx].correctivesAndPrehab.map((c, ci) => (
                                <li key={ci}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {plan.days[selectedDayIdx].recoveryNote && (
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                            <span className="font-bold text-emerald-400 block text-[10px] uppercase mb-1">
                              Recovery & Regeneration Protocol:
                            </span>
                            <p className="text-slate-300 text-[11px]">
                              {plan.days[selectedDayIdx].recoveryNote}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            National Athletics High Performance Centre • {activeCoach} AI Diagnostic Engine
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-200 font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
