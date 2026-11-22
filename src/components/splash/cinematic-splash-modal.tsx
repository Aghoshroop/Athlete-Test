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

  // Coach inputs
  const [coachName, setCoachName] = useState(defaultCoachName);
  const [organization, setOrganization] = useState(defaultOrganization);

  // Selected athletes under this coach (defaults to all athletes)
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>(() =>
    athletes.map((a) => a.id)
  );

  // Quick add athlete state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteEvent, setNewAthleteEvent] = useState('100m Sprint');
  const [newAthleteSquad, setNewAthleteSquad] = useState('Senior Sprint Squad');

  // Search filter for athletes list in gate
  const [searchQuery, setSearchQuery] = useState('');

  // Keep selected athletes in sync when athletes prop changes
  useEffect(() => {
    if (athletes.length > 0 && selectedAthleteIds.length === 0) {
      setSelectedAthleteIds(athletes.map((a) => a.id));
    }
  }, [athletes]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030306]/95 backdrop-blur-2xl p-3 sm:p-6 overflow-y-auto select-none animate-in fade-in duration-300">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Cybernetic Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ff0000 1px, transparent 1px), linear-gradient(to bottom, #ff0000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-4xl w-full rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0d0714]/95 to-slate-950/95 border border-rose-500/35 shadow-[0_0_80px_rgba(220,38,38,0.3)] overflow-hidden my-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center font-black text-white text-xs italic shadow-md shadow-red-950/60">
              AK
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white">
                AERO·KINETIX 360
              </span>
              <span className="text-[9px] text-rose-400 font-mono block">
                WORLD ATHLETICS HIGH-PERFORMANCE LAB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              title="Skip intro to dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* STAGE 1: CINEMATIC HERO INTRO                                           */}
        {/* ======================================================================= */}
        {step === 'welcome' && (
          <div className="p-8 sm:p-12 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-950/50">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>The Most Advanced Athletic Testing Platform</span>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 drop-shadow-[0_10px_20px_rgba(220,38,38,0.4)]">
                  AERO·KINETIX 360
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                Olympic-grade biomechanical kinetics, World Athletics scoring models, and OpenRouter GPT-4o artificial intelligence—designed for elite coaches and champions.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span>Kinetics &amp; FAT Timing</span>
                </div>
                <p className="text-xs text-slate-400">
                  Precision 10m/30m sprint timing, CMJ vertical impulse, and Reactive Strength Index (RSI).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>GPT-4o Periodization</span>
                </div>
                <p className="text-xs text-slate-400">
                  Instant periodized microcycles, Dan Pfaff sprint mechanics, and Coach Rudra Roy track cues.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Bilateral Pre-Hab</span>
                </div>
                <p className="text-xs text-slate-400">
                  Automatic detection of unilateral deficits (&gt;5% &amp; &gt;10%) to shield hamstrings and adductors.
                </p>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setStep('roster')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all hover:scale-105"
              >
                <span>ENTER HIGH-PERFORMANCE LAB</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STAGE 2: COACH & ATHLETES ONBOARDING GATE                               */}
        {/* ======================================================================= */}
        {step === 'roster' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-rose-500" />
                  <span>Coach &amp; Squad Authorization Gate</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Confirm coach identity and select which athletes to load into this active training session.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('welcome')}
                className="text-xs text-slate-400 hover:text-white font-mono"
              >
                ← Back
              </button>
            </div>

            {/* Coach & Organization Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-rose-300 block">
                  Lead Coach Name:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    placeholder="Enter Coach Name (e.g. Coach Rudra Roy)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                  Performance Centre / Organization:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="National Athletics High Performance Centre"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 transition font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Athletes Roster Selection Section */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-500" />
                  <label className="text-[11px] font-black uppercase tracking-wider text-white">
                    Select Athletes Under Coach {coachName || 'Coach'}:
                  </label>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                    {selectedAthleteIds.length} of {athletes.length} Selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-slate-300 hover:text-white font-mono underline"
                  >
                    {selectedAthleteIds.length === athletes.length ? 'Deselect All' : 'Select All Athletes'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddingNew(!isAddingNew)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isAddingNew ? 'Cancel' : 'Add New Athlete'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Add Form If Toggled */}
              {isAddingNew && (
                <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-3">
                  <h4 className="text-xs font-extrabold text-white">Quick Register Athlete Under {coachName}:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Athlete Full Name (e.g. Akshat Singhal)"
                      value={newAthleteName}
                      onChange={(e) => setNewAthleteName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-rose-500"
                    />
                    <input
                      type="text"
                      placeholder="Primary Event (e.g. 100m Sprint, Long Jump)"
                      value={newAthleteEvent}
                      onChange={(e) => setNewAthleteEvent(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-rose-500"
                    />
                    <input
                      type="text"
                      placeholder="Squad (e.g. Senior Sprint Squad)"
                      value={newAthleteSquad}
                      onChange={(e) => setNewAthleteSquad(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickAddAthlete}
                    className="px-4 py-1.5 text-xs font-black bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition"
                  >
                    Add &amp; Select Athlete
                  </button>
                </div>
              )}

              {/* Search Filter Box */}
              <input
                type="text"
                placeholder="Filter athletes by name, code, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-slate-600"
              />

              {/* Athletes Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {filteredAthletes.map((ath) => {
                  const isChecked = selectedAthleteIds.includes(ath.id);
                  return (
                    <div
                      key={ath.id}
                      onClick={() => toggleAthlete(ath.id)}
                      className={`cursor-pointer p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
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
            </div>

            {/* Launch Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Active Session: <strong className="text-white">{coachName || 'Coach'}</strong> with{' '}
                <strong className="text-rose-400 font-mono">{selectedAthleteIds.length} athletes</strong> loaded.
              </div>

              <button
                type="button"
                onClick={handleFinalLaunch}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-950/60 transition hover:scale-[1.02]"
              >
                <span>INITIALIZE HIGH-PERFORMANCE LAB</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
