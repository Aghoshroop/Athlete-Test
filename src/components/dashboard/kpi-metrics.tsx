'use client';

import React from 'react';
import { Users, Activity, Trophy, Calendar, CheckCircle2, Clock, Flame } from 'lucide-react';

interface KpiMetricsProps {
  totalAthletes: number;
  activeAthletes: number;
  registeredCoaches: number;
  assessmentsCompleted: number;
  assessmentsPending: number;
  recentPersonalBests: number;
  upcomingReassessments: number;
  theme?: 'bright' | 'dark';
}

export function KpiMetrics({
  totalAthletes,
  activeAthletes,
  registeredCoaches,
  assessmentsCompleted,
  assessmentsPending,
  recentPersonalBests,
  upcomingReassessments,
  theme = 'bright',
}: KpiMetricsProps) {
  const isBright = theme === 'bright';
  const cards = [
    {
      label: 'Total Athletes',
      value: totalAthletes,
      sublabel: `${activeAthletes} Active in Training`,
      icon: Users,
      color: isBright
        ? 'bg-red-50 border border-red-200 text-red-600'
        : 'from-rose-500/20 to-red-600/20 text-rose-400 border border-red-500/30',
    },
    {
      label: 'Assessments Done',
      value: assessmentsCompleted,
      sublabel: `${assessmentsPending} Pending Review`,
      icon: Activity,
      color: isBright
        ? 'bg-red-50 border border-red-200 text-red-600'
        : 'from-rose-500/20 to-red-600/20 text-rose-400 border border-red-500/30',
    },
    {
      label: 'Recent PBs Logged',
      value: recentPersonalBests,
      sublabel: 'Official Legal Records',
      icon: Trophy,
      color: isBright
        ? 'bg-red-50 border border-red-200 text-red-600'
        : 'from-rose-500/20 to-red-600/20 text-rose-400 border border-red-500/30',
    },
    {
      label: 'Reassessments Due',
      value: upcomingReassessments,
      sublabel: 'Within Next 14 Days',
      icon: Clock,
      color: isBright
        ? 'bg-red-50 border border-red-200 text-red-600'
        : 'from-rose-500/20 to-red-600/20 text-rose-400 border border-red-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl shadow-sm flex items-start justify-between relative overflow-hidden transition-colors ${
              isBright
                ? 'bg-white border border-slate-200/90 text-slate-900'
                : 'bg-[#0e0e13] border border-slate-800 text-white'
            }`}
          >
            <div>
              <p
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isBright ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {card.label}
              </p>
              <div
                className={`text-2xl sm:text-3xl font-black mt-1 ${
                  isBright ? 'text-slate-900' : 'text-white'
                }`}
              >
                {card.value}
              </div>
              <p
                className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${
                  isBright ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {card.sublabel}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${card.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
