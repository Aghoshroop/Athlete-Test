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
      <div className="bg-[#0e0e13] rounded-xl border border-slate-800 p-4 shadow-xl text-white">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
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
              className="p-2.5 rounded-lg bg-slate-950 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/40 transition cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white block">{ass.athleteName}</span>
                <span className="text-slate-400 text-[11px] font-mono">
                  {ass.assessmentDate} • {ass.primaryEvent}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-rose-400 block">
                  {ass.overallFitnessScore !== undefined ? `${ass.overallFitnessScore.toFixed(1)} pts` : 'Draft'}
                </span>
                <span className="text-[10px] text-slate-400">{ass.overallRating ?? 'Review'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Latest Track & Field Personal Bests */}
      <div className="bg-[#0e0e13] rounded-xl border border-slate-800 p-4 shadow-xl text-white">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-rose-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              Certified Personal Bests
            </h4>
          </div>
          <span className="text-[10px] text-rose-400 font-bold uppercase">Legal Marks</span>
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
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{perf.eventName}</span>
                    <span className="text-slate-400 text-[11px] truncate max-w-[140px] block">
                      {perf.competitionName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white text-sm block">
                      {isTrack ? `${perf.timeSeconds?.toFixed(2)}s` : `${perf.distanceOrHeightMeters?.toFixed(2)}m`}
                    </span>
                    <span className="text-[10px] font-bold text-rose-400">
                      {perf.worldAthleticsPoints} WA pts
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 3. Reassessments Due */}
      <div className="bg-[#0e0e13] rounded-xl border border-slate-800 p-4 shadow-xl text-white">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">
              Reassessments Due
            </h4>
          </div>
          <span className="text-[10px] text-rose-400 font-bold uppercase">Schedule</span>
        </div>
        <div className="space-y-2.5">
          {athletesRequiringReassessment.slice(0, 4).map((ath) => (
            <div
              key={ath.id}
              onClick={() => onSelectAthlete(ath)}
              className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 transition cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white block">{ath.fullName}</span>
                <span className="text-slate-400 text-[11px]">{ath.trainingSquad}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-rose-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
                  Due Cycle
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
