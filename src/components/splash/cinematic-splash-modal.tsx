'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AthleteProfile } from '@/types/athlete';
import { ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

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
const FULL_SUBTITLE = "Olympic-grade biomechanical kinetics. World Athletics scoring models. GPT-4o intelligence.";

export function CinematicSplashModal({
  isOpen,
  onClose,
  athletes = [],
  onComplete,
  defaultOrganization = 'National Athletics High Performance Centre',
}: CinematicSplashModalProps) {
  // Phase 1: Pure dark screen with slow typewriter
  // Phase 2: Dissolve into asking for coach name (nothing else, no skip)
  // Phase 3: Cinematic personalized welcome reveal before entering
  const [phase, setPhase] = useState<'typewriter' | 'prompt_coach' | 'welcome'>('typewriter');
  const [isDissolving, setIsDissolving] = useState(false);

  // NO default coach name - user MUST enter their name
  const [coachName, setCoachName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Typewriter state
  const [displayedHeadline, setDisplayedHeadline] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [isHeadlineDone, setIsHeadlineDone] = useState(false);
  const [isSubtitleDone, setIsSubtitleDone] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Scene 1: Slow cinematic typewriter execution
  useEffect(() => {
    if (!isOpen) return;

    // Reset all states on entrance
    setPhase('typewriter');
    setIsDissolving(false);
    setDisplayedHeadline('');
    setDisplayedSubtitle('');
    setIsHeadlineDone(false);
    setIsSubtitleDone(false);
    setCoachName('');
    setErrorMessage('');

    let headIdx = 0;
    let subIdx = 0;
    let subTimeout: NodeJS.Timeout | null = null;
    let subInterval: NodeJS.Timeout | null = null;
    let dissolveTimeout: NodeJS.Timeout | null = null;

    // Type headline slowly (~42ms)
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

              // Hold message on the dark screen for 2.4 seconds, then dissolve into Scene 2
              dissolveTimeout = setTimeout(() => {
                setIsDissolving(true);
                setTimeout(() => {
                  setPhase('prompt_coach');
                  setIsDissolving(false);
                }, 800);
              }, 2400);
            }
          }, 22);
        }, 250);
      }
    }, 42);

    return () => {
      clearInterval(headInterval);
      if (subInterval) clearInterval(subInterval);
      if (subTimeout) clearTimeout(subTimeout);
      if (dissolveTimeout) clearTimeout(dissolveTimeout);
    };
  }, [isOpen]);

  // Focus input when entering Scene 2
  useEffect(() => {
    if (phase === 'prompt_coach' && !isDissolving) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [phase, isDissolving]);

  // Handle coach submission: user MUST provide a name
  const handleCoachSubmit = () => {
    const trimmed = coachName.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your name to authorize access.');
      inputRef.current?.focus();
      return;
    }

    setErrorMessage('');
    // Dissolve into Scene 3: Cinematic welcome reveal
    setIsDissolving(true);
    setTimeout(() => {
      setPhase('welcome');
      setIsDissolving(false);

      // Hold welcome message for 2.2 seconds before entering dashboard
      setTimeout(() => {
        setIsDissolving(true);
        setTimeout(() => {
          onComplete(trimmed, athletes.map((a) => a.id), defaultOrganization);
          onClose();
        }, 700);
      }, 2200);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-[#020204] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Subtle, soft cinematic vignette */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-[#020204]/60 to-[#020204]" />

      {/* ======================================================================= */}
      {/* SCENE 1: PURE DARK SCREEN WITH SLOW CINEMATIC TYPEWRITER MESSAGE        */}
      {/* ======================================================================= */}
      {phase === 'typewriter' && (
        <div
          className={`relative z-10 max-w-4xl mx-auto text-center space-y-6 transition-all duration-800 ${
            isDissolving ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          {/* Main Headline Typing Character by Character */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-[1.1] min-h-[110px] sm:min-h-[150px] flex items-center justify-center">
            <span className="text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
              {displayedHeadline}
            </span>
            {!isHeadlineDone && (
              <span className="inline-block w-2 sm:w-3.5 h-8 sm:h-12 ml-2 bg-rose-500 animate-pulse align-middle shrink-0" />
            )}
          </h1>

          {/* Subtitle Message Typing Underneath */}
          <p className="text-sm sm:text-lg text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed min-h-[48px] flex items-center justify-center">
            <span>{displayedSubtitle}</span>
            {isHeadlineDone && !isSubtitleDone && (
              <span className="inline-block w-1.5 h-4 ml-1.5 bg-amber-400 animate-pulse align-middle shrink-0" />
            )}
          </p>
        </div>
      )}

      {/* ======================================================================= */}
      {/* SCENE 2: CINEMATIC DISSOLVE TO ASKING FOR COACH NAME (NOTHING ELSE)     */}
      {/* ======================================================================= */}
      {phase === 'prompt_coach' && (
        <div
          className={`relative z-10 max-w-xl w-full mx-auto text-center space-y-8 transition-all duration-700 ${
            isDissolving ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono tracking-[0.25em] text-rose-400 uppercase">
              <UserCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>LEAD PERFORMANCE COACH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enter Coach Name to Initialize
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your name will calibrate all kinematics directives and reports across the lab.
            </p>
          </div>

          {/* Single Focused Input — ONLY the Coach Name */}
          <div className="space-y-4 max-w-md mx-auto">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={coachName}
                onChange={(e) => {
                  setCoachName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCoachSubmit();
                  }
                }}
                placeholder="Type your name..."
                className="w-full bg-slate-950/80 border-b-2 border-slate-700 focus:border-rose-500 rounded-t-xl px-4 py-3.5 text-center text-lg sm:text-2xl font-bold text-white placeholder:text-slate-600 focus:outline-hidden transition shadow-inner"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-mono tracking-wide animate-shake">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleCoachSubmit}
              disabled={!coachName.trim()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                coachName.trim()
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>AUTHORIZE COACH &amp; ENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-slate-600 font-mono tracking-wider">
              Press Enter ↵ to proceed • Athletes can be registered inside
            </p>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* SCENE 3: CINEMATIC WELCOME REVEAL BEFORE DISSOLVING INTO PLATFORM       */}
      {/* ======================================================================= */}
      {phase === 'welcome' && (
        <div
          className={`relative z-10 max-w-2xl mx-auto text-center space-y-5 transition-all duration-700 ${
            isDissolving ? 'opacity-0 scale-105 blur-lg' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-[11px] font-mono tracking-[0.3em] text-rose-300 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>ACCESS AUTHORIZED</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase">
            Welcome, {coachName.trim()}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-widest uppercase">
            Initializing High-Performance Athletics Lab...
          </p>

          <div className="w-36 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 mx-auto rounded-full animate-pulse mt-6" />
        </div>
      )}
    </div>
  );
}
