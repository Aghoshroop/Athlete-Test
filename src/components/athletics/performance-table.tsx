'use client';

import React from 'react';
import { PerformanceRecord } from '@/types/athletics';
import { Badge } from '@/components/ui/badge';
import { Trophy, Wind, Clock, Award, ShieldCheck } from 'lucide-react';

interface PerformanceTableProps {
  performances: PerformanceRecord[];
}

export function PerformanceTable({ performances }: PerformanceTableProps) {
  if (performances.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl">
        <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">No competition performances recorded yet.</p>
        <p className="text-xs text-slate-500 mt-1">Use "Record Competition Result" to log official track or field marks.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-xs text-slate-700">
        <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Competition</th>
            <th className="px-4 py-3">Event</th>
            <th className="px-4 py-3">Round</th>
            <th className="px-4 py-3 text-right">Official Mark</th>
            <th className="px-4 py-3 text-center">Wind</th>
            <th className="px-4 py-3 text-right">WA Points</th>
            <th className="px-4 py-3 text-center">Milestones</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {performances.map((perf) => {
            const isTrack = perf.eventCategory === 'track';
            const displayMark = isTrack
              ? `${perf.timeSeconds?.toFixed(2)}s`
              : `${perf.distanceOrHeightMeters?.toFixed(2)}m`;

            return (
              <tr key={perf.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-mono font-medium whitespace-nowrap">{perf.date}</td>
                <td className="px-4 py-3 font-bold text-slate-900">{perf.competitionName}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    {perf.eventName}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize font-medium">{perf.round} (Pos: {perf.position ?? 1})</td>
                <td className="px-4 py-3 text-right font-black text-slate-900 text-sm whitespace-nowrap">
                  {displayMark}
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {perf.windReading !== undefined ? (
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                        perf.windLegalStatus === 'legal'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-rose-100 text-rose-800 font-bold'
                      }`}
                    >
                      <Wind className="w-3 h-3 text-slate-400" />
                      {perf.windReading > 0 ? `+${perf.windReading.toFixed(1)}` : perf.windReading.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-black text-amber-600 whitespace-nowrap">
                  {perf.worldAthleticsPoints ? `${perf.worldAthleticsPoints} pts` : '—'}
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    {perf.isPersonalBest && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[10px]">
                        PB
                      </span>
                    )}
                    {perf.isSeasonBest && !perf.isPersonalBest && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px]">
                        SB
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate" title={perf.notes}>
                  {perf.notes || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
