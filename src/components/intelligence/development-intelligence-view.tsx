'use client';

import React, { useState, useEffect } from 'react';
import { AthleteProfile } from '@/types/athlete';
import { Assessment } from '@/types/assessment';
import { Competition, PerformanceRecord } from '@/types/athletics';
import {
  AthleteDevelopmentInsight,
  SquadDevelopmentInsight,
} from '@/types/development-intelligence';
import { FitnessRadarChart } from './fitness-radar-chart';
import { ProgressionChart } from './progression-chart';
import { BilateralAsymmetryChart } from './bilateral-asymmetry-chart';
import { InsightCards } from './insight-cards';
import { AiTrainingPlanModal } from './ai-training-plan-modal';
import {
  Sparkles,
  Brain,
  Zap,
  Users,
  User,
  TrendingUp,
  TrendingDown,
  Scale,
  Activity,
  Flame,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Award,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Target,
  Compass,
  Printer,
  ArrowUpRight,
  AlertTriangle,
  Send,
  Dumbbell,
  Clock,
  LineChart,
} from 'lucide-react';

interface DevelopmentIntelligenceViewProps {
  theme?: 'bright' | 'dark';
  athletes: AthleteProfile[];
  assessments: Assessment[];
  competitions?: Competition[];
  performances?: PerformanceRecord[];
  onSelectAthlete?: (athlete: AthleteProfile) => void;
  onOpenReport?: (assessment: Assessment) => void;
}

export function DevelopmentIntelligenceView({
  theme = 'bright',
  athletes,
  assessments,
  competitions = [],
  performances = [],
  onSelectAthlete,
  onOpenReport,
}: DevelopmentIntelligenceViewProps) {
  // Mode switcher: 'individual' | 'squad'
  const [activeMode, setActiveMode] = useState<'individual' | 'squad'>('individual');

  // Selected athlete for Individual Mode
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(
    athletes[0]?.id || ''
  );

  // Filter for squad mode
  const [squadEventFilter, setSquadEventFilter] = useState<string>('all');

  // Individual AI State
  const [individualInsight, setIndividualInsight] = useState<AthleteDevelopmentInsight | null>(null);
  const [isGeneratingIndividual, setIsGeneratingIndividual] = useState(false);
  const [customCoachQuery, setCustomCoachQuery] = useState('');
  const [activeFocusTopic, setActiveFocusTopic] = useState('Event Velocity & Acceleration Mechanics');
  const [copyIndividualSuccess, setCopyIndividualSuccess] = useState(false);

  // Squad AI State
  const [squadInsight, setSquadInsight] = useState<SquadDevelopmentInsight | null>(null);
  const [isGeneratingSquad, setIsGeneratingSquad] = useState(false);
  const [squadCoachQuery, setSquadCoachQuery] = useState('');
  const [copySquadSuccess, setCopySquadSuccess] = useState(false);

  // Full AI Training Plan Modal state
  const [isFullPlanModalOpen, setIsFullPlanModalOpen] = useState(false);

  // Currently selected athlete and their assessments
  const currentAthlete = athletes.find((a) => a.id === selectedAthleteId) || athletes[0];
  const athleteAssessments = assessments
    .filter((ass) => ass.athleteId === currentAthlete?.id)
    .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime());

  const latestAssessment = athleteAssessments[0] || assessments[0];
  const previousAssessment = athleteAssessments[1] || assessments[1];
  const bestAssessment = athleteAssessments.reduce<Assessment | undefined>((best, curr) => {
    if (!best) return curr;
    return (curr.overallFitnessScore || 0) > (best.overallFitnessScore || 0) ? curr : best;
  }, undefined);

  // Preset prompt accelerators for Coach Rudra Roy
  const promptPresets = [
    {
      id: 'Event Velocity & Acceleration Mechanics',
      label: '⚡ 0-30m Acceleration & Top Velocity',
      query: 'Analyze how their physical test profile impacts their start drive phase and max sprint turnover. Prescribe event-specific technical cues.',
    },
    {
      id: 'Bilateral Asymmetry Correction & Tendon Shield',
      label: '⚖️ Bilateral Asymmetries & Injury Shield',
      query: 'Analyze all bilateral limb discrepancies (>5%). Prescribe unilateral eccentric pre-hab to protect hamstrings and adductors.',
    },
    {
      id: 'Longitudinal Progress & Peaking Forecast',
      label: '📈 Progress Trajectory & Peaking Forecast',
      query: 'Evaluate their longitudinal progress across recorded assessments. Pinpoint why metrics plateaued or improved and forecast competition readiness.',
    },
    {
      id: 'Explosive Power & Reactive Strength (RSI)',
      label: '💥 Explosive Power & Reactive Elasticity',
      query: 'How can Coach Rudra optimize this athlete’s reactive strength index (RSI), vertical jump impulse, and stretch-shortening cycle?',
    },
  ];

  // 1. Generate Individual AI Coaching Insight
  const handleGenerateIndividualInsight = async (overrideQuery?: string, topic?: string) => {
    if (!currentAthlete || !latestAssessment) return;
    setIsGeneratingIndividual(true);
    setCopyIndividualSuccess(false);

    const queryToSend = overrideQuery || customCoachQuery || promptPresets[0].query;
    const topicToSend = topic || activeFocusTopic;

    try {
      const res = await fetch('/api/ai/development-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'individual',
          athlete: {
            id: currentAthlete.id,
            fullName: currentAthlete.fullName,
            athleteCode: currentAthlete.athleteCode,
            sex: currentAthlete.sex,
            primaryEventName: currentAthlete.primaryEventName,
            eventGroup: currentAthlete.eventGroup,
            trainingSquad: currentAthlete.trainingSquad,
            club: currentAthlete.club,
          },
          assessment: latestAssessment,
          assessmentHistory: athleteAssessments,
          coachQuery: queryToSend,
          focusTopic: topicToSend,
        }),
      });

      const data = await res.json();
      if (data.success && data.insight) {
        setIndividualInsight(data.insight);
      }
    } catch (err) {
      console.error('Failed to generate individual development intelligence:', err);
    } finally {
      setIsGeneratingIndividual(false);
    }
  };

  // 2. Generate Squad AI Collective Insight
  const handleGenerateSquadInsight = async () => {
    if (athletes.length === 0) return;
    setIsGeneratingSquad(true);
    setCopySquadSuccess(false);

    const squadRosterData = athletes.map((ath) => {
      const athAssessments = assessments
        .filter((ass) => ass.athleteId === ath.id)
        .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime());
      const latest = athAssessments[0];
      const highestAsym = latest?.bilateralAsymmetries?.reduce(
        (max, curr) => (Math.abs(curr.asymmetryPercent) > Math.abs(max.asymmetryPercent) ? curr : max),
        latest.bilateralAsymmetries[0]
      );

      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (athAssessments.length >= 2) {
        const diff = (latest.overallFitnessScore || 0) - (athAssessments[1].overallFitnessScore || 0);
        if (diff > 1.5) trend = 'improving';
        else if (diff < -1.5) trend = 'declining';
      }

      return {
        id: ath.id,
        fullName: ath.fullName,
        athleteCode: ath.athleteCode,
        primaryEventName: ath.primaryEventName,
        eventGroup: ath.eventGroup,
        latestFitnessScore: latest?.overallFitnessScore || 75,
        highestAsymmetryPercent: highestAsym ? highestAsym.asymmetryPercent : undefined,
        highestAsymmetryTest: highestAsym ? highestAsym.testName : undefined,
        trend,
      };
    });

    try {
      const res = await fetch('/api/ai/development-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'squad',
          squadAthletes: squadRosterData,
          coachQuery: squadCoachQuery || 'Formulate squad strengths, systemic technical weaknesses, and periodization directive for Coach Rudra Roy.',
          focusTopic: squadEventFilter === 'all' ? 'All Track & Field Event Groups' : squadEventFilter,
        }),
      });

      const data = await res.json();
      if (data.success && data.insight) {
        setSquadInsight(data.insight);
      }
    } catch (err) {
      console.error('Failed to generate squad development intelligence:', err);
    } finally {
      setIsGeneratingSquad(false);
    }
  };

  // Copy helper
  const handleCopyText = (text: string, isSquad = false) => {
    navigator.clipboard.writeText(text);
    if (isSquad) {
      setCopySquadSuccess(true);
      setTimeout(() => setCopySquadSuccess(false), 2000);
    } else {
      setCopyIndividualSuccess(true);
      setTimeout(() => setCopyIndividualSuccess(false), 2000);
    }
  };

  // Filtered athletes for squad view
  const filteredSquadAthletes = athletes.filter((a) => {
    if (squadEventFilter === 'all') return true;
    return a.eventGroup === squadEventFilter;
  });

  return (
    <div className="space-y-6">
      {/* ======================================================================= */}
      {/* MAGICAL AI HERO BANNER                                                  */}
      {/* ======================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-[#120718] to-slate-900 border border-rose-500/30 p-6 sm:p-8 shadow-2xl text-white">
        {/* Glowing background nebula & cybernetic grids */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-[11px] font-black uppercase tracking-wider text-rose-300 shadow-lg shadow-rose-950/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Next-Gen Athletics Intelligence • Powered by OpenRouter GPT-4o</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Athlete Development Intelligence Lab</span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md">
                COACH RUDRA ROY
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              World Athletics biomechanical diagnostics, longitudinal progress forecasting, and bilateral injury prevention.
              Consult the AI copilot for bespoke single-athlete event mastery or synthesize team-wide squad development.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveMode('individual')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all ${
                activeMode === 'individual'
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white shadow-lg shadow-rose-950/50 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Individual Athlete Lab</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('squad')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black transition-all ${
                activeMode === 'squad'
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white shadow-lg shadow-rose-950/50 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Squad Collective Intelligence</span>
            </button>
          </div>
        </div>

        {/* Live Neural Engine Status Indicators */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white">IAAF / World Athletics Diagnostic Models: Active</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-amber-300">
            <Brain className="w-3.5 h-3.5" />
            <span>OpenRouter Model: openai/gpt-4o</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-rose-300">
            <Scale className="w-3.5 h-3.5" />
            <span>Bilateral Limb Asymmetry Threshold: &gt;5% Warning, &gt;10% Hazard</span>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MODE 1: INDIVIDUAL ATHLETE AI DEEP-DIVE LAB                             */}
      {/* ======================================================================= */}
      {activeMode === 'individual' && (
        <div className="space-y-6">
          {/* Athlete Selector Carousel / Chips */}
          <div className={`p-4 rounded-xl border ${
            theme === 'bright' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'
          }`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-500" />
                <h3 className={`text-xs font-extrabold uppercase tracking-wider ${
                  theme === 'bright' ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  Select Athlete for Biomechanical AI Diagnostics
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {athletes.length} Athletes Enrolled
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {athletes.map((ath) => {
                const isSelected = ath.id === currentAthlete?.id;
                const athAssessments = assessments.filter((a) => a.athleteId === ath.id);
                const latest = athAssessments[0];
                return (
                  <button
                    key={ath.id}
                    type="button"
                    onClick={() => {
                      setSelectedAthleteId(ath.id);
                      setIndividualInsight(null);
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-rose-500 shadow-md scale-[1.02]'
                        : theme === 'bright'
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg font-black flex items-center justify-center text-xs shrink-0 ${
                        isSelected ? 'bg-white text-rose-600' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {ath.fullName
                        .split(' ')
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-xs leading-tight flex items-center gap-1.5">
                        <span>{ath.fullName}</span>
                        <span className={`text-[10px] font-mono px-1 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {ath.athleteCode}
                        </span>
                      </div>
                      <div className={`text-[11px] mt-0.5 flex items-center gap-1.5 ${
                        isSelected ? 'text-rose-100' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        <span className="font-bold">{ath.primaryEventName}</span>
                        <span>•</span>
                        <span>Score: {latest?.overallFitnessScore?.toFixed(0) || '—'}/100</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {currentAthlete && latestAssessment ? (
            <div className="space-y-6">
              {/* Athlete Event & Kinetic Demands Card */}
              <div className={`p-5 rounded-2xl border ${
                theme === 'bright'
                  ? 'bg-gradient-to-r from-rose-50 via-white to-amber-50/40 border-rose-200 text-slate-900 shadow-sm'
                  : 'bg-gradient-to-r from-slate-950 via-[#100814] to-slate-900 border-slate-800 text-white shadow-xl'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black flex items-center justify-center text-xl shadow-lg shrink-0">
                      {currentAthlete.fullName
                        .split(' ')
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black">{currentAthlete.fullName}</h2>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {currentAthlete.athleteCode}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                          {currentAthlete.eventGroup}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Primary Event: <strong className="text-rose-600 dark:text-rose-400">{currentAthlete.primaryEventName}</strong> • Squad: {currentAthlete.trainingSquad} • Coach: {currentAthlete.coachName || 'Coach Rudra Roy'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                        Fitness Score
                      </span>
                      <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                        {latestAssessment.overallFitnessScore?.toFixed(1) || '—'}
                        <span className="text-xs text-slate-400">/100</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFullPlanModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white rounded-xl shadow-md transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      Full Training Plan Modal
                    </button>
                  </div>
                </div>
              </div>

              {/* ======================================================================= */}
              {/* AI COPILOT & BIOMECHANICAL ADVISOR SECTION                              */}
              {/* ======================================================================= */}
              <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-br from-slate-950 via-[#180a1d] to-slate-900 p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-rose-400 animate-pulse" />
                      <h3 className="font-black text-base text-white">
                        AI Biomechanical Coaching Copilot
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Analyzes {currentAthlete.fullName}&apos;s event kinematics, test deltas, and bilateral deficits to formulate Coach Rudra&apos;s tactical strategy.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                      ● Model: GPT-4o Ready
                    </span>
                  </div>
                </div>

                {/* Prompt Accelerator Chips */}
                <div className="relative z-10 my-4 space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Quick Tactical Prompts for Coach Rudra Roy:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {promptPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setActiveFocusTopic(preset.id);
                          setCustomCoachQuery(preset.query);
                          handleGenerateIndividualInsight(preset.query, preset.id);
                        }}
                        className={`text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                          activeFocusTopic === preset.id
                            ? 'bg-rose-950/80 border-rose-500 text-white shadow-md'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{preset.label}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                          {preset.query}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Coach Query Input */}
                <div className="relative z-10 flex flex-col sm:flex-row gap-2 mt-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={customCoachQuery}
                      onChange={(e) => setCustomCoachQuery(e.target.value)}
                      placeholder={`Ask AI: "How can Coach Rudra optimize ${currentAthlete.fullName}'s 100m sprint start and resolve the left leg deficit?"`}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition shadow-inner"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGenerateIndividualInsight();
                        }
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateIndividualInsight()}
                    disabled={isGeneratingIndividual}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-950/50 disabled:opacity-50 transition"
                  >
                    {isGeneratingIndividual ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synthesizing Diagnostics...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Consult AI Biomechanist</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Dynamic AI Results View */}
                {isGeneratingIndividual && (
                  <div className="relative z-10 mt-6 p-8 rounded-xl bg-slate-950/80 border border-rose-500/30 text-center space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-full bg-rose-600/20 border border-rose-500 flex items-center justify-center animate-spin">
                      <Sparkles className="w-6 h-6 text-rose-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-white text-sm">
                        OpenRouter GPT-4o Analyzing {currentAthlete.fullName}...
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Evaluating 10m start kinetics, countermovement jump impulse, reactive stiffness (RSI), and bilateral pelvic symmetry.
                      </p>
                    </div>
                  </div>
                )}

                {individualInsight && !isGeneratingIndividual && (
                  <div className="relative z-10 mt-6 space-y-5">
                    {/* Top Diagnosis & Readiness Banner */}
                    <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                            Event Biomechanical Diagnosis
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {individualInsight.primaryEvent}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          {individualInsight.eventBiomechanicalDiagnosis}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">
                            Competitive Readiness
                          </span>
                          <span className="text-xl font-black text-amber-400 font-mono">
                            {individualInsight.readinessScore} / 100
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyText(JSON.stringify(individualInsight, null, 2))}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Copy Full Diagnostic Summary"
                        >
                          {copyIndividualSuccess ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Grid of Key Diagnostics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Longitudinal Progress Analysis */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                          <TrendingUp className="w-4 h-4" />
                          <span>Longitudinal Progress & Trajectory</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {individualInsight.longitudinalProgressAnalysis}
                        </p>
                        {individualInsight.topPriorityBottleneck && (
                          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs">
                            <strong>#1 Bottleneck:</strong> {individualInsight.topPriorityBottleneck}
                          </div>
                        )}
                      </div>

                      {/* Bilateral Pre-Hab & Injury Shield */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Bilateral Asymmetry & Tendon Shield</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {individualInsight.bilateralPrehabAlert}
                        </p>
                        {individualInsight.periodizationRecommendation && (
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                            <strong>Periodization Note:</strong> {individualInsight.periodizationRecommendation}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coach Rudra Roy Trackside Technical Cues */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Coach Rudra Roy Field Cues (Verbal Trackside Triggers)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {individualInsight.coachRudraFieldCues.map((cue, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium flex items-start gap-2"
                          >
                            <span className="w-5 h-5 rounded-full bg-rose-600/30 text-rose-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>&ldquo;{cue}&rdquo;</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended High-Impact Drills */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <Dumbbell className="w-4 h-4 text-rose-400" />
                        <span>Recommended Event-Specific Technical Drills</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {individualInsight.recommendedDrills.map((drill, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                          >
                            <div className="font-extrabold text-white text-xs flex items-center justify-between">
                              <span>{drill.name}</span>
                              <span className="text-[10px] font-mono text-amber-400">
                                {drill.prescription}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              <strong>Intent:</strong> {drill.focus}
                            </p>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-rose-300">
                              <strong>Cue:</strong> {drill.technicalCue}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tactical Action Plan */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Coach Rudra Tactical Microcycle Execution Plan</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {individualInsight.coachingActionPlan.map((act, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 p-2 rounded bg-slate-900/60 border border-slate-800"
                          >
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* ======================================================================= */}
              {/* CHARTS & KINETIC PROFILES GRID                                          */}
              {/* ======================================================================= */}
              <InsightCards
                currentAssessment={latestAssessment}
                previousAssessment={previousAssessment}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RADAR PROFILE */}
                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    theme === 'bright'
                      ? 'bg-white border-slate-200 text-slate-900'
                      : 'bg-[#0e0e13] border-slate-800 text-white shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-rose-500" />
                      <span>Radar Profile ({currentAthlete.fullName})</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500">
                      Current vs Previous vs Best
                    </span>
                  </div>
                  <FitnessRadarChart
                    currentAssessment={latestAssessment}
                    previousAssessment={previousAssessment}
                    bestAssessment={bestAssessment}
                  />
                </div>

                {/* PROGRESSION CHART */}
                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    theme === 'bright'
                      ? 'bg-white border-slate-200 text-slate-900'
                      : 'bg-[#0e0e13] border-slate-800 text-white shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                      <LineChart className="w-4 h-4 text-amber-500" />
                      <span>Longitudinal Progress Trajectory</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500">
                      {athleteAssessments.length} Test Sessions
                    </span>
                  </div>
                  <ProgressionChart
                    assessments={athleteAssessments.length > 0 ? athleteAssessments : assessments}
                  />
                </div>
              </div>

              {/* BILATERAL ASYMMETRY CHART */}
              <div
                className={`rounded-2xl border p-5 shadow-sm ${
                  theme === 'bright'
                    ? 'bg-white border-slate-200 text-slate-900'
                    : 'bg-[#0e0e13] border-slate-800 text-white shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    <Scale className="w-4 h-4 text-rose-500" />
                    <span>Bilateral Symmetry & Limb Deficit Analysis</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Left vs Right Balance
                  </span>
                </div>
                <BilateralAsymmetryChart assessment={latestAssessment} />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-400 text-xs">
              No assessment data logged for this athlete yet. Complete testing to activate diagnostics.
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODE 2: SQUAD COLLECTIVE INTELLIGENCE ("ALL ATHLETES TOGETHER")          */}
      {/* ======================================================================= */}
      {activeMode === 'squad' && (
        <div className="space-y-6">
          {/* Squad Roster Matrix & Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${
              theme === 'bright' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Total Athletes</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {athletes.length}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">High Performance Roster</span>
            </div>

            <div className={`p-4 rounded-xl border ${
              theme === 'bright' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Squad Fitness Average</span>
              <span className="text-2xl font-black text-amber-500 font-mono">
                {(
                  assessments.reduce((acc, a) => acc + (a.overallFitnessScore || 0), 0) /
                  (assessments.length || 1)
                ).toFixed(1)}
                <span className="text-xs text-slate-400">/100</span>
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">Across All Completed Tests</span>
            </div>

            <div className={`p-4 rounded-xl border ${
              theme === 'bright' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Asymmetry Hazard Flag</span>
              <span className="text-2xl font-black text-rose-500 font-mono">
                {
                  assessments.filter((a) =>
                    a.bilateralAsymmetries?.some((b) => Math.abs(b.asymmetryPercent) >= 10)
                  ).length
                }
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">Athletes with &gt;10% Limb Deficit</span>
            </div>

            <div className={`p-4 rounded-xl border ${
              theme === 'bright' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Lead Coach</span>
              <span className="text-lg font-black text-white dark:text-white font-mono truncate block">
                Coach Rudra Roy
              </span>
              <span className="text-xs text-emerald-500 font-bold block mt-0.5">S&amp;C High Performance</span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SQUAD-WIDE AI STRATEGY ENGINE                                          */}
          {/* ======================================================================= */}
          <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-br from-slate-950 via-[#180a1d] to-slate-900 p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-400" />
                  <h3 className="font-black text-base text-white">
                    Squad-Wide AI Collective Strategy
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synthesizes roster-wide kinetics, highlights systemic technical flaws, and structures the group microcycle.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateSquadInsight}
                disabled={isGeneratingSquad}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-950/50 disabled:opacity-50 transition shrink-0"
              >
                {isGeneratingSquad ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Squad...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Run Squad-Wide AI Diagnostics</span>
                  </>
                )}
              </button>
            </div>

            {/* Event Group Filter Bar */}
            <div className="relative z-10 flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1">
                Filter Group:
              </span>
              {[
                { id: 'all', label: 'All Event Groups' },
                { id: 'sprints', label: 'Sprints' },
                { id: 'hurdles', label: 'Hurdles' },
                { id: 'jumps', label: 'Jumps' },
                { id: 'throws', label: 'Throws' },
                { id: 'middle_distance', label: 'Distance' },
              ].map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setSquadEventFilter(grp.id)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    squadEventFilter === grp.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>

            {/* Squad AI Loading */}
            {isGeneratingSquad && (
              <div className="relative z-10 mt-6 p-8 rounded-xl bg-slate-950/80 border border-rose-500/30 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-600/20 border border-rose-500 flex items-center justify-center animate-spin">
                  <Users className="w-6 h-6 text-rose-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-sm">
                    OpenRouter GPT-4o Analyzing Roster Data...
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Computing squad mean power profiles, aggregating bilateral asymmetry risk vectors, and generating Coach Rudra&apos;s team plan.
                  </p>
                </div>
              </div>
            )}

            {/* Squad AI Results */}
            {squadInsight && !isGeneratingSquad && (
              <div className="relative z-10 mt-6 space-y-5">
                {/* Squad Strengths Banner */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      Squad Strengths &amp; High-Performance Baseline
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(JSON.stringify(squadInsight, null, 2), true)}
                      className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white transition"
                      title="Copy Squad Intelligence"
                    >
                      {copySquadSuccess ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {squadInsight.squadStrengthsOverview}
                  </p>
                </div>

                {/* Systemic Bottlenecks & Periodization Directive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Systemic Bottlenecks */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Systemic Bottlenecks Across the Roster</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {squadInsight.systemicBottlenecks.map((bot, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">✕</span>
                          <span>{bot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Team Periodization Directive */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Compass className="w-4 h-4" />
                      <span>Team Periodization Directive (Next 4-Week Block)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {squadInsight.teamPeriodizationDirective}
                    </p>
                  </div>
                </div>

                {/* High-Risk Athletes Alert Watchlist */}
                {squadInsight.highRiskAthletes && squadInsight.highRiskAthletes.length > 0 && (
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span>High-Risk Athlete Watchlist (Immediate Unilateral Pre-Hab Required)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {squadInsight.highRiskAthletes.map((hr, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-950/90 border border-rose-500/40 text-xs space-y-1"
                        >
                          <div className="font-extrabold text-white flex items-center justify-between">
                            <span>{hr.athleteName}</span>
                            <span className="text-[10px] font-mono text-rose-400">{hr.athleteCode}</span>
                          </div>
                          <p className="text-[11px] text-rose-300 font-medium">
                            ⚠️ {hr.riskFactor}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            <strong>Action:</strong> {hr.recommendedIntervention}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Squad Pre-Hab Warmup & Coach Rudra Action Plan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prehab Protocol */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Mandatory Group Pre-Hab Warmup Protocol</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {squadInsight.teamPrehabProtocol.map((proto, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{proto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coach Action Plan */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                      <Target className="w-4 h-4 text-rose-400" />
                      <span>Coach Rudra Roy Squad Weekly Priorities</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {squadInsight.coachRudraWeeklyActionPlan.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================================= */}
          {/* SQUAD ATHLETES ROSTER MATRIX TABLE                                      */}
          {/* ======================================================================= */}
          <div className={`rounded-2xl border overflow-hidden ${
            theme === 'bright' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-xl'
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              theme === 'bright' ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <h3 className={`font-extrabold text-sm ${theme === 'bright' ? 'text-slate-900' : 'text-white'}`}>
                Athletics Squad Kinetic Roster &amp; Progression Matrix
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {filteredSquadAthletes.length} Athletes Listed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b font-mono uppercase tracking-wider ${
                    theme === 'bright'
                      ? 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    <th className="px-4 py-3">Athlete</th>
                    <th className="px-4 py-3">Event Group</th>
                    <th className="px-4 py-3">Primary Event</th>
                    <th className="px-4 py-3">Fitness Score</th>
                    <th className="px-4 py-3">L/R Asymmetry</th>
                    <th className="px-4 py-3">Progress Trend</th>
                    <th className="px-4 py-3 text-right">AI Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredSquadAthletes.map((ath) => {
                    const athAssessments = assessments.filter((a) => a.athleteId === ath.id);
                    const latest = athAssessments[0];
                    const highestAsym = latest?.bilateralAsymmetries?.reduce(
                      (max, curr) => (Math.abs(curr.asymmetryPercent) > Math.abs(max.asymmetryPercent) ? curr : max),
                      latest.bilateralAsymmetries[0]
                    );

                    const isHighHazard = highestAsym && Math.abs(highestAsym.asymmetryPercent) >= 10;
                    const isModerate = highestAsym && Math.abs(highestAsym.asymmetryPercent) >= 5;

                    return (
                      <tr
                        key={ath.id}
                        className={`transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40`}
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{ath.fullName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {ath.athleteCode}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">{ath.trainingSquad}</span>
                        </td>
                        <td className="px-4 py-3.5 capitalize font-medium text-slate-600 dark:text-slate-300">
                          {ath.eventGroup}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-rose-600 dark:text-rose-400">
                          {ath.primaryEventName}
                        </td>
                        <td className="px-4 py-3.5 font-mono font-black">
                          {latest?.overallFitnessScore !== undefined ? (
                            <span className="text-slate-900 dark:text-white">
                              {latest.overallFitnessScore.toFixed(1)} / 100
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          {highestAsym ? (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                                isHighHazard
                                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                                  : isModerate
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                  : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              <Scale className="w-3 h-3" />
                              {highestAsym.asymmetryPercent}% ({highestAsym.testName.split(' ')[0]})
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono">Balanced (&lt;5%)</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          {athAssessments.length >= 2 ? (
                            (latest?.overallFitnessScore || 0) >= (athAssessments[1]?.overallFitnessScore || 0) ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Improving</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                                <TrendingDown className="w-3.5 h-3.5" />
                                <span>Deload / Plateau</span>
                              </span>
                            )
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">Baseline</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAthleteId(ath.id);
                              setActiveMode('individual');
                              setIndividualInsight(null);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition"
                          >
                            <Sparkles className="w-3 h-3 text-amber-200" />
                            <span>Consult AI</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Full AI Training Plan Modal */}
      {currentAthlete && (
        <AiTrainingPlanModal
          isOpen={isFullPlanModalOpen}
          onClose={() => setIsFullPlanModalOpen(false)}
          athlete={currentAthlete}
          assessment={latestAssessment}
        />
      )}
    </div>
  );
}
