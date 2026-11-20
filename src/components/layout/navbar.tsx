'use client';

import React from 'react';
import { UserRole, UserProfile } from '@/types/user';
import { db } from '@/lib/storage/local-storage-db';
import {
  Users,
  BarChart3,
  UserPlus,
  Trophy,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  onUserChange?: (user: UserProfile) => void;
  onOpenTestingModal?: () => void;
  onOpenAthleteModal?: () => void;
  onOpenWACalculator?: () => void;
  onOpenCombinedReport?: () => void;
  onOpenBatchMatrix?: () => void;
}

// Custom athletics sprinter silhouette icon matching the reference design
function SprinterIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="4.5" r="2" />
      <path d="M19 10l-4.5-1.5-2.5 3-4-2-3.5 2.5" />
      <path d="M12 11.5l2 4 4.5 1.5" />
      <path d="M10.5 14l-2.5 5-4.5 1" />
    </svg>
  );
}

export function Navbar({
  currentUser,
  onUserChange,
  onOpenTestingModal,
  onOpenAthleteModal,
  onOpenWACalculator,
  onOpenCombinedReport,
  onOpenBatchMatrix,
}: NavbarProps) {
  const handleResetData = () => {
    if (
      confirm(
        'Reset demo database to standard factory seed state? All test measurements will be restored to verified defaults.'
      )
    ) {
      db.resetToSeed();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060608] pb-3 pt-3 overflow-hidden select-none">
      {/* Ambient Crimson Lighting Background Flares (matching reference image) */}
      <div
        className="pointer-events-none absolute -top-16 -left-10 w-[420px] h-[220px] rounded-full blur-[90px] opacity-75"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(225, 29, 72, 0.45) 0%, rgba(185, 28, 28, 0.25) 45%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute -top-16 -right-10 w-[420px] h-[220px] rounded-full blur-[90px] opacity-75"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(225, 29, 72, 0.45) 0%, rgba(185, 28, 28, 0.25) 45%, transparent 75%)',
        }}
      />

      {/* Floating Pill Dock Container */}
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="relative rounded-full bg-[#0d0d12]/90 border border-red-500/25 backdrop-blur-2xl px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 shadow-[0_12px_40px_-10px_rgba(220,38,38,0.35),0_0_1px_1px_rgba(255,255,255,0.06)]">
          {/* 1. BRAND & LOGO (LEFT) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Glowing Logo Square with Stylized Ai */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-red-950 p-0.5 shadow-[0_0_22px_rgba(239,68,68,0.55)] border border-red-400/35 flex items-center justify-center shrink-0">
              <span className="text-white font-black italic text-lg tracking-tighter drop-shadow-md select-none">
                Ai
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-red-900/40" />

            {/* Brand Title */}
            <div className="text-left">
              <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-slate-200 leading-none uppercase">
                ATHLETICS
              </div>
              <div className="text-xs sm:text-sm font-black tracking-wider text-rose-500 leading-tight uppercase mt-0.5">
                INTELLIGENCE
              </div>
              <p className="text-[9px] text-slate-400 font-medium tracking-tight hidden lg:block leading-none mt-0.5">
                National High Performance Athletics Centre • Squad
              </p>
            </div>
          </div>

          {/* 2. NAVIGATION ACTIONS CLUSTER (CENTER) */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            {/* Spotlight Action: All Reports Glowing Pill Button */}
            {onOpenCombinedReport && (
              <button
                type="button"
                onClick={onOpenCombinedReport}
                className="relative group shrink-0 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-bold text-xs shadow-[0_0_24px_rgba(239,68,68,0.7),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_0_32px_rgba(239,68,68,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                title="View all athlete test reports together in one combined dossier"
              >
                <Users className="w-4 h-4 text-white drop-shadow-xs" />
                <span className="font-bold tracking-wide whitespace-nowrap">All Reports</span>
                {/* Red Neon Bottom Underline Bar */}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full bg-red-400 shadow-[0_0_8px_#f43f5e]" />
              </button>
            )}

            {/* Squad Batch Testing */}
            {onOpenBatchMatrix && (
              <button
                type="button"
                onClick={onOpenBatchMatrix}
                className="group shrink-0 inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
                title="Open spreadsheet matrix to enter test results for all athletes together"
              >
                <div className="p-1 rounded-lg text-slate-300 group-hover:text-rose-400 transition">
                  <SprinterIcon className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight text-left whitespace-nowrap">
                  Squad Batch
                  <br />
                  <span className="text-slate-400 group-hover:text-slate-200">Testing</span>
                </div>
              </button>
            )}

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-red-950/60 shrink-0" />

            {/* New Test */}
            {onOpenTestingModal && (
              <button
                type="button"
                onClick={onOpenTestingModal}
                className="group shrink-0 inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
                title="Record new test assessment"
              >
                <div className="p-1 rounded-lg text-slate-300 group-hover:text-rose-400 transition">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight text-left whitespace-nowrap">
                  New
                  <br />
                  <span className="text-slate-400 group-hover:text-slate-200">Test</span>
                </div>
              </button>
            )}

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-red-950/60 shrink-0" />

            {/* Add Athlete */}
            {onOpenAthleteModal && (
              <button
                type="button"
                onClick={onOpenAthleteModal}
                className="group shrink-0 inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
                title="Register new athlete profile"
              >
                <div className="p-1 rounded-lg text-slate-300 group-hover:text-rose-400 transition">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight text-left whitespace-nowrap">
                  Add
                  <br />
                  <span className="text-slate-400 group-hover:text-slate-200">Athlete</span>
                </div>
              </button>
            )}

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-red-950/60 shrink-0" />

            {/* WA Points */}
            {onOpenWACalculator && (
              <button
                type="button"
                onClick={onOpenWACalculator}
                className="group shrink-0 inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
                title="Official World Athletics Scoring Calculator"
              >
                <div className="p-1 rounded-lg text-slate-300 group-hover:text-rose-400 transition">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight text-left whitespace-nowrap">
                  WA
                  <br />
                  <span className="text-slate-400 group-hover:text-slate-200">Points</span>
                </div>
              </button>
            )}
          </div>

          {/* 3. COACH PROFILE & RELOAD PILL (RIGHT) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Coach Profile Capsule */}
            <div className="rounded-full border border-red-500/25 bg-black/45 hover:bg-black/65 hover:border-red-500/45 px-3 py-1.5 flex items-center gap-2.5 transition cursor-pointer shadow-xs">
              {/* Red Circle DM Avatar */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.5)] shrink-0">
                DM
              </div>

              {/* Coach Credentials */}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1 leading-none">
                  <span>Coach David Miller</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[9px] text-slate-400 font-medium leading-none mt-1">
                  Head Athletics Coach • Senior Squad
                </div>
              </div>
            </div>

            {/* Reset / Reload Circle Button */}
            <button
              type="button"
              onClick={handleResetData}
              title="Reset sample data to verified defaults"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-red-500/25 bg-black/45 hover:bg-black/70 hover:border-red-500/70 hover:shadow-[0_0_15px_rgba(239,68,68,0.45)] flex items-center justify-center text-slate-300 hover:text-white transition shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
