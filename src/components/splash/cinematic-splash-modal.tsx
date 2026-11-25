'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AthleteProfile } from '@/types/athlete';
import {
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Lock,
  FileText,
  HeartPulse,
  Cookie,
  Scale,
} from 'lucide-react';
import { db } from '@/lib/storage/local-storage-db';
import { CloudBackupPayload } from '@/types/cloud-backup';
import { LegalDocumentsModal, LegalDocTab } from '@/components/legal/legal-documents-modal';

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
  initialPhase?: 'typewriter' | 'prompt_coach';
}

const FULL_HEADLINE = 'THE MOST ADVANCED ATHLETIC TESTING PLATFORM';
const FULL_SUBTITLE =
  'WellPerform Olympic biomechanical kinetics. World Athletics scoring models. AI periodization.';

export function CinematicSplashModal(props: CinematicSplashModalProps) {
  if (!props.isOpen) return null;
  return <CinematicSplashContent {...props} />;
}

function CinematicSplashContent({
  onClose,
  athletes = [],
  onComplete,
  defaultOrganization = 'National Athletics High Performance Centre',
  initialPhase = 'typewriter',
}: CinematicSplashModalProps) {
  const [phase, setPhase] = useState<'typewriter' | 'prompt_coach' | 'welcome'>(initialPhase);
  const [isDissolving, setIsDissolving] = useState(false);

  // User input states
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState(() => db.getCoachEmail() || '');
  const [errorMessage, setErrorMessage] = useState('');

  // Cloud detection state
  const [isCheckingCloud, setIsCheckingCloud] = useState(false);
  const [foundCloudBackup, setFoundCloudBackup] = useState<CloudBackupPayload | null>(null);
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);

  // Legal document modal state
  const [legalModalTab, setLegalModalTab] = useState<LegalDocTab | null>(null);

  // Typewriter state
  const [displayedHeadline, setDisplayedHeadline] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [isHeadlineDone, setIsHeadlineDone] = useState(false);
  const [isSubtitleDone, setIsSubtitleDone] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const coachNameRef = useRef(coachName);

  const handleNameChange = (val: string) => {
    coachNameRef.current = val;
    setCoachName(val);
    if (errorMessage) setErrorMessage('');
  };

  const handleEmailChange = (val: string) => {
    setCoachEmail(val);
    if (errorMessage) setErrorMessage('');
    const clean = val.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setFoundCloudBackup(null);
      setCloudMessage(null);
    }
  };

  // 1. Scene 1: Slow cinematic typewriter execution on mount (when starting from intro)
  useEffect(() => {
    if (initialPhase !== 'typewriter') {
      return;
    }

    let headIdx = 0;
    let subIdx = 0;
    let subTimeout: NodeJS.Timeout | null = null;
    let subInterval: NodeJS.Timeout | null = null;
    let dissolveTimeout: NodeJS.Timeout | null = null;

    const headInterval = setInterval(() => {
      headIdx++;
      if (headIdx <= FULL_HEADLINE.length) {
        setDisplayedHeadline(FULL_HEADLINE.slice(0, headIdx));
      } else {
        clearInterval(headInterval);
        setIsHeadlineDone(true);

        subTimeout = setTimeout(() => {
          subInterval = setInterval(() => {
            subIdx++;
            if (subIdx <= FULL_SUBTITLE.length) {
              setDisplayedSubtitle(FULL_SUBTITLE.slice(0, subIdx));
            } else {
              if (subInterval) clearInterval(subInterval);
              setIsSubtitleDone(true);

              dissolveTimeout = setTimeout(() => {
                setIsDissolving(true);
                setTimeout(() => {
                  setPhase('prompt_coach');
                  setIsDissolving(false);
                }, 800);
              }, 2200);
            }
          }, 20);
        }, 250);
      }
    }, 38);

    return () => {
      clearInterval(headInterval);
      if (subInterval) clearInterval(subInterval);
      if (subTimeout) clearTimeout(subTimeout);
      if (dissolveTimeout) clearTimeout(dissolveTimeout);
    };
  }, [initialPhase]);

  // Focus input when entering Scene 2
  useEffect(() => {
    if (phase === 'prompt_coach' && !isDissolving) {
      const t = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [phase, isDissolving]);

  // Cloud backup detector: Debounced lookup when email changes
  useEffect(() => {
    const clean = coachEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingCloud(true);
      try {
        const res = await db.fetchCloudBackup(clean);
        if (res.found && res.backup) {
          setFoundCloudBackup(res.backup);
          if (!coachNameRef.current.trim() && res.backup.coachName) {
            coachNameRef.current = res.backup.coachName;
            setCoachName(res.backup.coachName);
          }
          const athCount = res.backup.stats?.athleteCount ?? res.backup.athletes?.length ?? 0;
          const assCount = res.backup.stats?.assessmentCount ?? res.backup.assessments?.length ?? 0;
          setCloudMessage(
            `Account Recognized! Cloud backup found for ${clean} with ${athCount} athletes and ${assCount} assessments. All data will be restored automatically on entry.`
          );
        } else {
          setFoundCloudBackup(null);
          setCloudMessage(
            `Ready to link: All squad data and testing records will automatically backup under ${clean}.`
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

    if (foundCloudBackup) {
      db.restoreFromBackupPayload(foundCloudBackup);
      if (foundCloudBackup.athletes && foundCloudBackup.athletes.length > 0) {
        restoredIds = foundCloudBackup.athletes.map((a) => a.id);
      }
    } else {
      db.syncToCloud(trimmedEmail).catch(() => {});
    }

    setIsDissolving(true);
    setTimeout(() => {
      setPhase('welcome');
      setIsDissolving(false);

      setTimeout(() => {
        setIsDissolving(true);
        setTimeout(() => {
          onComplete(trimmedName, restoredIds, defaultOrganization, trimmedEmail);
          onClose();
        }, 700);
      }, 2200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-[100dvh] min-h-[100dvh] bg-[#020204] text-white flex flex-col justify-between px-4 sm:px-8 py-4 sm:py-6 select-none overflow-y-auto overflow-x-hidden">
      {/* Background cinematic vignette and subtle ambient glow */}
      <div className="fixed inset-0 bg-radial-vignette opacity-85 pointer-events-none" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ======================================================================= */}
      {/* TOP BRAND ANCHOR: OFFICIAL WELLPERFORM LOGO & WORDMARK                  */}
      {/* ======================================================================= */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between gap-3 shrink-0 pt-1">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_0_22px_rgba(237,3,3,0.55)] border border-red-400/40 bg-[#ed0303] flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="WellPerform Logo"
              width={44}
              height={44}
              priority
              unoptimized
              className="w-full h-full object-cover scale-[1.08]"
            />
          </div>
          <div className="text-left">
            <div className="text-sm sm:text-base font-black tracking-wide leading-none flex items-center">
              <span className="text-white">Well</span>
              <span className="text-rose-500">Perform</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
              High-Performance Athletics &amp; Sports Science Lab
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local-First Privacy &bull; Verified WA &amp; AFI Norms</span>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* CENTER CONTENT STAGE                                                    */}
      {/* ======================================================================= */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto py-6 sm:py-8 w-full">
        {/* SCENE 1: TYPEWRITER */}
        {phase === 'typewriter' && (
          <div
            className={`max-w-4xl mx-auto text-center space-y-5 transition-all duration-700 ${
              isDissolving ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'
            }`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(237,3,3,0.65)] border border-red-400/45 bg-[#ed0303]">
              <Image
                src="/logo.png"
                alt="WellPerform Emblem"
                width={80}
                height={80}
                priority
                unoptimized
                className="w-full h-full object-cover scale-[1.08]"
              />
            </div>

            <h1 className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-[1.1] min-h-[90px] sm:min-h-[140px] flex items-center justify-center">
              <span className="text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.15)]">
                {displayedHeadline}
              </span>
              {!isHeadlineDone && (
                <span className="inline-block w-2 sm:w-3.5 h-7 sm:h-12 ml-2 bg-rose-500 animate-pulse align-middle shrink-0" />
              )}
            </h1>

            <p className="text-xs sm:text-lg text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed min-h-[44px] flex items-center justify-center">
              <span>{displayedSubtitle}</span>
              {isHeadlineDone && !isSubtitleDone && (
                <span className="inline-block w-1.5 h-4 ml-1.5 bg-amber-400 animate-pulse align-middle shrink-0" />
              )}
            </p>

            <div>
              <button
                type="button"
                onClick={() => setPhase('prompt_coach')}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-semibold text-slate-300 hover:text-white transition"
              >
                <span>Skip to Coach Login</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* SCENE 2: LOGIN / COACH AUTHORIZATION */}
        {phase === 'prompt_coach' && (
          <div
            className={`max-w-xl w-full mx-auto text-center space-y-5 sm:space-y-6 transition-all duration-700 ${
              isDissolving ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'
            }`}
          >
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono tracking-[0.22em] text-rose-400 uppercase">
                <UserCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>WELLPERFORM &bull; COACH PORTAL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Authorize Coach Identity &amp; Cloud Sync
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Sign in with your coach name and Gmail to calibrate squad analytics and sync records securely across mobile, tablet, and desktop.
              </p>
            </div>

            {/* Inputs: Coach Name & Gmail */}
            <div className="space-y-4 max-w-md mx-auto text-left">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                  Coach Full Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={coachName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCoachSubmit();
                  }}
                  placeholder="Type your name..."
                  className="w-full bg-slate-950/90 border-b-2 border-slate-700 focus:border-rose-500 rounded-t-xl px-4 py-3 text-base sm:text-lg font-bold text-white placeholder:text-slate-600 focus:outline-hidden transition shadow-inner"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                  <span>Coach Gmail (Cross-Device Cloud Sync)</span>
                  {isCheckingCloud && (
                    <span className="text-[10px] text-rose-400 flex items-center gap-1 font-mono">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Checking cloud...
                    </span>
                  )}
                </label>
                <input
                  type="email"
                  value={coachEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCoachSubmit();
                  }}
                  placeholder="e.g. coach.name@gmail.com"
                  className="w-full bg-slate-950/90 border-b-2 border-slate-700 focus:border-rose-500 rounded-t-xl px-4 py-3 text-sm sm:text-base font-semibold text-white placeholder:text-slate-600 focus:outline-hidden transition shadow-inner"
                />
              </div>

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
                className={`w-full py-3.5 sm:py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                  coachName.trim() && coachEmail.trim()
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:scale-[1.02] cursor-pointer'
                    : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>AUTHORIZE COACH &amp; ENTER</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 tracking-wide text-center leading-relaxed">
                By authorizing entry, you acknowledge WellPerform&apos;s{' '}
                <button
                  type="button"
                  onClick={() => setLegalModalTab('privacy')}
                  className="underline text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Privacy Policy
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() => setLegalModalTab('biometric')}
                  className="underline text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Biometric Data Terms
                </button>
                , and{' '}
                <button
                  type="button"
                  onClick={() => setLegalModalTab('terms')}
                  className="underline text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Terms of Service
                </button>
                .
              </p>
            </div>
          </div>
        )}

        {/* SCENE 3: WELCOME */}
        {phase === 'welcome' && (
          <div
            className={`max-w-2xl mx-auto text-center space-y-5 transition-all duration-700 ${
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
                ? `Cloud Backup Restored for ${coachEmail.trim()} • Launching WellPerform...`
                : `Cloud Sync Active for ${coachEmail.trim()} • Launching WellPerform...`}
            </p>

            <div className="w-36 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 mx-auto rounded-full animate-pulse mt-6" />
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* BOTTOM LEGAL, PRIVACY POLICY & COMPLIANCE FOOTER                        */}
      {/* ======================================================================= */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto pt-3.5 pb-1 border-t border-slate-800/80 shrink-0 text-center space-y-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setLegalModalTab('privacy')}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-rose-400 font-semibold transition"
          >
            <Lock className="w-3 h-3 text-rose-500" />
            <span>Privacy Policy</span>
          </button>
          <span className="text-slate-700">&bull;</span>
          <button
            type="button"
            onClick={() => setLegalModalTab('terms')}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-rose-400 font-semibold transition"
          >
            <FileText className="w-3 h-3 text-rose-500" />
            <span>Terms of Service</span>
          </button>
          <span className="text-slate-700">&bull;</span>
          <button
            type="button"
            onClick={() => setLegalModalTab('biometric')}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-rose-400 font-semibold transition"
          >
            <ShieldCheck className="w-3 h-3 text-rose-500" />
            <span>Athlete Data &amp; DPDP Compliance</span>
          </button>
          <span className="text-slate-700">&bull;</span>
          <button
            type="button"
            onClick={() => setLegalModalTab('medical')}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-rose-400 font-semibold transition"
          >
            <HeartPulse className="w-3 h-3 text-rose-500" />
            <span>Medical &amp; Anti-Doping Notice</span>
          </button>
          <span className="text-slate-700">&bull;</span>
          <button
            type="button"
            onClick={() => setLegalModalTab('cookies')}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-rose-400 font-semibold transition"
          >
            <Cookie className="w-3 h-3 text-rose-500" />
            <span>Cookie &amp; Offline Storage</span>
          </button>
          <span className="text-slate-700">&bull;</span>
          <button
            type="button"
            onClick={() => setLegalModalTab('legal')}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-rose-400 font-semibold transition"
          >
            <Scale className="w-3 h-3 text-rose-500" />
            <span>Legal &amp; Scientific Attributions</span>
          </button>
        </div>

        <div className="space-y-1 text-[10px] text-slate-500 leading-relaxed max-w-3xl mx-auto">
          <p>
            Not a medical device &bull; Maximal testing requires qualified coaching supervision &amp; clearance &bull;
            Supports WADA &amp; NADA clean sport guidelines &bull; Zero third-party ad tracking cookies.
          </p>
          <p className="text-slate-400 font-medium">
            &copy; 2026 WellPerform. All rights reserved. World Athletics, AFI, Olympic &amp; Eurofit standards cited strictly for empirical sports benchmarking.
          </p>
        </div>
      </footer>

      <LegalDocumentsModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab ?? 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}
