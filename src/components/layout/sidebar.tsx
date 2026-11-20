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
}

export function Sidebar({ activeTab, onTabChange, userRole }: SidebarProps) {
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
      description: 'Radars, progression & balance',
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
    <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 shrink-0">
      <div className="p-4 space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
          Athletics Engine
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon
                className={`w-5 h-5 mt-0.5 shrink-0 ${
                  isActive ? 'text-amber-400' : 'text-slate-500'
                }`}
              />
              <div className="min-w-0">
                <div className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {item.label}
                </div>
                <div className={`text-[11px] truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Track & Field Dedicated Banner */}
      <div className="p-4 m-3 rounded-lg bg-amber-50 border border-amber-200/80">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          100% Track & Field
        </div>
        <p className="mt-1 text-xs text-amber-800 leading-relaxed">
          Calibrated specifically for sprints, jumps, throws, middle distance, hurdles & decathlon.
        </p>
      </div>
    </aside>
  );
}
