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
      color: 'from-rose-500/20 to-red-600/20 text-rose-400 border border-red-500/30',
    },
    {
      label: 'Assessments Done',
      value: assessmentsCompleted,
      sublabel: `${assessmentsPending} Pending Review`,
      icon: Activity,
      color: 'from-rose-500/20 to-red-600/20 text-rose-400 border border-red-500/30',
    },
    {
      label: 'Recent PBs Logged',
      value: recentPersonalBests,
      sublabel: 'Official Legal Records',
      icon: Trophy,
      color: 'from-rose-500/20 to-red-600/20 text-rose-400 border border-red-500/30',
    },
    {
      label: 'Reassessments Due',
      value: upcomingReassessments,
      sublabel: 'Within Next 14 Days',
      icon: Clock,
      color: 'from-rose-500/20 to-red-600/20 text-rose-400 border border-red-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-[#0e0e13] border border-slate-800 shadow-xl flex items-start justify-between relative overflow-hidden text-white`}
          >
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                {card.value}
              </div>
              <p className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
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
