'use client';

import React from 'react';
import { Assessment } from '@/types/assessment';
import { PerformanceRecord } from '@/types/athletics';
import { AthleteProfile } from '@/types/athlete';
import { Activity, Trophy, Clock } from 'lucide-react';
import { SportZone } from '@/types/zone';

interface RecentActivityWidgetProps {
  recentAssessments: Assessment[];
  recentPerformances: PerformanceRecord[];
  athletesRequiringReassessment: AthleteProfile[];
  onSelectAssessment: (ass: Assessment) => void;
  onSelectAthlete: (ath: AthleteProfile) => void;
  activeZone?: SportZone;
  theme?: 'bright' | 'dark';
}

export function RecentActivityWidget({
  recentAssessments,
  recentPerformances,
  athletesRequiringReassessment,
  onSelectAssessment,
  onSelectAthlete,
  activeZone = 'track_and_field',
  theme = 'bright',
}: RecentActivityWidgetProps) {
  const isBright = theme === 'bright';
  const isMulti = activeZone === 'multi_sports';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Recent Assessments */}
      <div
        className={`rounded-xl p-4 shadow-sm transition-colors ${
          isBright
            ? 'bg-white border border-slate-200/90 text-slate-900'
            : 'bg-[#0e0e13] border border-slate-800 text-white'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-2 mb-3 border-b ${
            isBright ? 'border-slate-100' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            <h4
              className={`font-bold text-xs uppercase tracking-wider ${
                isBright ? 'text-slate-900' : 'text-white'
              }`}
            >
              Recent Official Assessments
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Latest</span>
        </div>
        <div className="space-y-2.5">
          {recentAssessments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No assessments completed yet.</p>
          ) : (
            recentAssessments.slice(0, 4).map((ass) => (
              <div
                key={ass.id}
                onClick={() => onSelectAssessment(ass)}
                className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between text-xs ${
                  isBright
                    ? 'bg-slate-50/70 hover:bg-red-50/50 border-slate-200/80 hover:border-red-300'
                    : 'bg-slate-950 hover:bg-red-950/20 border-slate-800 hover:border-red-500/40'
                }`}
              >
                <div>
                  <span
                    className={`font-bold block ${
                      isBright ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {ass.athleteName}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">
                    {ass.assessmentDate} • {ass.primaryEvent}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-rose-600 block">
                    {ass.overallFitnessScore !== undefined ? `${ass.overallFitnessScore.toFixed(1)} pts` : 'Draft'}
                  </span>
                  <span className="text-[10px] text-slate-500">{ass.overallRating ?? 'Review'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Latest Track & Field Personal Bests OR Multi-Sport Top Combine Leaders */}
      <div
        className={`rounded-xl p-4 shadow-sm transition-colors ${
          isBright
            ? 'bg-white border border-slate-200/90 text-slate-900'
            : 'bg-[#0e0e13] border border-slate-800 text-white'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-2 mb-3 border-b ${
            isBright ? 'border-slate-100' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trophy className={`w-4 h-4 ${isMulti ? 'text-emerald-500' : 'text-rose-500'}`} />
            <h4
              className={`font-bold text-xs uppercase tracking-wider ${
                isBright ? 'text-slate-900' : 'text-white'
              }`}
            >
              {isMulti ? 'Top Combine Leaders' : 'Certified Personal Bests'}
            </h4>
          </div>
          <span className={`text-[10px] font-bold uppercase ${isMulti ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isMulti ? 'Conditioning Index' : 'Legal Marks'}
          </span>
        </div>
        <div className="space-y-2.5">
          {isMulti ? (
            recentAssessments.filter((a) => a.overallFitnessScore !== undefined).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No multi-sport combine scores logged yet.</p>
            ) : (
              [...recentAssessments]
                .filter((a) => a.overallFitnessScore !== undefined)
                .sort((a, b) => (b.overallFitnessScore ?? 0) - (a.overallFitnessScore ?? 0))
                .slice(0, 4)
                .map((ass) => (
                  <div
                    key={ass.id}
                    onClick={() => onSelectAssessment(ass)}
                    className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between text-xs ${
                      isBright
                        ? 'bg-slate-50/70 hover:bg-emerald-50/50 border-slate-200/80'
                        : 'bg-slate-950 hover:bg-emerald-950/20 border-slate-800'
                    }`}
                  >
                    <div>
                      <span className={`font-bold block ${isBright ? 'text-slate-900' : 'text-white'}`}>
                        {ass.athleteName}
                      </span>
                      <span className="text-slate-500 text-[11px] truncate max-w-[140px] block">
                        {ass.primaryEvent}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`font-black text-sm block ${isBright ? 'text-slate-900' : 'text-white'}`}>
                        {ass.overallFitnessScore?.toFixed(1)} pts
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {ass.overallRating ?? 'Evaluated'}
                      </span>
                    </div>
                  </div>
                ))
            )
          ) : recentPerformances.filter((p) => p.isPersonalBest).length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No certified personal bests logged yet.</p>
          ) : (
            recentPerformances
              .filter((p) => p.isPersonalBest)
              .slice(0, 4)
              .map((perf) => {
                const isTrack = perf.eventCategory === 'track';
                return (
                  <div
                    key={perf.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                      isBright
                        ? 'bg-slate-50/70 border-slate-200/80'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div>
                      <span
                        className={`font-bold block ${
                          isBright ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {perf.eventName}
                      </span>
                      <span className="text-slate-500 text-[11px] truncate max-w-[140px] block">
                        {perf.competitionName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-black text-sm block ${
                          isBright ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {isTrack ? `${perf.timeSeconds?.toFixed(2)}s` : `${perf.distanceOrHeightMeters?.toFixed(2)}m`}
                      </span>
                      <span className="text-[10px] font-bold text-rose-600">
                        {perf.worldAthleticsPoints} WA pts
                      </span>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* 3. Reassessments Due */}
      <div
        className={`rounded-xl p-4 shadow-sm transition-colors ${
          isBright
            ? 'bg-white border border-slate-200/90 text-slate-900'
            : 'bg-[#0e0e13] border border-slate-800 text-white'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-2 mb-3 border-b ${
            isBright ? 'border-slate-100' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-500" />
            <h4
              className={`font-bold text-xs uppercase tracking-wider ${
                isBright ? 'text-slate-900' : 'text-white'
              }`}
            >
              Reassessments Due
            </h4>
          </div>
          <span className="text-[10px] text-rose-600 font-bold uppercase">Schedule</span>
        </div>
        <div className="space-y-2.5">
          {athletesRequiringReassessment.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">All registered athletes up to date.</p>
          ) : (
            athletesRequiringReassessment.slice(0, 4).map((ath) => (
              <div
                key={ath.id}
                onClick={() => onSelectAthlete(ath)}
                className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between text-xs ${
                  isBright
                    ? 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80'
                    : 'bg-slate-950 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <span
                    className={`font-bold block ${
                      isBright ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {ath.fullName}
                  </span>
                  <span className="text-slate-500 text-[11px]">{ath.trainingSquad}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isBright
                        ? 'text-red-700 bg-red-50 border-red-200'
                        : 'text-rose-400 bg-red-950/40 border-red-500/30'
                    }`}
                  >
                    Due Cycle
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
