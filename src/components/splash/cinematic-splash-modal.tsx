'use client';

import React, { useState, useEffect } from 'react';
import { AthleteProfile } from '@/types/athlete';
import {
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  ChevronRight,
  Check,
  Plus,
  Target,
  ArrowRight,
  Flame,
  Award,
  Activity,
  Layers,
  X,
  UserCheck,
} from 'lucide-react';

interface CinematicSplashModalProps {
  isOpen: boolean;
  onClose: () => void;
  athletes: AthleteProfile[];
  onComplete: (coachName: string, selectedAthleteIds: string[], organizationName: string) => void;
  onAddNewAthlete?: (athlete: AthleteProfile) => void;
  defaultCoachName?: string;
  defaultOrganization?: string;
}

const FULL_HEADLINE = "THE MOST ADVANCED ATHLETIC TESTING PLATFORM";
const FULL_SUBTITLE = "Olympic-grade biomechanical kinetics, World Athletics scoring models, and OpenRouter GPT-4o artificial intelligence—engineered for elite coaches and champions.";

export function CinematicSplashModal({
  isOpen,
  onClose,
  athletes,
  onComplete,
  onAddNewAthlete,
  defaultCoachName = 'Coach Rudra Roy',
  defaultOrganization = 'National Athletics High Performance Centre',
}: CinematicSplashModalProps) {
  // Step 1: Cinematic Welcome Hero | Step 2: Coach & Athlete Roster Gate
  const [step, setStep] = useState<'welcome' | 'roster'>('welcome');

  // Typewriter effect state
  const [displayedHeadline, setDisplayedHeadline] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [isHeadlineDone, setIsHeadlineDone] = useState(false);
  const [isSubtitleDone, setIsSubtitleDone] = useState(false);

  // Coach inputs
  const [coachName, setCoachName] = useState(defaultCoachName);
  const [organization, setOrganization] = useState(defaultOrganization);

  // Selected athletes under this coach (defaults to all athletes)
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>(() =>
    athletes.map((a) => a.id)
  );

  // Quick add athlete state (open by default if no athletes exist)
  const [isAddingNew, setIsAddingNew] = useState(() => athletes.length === 0);
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteEvent, setNewAthleteEvent] = useState('100m Sprint');
  const [newAthleteSquad, setNewAthleteSquad] = useState('Senior Sprint Squad');

  // Search filter for athletes list in gate
  const [searchQuery, setSearchQuery] = useState('');

  // Cinematic Typewriter Effect execution
  useEffect(() => {
    if (!isOpen || step !== 'welcome') return;

    let headIdx = 0;
    let subIdx = 0;
    let subTimeout: NodeJS.Timeout | null = null;
    let subInterval: NodeJS.Timeout | null = null;

    setDisplayedHeadline('');
    setDisplayedSubtitle('');
    setIsHeadlineDone(false);
    setIsSubtitleDone(false);

    // Type headline character by character (~35ms)
    const headInterval = setInterval(() => {
      headIdx++;
      if (headIdx <= FULL_HEADLINE.length) {
        setDisplayedHeadline(FULL_HEADLINE.slice(0, headIdx));
      } else {
        clearInterval(headInterval);
        setIsHeadlineDone(true);

        // Pause before typing subtitle
        subTimeout = setTimeout(() => {
          subInterval = setInterval(() => {
            subIdx++;
            if (subIdx <= FULL_SUBTITLE.length) {
              setDisplayedSubtitle(FULL_SUBTITLE.slice(0, subIdx));
            } else {
              if (subInterval) clearInterval(subInterval);
              setIsSubtitleDone(true);
            }
          }, 16);
        }, 200);
      }
    }, 36);

    return () => {
      clearInterval(headInterval);
      if (subInterval) clearInterval(subInterval);
      if (subTimeout) clearTimeout(subTimeout);
    };
  }, [isOpen, step]);

  const handleSkipTypewriter = () => {
    setDisplayedHeadline(FULL_HEADLINE);
    setDisplayedSubtitle(FULL_SUBTITLE);
    setIsHeadlineDone(true);
    setIsSubtitleDone(true);
  };

  // Keep selected athletes in sync when athletes prop changes
  useEffect(() => {
    if (athletes.length === 0) {
      setIsAddingNew(true);
    } else if (selectedAthleteIds.length === 0) {
      setSelectedAthleteIds(athletes.map((a) => a.id));
    }
  }, [athletes, selectedAthleteIds.length]);

  if (!isOpen) return null;

  const toggleAthlete = (id: string) => {
    setSelectedAthleteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAthleteIds.length === athletes.length) {
      setSelectedAthleteIds([]);
    } else {
      setSelectedAthleteIds(athletes.map((a) => a.id));
    }
  };

  const handleQuickAddAthlete = () => {
    if (!newAthleteName.trim()) return;

    const newId = `ath-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newAth: AthleteProfile = {
      id: newId,
      organizationId: 'org-nahpc',
      athleteCode: `ATH-2026-${String(athletes.length + 1).padStart(3, '0')}`,
      fullName: newAthleteName.trim(),
      dateOfBirth: '2004-05-15',
      sex: 'male',
      club: organization || 'National Athletics Club',
      coachId: 'coach-rudra-roy',
      coachName: coachName || 'Coach Rudra Roy',
      trainingSquad: newAthleteSquad || 'Sprint Squad A',
      dominantHand: 'right',
      primaryEventId: `ev-${newAthleteEvent.toLowerCase().replace(/\s+/g, '-')}`,
      primaryEventName: newAthleteEvent,
      eventGroup: 'sprints',
      secondaryEventIds: [],
      secondaryEventNames: [],
      status: 'active',
      currentMeasurements: {
        id: `m-${newId}`,
        athleteId: newId,
        date: new Date().toISOString().split('T')[0],
        heightCm: 180,
        weightKg: 74,
      },
      measurementHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (onAddNewAthlete) {
      onAddNewAthlete(newAth);
    }

    // Auto-select the newly added athlete
    setSelectedAthleteIds((prev) => [...prev, newId]);
    setNewAthleteName('');
    setIsAddingNew(false);
  };

  const handleFinalLaunch = () => {
    const finalCoach = coachName.trim() || 'Coach Rudra Roy';
    const finalOrg = organization.trim() || 'National Athletics High Performance Centre';
    const finalAthletes = selectedAthleteIds.length > 0 ? selectedAthleteIds : athletes.map((a) => a.id);

    onComplete(finalCoach, finalAthletes, finalOrg);
    onClose();
  };

  const filteredAthletes = athletes.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.athleteCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.primaryEventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-[#020205] text-white flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none animate-in fade-in duration-500">
      {/* Cinematic Anamorphic Letterbox Glow Lines */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_20px_#f43f5e] z-30" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_20px_#f43f5e] z-30" />

      {/* Atmospheric Background Glow Nodes */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[55vh] bg-red-600/12 rounded-full blur-[200px]" />
      <div className="pointer-events-none absolute top-1/4 right-1/4 w-[45vw] h-[45vh] bg-amber-500/10 rounded-full blur-[180px]" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/4 w-[45vw] h-[45vh] bg-rose-600/10 rounded-full blur-[180px]" />

      {/* Cybernetic Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ff0000 1px, transparent 1px), linear-gradient(to bottom, #ff0000 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Top HUD Telemetry Header */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-rose-500/20 bg-black/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <div className="font-mono text-xs sm:text-sm tracking-[0.25em] text-slate-200 font-bold uppercase">
            HIGH-PERFORMANCE ATHLETIC TESTING LAB <span className="text-rose-400">// SYS-v4.2</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-xs font-mono text-slate-400 uppercase tracking-widest">
            <span>WORLD ATHLETICS BENCHMARKING</span>
            <span className="text-rose-500">•</span>
            <span>GPT-4o KINETICS CORE</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-mono text-xs tracking-wider uppercase transition"
            title="Skip directly to dashboard"
          >
            Skip Intro ➔
          </button>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* STAGE 1: CINEMATIC HERO INTRO (TYPEWRITER ARRIVAL)                      */}
      {/* ======================================================================= */}
      {step === 'welcome' && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 text-center max-w-6xl mx-auto w-full space-y-8 sm:space-y-12">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs sm:text-sm font-black uppercase tracking-[0.3em] shadow-[0_0_35px_rgba(225,29,72,0.4)]">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Olympic High-Performance Biomechanics</span>
          </div>

          {/* Cinematic Typewriter Text Arrival */}
          <div
            onClick={handleSkipTypewriter}
            title="Click anywhere to fast-forward text arrival"
            className="cursor-pointer space-y-6 w-full"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.04] drop-shadow-[0_20px_40px_rgba(220,38,38,0.5)] min-h-[140px] sm:min-h-[190px] flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400">
                {displayedHeadline}
              </span>
              {!isHeadlineDone && (
                <span className="inline-block w-3 sm:w-5 md:w-6 h-10 sm:h-16 md:h-20 ml-2 bg-rose-500 animate-pulse align-middle shrink-0" />
              )}
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed min-h-[64px] flex items-center justify-center">
              <span>{displayedSubtitle}</span>
              {isHeadlineDone && !isSubtitleDone && (
                <span className="inline-block w-2.5 h-5 ml-2 bg-amber-400 animate-pulse align-middle shrink-0" />
              )}
            </p>
          </div>

          {/* Minimalist Telemetry Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-slate-400 font-mono tracking-widest uppercase pt-2">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold">
              <Activity className="w-4 h-4 text-rose-500" />
              <span>FAT SPRINT KINETICS</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2.5 text-amber-400 font-bold">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>GPT-4o PERIODIZATION</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>BILATERAL PRE-HAB</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setStep('roster')}
              className="group relative inline-flex items-center gap-4 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm sm:text-base uppercase tracking-[0.2em] shadow-[0_0_60px_rgba(220,38,38,0.7)] transition-all hover:scale-105 active:scale-95"
            >
              <span>ENTER HIGH-PERFORMANCE LAB</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            {(!isHeadlineDone || !isSubtitleDone) && (
              <span
                onClick={handleSkipTypewriter}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-mono tracking-widest uppercase cursor-pointer transition pt-1"
              >
                ⚡ Click anywhere to fast-forward animation
              </span>
            )}
          </div>
        </main>
      )}

      {/* ======================================================================= */}
      {/* STAGE 2: COACH & ATHLETES ONBOARDING GATE (FULLSCREEN CONSOLE)          */}
      {/* ======================================================================= */}
      {step === 'roster' && (
        <main className="relative z-10 flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-6 sm:px-12 py-8 space-y-6">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
            <div>
              <div className="text-[11px] font-mono tracking-[0.25em] text-rose-400 font-bold uppercase">
                STAGE 02 // SQUAD &amp; COACH AUTHORIZATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Lead Coach &amp; Squad Authorization
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Confirm coach identity and configure which squad members enter this active training session.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep('welcome')}
              className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider transition"
            >
              ← Cinematic Intro
            </button>
          </div>

          {/* Coach & Organization Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-rose-300 block font-mono">
                Lead Coach Name:
              </label>
              <input
                type="text"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                placeholder="Enter Coach Name (e.g. Coach Rudra Roy)"
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden transition font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-amber-300 block font-mono">
                Performance Centre / Organization:
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="National Athletics High Performance Centre"
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden transition font-bold"
              />
            </div>
          </div>

          {/* Athletes Roster Selection Section */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-500" />
                <label className="text-xs font-black uppercase tracking-wider text-white">
                  Athletes Under Coach {coachName || 'Coach'}:
                </label>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                  {selectedAthleteIds.length} of {athletes.length} Selected
                </span>
              </div>

              <div className="flex items-center gap-3">
                {athletes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-slate-300 hover:text-white font-mono underline"
                  >
                    {selectedAthleteIds.length === athletes.length ? 'Deselect All' : 'Select All Athletes'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsAddingNew(!isAddingNew)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl transition"
                >
                  <Plus className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isAddingNew ? 'Close Form' : 'Register New Athlete'}</span>
                </button>
              </div>
            </div>

            {/* Quick Add Form If Toggled */}
            {isAddingNew && (
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-rose-500/40 space-y-3">
                <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-rose-400" />
                  <span>Register Athlete Under Coach {coachName}:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Athlete Full Name (e.g. Akshat Singhal)"
                    value={newAthleteName}
                    onChange={(e) => setNewAthleteName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Primary Event (e.g. 100m Sprint, Long Jump)"
                    value={newAthleteEvent}
                    onChange={(e) => setNewAthleteEvent(e.target.value)}
                    className="bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Squad (e.g. Senior Sprint Squad)"
                    value={newAthleteSquad}
                    onChange={(e) => setNewAthleteSquad(e.target.value)}
                    className="bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleQuickAddAthlete}
                  className="px-5 py-2 text-xs font-black bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition shadow-md shadow-rose-950/60"
                >
                  Save &amp; Select Athlete
                </button>
              </div>
            )}

            {/* Search Filter Box (only if athletes exist) */}
            {athletes.length > 0 && (
              <input
                type="text"
                placeholder="Filter athletes by name, code, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-slate-600 font-mono"
              />
            )}

            {/* Athletes Selection Grid */}
            {athletes.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-rose-500/40 bg-slate-950/60 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">
                    0 Athletes Registered (Clean Production Environment)
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    All dummy demo athletes have been cleared. Use the form above to register your first athlete under Coach {coachName || 'Coach Rudra Roy'}!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {filteredAthletes.map((ath) => {
                  const isChecked = selectedAthleteIds.includes(ath.id);
                  return (
                    <div
                      key={ath.id}
                      onClick={() => toggleAthlete(ath.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-rose-950/40 border-rose-500/70 text-white shadow-sm'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg font-black flex items-center justify-center text-xs shrink-0 ${
                            isChecked ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ath.fullName
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs text-white truncate flex items-center gap-1.5">
                            <span className="truncate">{ath.fullName}</span>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              {ath.athleteCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            <span className="text-rose-400 font-bold">{ath.primaryEventName}</span>
                            <span> • {ath.trainingSquad}</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-rose-600 border-rose-500 text-white'
                            : 'border-slate-700 bg-slate-900 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Launch Action Bar */}
          <div className="pt-4 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-mono">
              Active Session: <strong className="text-white">{coachName || 'Coach'}</strong> with{' '}
              <strong className="text-rose-400 font-bold">{selectedAthleteIds.length} athletes</strong> loaded.
            </div>

            <button
              type="button"
              onClick={handleFinalLaunch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-950/60 transition hover:scale-[1.02]"
            >
              <span>INITIALIZE HIGH-PERFORMANCE LAB</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      )}

      {/* Bottom HUD Telemetry Footer */}
      <footer className="relative z-20 w-full px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-rose-500/20 bg-black/50 backdrop-blur-md text-[11px] font-mono text-slate-500 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>KINETIC TIMING SENSORS: ONLINE</span>
          <span className="text-slate-700">•</span>
          <span>ACCELERATION FAT TIMING: 10M / 30M / 60M</span>
        </div>
        <div>
          WORLD ATHLETICS SCORING SYSTEM • OPENROUTER GPT-4o
        </div>
      </footer>
    </div>
  );
}
