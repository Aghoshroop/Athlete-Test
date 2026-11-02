'use client';

import React from 'react';
import { Assessment } from '@/types/assessment';
import { PerformanceRecord } from '@/types/athletics';
import { AthleteProfile } from '@/types/athlete';
import { Activity, Trophy, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface RecentActivityWidgetProps {
  recentAssessments: Assessment[];
  recentPerformances: PerformanceRecord[];
  athletesRequiringReassessment: AthleteProfile[];
  onSelectAssessment: (ass: Assessment) => void;
  onSelectAthlete: (ath: AthleteProfile) => void;
}

export function RecentActivityWidget({
  recentAssessments,
  recentPerformances,
  athletesRequiringReassessment,
  onSelectAssessment,
  onSelectAthlete,
}: RecentActivityWidgetProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Recent Assessments */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Recent Official Assessments
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Latest</span>
        </div>
        <div className="space-y-2.5">
          {recentAssessments.slice(0, 4).map((ass) => (
            <div
              key={ass.id}
              onClick={() => onSelectAssessment(ass)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 block">{ass.athleteName}</span>
                <span className="text-slate-500 text-[11px] font-mono">
                  {ass.assessmentDate} • {ass.primaryEvent}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-amber-600 block">
                  {ass.overallFitnessScore !== undefined ? `${ass.overallFitnessScore.toFixed(1)} pts` : 'Draft'}
                </span>
                <span className="text-[10px] text-slate-500">{ass.overallRating ?? 'Review'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Latest Track & Field Personal Bests */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Certified Personal Bests
            </h4>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase">Legal Marks</span>
        </div>
        <div className="space-y-2.5">
          {recentPerformances
            .filter((p) => p.isPersonalBest)
            .slice(0, 4)
            .map((perf) => {
              const isTrack = perf.eventCategory === 'track';
              return (
                <div
                  key={perf.id}
                  className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{perf.eventName}</span>
                    <span className="text-slate-500 text-[11px] truncate max-w-[140px] block">
                      {perf.competitionName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm block">
                      {isTrack ? `${perf.timeSeconds?.toFixed(2)}s` : `${perf.distanceOrHeightMeters?.toFixed(2)}m`}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600">
                      {perf.worldAthleticsPoints} WA pts
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 3. Reassessments Due */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Reassessments Due
            </h4>
          </div>
          <span className="text-[10px] text-rose-600 font-bold uppercase">Schedule</span>
        </div>
        <div className="space-y-2.5">
          {athletesRequiringReassessment.slice(0, 4).map((ath) => (
            <div
              key={ath.id}
              onClick={() => onSelectAthlete(ath)}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 block">{ath.fullName}</span>
                <span className="text-slate-500 text-[11px]">{ath.trainingSquad}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Due Cycle
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Primary: {ath.primaryEventName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
