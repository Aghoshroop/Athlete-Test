'use client';

import React, { useState, useEffect } from 'react';
import { AthleteProfile } from '@/types/athlete';
import {
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Zap,
  Activity,
  Award,
} from 'lucide-react';

interface CinematicSplashModalProps {
  isOpen: boolean;
  onClose: () => void;
  athletes?: AthleteProfile[];
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
  athletes = [],
  onComplete,
  defaultCoachName = 'Coach Rudra Roy',
  defaultOrganization = 'National Athletics High Performance Centre',
}: CinematicSplashModalProps) {
  // Coach inputs
  const [coachName, setCoachName] = useState(defaultCoachName);
  const [organization, setOrganization] = useState(defaultOrganization);

  // Typewriter effect state
  const [displayedHeadline, setDisplayedHeadline] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [isHeadlineDone, setIsHeadlineDone] = useState(false);
  const [isSubtitleDone, setIsSubtitleDone] = useState(false);

  // Cinematic Typewriter Effect execution
  useEffect(() => {
    if (!isOpen) return;

    let headIdx = 0;
    let subIdx = 0;
    let subTimeout: NodeJS.Timeout | null = null;
    let subInterval: NodeJS.Timeout | null = null;

    setDisplayedHeadline('');
    setDisplayedSubtitle('');
    setIsHeadlineDone(false);
    setIsSubtitleDone(false);

    // Type headline smoothly character by character
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
          }, 15);
        }, 180);
      }
    }, 32);

    return () => {
      clearInterval(headInterval);
      if (subInterval) clearInterval(subInterval);
      if (subTimeout) clearTimeout(subTimeout);
    };
  }, [isOpen]);

  const handleSkipTypewriter = () => {
    setDisplayedHeadline(FULL_HEADLINE);
    setDisplayedSubtitle(FULL_SUBTITLE);
    setIsHeadlineDone(true);
    setIsSubtitleDone(true);
  };

  const handleLaunch = () => {
    const finalCoach = coachName.trim() || 'Coach Rudra Roy';
    const finalOrg = organization.trim() || 'National Athletics High Performance Centre';
    // No athlete asking required on entry: pass all existing athletes (if any) or empty
    onComplete(finalCoach, athletes.map((a) => a.id), finalOrg);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-[#07070a] text-white flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none animate-in fade-in duration-300">
      {/* Subtle, Sophisticated Ambient Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-rose-600/8 rounded-full blur-[180px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[30vw] h-[30vh] bg-amber-500/5 rounded-full blur-[160px]" />

      {/* Understated Executive Top Bar */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-slate-800/80 bg-black/40 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center font-black text-white text-xs italic shadow-sm">
            Ai
          </div>
          <div>
            <div className="font-mono text-xs tracking-[0.2em] text-slate-200 font-bold uppercase">
              ATHLETICS HIGH-PERFORMANCE LAB
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              NATIONAL PERFORMANCE BENCHMARKING SYSTEM
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLaunch}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs tracking-wider uppercase transition"
            title="Skip to Dashboard"
          >
            Skip to Platform ➔
          </button>
        </div>
      </header>

      {/* Main Centerpiece Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8 text-center max-w-4xl mx-auto w-full space-y-8 my-auto">
        {/* Subtle Institutional Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-[0.2em]">
          <Award className="w-3.5 h-3.5 text-rose-500" />
          <span>World Athletics Standard Diagnostics</span>
        </div>

        {/* Mature Cinematic Typewriter Headline */}
        <div
          onClick={handleSkipTypewriter}
          title="Click to fast-forward text arrival"
          className="cursor-pointer space-y-4 w-full"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.08] min-h-[90px] sm:min-h-[130px] flex items-center justify-center">
            <span className="text-white drop-shadow-sm">
              {displayedHeadline}
            </span>
            {!isHeadlineDone && (
              <span className="inline-block w-2 sm:w-3.5 h-8 sm:h-12 ml-2 bg-rose-500 animate-pulse align-middle shrink-0" />
            )}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed min-h-[48px] flex items-center justify-center">
            <span>{displayedSubtitle}</span>
            {isHeadlineDone && !isSubtitleDone && (
              <span className="inline-block w-1.5 h-4 ml-1.5 bg-amber-400 animate-pulse align-middle shrink-0" />
            )}
          </p>
        </div>

        {/* Minimalist Institutional Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-mono tracking-wider uppercase">
          <div className="flex items-center gap-2 text-slate-300">
            <Activity className="w-4 h-4 text-rose-500" />
            <span>01. FAT SPRINT KINETICS</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>02. GPT-4o PERIODIZATION</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>03. BILATERAL PRE-HAB</span>
          </div>
        </div>

        {/* Lead Coach Authorization Block (Zero Asking for Athletes) */}
        <div className="w-full max-w-md mx-auto p-6 sm:p-7 rounded-2xl bg-black/60 border border-slate-800/90 shadow-2xl backdrop-blur-md text-left space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-rose-500" />
              <span>Lead Coach Authorization</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify your coaching name to calibrate all testing models and AI directives.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block font-mono">
                Lead Coach Name:
              </label>
              <input
                type="text"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                placeholder="Coach Rudra Roy"
                className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden transition font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block font-mono">
                Performance Centre / Club:
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="National Athletics High Performance Centre"
                className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden transition font-semibold"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleLaunch}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
            >
              <span>ACCESS COACHING LAB</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-2.5 font-mono">
              Athletes are managed and registered anytime directly from Athlete Management inside.
            </p>
          </div>
        </div>
      </main>

      {/* Understated Executive Footer */}
      <footer className="relative z-20 w-full px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80 bg-black/40 backdrop-blur-md text-[11px] font-mono text-slate-500 shrink-0">
        <div>WORLD ATHLETICS BENCHMARKING (2026 EDITION)</div>
        <div>OPENROUTER GPT-4o SPORTS SCIENCE CORE</div>
      </footer>
    </div>
  );
}
