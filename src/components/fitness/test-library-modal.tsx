'use client';

import React, { useState } from 'react';
import { TestDefinition, FITNESS_CATEGORIES_INFO, FitnessCategory, AggregationMethod } from '@/types/fitness';
import { NormDataset, PercentilePoint } from '@/types/benchmark';
import { db } from '@/lib/storage/local-storage-db';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Plus,
  Check,
  Search,
  Filter,
  Edit3,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

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
  
  // Drawer / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<FitnessCategory>('strength');
  const [formUnit, setFormUnit] = useState<TestDefinition['unit']>('reps');
  const [formDescription, setFormDescription] = useState('');
  const [formProtocol, setFormProtocol] = useState('');
  const [formEquipment, setFormEquipment] = useState('');
  const [formDirection, setFormDirection] = useState<'higher_is_better' | 'lower_is_better'>('higher_is_better');
  const [formAttempts, setFormAttempts] = useState<number>(1);
  const [formAggregation, setFormAggregation] = useState<AggregationMethod>('best');
  const [formBilateral, setFormBilateral] = useState(false);
  const [formMinValid, setFormMinValid] = useState<number>(0);
  const [formMaxValid, setFormMaxValid] = useState<number>(100);

  // Benchmark Percentiles State
  const [enableBenchmarks, setEnableBenchmarks] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [publicationTitle, setPublicationTitle] = useState('');
  const [doiOrUrl, setDoiOrUrl] = useState('');
  const [publicationYear, setPublicationYear] = useState<number>(2026);
  const [studyPopulation, setStudyPopulation] = useState('');
  const [sampleSize, setSampleSize] = useState<number>(1000);

  // Male Percentiles
  const [maleP10, setMaleP10] = useState<string>('20');
  const [maleP25, setMaleP25] = useState<string>('28');
  const [maleP50, setMaleP50] = useState<string>('38');
  const [maleP75, setMaleP75] = useState<string>('46');
  const [maleP90, setMaleP90] = useState<string>('54');
  const [maleP95, setMaleP95] = useState<string>('60');

  // Female Percentiles
  const [femP10, setFemP10] = useState<string>('15');
  const [femP25, setFemP25] = useState<string>('22');
  const [femP50, setFemP50] = useState<string>('30');
  const [femP75, setFemP75] = useState<string>('38');
  const [femP90, setFemP90] = useState<string>('45');
  const [femP95, setFemP95] = useState<string>('52');

  if (!isOpen) return null;

  const filteredTests = tests.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Open Form to Add New Test
  const handleOpenAddForm = () => {
    setEditingTestId(null);
    setFormName('');
    setFormCode('');
    setFormCategory('strength');
    setFormUnit('reps');
    setFormDescription('Standardized physical athletic test protocol.');
    setFormProtocol('');
    setFormEquipment('Gym mat, timer');
    setFormDirection('higher_is_better');
    setFormAttempts(1);
    setFormAggregation('best');
    setFormBilateral(false);
    setFormMinValid(0);
    setFormMaxValid(120);

    setEnableBenchmarks(false);
    setSourceName('Coach Athletic Camp Standards');
    setPublicationTitle('National Track & Field Testing Standards');
    setDoiOrUrl('https://athletics.gov.in');
    setPublicationYear(2026);
    setStudyPopulation('Senior and Junior National Level Track & Field Athletes');
    setSampleSize(1500);

    setMaleP10('25');
    setMaleP25('32');
    setMaleP50('42');
    setMaleP75('50');
    setMaleP90('58');
    setMaleP95('64');

    setFemP10('18');
    setFemP25('25');
    setFemP50('35');
    setFemP75('43');
    setFemP90('50');
    setFemP95('56');

    setIsFormOpen(true);
  };

  // Open Form to Edit Existing Test
  const handleOpenEditForm = (test: TestDefinition) => {
    setEditingTestId(test.id);
    setFormName(test.name);
    setFormCode(test.code);
    setFormCategory(test.category);
    setFormUnit(test.unit);
    setFormDescription(test.description || '');
    setFormProtocol(test.protocol);
    setFormEquipment(test.equipmentRequirements ? test.equipmentRequirements.join(', ') : '');
    setFormDirection(test.measurementDirection);
    setFormAttempts(test.permittedAttempts || 1);
    setFormAggregation(test.resultAggregation || 'best');
    setFormBilateral(Boolean(test.isBilateral));

    const dataset = normDatasets.find((d) => d.testCode === test.code);
    if (dataset) {
      setEnableBenchmarks(true);
      setFormMinValid(dataset.minValidMeasurement);
      setFormMaxValid(dataset.maxValidMeasurement);
      setSourceName(dataset.source.sourceName);
      setPublicationTitle(dataset.source.publicationTitle);
      setDoiOrUrl(dataset.source.doiOrUrl);
      setPublicationYear(dataset.source.publicationYear);
      setStudyPopulation(dataset.source.studyPopulation);
      setSampleSize(dataset.source.sampleSize);

      const maleBracket = dataset.ageBrackets.find((b) => b.sex === 'male');
      if (maleBracket && maleBracket.percentiles.length > 0) {
        const getP = (pNum: number) => {
          const pt = maleBracket.percentiles.find((x) => x.percentile === pNum);
          return pt ? String(pt.value) : '';
        };
        setMaleP10(getP(10) || '20');
        setMaleP25(getP(25) || '30');
        setMaleP50(getP(50) || '40');
        setMaleP75(getP(75) || '50');
        setMaleP90(getP(90) || '60');
        setMaleP95(getP(95) || '65');
      }

      const femBracket = dataset.ageBrackets.find((b) => b.sex === 'female');
      if (femBracket && femBracket.percentiles.length > 0) {
        const getP = (pNum: number) => {
          const pt = femBracket.percentiles.find((x) => x.percentile === pNum);
          return pt ? String(pt.value) : '';
        };
        setFemP10(getP(10) || '15');
        setFemP25(getP(25) || '25');
        setFemP50(getP(50) || '35');
        setFemP75(getP(75) || '45');
        setFemP90(getP(90) || '55');
        setFemP95(getP(95) || '60');
      }
    } else {
      setEnableBenchmarks(false);
      setFormMinValid(0);
      setFormMaxValid(100);
      setSourceName('National Camp Norms');
      setPublicationTitle('Athletics Performance Standards');
      setDoiOrUrl('https://athletics.gov.in');
      setPublicationYear(2026);
      setStudyPopulation('National Athletes');
      setSampleSize(1000);
    }

    setIsFormOpen(true);
  };

  // Delete Custom Test
  const handleDeleteTest = (testId: string) => {
    if (confirm('Are you sure you want to delete this test protocol from the library?')) {
      db.deleteTestDefinition(testId);
      setTests(db.getTestDefinitions());
      setNormDatasets(db.getNormDatasets());
      setFormSuccessMessage('Test removed successfully.');
      setTimeout(() => setFormSuccessMessage(null), 3000);
    }
  };

  // Save Test & Benchmarks
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const testCode = formCode.trim().toUpperCase().replace(/\s+/g, '_') || `TEST_${Date.now()}`;
    const testId = editingTestId || `test-${testCode.toLowerCase()}-${Date.now()}`;

    // 1. Build and save TestDefinition
    const updatedTest: TestDefinition = {
      id: testId,
      code: testCode,
      name: formName.trim(),
      category: formCategory,
      description: formDescription.trim() || 'Coach-authorized physical test protocol.',
      unit: formUnit,
      protocol: formProtocol.trim() || 'Standard athletics coach supervised protocol.',
      measurementDirection: formDirection,
      permittedAttempts: formAttempts,
      resultAggregation: formAggregation,
      equipmentRequirements: formEquipment
        ? formEquipment.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Standard field equipment'],
      isBilateral: formBilateral,
      applicableAgeRange: [12, 45],
      applicableEventGroups: ['sprints', 'hurdles', 'jumps', 'throws', 'middle_distance', 'long_distance', 'combined'],
      applicableSexGroups: ['male', 'female'],
      hasValidatedBenchmark: enableBenchmarks,
      benchmarkStatus: enableBenchmarks ? 'valid' : 'none',
      benchmarkSourceId: enableBenchmarks ? `src-${testCode.toLowerCase()}` : undefined,
      isCustom: true,
      notes: enableBenchmarks
        ? 'Configured with coach-defined percentile equations and benchmark curves.'
        : 'Tracked longitudinally without benchmark percentiles.',
    };

    db.saveTestDefinition(updatedTest);

    // 2. If Benchmarks enabled, build and save NormDataset
    if (enableBenchmarks) {
      const malePoints: PercentilePoint[] = [
        { percentile: 10, value: parseFloat(maleP10) || 0 },
        { percentile: 25, value: parseFloat(maleP25) || 0 },
        { percentile: 50, value: parseFloat(maleP50) || 0 },
        { percentile: 75, value: parseFloat(maleP75) || 0 },
        { percentile: 90, value: parseFloat(maleP90) || 0 },
        { percentile: 95, value: parseFloat(maleP95) || 0 },
      ].sort((a, b) => a.percentile - b.percentile);

      const femalePoints: PercentilePoint[] = [
        { percentile: 10, value: parseFloat(femP10) || 0 },
        { percentile: 25, value: parseFloat(femP25) || 0 },
        { percentile: 50, value: parseFloat(femP50) || 0 },
        { percentile: 75, value: parseFloat(femP75) || 0 },
        { percentile: 90, value: parseFloat(femP90) || 0 },
        { percentile: 95, value: parseFloat(femP95) || 0 },
      ].sort((a, b) => a.percentile - b.percentile);

      const normDataset: NormDataset = {
        id: `src-${testCode.toLowerCase()}`,
        testCode: testCode,
        sourceId: `src-${testCode.toLowerCase()}`,
        source: {
          id: `src-${testCode.toLowerCase()}`,
          sourceName: sourceName.trim() || 'Coach Benchmark Standards',
          publicationTitle: publicationTitle.trim() || 'Track & Field Performance Norms',
          authors: ['High Performance Coaching Staff'],
          doiOrUrl: doiOrUrl.trim() || 'https://athletics.gov.in',
          publicationYear: publicationYear || 2026,
          datasetVersion: 'v2.6',
          studyPopulation: studyPopulation.trim() || 'Athletic Testing Cohorts',
          sampleSize: sampleSize || 1000,
          ageRange: [12, 45],
          sexGroups: ['male', 'female'],
          countryOrRegion: 'India / International',
          testProtocolSummary: formProtocol.trim() || formDescription.trim(),
          measurementUnits: formUnit,
          statisticalMethod: 'percentile_ranks',
          limitations: 'Coach supervised standardized protocol.',
          licenseOrUsageInfo: 'Internal Well Perform Specification',
        },
        measurementDirection: formDirection,
        minValidMeasurement: Number(formMinValid) || 0,
        maxValidMeasurement: Number(formMaxValid) || 1000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ageBrackets: [
          {
            minAge: 12,
            maxAge: 45,
            sex: 'male',
            percentiles: malePoints,
          },
          {
            minAge: 12,
            maxAge: 45,
            sex: 'female',
            percentiles: femalePoints,
          },
        ],
      };

      db.saveNormDataset(normDataset);
    }

    setTests(db.getTestDefinitions());
    setNormDatasets(db.getNormDatasets());
    setIsFormOpen(false);
    setFormSuccessMessage(`Test "${updatedTest.name}" saved successfully with rules & benchmarks.`);
    setTimeout(() => setFormSuccessMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-600 text-white font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Physical Fitness Test & Benchmark Library</h3>
              <p className="text-xs text-slate-400">
                Published scientific norm tables with official DOIs, equations & measurement protocols
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole !== 'ATHLETE' && (
              <button
                onClick={handleOpenAddForm}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Test
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {formSuccessMessage && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{formSuccessMessage}</span>
          </div>
        )}

        {/* Custom Test & Benchmark Editor Drawer */}
        {isFormOpen && (
          <form
            onSubmit={handleSaveForm}
            className="p-5 bg-gradient-to-br from-rose-50/70 via-slate-50 to-white border-b-2 border-red-500 text-xs space-y-4 overflow-y-auto max-h-[60vh] shrink-0"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-600" />
                <span className="font-bold text-sm text-slate-900">
                  {editingTestId ? `Edit Test Protocol: ${formName}` : 'Register New Test Protocol & Benchmark Curves'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Coach High-Performance Specification Engine
              </span>
            </div>

            {/* SECTION 1: Test Details */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1 text-slate-800">Test Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1-Minute Continuous Sit-ups"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800">Test Code (Unique) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SITUPS_60S"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as FitnessCategory)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
                >
                  {Object.keys(FITNESS_CATEGORIES_INFO).map((c) => (
                    <option key={c} value={c}>
                      {FITNESS_CATEGORIES_INFO[c as FitnessCategory].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-800">Measurement Unit</label>
                <select
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
                >
                  <option value="reps">reps (repetitions)</option>
                  <option value="s">s (seconds)</option>
                  <option value="m">m (meters)</option>
                  <option value="cm">cm (centimeters)</option>
                  <option value="kg">kg (kilograms)</option>
                  <option value="degrees">degrees (°)</option>
                  <option value="score">score (numerical points)</option>
                  <option value="level">level (shuttle stage)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800">Directionality</label>
                <select
                  value={formDirection}
                  onChange={(e) => setFormDirection(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
                >
                  <option value="higher_is_better">Higher is Better (e.g. Reps, Jump, Weight)</option>
                  <option value="lower_is_better">Lower is Better (e.g. Sprint Time, Agility)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800">Permitted Attempts</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formAttempts}
                  onChange={(e) => setFormAttempts(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-800">Aggregation Rule</label>
                <select
                  value={formAggregation}
                  onChange={(e) => setFormAggregation(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-900"
                >
                  <option value="best">Best Trial Value</option>
                  <option value="average">Average of Trials</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1 text-slate-800">Standardized Protocol Instructions *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Exact starting position, timing cue, movement rules, valid reps, disallowed actions..."
                  value={formProtocol}
                  onChange={(e) => setFormProtocol(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-800">Required Equipment</label>
                  <input
                    type="text"
                    placeholder="e.g. Exercise mat, stopwatch"
                    value={formEquipment}
                    onChange={(e) => setFormEquipment(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
                  />
                </div>
                <div className="pt-1 flex items-center gap-3">
                  <label className="flex items-center gap-1.5 font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formBilateral}
                      onChange={(e) => setFormBilateral(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Bilateral (Left/Right)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Plausibility Bounds */}
            <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Biological Plausibility Bounds (Sensor / Input Error Protection)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">
                    Minimum Plausible Measurement ({formUnit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formMinValid}
                    onChange={(e) => setFormMinValid(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">
                    Maximum Plausible Measurement ({formUnit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formMaxValid}
                    onChange={(e) => setFormMaxValid(parseFloat(e.target.value) || 100)}
                    className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Benchmark Equations & Norms */}
            <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span className="font-bold text-slate-900">
                    Scientific Benchmark Equations & Percentile Curves
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-rose-900">
                  <input
                    type="checkbox"
                    checked={enableBenchmarks}
                    onChange={(e) => setEnableBenchmarks(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                  />
                  <span>Enable Live Percentile Scoring for this Test</span>
                </label>
              </div>

              {enableBenchmarks && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-800">Source / Study Name *</label>
                      <input
                        type="text"
                        required={enableBenchmarks}
                        placeholder="e.g. Eurofit / ACSM Muscular Endurance"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-800">DOI or Official Publication Link</label>
                      <input
                        type="text"
                        placeholder="https://doi.org/... or official URL"
                        value={doiOrUrl}
                        onChange={(e) => setDoiOrUrl(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-800">Cohort & Sample Size (N)</label>
                      <input
                        type="number"
                        placeholder="18400"
                        value={sampleSize}
                        onChange={(e) => setSampleSize(parseInt(e.target.value) || 1000)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Male Percentile Tiers */}
                  <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-200">
                    <div className="font-bold text-blue-950 mb-1">
                      👨 Male Benchmark Curve ({formUnit})
                    </div>
                    <div className="grid grid-cols-6 gap-2 text-center">
                      <div>
                        <div className="text-[10px] text-blue-800 font-semibold">10th %ile</div>
                        <input
                          type="text"
                          value={maleP10}
                          onChange={(e) => setMaleP10(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-blue-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-blue-800 font-semibold">25th %ile</div>
                        <input
                          type="text"
                          value={maleP25}
                          onChange={(e) => setMaleP25(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-blue-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-blue-800 font-semibold">50th %ile (Avg)</div>
                        <input
                          type="text"
                          value={maleP50}
                          onChange={(e) => setMaleP50(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-blue-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-blue-800 font-semibold">75th %ile</div>
                        <input
                          type="text"
                          value={maleP75}
                          onChange={(e) => setMaleP75(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-blue-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-blue-800 font-semibold">90th %ile</div>
                        <input
                          type="text"
                          value={maleP90}
                          onChange={(e) => setMaleP90(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-blue-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-blue-800 font-semibold">95th %ile (Elite)</div>
                        <input
                          type="text"
                          value={maleP95}
                          onChange={(e) => setMaleP95(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-blue-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Female Percentile Tiers */}
                  <div className="p-2.5 bg-rose-50/70 rounded-lg border border-rose-200">
                    <div className="font-bold text-rose-950 mb-1">
                      👩 Female Benchmark Curve ({formUnit})
                    </div>
                    <div className="grid grid-cols-6 gap-2 text-center">
                      <div>
                        <div className="text-[10px] text-rose-800 font-semibold">10th %ile</div>
                        <input
                          type="text"
                          value={femP10}
                          onChange={(e) => setFemP10(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-rose-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-rose-800 font-semibold">25th %ile</div>
                        <input
                          type="text"
                          value={femP25}
                          onChange={(e) => setFemP25(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-rose-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-rose-800 font-semibold">50th %ile (Avg)</div>
                        <input
                          type="text"
                          value={femP50}
                          onChange={(e) => setFemP50(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-rose-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-rose-800 font-semibold">75th %ile</div>
                        <input
                          type="text"
                          value={femP75}
                          onChange={(e) => setFemP75(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-rose-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-rose-800 font-semibold">90th %ile</div>
                        <input
                          type="text"
                          value={femP90}
                          onChange={(e) => setFemP90(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-rose-300 rounded text-xs"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] text-rose-800 font-semibold">95th %ile (Elite)</div>
                        <input
                          type="text"
                          value={femP95}
                          onChange={(e) => setFemP95(e.target.value)}
                          className="w-full px-1 py-1 text-center font-bold bg-white border border-rose-300 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg shadow-md transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                {editingTestId ? 'Update Test & Benchmarks' : 'Save Test to Library'}
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
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800"
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
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-xs transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
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
                      {test.isCustom && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          Custom Test
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{test.description}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      <strong>Protocol:</strong> {test.protocol}
                    </p>
                    {test.equipmentRequirements && test.equipmentRequirements.length > 0 && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        <strong>Equipment:</strong> {test.equipmentRequirements.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Unit: {test.unit}</span>
                      <span className="text-[11px] text-slate-500 capitalize block">
                        Direction: {test.measurementDirection.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Attempts: {test.permittedAttempts || 1} ({test.resultAggregation || 'best'})
                      </span>
                    </div>

                    {/* Coach Actions */}
                    {userRole !== 'ATHLETE' && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => handleOpenEditForm(test)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1"
                          title="Edit test rules, protocols, or benchmark equations"
                        >
                          <Edit3 className="w-3 h-3 text-slate-600" />
                          Edit Test
                        </button>
                        {test.isCustom && (
                          <button
                            onClick={() => handleDeleteTest(test.id)}
                            className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                            title="Delete this custom test protocol"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onSelectTest && (
                          <button
                            onClick={() => onSelectTest(test)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-red-600 hover:bg-red-500 text-white transition"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Published Scientific Norm Information */}
                {normDataset ? (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Scientific Source: {normDataset.source.sourceName} ({normDataset.source.publicationYear})
                      </span>
                      {normDataset.source.doiOrUrl && (
                        <a
                          href={normDataset.source.doiOrUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-950 font-semibold inline-flex items-center gap-1 text-[11px]"
                        >
                          Official Publication Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
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
