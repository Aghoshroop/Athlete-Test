'use client';

import React, { useState } from 'react';
import { calculateWorldAthleticsPoints, WA_OUTDOOR_TABLES } from '@/lib/scoring/wa-points';
import { SEED_ATHLETICS_EVENTS } from '@/lib/data/seed-events';
import { Calculator, X, Trophy, Wind, Check, AlertCircle } from 'lucide-react';

interface WACalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WACalculatorModal({ isOpen, onClose }: WACalculatorModalProps) {
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [eventCode, setEventCode] = useState('100m');
  const [resultInput, setResultInput] = useState('10.20');
  const [windMps, setWindMps] = useState('1.2');

  if (!isOpen) return null;

  const availableEvents = Object.keys(WA_OUTDOOR_TABLES[sex]);
  const currentEventCoeffs = WA_OUTDOOR_TABLES[sex][eventCode];

  const rawVal = parseFloat(resultInput) || 0;
  const windVal = parseFloat(windMps);

  const calcResult = calculateWorldAthleticsPoints(
    eventCode,
    rawVal,
    sex,
    !isNaN(windVal) ? windVal : undefined
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-lg bg-red-600 text-white font-bold">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">World Athletics Points Calculator</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Official Senior Outdoor Scoring Tables</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Sex Selection */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSex('male')}
              className={`py-1.5 text-xs font-bold rounded-md transition ${
                sex === 'male' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Men / Boys
            </button>
            <button
              onClick={() => setSex('female')}
              className={`py-1.5 text-xs font-bold rounded-md transition ${
                sex === 'female' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Women / Girls
            </button>
          </div>

          {/* Event Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Athletics Discipline</label>
            <select
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden font-semibold text-slate-900"
            >
              {availableEvents.map((evt) => (
                <option key={evt} value={evt}>
                  {evt.replace(/_/g, ' ').toUpperCase()} ({WA_OUTDOOR_TABLES[sex][evt].unit})
                </option>
              ))}
            </select>

            {/* Gender-specific Event Parameters Note */}
            {(() => {
              const matched = SEED_ATHLETICS_EVENTS.find(
                (e) => e.code === eventCode || e.code.replace(/_/g, '') === eventCode.replace(/_/g, '')
              );
              const p = sex === 'male' ? matched?.genderParameters?.male : matched?.genderParameters?.female;
              if (!p) return null;

              return (
                <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                  <div className="font-semibold text-slate-800 flex items-center justify-between">
                    <span>Official Parameters ({sex === 'male' ? 'Men' : 'Women'}):</span>
                    {p.qualifyingStandard && (
                      <span className="text-emerald-600 font-bold">Standard: {p.qualifyingStandard}</span>
                    )}
                  </div>
                  {p.implementSpec && <p><span className="text-slate-500">Implement:</span> {p.implementSpec}</p>}
                  {p.hurdleHeightM && <p><span className="text-slate-500">Hurdles:</span> {p.hurdleHeightM}m ({p.barrierCount || 10} barriers)</p>}
                  {p.worldRecord && (
                    <p><span className="text-slate-500">World Record:</span> <strong className="text-amber-600">{p.worldRecord.mark}</strong> ({p.worldRecord.athlete})</p>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Result Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mark / Time ({currentEventCoeffs?.unit ?? 'seconds'})
              </label>
              <input
                type="number"
                step="0.01"
                value={resultInput}
                onChange={(e) => setResultInput(e.target.value)}
                placeholder="e.g. 10.20 or 7.85"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-slate-400" /> Wind (m/s)
              </label>
              <input
                type="number"
                step="0.1"
                value={windMps}
                onChange={(e) => setWindMps(e.target.value)}
                placeholder="+1.2"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Result Calculation Card */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                World Athletics Score
              </div>
              <div className="text-3xl font-black text-rose-400 mt-0.5 flex items-baseline gap-1.5">
                {calcResult.points}
                <span className="text-xs font-normal text-slate-300">points</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Table version: {calcResult.tableVersion}
              </div>
            </div>

            <div className="text-right max-w-[180px]">
              {calcResult.isLegalForPoints ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" /> Legal Performance
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30">
                  <AlertCircle className="w-3.5 h-3.5" /> Wind Assisted (&gt;+2.0)
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Note: World Athletics scoring points compare performances across track and field disciplines. Under no circumstances are competition points confused with physical fitness percentiles.
          </p>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
