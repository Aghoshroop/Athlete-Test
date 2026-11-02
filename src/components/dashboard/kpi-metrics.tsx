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
}

export function KpiMetrics({
  totalAthletes,
  activeAthletes,
  registeredCoaches,
  assessmentsCompleted,
  assessmentsPending,
  recentPersonalBests,
  upcomingReassessments,
}: KpiMetricsProps) {
  const cards = [
    {
      label: 'Total Athletes',
      value: totalAthletes,
      sublabel: `${activeAthletes} Active in Training`,
      icon: Users,
      color: 'from-blue-500/10 to-blue-600/10 text-blue-600 border-blue-200',
    },
    {
      label: 'Assessments Done',
      value: assessmentsCompleted,
      sublabel: `${assessmentsPending} Pending Review`,
      icon: Activity,
      color: 'from-amber-500/10 to-amber-600/10 text-amber-600 border-amber-200',
    },
    {
      label: 'Recent PBs Logged',
      value: recentPersonalBests,
      sublabel: 'Official Legal Records',
      icon: Trophy,
      color: 'from-emerald-500/10 to-emerald-600/10 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Reassessments Due',
      value: upcomingReassessments,
      sublabel: 'Within Next 14 Days',
      icon: Clock,
      color: 'from-rose-500/10 to-rose-600/10 text-rose-600 border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start justify-between relative overflow-hidden`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {card.value}
              </div>
              <p className="text-[11px] font-medium text-slate-600 mt-1 flex items-center gap-1">
                {card.sublabel}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
