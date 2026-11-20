'use client';

import React, { useState } from 'react';
import { calculateCombinedEventScore, DECATHLON_EVENTS, HEPTATHLON_EVENTS } from '@/lib/scoring/combined-events';
import { Trophy, Calendar, Award } from 'lucide-react';

export function CombinedEventCard() {
  const [format, setFormat] = useState<'DEC' | 'HEP'>('DEC');

  // Realistic sample results for Decathlon
  const [decathlonMarks, setDecathlonMarks] = useState<Record<string, number>>({
    '100m': 10.68,
    long_jump: 7.42,
    shot_put: 14.85,
    high_jump: 2.02,
    '400m': 48.65,
    '110m_hurdles': 14.28,
    discus_throw: 44.5,
    pole_vault: 4.9,
    javelin_throw: 59.8,
    '1500m': 274.0, // 4:34.00
  });

  // Realistic sample results for Heptathlon
  const [heptathlonMarks, setHeptathlonMarks] = useState<Record<string, number>>({
    '100m_hurdles': 13.52,
    high_jump: 1.82,
    shot_put: 14.2,
    '200m': 23.95,
    long_jump: 6.35,
    javelin_throw: 46.8,
    '800m': 134.5, // 2:14.50
  });

  const marks = format === 'DEC' ? decathlonMarks : heptathlonMarks;
  const setMarks = format === 'DEC' ? setDecathlonMarks : setHeptathlonMarks;

  const scoreSheet = calculateCombinedEventScore(format, marks);

  const handleMarkChange = (code: string, value: string) => {
    const num = parseFloat(value) || 0;
    setMarks((prev) => ({ ...prev, [code]: num }));
  };

  const formulas = format === 'DEC' ? DECATHLON_EVENTS : HEPTATHLON_EVENTS;
  const day1Events = formulas.filter((e) => e.day === 1);
  const day2Events = formulas.filter((e) => e.day === 2);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base text-slate-900">
              World Athletics Combined Events Scoring Sheet
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official IAAF Polynomial Formulas • Day 1 & Day 2 Standings
          </p>
        </div>

        {/* Switch Format */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFormat('DEC')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              format === 'DEC' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Decathlon (Men - 10 Events)
          </button>
          <button
            onClick={() => setFormat('HEP')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              format === 'HEP' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Heptathlon (Women - 7 Events)
          </button>
        </div>
      </div>

      {/* Points Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 text-white mb-6">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Day 1 Total</div>
          <div className="text-2xl font-black text-white">{scoreSheet.day1Points.toLocaleString()} <span className="text-xs font-normal text-slate-400">pts</span></div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Day 2 Total</div>
          <div className="text-2xl font-black text-white">{scoreSheet.day2Points.toLocaleString()} <span className="text-xs font-normal text-slate-400">pts</span></div>
        </div>
        <div className="sm:text-right">
          <div className="text-[11px] font-semibold text-rose-400 uppercase">Final Total Score</div>
          <div className="text-2xl font-black text-rose-400 flex items-center sm:justify-end gap-1.5">
            <Award className="w-6 h-6" />
            {scoreSheet.totalPoints.toLocaleString()} <span className="text-xs font-normal text-rose-300">pts</span>
          </div>
        </div>
      </div>

      {/* Events Table (Day 1 & Day 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Day 1 */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-rose-500" /> Day 1 Disciplines
          </h4>
          <div className="space-y-2">
            {day1Events.map((evt) => {
              const disc = scoreSheet.disciplines.find((d) => d.eventId === evt.code);
              return (
                <div
                  key={evt.code}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-semibold text-slate-800">{evt.name}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.01"
                      value={marks[evt.code] ?? 0}
                      onChange={(e) => handleMarkChange(evt.code, e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-right font-bold focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    />
                    <span className="text-slate-500 w-6 font-mono">{evt.unit}</span>
                    <span className="font-black text-red-600 min-w-[55px] text-right">
                      {disc?.points ?? 0} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day 2 */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-rose-500" /> Day 2 Disciplines
          </h4>
          <div className="space-y-2">
            {day2Events.map((evt) => {
              const disc = scoreSheet.disciplines.find((d) => d.eventId === evt.code);
              return (
                <div
                  key={evt.code}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-semibold text-slate-800">{evt.name}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.01"
                      value={marks[evt.code] ?? 0}
                      onChange={(e) => handleMarkChange(evt.code, e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-right font-bold focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    />
                    <span className="text-slate-500 w-6 font-mono">{evt.unit}</span>
                    <span className="font-black text-red-600 min-w-[55px] text-right">
                      {disc?.points ?? 0} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
