'use client';

import React from 'react';
import { AthleteProfile } from '@/types/athlete';
import { PerformanceRecord } from '@/types/athletics';
import { Trophy, Award, Wind, Calendar, MapPin } from 'lucide-react';

interface CompetitionReportProps {
  athlete: AthleteProfile;
  performances: PerformanceRecord[];
}

export function CompetitionReport({ athlete, performances }: CompetitionReportProps) {
  // Sort chronologically
  const sorted = [...performances].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Personal Bests Map
  const pbs = sorted.filter((p) => p.isPersonalBest);

  return (
    <div className="w-full max-w-full sm:max-w-[210mm] mx-auto bg-white p-3.5 sm:p-8 text-black border border-slate-300 shadow-lg print:shadow-none print:border-none print:p-6 print:m-0 page-break overflow-hidden">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-red-600 to-rose-600 text-white px-2.5 py-0.5 rounded">
              OFFICIAL TRACK & FIELD DOSSIER
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-950 mt-1 tracking-tight">
            ATHLETICS COMPETITION & WORLD ATHLETICS POINTS RECORD
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Athlete: <span className="font-bold text-slate-900">{athlete.fullName}</span> ({athlete.athleteCode}) • Primary Event: {athlete.primaryEventName}
          </p>
        </div>

        <div className="text-right">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-rose-400 flex items-center justify-center font-black text-lg ml-auto">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Personal Bests Highlight Cards */}
      <div className="my-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-rose-500" /> Current Certified Personal Bests (PBs)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pbs.map((pb) => {
            const isTrack = pb.eventCategory === 'track';
            return (
              <div key={pb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-600 uppercase">{pb.eventName}</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {isTrack ? `${pb.timeSeconds?.toFixed(2)}s` : `${pb.distanceOrHeightMeters?.toFixed(2)}m`}
                </div>
                <div className="text-[11px] font-bold text-red-600 mt-1">
                  {pb.worldAthleticsPoints} World Athletics Points
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {pb.date} • {pb.competitionName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Historical Competition Log */}
      <div className="my-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
          Official Competition Results History
        </h3>
        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Competition</th>
                <th className="p-2.5">Discipline</th>
                <th className="p-2.5">Round</th>
                <th className="p-2.5 text-right">Result</th>
                <th className="p-2.5 text-center">Wind</th>
                <th className="p-2.5 text-right">WA Points</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {sorted.map((perf) => {
                const isTrack = perf.eventCategory === 'track';
                return (
                  <tr key={perf.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono whitespace-nowrap">{perf.date}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{perf.competitionName}</td>
                    <td className="p-2.5 font-bold text-red-700">{perf.eventName}</td>
                    <td className="p-2.5 capitalize">{perf.round}</td>
                    <td className="p-2.5 text-right font-black text-slate-900">
                      {isTrack ? `${perf.timeSeconds?.toFixed(2)}s` : `${perf.distanceOrHeightMeters?.toFixed(2)}m`}
                    </td>
                    <td className="p-2.5 text-center font-mono">
                      {perf.windReading !== undefined ? `${perf.windReading > 0 ? '+' : ''}${perf.windReading.toFixed(1)}` : '—'}
                    </td>
                    <td className="p-2.5 text-right font-bold text-red-600">
                      {perf.worldAthleticsPoints ? `${perf.worldAthleticsPoints} pts` : '—'}
                    </td>
                    <td className="p-2.5 text-center">
                      {perf.isPersonalBest && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                          PB
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
        <span>World Athletics Scoring Tables (Senior Edition)</span>
        <span>Certified Athletics Performance Dossier</span>
      </div>
    </div>
  );
}
