'use client';

import React, { useState } from 'react';
import { TestDefinition, FITNESS_CATEGORIES_INFO, FitnessCategory } from '@/types/fitness';
import { NormDataset } from '@/types/benchmark';
import { db } from '@/lib/storage/local-storage-db';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, ShieldCheck, Plus, Check, Search, Filter } from 'lucide-react';

interface TestLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTest?: (test: TestDefinition) => void;
  userRole?: string;
}

export function TestLibraryModal({ isOpen, onClose, onSelectTest, userRole }: TestLibraryModalProps) {
  const [tests, setTests] = useState<TestDefinition[]>(() => db.getTestDefinitions());
  const [normDatasets, setNormDatasets] = useState<NormDataset[]>(() => db.getNormDatasets());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // Custom Test Form State
  const [customName, setCustomName] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [customCategory, setCustomCategory] = useState<FitnessCategory>('strength');
  const [customUnit, setCustomUnit] = useState<TestDefinition['unit']>('kg');
  const [customProtocol, setCustomProtocol] = useState('');
  const [customDirection, setCustomDirection] = useState<'higher_is_better' | 'lower_is_better'>('higher_is_better');
  const [customBilateral, setCustomBilateral] = useState(false);

  if (!isOpen) return null;

  const filteredTests = tests.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newTest: TestDefinition = {
      id: `test-custom-${Date.now()}`,
      code: customCode.trim().toUpperCase().replace(/\s+/g, '_') || `TEST_${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      description: 'Coach-authorized custom physical test.',
      unit: customUnit,
      protocol: customProtocol.trim() || 'Standard athletics coach supervised protocol.',
      measurementDirection: customDirection,
      permittedAttempts: 2,
      resultAggregation: 'best',
      equipmentRequirements: ['Standard field equipment'],
      isBilateral: customBilateral,
      applicableAgeRange: [12, 45],
      applicableEventGroups: ['sprints', 'jumps', 'throws'],
      applicableSexGroups: ['male', 'female'],
      hasValidatedBenchmark: false,
      benchmarkStatus: 'none',
      isCustom: true,
      notes: 'Custom physical assessment protocol. Track longitudinal change without benchmark percentiles.',
    };

    db.saveTestDefinition(newTest);
    setTests(db.getTestDefinitions());
    setIsAddingCustom(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-400 text-slate-950 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Physical Fitness Test & Benchmark Library</h3>
              <p className="text-xs text-slate-400">
                Published scientific norm tables with official DOIs & measurement protocols
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole !== 'ATHLETE' && (
              <button
                onClick={() => setIsAddingCustom(!isAddingCustom)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition"
              >
                + Add Custom Test
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              ✕
            </button>
          </div>
        </div>

        {/* Custom Test Drawer Form */}
        {isAddingCustom && (
          <form onSubmit={handleSaveCustom} className="p-4 bg-amber-50/70 border-b border-amber-200 text-xs space-y-3">
            <div className="font-bold text-slate-900 uppercase">Register Coach Custom Test Definition</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Test Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Hop Distance"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as FitnessCategory)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  {Object.keys(FITNESS_CATEGORIES_INFO).map((c) => (
                    <option key={c} value={c}>
                      {FITNESS_CATEGORIES_INFO[c as FitnessCategory].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Unit</label>
                <select
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="s">s</option>
                  <option value="kg">kg</option>
                  <option value="reps">reps</option>
                  <option value="degrees">degrees</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Protocol Description</label>
                <input
                  type="text"
                  placeholder="Testing rules, attempts allowed, equipment..."
                  value={customProtocol}
                  onChange={(e) => setCustomProtocol(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customDirection === 'lower_is_better'}
                    onChange={(e) => setCustomDirection(e.target.checked ? 'lower_is_better' : 'higher_is_better')}
                  />
                  <span>Lower is Better (Speed/Times)</span>
                </label>
                <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customBilateral}
                    onChange={(e) => setCustomBilateral(e.target.checked)}
                  />
                  <span>Bilateral (L/R)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-3 py-1 font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 font-bold bg-amber-400 text-slate-950 rounded shadow-xs"
              >
                Save Custom Test
              </button>
            </div>
          </form>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tests by name, protocol or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg"
            >
              <option value="all">All Fitness Categories (10)</option>
              {Object.keys(FITNESS_CATEGORIES_INFO).map((c) => (
                <option key={c} value={c}>
                  {FITNESS_CATEGORIES_INFO[c as FitnessCategory].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Test List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredTests.map((test) => {
            const normDataset = normDatasets.find((d) => d.testCode === test.code);
            const catInfo = FITNESS_CATEGORIES_INFO[test.category];

            return (
              <div
                key={test.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{test.name}</h4>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {test.code}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: catInfo?.color ?? '#eab308' }}
                      >
                        {catInfo?.label}
                      </span>
                      {test.isBilateral && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                          Bilateral (L/R)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{test.description}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      <strong>Protocol:</strong> {test.protocol}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-700 block">Unit: {test.unit}</span>
                    <span className="text-[11px] text-slate-500 capitalize block">
                      Direction: {test.measurementDirection.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Published Scientific Norm Information */}
                {normDataset ? (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Scientific Source: {normDataset.source.sourceName} ({normDataset.source.publicationYear})
                      </span>
                      <a
                        href={normDataset.source.doiOrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-950 font-semibold inline-flex items-center gap-1 text-[11px]"
                      >
                        Official DOI Publication <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-emerald-950 text-[11px]">
                      <strong>Study Cohort:</strong> {normDataset.source.studyPopulation} (N = {normDataset.source.sampleSize.toLocaleString()})
                    </p>
                    <p className="text-emerald-800 text-[10px] italic">
                      <strong>Limitations:</strong> {normDataset.source.limitations}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span className="italic">
                      Status: No universal published percentile standard. Results tracked raw without percentile extrapolation.
                    </span>
                    <Badge variant="gray" size="sm">Unbenchmarked</Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
