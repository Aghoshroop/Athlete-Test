'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AthleteProfile } from '@/types/athlete';
import { ArrowRight, UserCheck, ShieldCheck, Cloud, CheckCircle2, RefreshCw } from 'lucide-react';
import { db } from '@/lib/storage/local-storage-db';
import { CloudBackupPayload } from '@/types/cloud-backup';

interface CinematicSplashModalProps {
  isOpen: boolean;
  onClose: () => void;
  athletes?: AthleteProfile[];
  onComplete: (
    coachName: string,
    selectedAthleteIds: string[],
    organizationName: string,
    coachEmail?: string
  ) => void;
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
  // Phase 2: Dissolve into asking for coach name & gmail
  // Phase 3: Cinematic personalized welcome reveal before entering
  const [phase, setPhase] = useState<'typewriter' | 'prompt_coach' | 'welcome'>('typewriter');
  const [isDissolving, setIsDissolving] = useState(false);

  // User input states
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cloud detection state
  const [isCheckingCloud, setIsCheckingCloud] = useState(false);
  const [foundCloudBackup, setFoundCloudBackup] = useState<CloudBackupPayload | null>(null);
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);

  // Typewriter state
  const [displayedHeadline, setDisplayedHeadline] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [isHeadlineDone, setIsHeadlineDone] = useState(false);
  const [isSubtitleDone, setIsSubtitleDone] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

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
    setCoachEmail(db.getCoachEmail() || '');
    setErrorMessage('');
    setFoundCloudBackup(null);
    setCloudMessage(null);

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
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [phase, isDissolving]);

  // Cloud backup detector: Debounced lookup when email changes
  useEffect(() => {
    const clean = coachEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setFoundCloudBackup(null);
      setCloudMessage(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingCloud(true);
      try {
        const res = await db.fetchCloudBackup(clean);
        if (res.found && res.backup) {
          setFoundCloudBackup(res.backup);
          // If coach name is not filled yet, auto-populate from backup
          if (!coachName.trim() && res.backup.coachName) {
            setCoachName(res.backup.coachName);
          }
          const athCount = res.backup.stats?.athleteCount ?? res.backup.athletes?.length ?? 0;
          const assCount = res.backup.stats?.assessmentCount ?? res.backup.assessments?.length ?? 0;
          setCloudMessage(
            `✨ Account Recognized! Cloud backup found for ${clean} with ${athCount} athletes and ${assCount} assessments. All data will be restored automatically on entry.`
          );
        } else {
          setFoundCloudBackup(null);
          setCloudMessage(
            `☁️ Ready to link: All squad data and testing records will automatically backup under ${clean}.`
          );
        }
      } catch {
        // Ignore lookup error
      } finally {
        setIsCheckingCloud(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [coachEmail]);

  // Handle coach submission: user MUST provide a name and email
  const handleCoachSubmit = async () => {
    const trimmedName = coachName.trim();
    const trimmedEmail = coachEmail.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMessage('Please enter your name to authorize access.');
      nameInputRef.current?.focus();
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please enter a valid Gmail address to enable cross-device cloud sync.');
      return;
    }

    setErrorMessage('');
    db.setCoachEmail(trimmedEmail);

    let restoredIds: string[] = athletes.map((a) => a.id);

    // If a cloud backup was found for this Gmail, restore it immediately!
    if (foundCloudBackup) {
      db.restoreFromBackupPayload(foundCloudBackup);
      if (foundCloudBackup.athletes && foundCloudBackup.athletes.length > 0) {
        restoredIds = foundCloudBackup.athletes.map((a) => a.id);
      }
    } else {
      // Create initial cloud snapshot
      db.syncToCloud(trimmedEmail).catch(() => {});
    }

    // Dissolve into Scene 3: Cinematic welcome reveal
    setIsDissolving(true);
    setTimeout(() => {
      setPhase('welcome');
      setIsDissolving(false);

      // Hold welcome message for 2.4 seconds before entering dashboard
      setTimeout(() => {
        setIsDissolving(true);
        setTimeout(() => {
          onComplete(trimmedName, restoredIds, defaultOrganization, trimmedEmail);
          onClose();
        }, 700);
      }, 2400);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-[#020204] text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden">
      {/* Background cinematic vignette and subtle ambient glow */}
      <div className="absolute inset-0 bg-radial-vignette opacity-85 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

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
      {/* SCENE 2: CINEMATIC DISSOLVE TO ASKING FOR COACH NAME & GMAIL CLOUD SYNC */}
      {/* ======================================================================= */}
      {phase === 'prompt_coach' && (
        <div
          className={`relative z-10 max-w-xl w-full mx-auto text-center space-y-6 sm:space-y-7 transition-all duration-700 ${
            isDissolving ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'
          }`}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono tracking-[0.25em] text-rose-400 uppercase">
              <UserCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>LEAD PERFORMANCE COACH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Authorize Coach Identity &amp; Cloud Sync
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your name calibrates all directives. Your Gmail automatically links and synchronizes all your data across every device.
            </p>
          </div>

          {/* Inputs: Coach Name & Gmail */}
          <div className="space-y-4 max-w-md mx-auto text-left">
            {/* Input 1: Coach Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                Coach Full Name
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={coachName}
                onChange={(e) => {
                  setCoachName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCoachSubmit();
                }}
                placeholder="Type your name..."
                className="w-full bg-slate-950/80 border-b-2 border-slate-700 focus:border-rose-500 rounded-t-xl px-4 py-3 text-base sm:text-xl font-bold text-white placeholder:text-slate-600 focus:outline-hidden transition shadow-inner"
              />
            </div>

            {/* Input 2: Coach Gmail for Cloud Sync */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1 flex items-center justify-between">
                <span>Coach Gmail (Cross-Device Cloud Sync)</span>
                {isCheckingCloud && (
                  <span className="text-[10px] text-rose-400 flex items-center gap-1 font-mono">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Checking cloud...
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={coachEmail}
                  onChange={(e) => {
                    setCoachEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCoachSubmit();
                  }}
                  placeholder="e.g. coach.rudra@gmail.com"
                  className="w-full bg-slate-950/80 border-b-2 border-slate-700 focus:border-rose-500 rounded-t-xl px-4 py-3 text-sm sm:text-base font-semibold text-white placeholder:text-slate-600 focus:outline-hidden transition shadow-inner"
                />
              </div>
            </div>

            {/* Cloud Status Detector Badge */}
            {cloudMessage && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                  foundCloudBackup
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  {foundCloudBackup ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Cloud className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{cloudMessage}</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-rose-400 font-mono tracking-wide animate-shake text-center">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleCoachSubmit}
              disabled={!coachName.trim() || !coachEmail.trim()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                coachName.trim() && coachEmail.trim()
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>AUTHORIZE COACH &amp; ENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-slate-500 font-mono tracking-wider text-center">
              Press Enter ↵ to proceed • Cross-device cloud sync is automatically enabled
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
            {foundCloudBackup
              ? `Cloud Backup Restored for ${coachEmail.trim()} • Initializing Athletics Lab...`
              : `Cloud Sync Active for ${coachEmail.trim()} • Initializing Athletics Lab...`}
          </p>

          <div className="w-36 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 mx-auto rounded-full animate-pulse mt-6" />
        </div>
      )}
    </div>
  );
}
