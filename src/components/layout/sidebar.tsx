'use client';

import React from 'react';
import { UserRole } from '@/types/user';
import { SportZone } from '@/types/zone';
import {
  LayoutDashboard,
  Users,
  Activity,
  Trophy,
  BookOpen,
  LineChart,
  FileText,
  ShieldCheck,
  Zap,
  ArrowLeftRight,
  Layers,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'athletes'
  | 'fitness'
  | 'competitions'
  | 'benchmarks'
  | 'intelligence'
  | 'reports'
  | 'system';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userRole: UserRole;
  activeZone: SportZone;
  onChangeZone: (zone: SportZone) => void;
  theme?: 'bright' | 'dark';
}

export function Sidebar({
  activeTab,
  onTabChange,
  activeZone,
  onChangeZone,
  theme = 'bright',
}: SidebarProps) {
  const isBright = theme === 'bright';
  const isTrack = activeZone === 'track_and_field';

  const allNavItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Coaching Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      description: 'KPIs & squad metrics',
    },
    {
      id: 'athletes' as ActiveTab,
      label: isTrack ? 'Track & Field Athletes' : 'Multi-Sports Athletes',
      shortLabel: 'Athletes',
      icon: Users,
      description: isTrack ? 'Track profiles & bio data' : 'Multi-sport roster & roles',
    },
    {
      id: 'fitness' as ActiveTab,
      label: isTrack ? 'Fitness Assessments' : 'Combine & Conditioning',
      shortLabel: isTrack ? 'Fitness' : 'Combine',
      icon: Activity,
      description: isTrack ? 'Coach test entry & batteries' : 'Speed, agility, power & Yo-Yo',
    },
    ...(isTrack
      ? [
          {
            id: 'competitions' as ActiveTab,
            label: 'Athletics & WA Points',
            shortLabel: 'WA Points',
            icon: Trophy,
            description: 'Track FAT, field & decathlon',
          },
        ]
      : []),
    {
      id: 'benchmarks' as ActiveTab,
      label: 'Scientific Norms',
      shortLabel: 'Norms',
      icon: BookOpen,
      description: 'Eurofit, ACSM & DOIs',
    },
    {
      id: 'intelligence' as ActiveTab,
      label: 'Development Intelligence',
      shortLabel: 'AI Lab',
      icon: LineChart,
      description: 'AI diagnostics & periodization',
    },
    {
      id: 'reports' as ActiveTab,
      label: 'A4 Report Generator',
      shortLabel: 'Reports',
      icon: FileText,
      description: '2-page print & PDF export',
    },
    {
      id: 'system' as ActiveTab,
      label: 'Coaching Activity Logs',
      shortLabel: 'Logs',
      icon: ShieldCheck,
      description: 'Audit logs & record history',
    },
  ];

  const otherZone: SportZone = isTrack ? 'multi_sports' : 'track_and_field';

  return (
    <>
      {/* ============================================================== */}
      {/* 1. MOBILE HORIZONTAL NAVIGATION STRIP (< lg screens)           */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full sticky top-[62px] sm:top-[72px] z-40 pb-2 pt-1 mt-1">
        <div
          className={`w-full p-1.5 rounded-2xl border backdrop-blur-xl shadow-lg transition-colors overflow-hidden ${
            isBright
              ? 'bg-white/95 border-slate-200/90 shadow-slate-200/60 text-slate-800'
              : 'bg-[#0c0c10]/95 border-slate-800/80 shadow-black/80 text-white'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-0.5">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap active:scale-95 ${
                    isActive
                      ? isTrack
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white shadow-md shadow-red-950/40 font-black'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 font-black'
                      : isBright
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 font-semibold'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : isBright ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.shortLabel}</span>
                  {item.id === 'intelligence' && (
                    <span
                      className={`px-1.5 py-0.2 text-[8px] font-black rounded uppercase tracking-wider shrink-0 ${
                        isActive ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-rose-600 text-white animate-pulse'
                      }`}
                    >
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP STICKY SIDEBAR (>= lg screens)                      */}
      {/* ============================================================== */}
      <aside
        className={`hidden lg:flex w-64 sticky top-[76px] self-start max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl shrink-0 p-3 flex-col justify-between transition-colors duration-200 scrollbar-none ${
          isBright
            ? 'bg-white border border-slate-200/90 shadow-sm'
            : 'bg-[#0c0c10] border border-slate-800/80 shadow-xl'
        }`}
      >
        <div className="space-y-1">
          {/* Active Zone Indicator + Quick Change Zone */}
          <div
            className={`mb-2 p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
              isTrack
                ? isBright
                  ? 'bg-red-50 border-red-200/80 text-red-950'
                  : 'bg-red-950/30 border-red-500/30 text-rose-200'
                : isBright
                ? 'bg-emerald-50 border-emerald-200/80 text-emerald-950'
                : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
            }`}
          >
            <div className="min-w-0">
              <div className="text-[9px] font-bold uppercase tracking-wider opacity-70">Active Zone</div>
              <div className="text-xs font-black truncate flex items-center gap-1.5 mt-0.5">
                {isTrack ? (
                  <Trophy className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                ) : (
                  <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                )}
                <span>{isTrack ? 'Track & Field' : 'Multi-Sports'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChangeZone(otherZone)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition shrink-0 ${
                isBright
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
              title={`Transfer to ${isTrack ? 'Multi-Sports Zone' : 'Track & Field Zone'}`}
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>Switch</span>
            </button>
          </div>

          <div
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 ${
              isBright ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {isTrack ? 'Athletics Engine' : 'Multi-Sport Engine'}
          </div>

          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? isTrack
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white shadow-md shadow-red-500/25 font-bold'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-bold'
                    : isBright
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    isActive ? 'text-white' : isBright ? 'text-slate-400' : 'text-slate-400'
                  }`}
                />
                <div className="min-w-0">
                  <div
                    className={`text-sm font-bold truncate flex items-center gap-1.5 ${
                      isActive ? 'text-white' : isBright ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.id === 'intelligence' && (
                      <span
                        className={`px-1.5 py-0.2 text-[9px] font-black rounded uppercase tracking-wider shrink-0 ${
                          isActive ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-rose-600 text-white animate-pulse'
                        }`}
                      >
                        AI LAB
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isActive ? 'text-white/85' : isBright ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dedicated Zone Info Banner */}
        <div
          className={`p-3.5 mt-4 rounded-xl border ${
            isTrack
              ? isBright
                ? 'bg-red-50/90 border-red-200/80 text-red-950'
                : 'bg-red-950/25 border-red-500/30 text-rose-300'
              : isBright
              ? 'bg-emerald-50/90 border-emerald-200/80 text-emerald-950'
              : 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div
            className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
              isTrack ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {isTrack ? '100% Track & Field' : 'Multi-Sports Combine'}
          </div>
          <p className={`mt-1 text-xs leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
            {isTrack
              ? 'Isolated roster & WA/AFI calibration for sprints, jumps, throws, hurdles & combined events.'
              : 'Isolated conditioning & combine roster for football, cricket, basketball, badminton, hockey & more.'}
          </p>
        </div>
      </aside>
    </>
  );
}
