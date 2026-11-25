'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  Cloud,
  Download,
  CheckCircle2,
  Smartphone,
  LogOut,
} from 'lucide-react';
import { usePwaInstall } from '@/components/pwa/pwa-install-context';

interface NavbarProps {
  currentUser: UserProfile;
  onUserChange?: (user: UserProfile) => void;
  onOpenTestingModal?: () => void;
  onOpenAthleteModal?: () => void;
  onOpenWACalculator?: () => void;
  onOpenCombinedReport?: () => void;
  onOpenBatchMatrix?: () => void;
  onOpenCloudSync?: () => void;
  onLogout?: () => void;
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
  onOpenCloudSync,
  onLogout,
  theme = 'bright',
  onToggleTheme,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isStandalone, canNativeInstall, isOfflineReady, openInstallModal } = usePwaInstall();

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
    <header className="sticky top-0 z-50 w-full pt-[18px] sm:pt-4 pb-1 sm:pb-2 px-2.5 sm:px-4 pointer-events-none select-none">
      {/* Floating Pill Dock Container */}
      <div className="pointer-events-auto max-w-[1360px] mx-auto rounded-full bg-[#0c0c10]/95 border border-red-500/30 backdrop-blur-xl px-2.5 sm:px-5 py-1 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2 shadow-[0_10px_35px_-5px_rgba(220,38,38,0.35)]">
        {/* 1. BRAND & LOGO (LEFT) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* WellPerform Official Brand Emblem */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_0_18px_rgba(239,68,68,0.55)] border border-red-400/40 bg-[#ed0303] flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="WellPerform Logo"
              width={40}
              height={40}
              priority
              unoptimized
              className="w-full h-full object-cover scale-[1.08] select-none"
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-7 bg-red-900/40" />

          {/* Brand Title */}
          <div className="text-left">
            <div className="text-xs sm:text-sm font-black tracking-wide leading-none flex items-center whitespace-nowrap">
              <span className="text-white">Well</span>
              <span className="text-rose-500">Perform</span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium tracking-tight hidden xl:block leading-none mt-1">
              High-Performance Athletics Lab
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
          {/* Quick Install App Button on Mobile */}
          <button
            type="button"
            onClick={openInstallModal}
            className={`md:hidden inline-flex items-center gap-1 px-2 py-1 rounded-full font-bold text-[10px] border transition ${
              isStandalone
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-red-500/45 text-rose-200 hover:bg-red-950/50'
            }`}
            title={isStandalone ? 'App Installed (Offline Ready)' : 'Download / Install App on This Device'}
          >
            {isStandalone ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>App</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3 text-rose-400" />
                <span>Get App</span>
                {canNativeInstall && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />}
              </>
            )}
          </button>

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

          {/* Install / Download App Pill (Desktop >= md) */}
          <button
            type="button"
            onClick={openInstallModal}
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition shrink-0 select-none ${
              isStandalone
                ? 'bg-emerald-950/40 border-emerald-500/35 text-emerald-300 hover:border-emerald-400/60'
                : canNativeInstall
                ? 'bg-red-950/60 border-red-500/50 text-rose-200 hover:bg-red-900/60 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200'
            }`}
            title={
              isStandalone
                ? 'Running as Installed App (Offline Ready)'
                : 'Download & Install App from Any Browser'
            }
          >
            {isStandalone ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold hidden lg:inline">App</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="text-[11px] font-bold hidden lg:inline">
                  Install<span className="hidden xl:inline"> App</span>
                </span>
                {canNativeInstall && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />}
              </>
            )}
          </button>

          {/* Cloud Sync & Backup Pill (Desktop only >= md) */}
          {onOpenCloudSync && (
            <button
              type="button"
              onClick={onOpenCloudSync}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-slate-300 hover:text-emerald-300 transition shrink-0 select-none"
              title="Cross-Device Cloud Sync & Gmail Backup"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-bold hidden xl:inline">Cloud Backup</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
              <div className="text-[9px] text-slate-400 font-medium leading-none mt-1 hidden xl:block">
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

          {/* Desktop Logout Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Log out and return to Coach Login page"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-red-500/40 bg-red-950/50 hover:bg-red-600 hover:border-red-500 text-rose-200 hover:text-white transition shrink-0 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-bold hidden lg:inline">Logout</span>
            </button>
          )}

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
          {/* Coach Identity Bar with Quick Mobile Logout */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
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

            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onLogout();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-[11px] font-bold shadow-xs shrink-0 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
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

          {/* Install / Download App Mobile Card */}
          <button
            type="button"
            onClick={() => {
              openInstallModal();
              closeMobileMenu();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-950/70 to-slate-950 border border-red-500/40 text-left hover:bg-slate-800 transition"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{isStandalone ? 'App Installed & Offline Ready' : 'Download & Install App'}</span>
                  {(canNativeInstall || isOfflineReady) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isStandalone
                    ? 'Offline stadium cache active'
                    : 'Install from Android, iPhone Safari, Firefox, Edge or Chrome'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {isStandalone ? 'Status' : 'Install'}
            </span>
          </button>

          {/* Cloud Sync Mobile Action Card */}
          {onOpenCloudSync && (
            <button
              type="button"
              onClick={() => {
                onOpenCloudSync();
                closeMobileMenu();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-emerald-500/40 text-left hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Cloud Sync &amp; Gmail Backup</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Auto-sync across mobile, tablet &amp; laptop
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Manage
              </span>
            </button>
          )}

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
            <span className="text-[10px]">WellPerform v2.0</span>
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
