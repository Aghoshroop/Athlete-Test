'use client';

import React, { useState } from 'react';
import { SEED_ATHLETICS_EVENTS } from '@/lib/data/seed-events';
import { INDIAN_RECORDS_BY_CODE, INDIAN_NATIONAL_RECORDS, IndianNationalRecord } from '@/lib/data/indian-athletics-standards';
import { AthleticsCategory, EventGroup } from '@/types/athletics';
import {
  Trophy,
  Search,
  Filter,
  Flame,
  Clock,
  Ruler,
  Compass,
  Award,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface EventsSpecificationCatalogProps {
  theme?: 'bright' | 'dark';
}

export function EventsSpecificationCatalog({ theme = 'bright' }: EventsSpecificationCatalogProps) {
  const isBright = theme === 'bright';
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'comparison'>('cards');

  // Helper to match Indian National Records
  const getIndianRecord = (evt: { code: string; name: string; genderParameters?: any }): IndianNationalRecord | undefined => {
    const codeLower = evt.code.toLowerCase();
    const codeKey = codeLower.replace(/[^a-z0-9]/g, '');
    const nameKey = evt.name.toLowerCase();
    
    if (INDIAN_RECORDS_BY_CODE[codeLower]) return INDIAN_RECORDS_BY_CODE[codeLower];
    if (INDIAN_RECORDS_BY_CODE[codeKey]) return INDIAN_RECORDS_BY_CODE[codeKey];
    
    // Check if event has indianRecord attached directly to genderParameters
    const maleInd = evt.genderParameters?.male?.indianRecord;
    const femaleInd = evt.genderParameters?.female?.indianRecord;
    if (maleInd || femaleInd) {
      return {
        eventCode: evt.code,
        eventName: evt.name,
        category: 'track',
        men: maleInd
          ? {
              mark: maleInd.mark,
              numericValue: parseFloat(maleInd.mark) || 0,
              unit: maleInd.mark.includes('s') ? 's' : maleInd.mark.includes('m') ? 'm' : 'pts',
              athlete: maleInd.athlete,
              stateOrUnit: '',
              year: maleInd.year,
              competition: maleInd.notes || 'Indian National Record',
              venue: '',
            }
          : ({} as any),
        women: femaleInd
          ? {
              mark: femaleInd.mark,
              numericValue: parseFloat(femaleInd.mark) || 0,
              unit: femaleInd.mark.includes('s') ? 's' : femaleInd.mark.includes('m') ? 'm' : 'pts',
              athlete: femaleInd.athlete,
              stateOrUnit: '',
              year: femaleInd.year,
              competition: femaleInd.notes || 'Indian National Record',
              venue: '',
            }
          : ({} as any),
      };
    }

    return INDIAN_NATIONAL_RECORDS.find((r) => {
      const rEvent = r.eventName.toLowerCase();
      const rCode = r.eventCode.toLowerCase();
      return nameKey.includes(rEvent) || rEvent.includes(nameKey) || codeKey.includes(rCode);
    });
  };

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'sprints', label: 'Sprints' },
    { id: 'hurdles', label: 'Hurdles' },
    { id: 'middle_distance', label: 'Middle Distance' },
    { id: 'long_distance', label: 'Long Distance & Steeple' },
    { id: 'jumps', label: 'Jumps' },
    { id: 'throws', label: 'Throws' },
    { id: 'race_walk', label: 'Road & Race Walk' },
    { id: 'combined', label: 'Combined Events' },
  ];

  const filteredEvents = SEED_ATHLETICS_EVENTS.filter((evt) => {
    const matchSearch =
      evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCat =
      selectedCategory === 'all' ||
      evt.eventGroup === selectedCategory ||
      (selectedCategory === 'race_walk' && (evt.category === 'road_and_walk' || evt.eventGroup === 'race_walk'));

    return matchSearch && matchCat;
  });

  return (
    <div
      className={`rounded-2xl border transition-colors p-3.5 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-hidden ${
        isBright
          ? 'bg-white border-slate-200/90 shadow-sm'
          : 'bg-[#0e0e13] border-slate-800 text-white'
      }`}
    >
      {/* Top Header & Gender Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600 text-white">
              <Trophy className="w-4 h-4" />
            </span>
            <h3 className={`font-black text-lg ${isBright ? 'text-slate-900' : 'text-white'}`}>
              World Athletics Events & Technical Parameters
            </h3>
          </div>
          <p className={`text-xs mt-1 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
            Official World Athletics & Olympic standards with separate technical specifications for Men and Women
          </p>
        </div>

        {/* Gender Toggle & Comparison Mode */}
        <div className="flex flex-wrap items-center gap-2">
          <div className={`p-1 rounded-xl flex items-center border ${
            isBright ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              onClick={() => setSelectedGender('male')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedGender === 'male'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                  : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Senior Men (M)</span>
            </button>
            <button
              onClick={() => setSelectedGender('female')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedGender === 'female'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                  : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Senior Women (F)</span>
            </button>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'comparison' : 'cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              viewMode === 'comparison'
                ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 font-bold'
                : isBright
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {viewMode === 'comparison' ? '✓ Showing Men vs Women Comparison' : 'Compare Men vs Women'}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search event (e.g. shot put, hurdles, 100m, steeplechase, decathlon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium ${
                isBright
                  ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  : 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
              }`}
            />
          </div>
          <span className={`text-xs flex items-center px-3 py-1.5 rounded-xl font-mono ${
            isBright ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-slate-400'
          }`}>
            {filteredEvents.length} Events
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : isBright
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid / Comparison Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((evt) => {
            const params = selectedGender === 'male'
              ? evt.genderParameters?.male
              : evt.genderParameters?.female;

            return (
              <div
                key={evt.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition hover:border-red-500/40 hover:shadow-md ${
                  isBright
                    ? 'bg-white border-slate-200/90 text-slate-900'
                    : 'bg-[#121218] border-slate-800/90 text-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      {evt.category} • {evt.eventGroup}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      selectedGender === 'male'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                    }`}>
                      {selectedGender === 'male' ? 'MEN (M)' : 'WOMEN (F)'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm leading-tight text-slate-900 dark:text-white">
                    {evt.name}
                  </h4>
                  <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                    isBright ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {evt.description}
                  </p>

                  {/* Technical Specifications */}
                  <div className={`mt-3 p-2.5 rounded-lg text-xs space-y-1.5 border ${
                    isBright ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-950/70 border-slate-800'
                  }`}>
                    {params?.implementSpec && (
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-semibold flex items-center gap-1 shrink-0 ${
                          isBright ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          <Layers className="w-3.5 h-3.5 text-red-500" /> Implement:
                        </span>
                        <span className="font-bold text-right text-slate-900 dark:text-white">
                          {params.implementSpec}
                        </span>
                      </div>
                    )}

                    {params?.hurdleHeightM && (
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-semibold flex items-center gap-1 shrink-0 ${
                          isBright ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          <Ruler className="w-3.5 h-3.5 text-red-500" /> Barrier Height:
                        </span>
                        <span className="font-bold text-right text-slate-900 dark:text-white">
                          {params.hurdleHeightM}m ({params.barrierCount || 10} barriers)
                        </span>
                      </div>
                    )}

                    {params?.hurdleSpacing && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Spacing: </span>
                        {params.hurdleSpacing}
                      </div>
                    )}

                    {params?.worldRecord && (
                      <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/80">
                        <span className={`font-semibold flex items-center gap-1 shrink-0 ${
                          isBright ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          <Award className="w-3.5 h-3.5 text-amber-500" /> World Record:
                        </span>
                        <span className="font-bold text-right text-amber-600 dark:text-amber-400">
                          {params.worldRecord.mark} <span className="font-normal text-[10px] text-slate-500 dark:text-slate-400">({params.worldRecord.athlete})</span>
                        </span>
                      </div>
                    )}

                    {/* 🇮🇳 Indian National Record */}
                    {(() => {
                      const indRec = getIndianRecord(evt);
                      const indGenderRec = indRec ? (selectedGender === 'male' ? indRec.men : indRec.women) : undefined;
                      if (!indGenderRec) return null;
                      return (
                        <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/80">
                          <span className="font-semibold flex items-center gap-1 shrink-0 text-amber-500">
                            <span className="text-xs">🇮🇳</span> Indian NR:
                          </span>
                          <span className="font-bold text-right text-amber-600 dark:text-amber-400">
                            {indGenderRec.mark} <span className="font-normal text-[10px] text-slate-500 dark:text-slate-400">({indGenderRec.athlete}, {indGenderRec.year})</span>
                          </span>
                        </div>
                      );
                    })()}

                    {params?.qualifyingStandard && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">Olympic Standard:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {params.qualifyingStandard}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Benchmark Footer */}
                {params?.benchmarks && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-3 gap-1 text-center">
                    <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/30">
                      <div className="text-[9px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Elite</div>
                      <div className="text-[11px] font-mono font-bold text-emerald-900 dark:text-emerald-300">{params.benchmarks.elite}</div>
                    </div>
                    <div className="p-1 rounded bg-blue-50 dark:bg-blue-950/30">
                      <div className="text-[9px] font-bold uppercase text-blue-700 dark:text-blue-400">National</div>
                      <div className="text-[11px] font-mono font-bold text-blue-900 dark:text-blue-300">{params.benchmarks.national}</div>
                    </div>
                    <div className="p-1 rounded bg-slate-100 dark:bg-slate-900">
                      <div className="text-[9px] font-bold uppercase text-slate-600 dark:text-slate-400">Club</div>
                      <div className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-300">{params.benchmarks.club}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Comparison View (Men vs Women side-by-side) - Fully Bounded & Zero Overflow */
        <div className="w-full max-w-full min-w-0 overflow-hidden space-y-3">
          {/* Mobile Comparison Cards (< md) */}
          <div className="block md:hidden space-y-3 w-full max-w-full min-w-0">
            {filteredEvents.map((evt) => {
              const m = evt.genderParameters?.male;
              const f = evt.genderParameters?.female;

              return (
                <div
                  key={evt.id}
                  className={`p-3 rounded-xl border w-full max-w-full overflow-hidden ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-slate-800'
                  }`}
                >
                  {/* Card Event Header */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                        {evt.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {evt.category} • {evt.unit}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/10 text-red-600 dark:text-rose-400 border border-red-500/20">
                      M vs F
                    </span>
                  </div>

                  {/* Parallel Side-by-Side or Stacked Micro-Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Senior Men (M) */}
                    <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 flex items-center justify-between">
                          <span>Senior Men</span>
                          <span className="font-mono text-[9px] bg-blue-100 dark:bg-blue-900/60 px-1 rounded">M</span>
                        </div>
                        <div className="mt-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          {m?.implementSpec && (
                            <div className="truncate"><strong className="text-slate-500 text-[10px]">Weight:</strong> {m.implementSpec}</div>
                          )}
                          {m?.hurdleHeightM && (
                            <div><strong className="text-slate-500 text-[10px]">Hurdles:</strong> {m.hurdleHeightM}m</div>
                          )}
                          {!m?.implementSpec && !m?.hurdleHeightM && (
                            <span className="text-slate-400 text-[11px]">Standard spec</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-blue-200/60 dark:border-blue-900/40 space-y-0.5 text-[10px]">
                        {(() => {
                          const indRec = getIndianRecord(evt);
                          return indRec?.men ? (
                            <div className="font-mono text-amber-600 dark:text-amber-400 font-semibold truncate">
                              🇮🇳 NR: {indRec.men.mark} ({indRec.men.athlete.split(' ')[0]})
                            </div>
                          ) : null;
                        })()}
                        {m?.worldRecord && (
                          <div className="font-mono">
                            <span className="text-slate-400">WR: </span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">{m.worldRecord.mark}</span>
                          </div>
                        )}
                        {m?.qualifyingStandard && (
                          <div className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                            Oly: {m.qualifyingStandard}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Senior Women (F) */}
                    <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-400 flex items-center justify-between">
                          <span>Senior Women</span>
                          <span className="font-mono text-[9px] bg-rose-100 dark:bg-rose-900/60 px-1 rounded">F</span>
                        </div>
                        <div className="mt-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          {f?.implementSpec && (
                            <div className="truncate"><strong className="text-slate-500 text-[10px]">Weight:</strong> {f.implementSpec}</div>
                          )}
                          {f?.hurdleHeightM && (
                            <div><strong className="text-slate-500 text-[10px]">Hurdles:</strong> {f.hurdleHeightM}m</div>
                          )}
                          {!f?.implementSpec && !f?.hurdleHeightM && (
                            <span className="text-slate-400 text-[11px]">Standard spec</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-rose-200/60 dark:border-rose-900/40 space-y-0.5 text-[10px]">
                        {(() => {
                          const indRec = getIndianRecord(evt);
                          return indRec?.women ? (
                            <div className="font-mono text-amber-600 dark:text-amber-400 font-semibold truncate">
                              🇮🇳 NR: {indRec.women.mark} ({indRec.women.athlete.split(' ')[0]})
                            </div>
                          ) : null;
                        })()}
                        {f?.worldRecord && (
                          <div className="font-mono">
                            <span className="text-slate-400">WR: </span>
                            <span className="font-bold text-rose-600 dark:text-rose-400">{f.worldRecord.mark}</span>
                          </div>
                        )}
                        {f?.qualifyingStandard && (
                          <div className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                            Oly: {f.qualifyingStandard}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop & Tablet Table (>= md) with Internal Scroll Container */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-full">
            <table className="w-full min-w-[640px] text-xs text-left border-collapse">
              <thead>
                <tr className={`border-b ${isBright ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'}`}>
                  <th className="p-3 font-bold">Athletics Discipline</th>
                  <th className="p-3 font-bold text-blue-600 dark:text-blue-400">Senior Men (M) Specification</th>
                  <th className="p-3 font-bold text-rose-600 dark:text-rose-400">Senior Women (F) Specification</th>
                  <th className="p-3 font-bold">Men WR / Standard</th>
                  <th className="p-3 font-bold">Women WR / Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredEvents.map((evt) => {
                  const m = evt.genderParameters?.male;
                  const f = evt.genderParameters?.female;

                  return (
                    <tr
                      key={evt.id}
                      className={`transition ${isBright ? 'hover:bg-slate-50' : 'hover:bg-slate-900/60'}`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{evt.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{evt.category} • {evt.unit}</div>
                      </td>
                      <td className="p-3">
                        {m?.implementSpec && <div><strong>Implement:</strong> {m.implementSpec}</div>}
                        {m?.hurdleHeightM && <div><strong>Hurdles:</strong> {m.hurdleHeightM}m ({m.barrierCount} barriers)</div>}
                        {!m?.implementSpec && !m?.hurdleHeightM && <span className="text-slate-400">Standard distance/pit</span>}
                      </td>
                      <td className="p-3">
                        {f?.implementSpec && <div><strong>Implement:</strong> {f.implementSpec}</div>}
                        {f?.hurdleHeightM && <div><strong>Hurdles:</strong> {f.hurdleHeightM}m ({f.barrierCount} barriers)</div>}
                        {!f?.implementSpec && !f?.hurdleHeightM && <span className="text-slate-400">Standard distance/pit</span>}
                      </td>
                      <td className="p-3">
                        {(() => {
                          const indRec = getIndianRecord(evt);
                          return indRec?.men ? (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                              🇮🇳 NR: {indRec.men.mark} ({indRec.men.athlete})
                            </div>
                          ) : null;
                        })()}
                        {m?.worldRecord && (
                          <div>
                            <span className="font-bold text-amber-600 dark:text-amber-400">{m.worldRecord.mark}</span>
                            <span className="text-[10px] text-slate-400"> ({m.worldRecord.athlete})</span>
                          </div>
                        )}
                        {m?.qualifyingStandard && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Oly: {m.qualifyingStandard}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {(() => {
                          const indRec = getIndianRecord(evt);
                          return indRec?.women ? (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                              🇮🇳 NR: {indRec.women.mark} ({indRec.women.athlete})
                            </div>
                          ) : null;
                        })()}
                        {f?.worldRecord && (
                          <div>
                            <span className="font-bold text-rose-600 dark:text-rose-400">{f.worldRecord.mark}</span>
                            <span className="text-[10px] text-slate-400"> ({f.worldRecord.athlete})</span>
                          </div>
                        )}
                        {f?.qualifyingStandard && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Oly: {f.qualifyingStandard}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
