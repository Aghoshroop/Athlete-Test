'use client';

import React from 'react';
import Image from 'next/image';
import { SportZone } from '@/types/zone';
import {
  ArrowRight,
  Layers,
  LogOut,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Trophy,
  Users,
} from 'lucide-react';

interface ZoneSelectorPageProps {
  coachName: string;
  coachEmail?: string;
  trackAthleteCount: number;
  multiAthleteCount: number;
  onSelectZone: (zone: SportZone) => void;
  onLogout: () => void;
  theme?: 'bright' | 'dark';
  onToggleTheme?: () => void;
}

export function ZoneSelectorPage({
  coachName,
  coachEmail,
  trackAthleteCount,
  multiAthleteCount,
  onSelectZone,
  onLogout,
  theme = 'bright',
  onToggleTheme,
}: ZoneSelectorPageProps) {
  const isBright = theme === 'bright';

  return (
    <div
      className={`min-h-[100dvh] flex flex-col justify-between px-4 sm:px-8 py-5 sm:py-7 transition-colors duration-200 ${
        isBright
          ? 'bg-[#f6f7fb] text-slate-900'
          : 'bg-[#07070b] text-slate-100'
      }`}
    >
      {/* Top Bar */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(237,3,3,0.45)] border border-red-400/40 bg-[#ed0303] shrink-0">
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
          <div>
            <div className="text-sm sm:text-base font-black tracking-wide leading-none flex items-center">
              <span className={isBright ? 'text-slate-900' : 'text-white'}>Well</span>
              <span className="text-rose-500">Perform</span>
            </div>
            <p className={`text-[11px] font-medium mt-0.5 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
              Coach Testing Portal {coachEmail ? `• ${coachEmail}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              title={isBright ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${
                isBright
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-900 border-slate-800 text-rose-300 hover:bg-slate-800'
              }`}
            >
              {isBright ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition ${
              isBright
                ? 'bg-white border-red-200 text-red-700 hover:bg-red-50 shadow-xs'
                : 'bg-red-950/50 border-red-500/40 text-rose-200 hover:bg-red-600 hover:text-white'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto my-auto py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
              isBright
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-red-950/50 border-red-500/35 text-rose-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Signed in as {coachName || 'Lead Coach'}</span>
          </div>

          <h1
            className={`text-2xl sm:text-4xl font-black tracking-tight ${
              isBright ? 'text-slate-950' : 'text-white'
            }`}
          >
            Choose Your Performance Testing Zone
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
            <strong>Track &amp; Field</strong> and <strong>Multi-Sports</strong> maintain strictly isolated athlete
            rosters, testing batteries, squad groups, and diagnostic reports so disciplines never mix.
          </p>
        </div>

        {/* Two Dedicated Zone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          {/* ZONE 1: TRACK & FIELD */}
          <button
            type="button"
            onClick={() => onSelectZone('track_and_field')}
            className={`group text-left rounded-3xl p-6 sm:p-8 border transition-all duration-200 flex flex-col justify-between relative overflow-hidden hover:scale-[1.01] active:scale-[0.99] ${
              isBright
                ? 'bg-white border-red-200/90 hover:border-red-500 shadow-lg shadow-red-950/5 hover:shadow-xl hover:shadow-red-500/10'
                : 'bg-gradient-to-br from-[#14090c] via-[#0e0e14] to-[#0b0b10] border-red-500/35 hover:border-red-500 shadow-2xl shadow-red-950/30'
            }`}
          >
            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                  <Trophy className="w-6 h-6" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                    isBright
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-red-950/60 text-rose-300 border-red-500/30'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  {trackAthleteCount} Track Athlete{trackAthleteCount === 1 ? '' : 's'}
                </span>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose-500 font-bold">
                  Olympic Athletics Engine
                </div>
                <h2
                  className={`text-xl sm:text-2xl font-black mt-1 ${
                    isBright ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Track &amp; Field Zone
                </h2>
                <p
                  className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                    isBright ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  Built exclusively for Track &amp; Field coaches managing sprinters, hurdlers, jumpers, throwers,
                  distance runners, race walkers, and combined events.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isBright ? 'bg-slate-50 border-slate-200/80 text-slate-700' : 'bg-white/5 border-white/10 text-slate-200'
                  }`}
                >
                  <strong className="block font-bold">WA &amp; Indian NR Tables</strong>
                  AFI, World Athletics &amp; Olympic standards
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    isBright ? 'bg-slate-50 border-slate-200/80 text-slate-700' : 'bg-white/5 border-white/10 text-slate-200'
                  }`}
                >
                  <strong className="block font-bold">Track Event Batteries</strong>
                  Sprint Vmax, RSI, Hurdles &amp; Throws specs
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-red-500/15 flex items-center justify-between relative z-10">
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Enter Track &amp; Field Zone
              </span>
              <span className="w-9 h-9 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-md shadow-red-600/30">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </button>

          {/* ZONE 2: MULTI-SPORTS */}
          <button
            type="button"
            onClick={() => onSelectZone('multi_sports')}
            className={`group text-left rounded-3xl p-6 sm:p-8 border transition-all duration-200 flex flex-col justify-between relative overflow-hidden hover:scale-[1.01] active:scale-[0.99] ${
              isBright
                ? 'bg-white border-emerald-200/90 hover:border-emerald-500 shadow-lg shadow-emerald-950/5 hover:shadow-xl hover:shadow-emerald-500/10'
                : 'bg-gradient-to-br from-[#071512] via-[#0c0e14] to-[#0b0b10] border-emerald-500/35 hover:border-emerald-400 shadow-2xl shadow-emerald-950/30'
            }`}
          >
            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <Layers className="w-6 h-6" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                    isBright
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  {multiAthleteCount} Multi-Sport Athlete{multiAthleteCount === 1 ? '' : 's'}
                </span>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500 font-bold">
                  Cross-Sport Conditioning Lab
                </div>
                <h2
                  className={`text-xl sm:text-2xl font-black mt-1 ${
                    isBright ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Multi-Sports Zone
                </h2>
                <p
                  className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                    isBright ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  Dedicated combine &amp; conditioning lab for Football, Cricket, Basketball, Badminton, Hockey,
                  Kabaddi, Tennis, Swimming, Combat &amp; academy squads.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isBright ? 'bg-slate-50 border-slate-200/80 text-slate-700' : 'bg-white/5 border-white/10 text-slate-200'
                  }`}
                >
                  <strong className="block font-bold">Athletic Combine Engine</strong>
                  Illinois Agility, T-Test, Yo-Yo, CMJ &amp; 1RM
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    isBright ? 'bg-slate-50 border-slate-200/80 text-slate-700' : 'bg-white/5 border-white/10 text-slate-200'
                  }`}
                >
                  <strong className="block font-bold">Sport &amp; Role Profiling</strong>
                  Position-specific strength &amp; conditioning
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between relative z-10">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Enter Multi-Sports Zone
              </span>
              <span className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-md shadow-emerald-600/30">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="w-full max-w-6xl mx-auto text-center text-[11px] text-slate-500">
        <div className="inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>
            You can switch between <strong>Track &amp; Field</strong> and <strong>Multi-Sports</strong> anytime using{' '}
            <strong>Change Zone</strong> inside the top bar.
          </span>
        </div>
      </footer>
    </div>
  );
}
