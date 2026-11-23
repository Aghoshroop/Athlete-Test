'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { db } from '@/lib/storage/local-storage-db';
import {
  Users,
  BarChart3,
  UserPlus,
  Trophy,
  RefreshCw,
  Sun,
  Moon,
  Menu,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  onUserChange?: (user: UserProfile) => void;
  onOpenTestingModal?: () => void;
  onOpenAthleteModal?: () => void;
  onOpenWACalculator?: () => void;
  onOpenCombinedReport?: () => void;
  onOpenBatchMatrix?: () => void;
  theme?: 'bright' | 'dark';
  onToggleTheme?: () => void;
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
  theme = 'bright',
  onToggleTheme,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full pt-[30px] sm:pt-4 pb-2 px-2.5 sm:px-4 pointer-events-none select-none">
      {/* Floating Pill Dock Container */}
      <div className="pointer-events-auto max-w-[1360px] mx-auto rounded-full bg-[#0c0c10]/95 border border-red-500/30 backdrop-blur-xl px-2.5 sm:px-5 py-1 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2 shadow-[0_10px_35px_-5px_rgba(220,38,38,0.35)]">
        {/* 1. BRAND & LOGO (LEFT) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Glowing Logo Square with Stylized Ai */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-red-950 p-0.5 shadow-[0_0_18px_rgba(239,68,68,0.55)] border border-red-400/35 flex items-center justify-center shrink-0">
            <span className="text-white font-black italic text-base sm:text-lg tracking-tighter drop-shadow-md select-none">
              Ai
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-7 bg-red-900/40" />

          {/* Brand Title */}
          <div className="text-left">
            <div className="text-[9px] sm:text-[11px] font-bold tracking-[0.2em] text-slate-200 leading-none uppercase">
              ATHLETICS
            </div>
            <div className="text-xs sm:text-sm font-black tracking-wider text-rose-500 leading-tight uppercase mt-0.5">
              INTELLIGENCE
            </div>
            <p className="text-[9px] text-slate-400 font-medium tracking-tight hidden xl:block leading-none mt-0.5">
              National High Performance Athletics Centre • Squad
            </p>
          </div>
        </div>

        {/* 2. DESKTOP NAVIGATION ACTIONS CLUSTER (CENTER) - VISIBLE ONLY >= md */}
        <div className="hidden md:flex items-center gap-1 sm:gap-1.5 shrink-0 flex-nowrap">
          {/* Spotlight Action: All Reports Glowing Pill Button */}
          {onOpenCombinedReport && (
            <button
              type="button"
              onClick={onOpenCombinedReport}
              className="relative group shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-bold text-xs shadow-[0_0_22px_rgba(239,68,68,0.7),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_0_30px_rgba(239,68,68,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="View all athlete test reports together in one combined dossier"
            >
              <Users className="w-3.5 h-3.5 text-white drop-shadow-xs" />
              <span className="font-bold tracking-wide whitespace-nowrap">All Reports</span>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-[2px] rounded-full bg-red-400 shadow-[0_0_6px_#f43f5e]" />
            </button>
          )}

          {/* Squad Batch Testing */}
          {onOpenBatchMatrix && (
            <button
              type="button"
              onClick={onOpenBatchMatrix}
              className="group shrink-0 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
              title="Open spreadsheet matrix to enter test results for all athletes together"
            >
              <div className="p-0.5 rounded-lg text-slate-300 group-hover:text-rose-400 transition">
                <SprinterIcon className="w-4 h-4" />
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight text-left whitespace-nowrap">
                Squad Batch
                <br />
                <span className="text-slate-400 group-hover:text-slate-200">Testing</span>
              </div>
            </button>
          )}

          <div className="hidden lg:block w-px h-5 bg-red-950/60 shrink-0" />

          {/* New Test */}
          {onOpenTestingModal && (
            <button
              type="button"
              onClick={onOpenTestingModal}
              className="group shrink-0 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
              title="Record new test assessment"
            >
              <div className="p-0.5 rounded-lg text-slate-300 group-hover:text-rose-400 transition">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight text-left whitespace-nowrap">
                New
                <br />
                <span className="text-slate-400 group-hover:text-slate-200">Test</span>
              </div>
            </button>
          )}

          <div className="hidden lg:block w-px h-5 bg-red-950/60 shrink-0" />

          {/* Add Athlete */}
          {onOpenAthleteModal && (
            <button
              type="button"
              onClick={onOpenAthleteModal}
              className="group shrink-0 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
              title="Register new athlete profile"
            >
              <div className="p-0.5 rounded-lg text-slate-300 group-hover:text-rose-400 transition">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight text-left whitespace-nowrap">
                Add
                <br />
                <span className="text-slate-400 group-hover:text-slate-200">Athlete</span>
              </div>
            </button>
          )}

          <div className="hidden lg:block w-px h-5 bg-red-950/60 shrink-0" />

          {/* WA Points */}
          {onOpenWACalculator && (
            <button
              type="button"
              onClick={onOpenWACalculator}
              className="group shrink-0 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
              title="Official World Athletics Scoring Calculator"
            >
              <div className="p-0.5 rounded-lg text-slate-300 group-hover:text-rose-400 transition">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-300 group-hover:text-white leading-tight text-left whitespace-nowrap">
                WA
                <br />
                <span className="text-slate-400 group-hover:text-slate-200">Points</span>
              </div>
            </button>
          )}
        </div>

        {/* 3. RIGHT CONTROLS: COACH CAPSULE (DESKTOP) + THEME + MOBILE MENU TRIGGER */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick All Reports on Mobile */}
          {onOpenCombinedReport && (
            <button
              type="button"
              onClick={onOpenCombinedReport}
              className="md:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-[10px] shadow-sm shadow-red-950/50"
            >
              <Users className="w-3 h-3 text-white" />
              <span>Reports</span>
            </button>
          )}

          {/* Coach Profile Capsule (Desktop only >= md) */}
          <div className="hidden md:flex rounded-full border border-red-500/25 bg-black/45 px-2.5 sm:px-3 py-1 items-center gap-2 shadow-xs select-none">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0">
              {currentUser.fullName
                ? currentUser.fullName
                    .split(' ')
                    .filter(Boolean)
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'CO'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white flex items-center gap-1 leading-none">
                <span>{currentUser.fullName || 'Lead Coach'}</span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium leading-none mt-1">
                Head Athletics Coach • Active Squad
              </div>
            </div>
          </div>

          {/* Bright / Dark Mode Toggle Pill */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              title={theme === 'bright' ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-red-500/25 bg-black/45 hover:bg-black/70 hover:border-red-500/70 hover:shadow-[0_0_12px_rgba(239,68,68,0.45)] flex items-center justify-center transition shrink-0"
            >
              {theme === 'bright' ? (
                <Moon className="w-3.5 h-3.5 text-rose-300" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-rose-300" />
              )}
            </button>
          )}

          {/* Desktop Reset Button */}
          <button
            type="button"
            onClick={handleResetData}
            title="Reset sample data to verified defaults"
            className="hidden md:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-red-500/25 bg-black/45 hover:bg-black/70 hover:border-red-500/70 hover:shadow-[0_0_12px_rgba(239,68,68,0.45)] items-center justify-center text-slate-300 hover:text-white transition shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Hamburger / Close Menu Toggle (Visible only < md) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full border border-red-500/35 bg-red-950/40 hover:bg-red-950/70 text-rose-300 flex items-center justify-center transition active:scale-95 shadow-sm"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MOBILE DROPDOWN ACTION SHEET (< md screens)                  */}
      {/* ============================================================== */}
      {isMobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 max-w-[1360px] mx-auto rounded-2xl bg-[#0c0c10]/95 border border-red-500/40 backdrop-blur-2xl p-4 shadow-2xl shadow-black/90 space-y-3.5 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Coach Identity Bar */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white font-black text-xs flex items-center justify-center shadow-md shadow-red-950/60 shrink-0">
              {currentUser.fullName
                ? currentUser.fullName
                    .split(' ')
                    .filter(Boolean)
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'CO'}
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {currentUser.fullName || 'Lead Coach'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Head Coach • Active Squad
              </div>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 gap-2">
            {onOpenTestingModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenTestingModal();
                  closeMobileMenu();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:bg-slate-800 transition"
              >
                <BarChart3 className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-bold text-white">New Test</span>
              </button>
            )}

            {onOpenAthleteModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenAthleteModal();
                  closeMobileMenu();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:bg-slate-800 transition"
              >
                <UserPlus className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-bold text-white">Add Athlete</span>
              </button>
            )}

            {onOpenBatchMatrix && (
              <button
                type="button"
                onClick={() => {
                  onOpenBatchMatrix();
                  closeMobileMenu();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:bg-slate-800 transition"
              >
                <SprinterIcon className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs font-bold text-white">Batch Matrix</span>
              </button>
            )}

            {onOpenWACalculator && (
              <button
                type="button"
                onClick={() => {
                  onOpenWACalculator();
                  closeMobileMenu();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:bg-slate-800 transition"
              >
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-white">WA Points</span>
              </button>
            )}
          </div>

          {/* Combined Dossier Action */}
          {onOpenCombinedReport && (
            <button
              type="button"
              onClick={() => {
                onOpenCombinedReport();
                closeMobileMenu();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-bold text-xs shadow-md shadow-red-950/50"
            >
              <Users className="w-4 h-4" />
              <span>Open All Reports Dossier</span>
            </button>
          )}

          {/* Bottom Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px]">Athletics Intelligence v2.0</span>
            <button
              type="button"
              onClick={() => {
                handleResetData();
                closeMobileMenu();
              }}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Demo Seed
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
