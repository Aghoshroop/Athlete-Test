'use client';

import React from 'react';
import { UserRole } from '@/types/user';
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
  theme?: 'bright' | 'dark';
}

export function Sidebar({ activeTab, onTabChange, userRole, theme = 'bright' }: SidebarProps) {
  const isBright = theme === 'bright';
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Coaching Dashboard',
      icon: LayoutDashboard,
      description: 'KPIs & squad metrics',
    },
    {
      id: 'athletes' as ActiveTab,
      label: 'Athletes Management',
      icon: Users,
      description: 'Profiles & body history',
    },
    {
      id: 'fitness' as ActiveTab,
      label: 'Fitness Assessments',
      icon: Activity,
      description: 'Coach test entry & batteries',
    },
    {
      id: 'competitions' as ActiveTab,
      label: 'Athletics & WA Points',
      icon: Trophy,
      description: 'Track FAT, field & decathlon',
    },
    {
      id: 'benchmarks' as ActiveTab,
      label: 'Scientific Norms',
      icon: BookOpen,
      description: 'Eurofit & published DOIs',
    },
    {
      id: 'intelligence' as ActiveTab,
      label: 'Development Intelligence',
      icon: LineChart,
      description: 'AI biomechanics & squad progress',
    },
    {
      id: 'reports' as ActiveTab,
      label: 'A4 Report Generator',
      icon: FileText,
      description: '2-page print & PDF export',
    },
    {
      id: 'system' as ActiveTab,
      label: 'Coaching Activity Logs',
      icon: ShieldCheck,
      description: 'Audit logs & record history',
    },
  ];

  return (
    <aside
      className={`w-full lg:w-64 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto rounded-2xl shrink-0 p-3 flex flex-col justify-between transition-colors duration-200 scrollbar-none ${
        isBright
          ? 'bg-white border border-slate-200/90 shadow-sm'
          : 'bg-[#0c0c10] border border-slate-800/80 shadow-xl'
      }`}
    >
      <div className="space-y-1">
        <div
          className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 ${
            isBright ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Athletics Engine
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white shadow-md shadow-red-500/25 font-bold'
                  : isBright
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <Icon
                className={`w-5 h-5 mt-0.5 shrink-0 ${
                  isActive
                    ? 'text-white'
                    : isBright
                    ? 'text-slate-400'
                    : 'text-slate-400'
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
                    <span className={`px-1.5 py-0.2 text-[9px] font-black rounded uppercase tracking-wider shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-rose-600 text-white animate-pulse'
                    }`}>
                      AI LAB
                    </span>
                  )}
                </div>
                <div
                  className={`text-[11px] truncate ${
                    isActive
                      ? 'text-red-100'
                      : isBright
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Track & Field Dedicated Banner */}
      <div
        className={`p-3.5 mt-4 rounded-xl ${
          isBright
            ? 'bg-red-50/90 border border-red-200/80 text-red-950'
            : 'bg-red-950/25 border border-red-500/30 text-rose-300'
        }`}
      >
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-red-600">
          <Zap className="w-3.5 h-3.5 text-red-600" />
          100% Track & Field
        </div>
        <p
          className={`mt-1 text-xs leading-relaxed ${
            isBright ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          Calibrated specifically for sprints, jumps, throws, middle distance, hurdles & decathlon.
        </p>
      </div>
    </aside>
  );
}
