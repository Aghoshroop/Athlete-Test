'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { UserProfile } from '@/types/user';
import { SportZone } from '@/types/zone';
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
  Cloud,
  Download,
  CheckCircle2,
  Smartphone,
  LogOut,
  ArrowLeftRight,
  ChevronDown,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import { usePwaInstall } from '@/components/pwa/pwa-install-context';
import { ResetDatabaseModal } from '@/components/system/reset-database-modal';

interface NavbarProps {
  currentUser: UserProfile;
  activeZone: SportZone;
  trackCount?: number;
  multiCount?: number;
  onChangeZone: (zone: SportZone) => void;
  onOpenZoneSelector?: () => void;
  onOpenTestingModal?: () => void;
  onOpenAthleteModal?: () => void;
  onOpenCombinedReport?: () => void;
  onOpenCloudSync?: () => void;
  onLogout?: () => void;
  theme?: 'bright' | 'dark';
  onToggleTheme?: () => void;
}

export function Navbar({
  currentUser,
  activeZone,
  trackCount = 0,
  multiCount = 0,
  onChangeZone,
  onOpenZoneSelector,
  onOpenTestingModal,
  onOpenAthleteModal,
  onOpenCombinedReport,
  onOpenCloudSync,
  onLogout,
  theme = 'bright',
  onToggleTheme,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isZoneMenuOpen, setIsZoneMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const zoneDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const { isStandalone, canNativeInstall, isOfflineReady, openInstallModal } = usePwaInstall();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(e.target as Node)) {
        setIsZoneMenuOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleResetData = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmResetData = () => {
    db.resetToSeed();
    setIsResetModalOpen(false);
    window.location.reload();
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isTrack = activeZone === 'track_and_field';
  const coachInitials = currentUser.fullName
    ? currentUser.fullName
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  return (
    <>
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 pb-1 sm:pb-2 px-2.5 sm:px-4 pointer-events-none select-none">
      {/* Streamlined Floating Pill Dock */}
      <div className="pointer-events-auto max-w-[1360px] mx-auto rounded-full bg-[#0c0c10]/95 border border-red-500/30 backdrop-blur-xl px-3 sm:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-2 shadow-[0_10px_35px_-5px_rgba(220,38,38,0.3)]">
        {/* 1. LEFT: BRAND + ACTIVE ZONE SWITCHER */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-[0_0_16px_rgba(239,68,68,0.5)] border border-red-400/40 bg-[#ed0303] flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="WellPerform Logo"
              width={36}
              height={36}
              priority
              unoptimized
              className="w-full h-full object-cover scale-[1.08] select-none"
            />
          </div>

          <div className="text-left">
            <div className="text-xs sm:text-sm font-black tracking-wide leading-none flex items-center whitespace-nowrap">
              <span className="text-white">Well</span>
              <span className="text-rose-500">Perform</span>
            </div>
          </div>

          {/* Zone Divider & Desktop Change Zone Switcher */}
          <div className="hidden sm:block w-px h-6 bg-slate-800" />

          <div className="relative hidden sm:block" ref={zoneDropdownRef}>
            <button
              type="button"
              onClick={() => setIsZoneMenuOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                isTrack
                  ? 'bg-red-950/50 border-red-500/40 text-rose-200 hover:bg-red-900/60'
                  : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/60'
              }`}
              title="Change Zone between Track & Field and Multi-Sports"
            >
              <span
                className={`w-2 h-2 rounded-full ${isTrack ? 'bg-rose-500' : 'bg-emerald-400'}`}
              />
              <span className="whitespace-nowrap">{isTrack ? 'Track & Field' : 'Multi-Sports'}</span>
              <ArrowLeftRight className="w-3 h-3 opacity-80" />
              <span className="text-[10px] opacity-75 hidden lg:inline">Change Zone</span>
            </button>

            {isZoneMenuOpen && (
              <div className="absolute left-0 mt-2.5 w-72 rounded-2xl bg-[#101018] border border-slate-700/80 shadow-2xl p-2 space-y-1.5 z-50">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Dedicated Testing Zone
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onChangeZone('track_and_field');
                    setIsZoneMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition ${
                    isTrack
                      ? 'bg-red-600/20 border border-red-500/50 text-white'
                      : 'hover:bg-white/5 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-red-600/20 text-rose-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Track &amp; Field Zone</div>
                      <div className="text-[10px] text-slate-400">{trackCount} dedicated athletes</div>
                    </div>
                  </div>
                  {isTrack && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeZone('multi_sports');
                    setIsZoneMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition ${
                    !isTrack
                      ? 'bg-emerald-600/20 border border-emerald-500/50 text-white'
                      : 'hover:bg-white/5 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Multi-Sports Zone</div>
                      <div className="text-[10px] text-slate-400">{multiCount} dedicated athletes</div>
                    </div>
                  </div>
                  {!isTrack && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>

                {onOpenZoneSelector && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsZoneMenuOpen(false);
                      onOpenZoneSelector();
                    }}
                    className="w-full pt-2 mt-1 border-t border-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Open Zone Selection Screen</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2. CENTER: ESSENTIAL COACH QUICK ACTIONS (DECLUTTERED) */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {onOpenAthleteModal && (
            <button
              type="button"
              onClick={onOpenAthleteModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition whitespace-nowrap"
              title={isTrack ? 'Register Track & Field Athlete' : 'Register Multi-Sports Athlete'}
            >
              <UserPlus className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Add Athlete</span>
            </button>
          )}

          {onOpenTestingModal && (
            <button
              type="button"
              onClick={onOpenTestingModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition whitespace-nowrap"
              title="Record new physical assessment"
            >
              <BarChart3 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>New Test</span>
            </button>
          )}

          {onOpenCombinedReport && (
            <button
              type="button"
              onClick={onOpenCombinedReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-bold text-xs shadow-[0_0_18px_rgba(239,68,68,0.5)] hover:shadow-[0_0_24px_rgba(239,68,68,0.8)] hover:scale-[1.02] transition whitespace-nowrap"
              title="View consolidated squad dossiers"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>All Reports</span>
            </button>
          )}
        </div>

        {/* 3. RIGHT: INSTALL, COACH SETTINGS DROPDOWN, LOGOUT & MOBILE MENU */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Zone Chip */}
          <button
            type="button"
            onClick={() => onChangeZone(isTrack ? 'multi_sports' : 'track_and_field')}
            className={`sm:hidden inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border transition ${
              isTrack
                ? 'bg-red-950/60 border-red-500/40 text-rose-200'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            }`}
            title="Tap to change zone"
          >
            <ArrowLeftRight className="w-2.5 h-2.5" />
            <span>{isTrack ? 'Track' : 'Multi'}</span>
          </button>

          {/* Compact Install App Pill (only when not already standalone) */}
          {!isStandalone && (
            <button
              type="button"
              onClick={openInstallModal}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-[11px] font-bold transition shrink-0 ${
                canNativeInstall
                  ? 'bg-red-950/60 border-red-500/50 text-rose-200 hover:bg-red-900/60'
                  : 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-white'
              }`}
              title="Download & Install WellPerform App"
            >
              <Download className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="hidden xl:inline">Install App</span>
            </button>
          )}

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              title={theme === 'bright' ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              className="hidden md:flex w-8 h-8 rounded-full border border-slate-800 bg-black/50 hover:border-red-500/60 items-center justify-center transition shrink-0"
            >
              {theme === 'bright' ? (
                <Moon className="w-3.5 h-3.5 text-rose-300" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              )}
            </button>
          )}

          {/* Coach Account & Utilities Popover (Desktop >= md) */}
          <div className="relative hidden md:block" ref={accountDropdownRef}>
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-black/55 hover:border-rose-500/50 px-2.5 py-1 transition"
              title="Coach Profile, Cloud Sync & Tools"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                {coachInitials}
              </div>
              <span className="text-xs font-bold text-white max-w-[110px] truncate hidden lg:inline">
                {currentUser.fullName || 'Coach'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#101018] border border-slate-700/80 shadow-2xl p-2 space-y-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="font-bold text-white truncate">{currentUser.fullName || 'Lead Coach'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                </div>

                {onOpenCloudSync && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      onOpenCloudSync();
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-slate-200 hover:bg-white/5 transition"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <Cloud className="w-4 h-4 text-emerald-400" />
                      Cloud Sync &amp; Backup
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    openInstallModal();
                  }}
                  className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-slate-200 hover:bg-white/5 transition"
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <Smartphone className="w-4 h-4 text-rose-400" />
                    {isStandalone ? 'App Offline Status' : 'Install / Get App'}
                  </span>
                </button>

                {onOpenZoneSelector && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      onOpenZoneSelector();
                    }}
                    className="w-full px-3 py-2 rounded-xl flex items-center gap-2 font-semibold text-slate-200 hover:bg-white/5 transition"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                    <span>Change Zone Hub</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    handleResetData();
                  }}
                  className="w-full px-3 py-2 rounded-xl flex items-center gap-2 font-semibold text-slate-400 hover:text-rose-300 hover:bg-white/5 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Database</span>
                </button>
              </div>
            )}
          </div>

          {/* Direct Logout Button (Desktop >= md) */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Log out and return to Login page"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/40 bg-red-950/50 hover:bg-red-600 hover:border-red-500 text-rose-200 hover:text-white transition shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-bold hidden lg:inline">Logout</span>
            </button>
          )}

          {/* Mobile Menu Toggle (< md) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full border border-red-500/35 bg-red-950/40 hover:bg-red-950/70 text-rose-300 flex items-center justify-center transition active:scale-95"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE DROPDOWN ACTION SHEET (< md screens)                    */}
      {/* ============================================================== */}
      {isMobileMenuOpen && (
        <div className="md:hidden pointer-events-auto mt-2 max-w-[1360px] mx-auto rounded-2xl bg-[#0c0c10]/95 border border-red-500/40 backdrop-blur-2xl p-4 shadow-2xl shadow-black/90 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Coach Bar + Logout */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                {coachInitials}
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser.fullName || 'Lead Coach'}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Active Zone: {isTrack ? 'Track & Field' : 'Multi-Sports'}
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold shrink-0 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Dedicated Change Zone Card */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onChangeZone('track_and_field');
                closeMobileMenu();
              }}
              className={`p-2.5 rounded-xl border text-left transition ${
                isTrack
                  ? 'bg-red-600/20 border-red-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-rose-400" />
                <span>Track &amp; Field</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{trackCount} athletes</div>
            </button>

            <button
              type="button"
              onClick={() => {
                onChangeZone('multi_sports');
                closeMobileMenu();
              }}
              className={`p-2.5 rounded-xl border text-left transition ${
                !isTrack
                  ? 'bg-emerald-600/20 border-emerald-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-Sports</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{multiCount} athletes</div>
            </button>
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
          </div>

          {/* Install & Cloud Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                openInstallModal();
                closeMobileMenu();
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-red-500/30 text-left hover:bg-slate-800 transition"
            >
              <Smartphone className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="text-xs font-bold text-white">
                {isStandalone ? 'App Status' : isOfflineReady ? 'Get App' : 'Install'}
              </span>
            </button>

            {onOpenCloudSync && (
              <button
                type="button"
                onClick={() => {
                  onOpenCloudSync();
                  closeMobileMenu();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-left hover:bg-slate-800 transition"
              >
                <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-white">Cloud Backup</span>
              </button>
            )}
          </div>

          {onOpenCombinedReport && (
            <button
              type="button"
              onClick={() => {
                onOpenCombinedReport();
                closeMobileMenu();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-bold text-xs shadow-md"
            >
              <Users className="w-4 h-4" />
              <span>All Squad Reports</span>
            </button>
          )}

          {/* Bottom Row */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => {
                onToggleTheme?.();
              }}
              className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              {theme === 'bright' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{theme === 'bright' ? 'Dark Mode' : 'Bright Mode'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleResetData();
                closeMobileMenu();
              }}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Data
            </button>
          </div>
        </div>
      )}
    </header>

    <ResetDatabaseModal
      isOpen={isResetModalOpen}
      onClose={() => setIsResetModalOpen(false)}
      onConfirmReset={handleConfirmResetData}
      athleteCount={trackCount + multiCount}
    />
    </>
  );
}
