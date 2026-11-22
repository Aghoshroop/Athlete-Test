'use client';

import React, { useState } from 'react';
import {
  ReportDesignConfig,
  REPORT_THEME_PRESETS,
  REPORT_FONT_PRESETS,
  REPORT_PAPER_TONES,
  ReportColorTheme,
  ReportFontFamily,
  ReportPaperTone,
  DEFAULT_REPORT_DESIGN,
  getResolvedThemeColor,
} from '@/types/report-design';
import { Assessment } from '@/types/assessment';
import { AthleteProfile } from '@/types/athlete';
import { db } from '@/lib/storage/local-storage-db';
import { ReportPageOne } from './report-page-one';
import { ReportPageTwo } from './report-page-two';
import {
  Palette,
  Type,
  FileSpreadsheet,
  BarChart3,
  Check,
  RotateCcw,
  X,
  Sparkles,
  Layers,
  Eye,
  Sliders,
  Columns,
  Maximize2,
} from 'lucide-react';

interface ReportDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReportDesignConfig;
  onChange: (config: ReportDesignConfig) => void;
  sampleAssessment?: Assessment;
  sampleAthlete?: AthleteProfile;
}

export function ReportDesignModal({
  isOpen,
  onClose,
  config,
  onChange,
  sampleAssessment,
  sampleAthlete,
}: ReportDesignModalProps) {
  const [localConfig, setLocalConfig] = useState<ReportDesignConfig>(config);
  const [previewTab, setPreviewTab] = useState<'page2' | 'page1' | 'both'>('page2');

  // Resolve sample data for live demo rendering
  const demoAssessment =
    sampleAssessment ||
    db.getAssessments()[0] || {
      id: 'demo-ass',
      organizationId: 'org-nahpc',
      athleteId: 'ath-1',
      athleteCode: 'GBR-100-24',
      athleteName: 'Liam Hughes',
      athleteAge: 23,
      sex: 'male',
      eventGroup: 'sprints',
      primaryEvent: '100m / 200m Sprint',
      batteryId: 'battery-olympic',
      batteryName: 'National Senior Sprint & Power Battery',
      coachId: 'coach-rudra-roy',
      coachName: 'Coach Rudra Roy',
      assessmentDate: '2024-11-15',
      status: 'finalized',
      testResults: [],
      overallFitnessScore: 88.4,
      overallRating: 'National Standard',
      coveragePercentage: 90,
      meetsMinimumCoverage: true,
      topStrengths: ['Acceleration (10m Sprint)', 'Explosive Power (CMJ 58.4cm)'],
      areasToImprove: ['Aerobic Lactate Buffer Capacity'],
      bilateralAsymmetries: [
        {
          testName: 'Single Leg Isometric Force',
          asymmetryPercent: 4.8,
          description: 'Right Leg Dominant (4.8%)',
        },
      ],
      revision: 1,
      scoringConfigVersion: '1.0',
      coachGeneralComments:
        'Liam demonstrated elite sprint power. Recommend maintaining power cycle and increasing high-lactate buffer runs.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  const demoAthlete =
    sampleAthlete ||
    db.getAthletes().find((a) => a.id === demoAssessment?.athleteId) ||
    db.getAthletes()[0] || {
      id: 'ath-1',
      organizationId: 'org-nahpc',
      athleteCode: 'GBR-100-24',
      fullName: 'Liam Hughes',
      dateOfBirth: '2001-05-14',
      sex: 'male',
      primaryEventName: '100m Sprint',
      eventGroup: 'sprints',
      status: 'active',
      trainingSquad: 'Senior Sprint & Hurdle Group A',
      coachId: 'coach-rudra-roy',
      coachName: 'Coach Rudra Roy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  if (!isOpen) return null;

  const handleUpdate = (partial: Partial<ReportDesignConfig>) => {
    const updated = { ...localConfig, ...partial };
    setLocalConfig(updated);
    onChange(updated);
  };

  const handleReset = () => {
    setLocalConfig(DEFAULT_REPORT_DESIGN);
    onChange(DEFAULT_REPORT_DESIGN);
  };

  const resolvedTheme = getResolvedThemeColor(localConfig);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-print"
    >
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-7xl w-full overflow-hidden my-auto flex flex-col h-[94vh]">
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black shadow-md shadow-red-950/40"
              style={{ backgroundColor: resolvedTheme.primary }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Report Paper Design Customizer
                </h3>
                <span
                  className="text-[10px] uppercase font-black px-2 py-0.5 rounded text-white shadow-xs"
                  style={{ backgroundColor: resolvedTheme.primary }}
                >
                  Side-by-Side Live Demo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Adjust brand colors, fonts, paper tones, and Page 2 metric graphing styles with real-time demo preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
              title="Reset to Athletics Standard"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              title="Close Customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TWO-COLUMN SIDE-BY-SIDE SPLIT VIEW                             */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* ------------------------------------------------------------ */}
          {/* LEFT COLUMN: DESIGN SETTINGS CONTROLS (Scrollable)           */}
          {/* ------------------------------------------------------------ */}
          <div className="w-full lg:w-5/12 xl:w-4/12 overflow-y-auto p-5 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900 shrink-0">
            {/* 1. REPORT ACCENT COLOR */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-rose-500" /> 1. Brand & Accent Color
                </span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: resolvedTheme.primary }}
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(REPORT_THEME_PRESETS) as ReportColorTheme[])
                  .filter((k) => k !== 'custom')
                  .map((themeKey) => {
                    const preset = REPORT_THEME_PRESETS[themeKey];
                    const isSelected = localConfig.themeColor === themeKey;

                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => handleUpdate({ themeColor: themeKey })}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 relative ${
                          isSelected
                            ? 'border-white bg-slate-800 shadow-md ring-2 ring-red-500/50'
                            : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full shrink-0 border border-white/20 shadow-xs flex items-center justify-center"
                          style={{ backgroundColor: preset.primary }}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-200 text-[11px] truncate">
                            {preset.label.split(' ')[0]}
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono">{preset.primary}</div>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Custom Hex Color Picker */}
              <div className="mt-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localConfig.customAccentColor || '#dc2626'}
                    onChange={(e) =>
                      handleUpdate({ themeColor: 'custom', customAccentColor: e.target.value })
                    }
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Pick custom hex color"
                  />
                  <div>
                    <div className="font-bold text-slate-200 text-[11px]">Custom Hex Picker</div>
                    <div className="text-[9px] text-slate-400">Any brand or federation color</div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="#dc2626"
                  value={localConfig.customAccentColor || ''}
                  onChange={(e) =>
                    handleUpdate({ themeColor: 'custom', customAccentColor: e.target.value })
                  }
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-white text-center focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* 2. TYPOGRAPHY & FONT STYLES */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
                <Type className="w-4 h-4 text-rose-500" /> 2. Typography & Font Style
              </label>

              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(REPORT_FONT_PRESETS) as ReportFontFamily[]).map((fontKey) => {
                  const font = REPORT_FONT_PRESETS[fontKey];
                  const isSelected = localConfig.fontFamily === fontKey;

                  return (
                    <button
                      key={fontKey}
                      type="button"
                      onClick={() => handleUpdate({ fontFamily: fontKey })}
                      className={`p-2.5 rounded-xl border text-left transition relative ${
                        isSelected
                          ? 'border-white bg-slate-800 shadow-md ring-2 ring-red-500/50'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-200 text-xs">{font.label}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[11px] p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 ${font.className}`}
                      >
                        100m Sprint 10.42s • 88th %ile
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. PAGE 2 DETAILED RESULTS GRAPH MODE */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-rose-500" /> 3. Page 2 Metric Graph Mode
                </span>
                <span className="text-[10px] text-rose-400 font-bold uppercase">Visual Metrics</span>
              </label>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate({ pageTwoGraphMode: 'both' });
                    setPreviewTab('page2');
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition ${
                    localConfig.pageTwoGraphMode === 'both'
                      ? 'border-white bg-slate-800 ring-2 ring-red-500/50'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="font-bold text-xs text-white mb-0.5 flex items-center justify-between">
                    <span>📊 Both Graphs & Measurements Table</span>
                    {localConfig.pageTwoGraphMode === 'both' && (
                      <Check className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Full horizontal benchmark distribution charts + detailed table with inline micro-gauges.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleUpdate({ pageTwoGraphMode: 'graph-first' });
                    setPreviewTab('page2');
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition ${
                    localConfig.pageTwoGraphMode === 'graph-first'
                      ? 'border-white bg-slate-800 ring-2 ring-red-500/50'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="font-bold text-xs text-white mb-0.5 flex items-center justify-between">
                    <span>📈 Graph-First Visual Metrics</span>
                    {localConfig.pageTwoGraphMode === 'graph-first' && (
                      <Check className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    High-impact horizontal comparison bars with Olympic normative standard zones highlighted.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleUpdate({ pageTwoGraphMode: 'table-first' });
                    setPreviewTab('page2');
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition ${
                    localConfig.pageTwoGraphMode === 'table-first'
                      ? 'border-white bg-slate-800 ring-2 ring-red-500/50'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="font-bold text-xs text-white mb-0.5 flex items-center justify-between">
                    <span>📋 Table with Micro-Gauges</span>
                    {localConfig.pageTwoGraphMode === 'table-first' && (
                      <Check className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Scientific table with inline visual progress bars in every test row.
                  </p>
                </button>
              </div>
            </div>

            {/* 4. PAPER BACKGROUND TONE */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
                <FileSpreadsheet className="w-4 h-4 text-rose-500" /> 4. Report Paper Background Tone
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(REPORT_PAPER_TONES) as ReportPaperTone[]).map((toneKey) => {
                  const tone = REPORT_PAPER_TONES[toneKey];
                  const isSelected = localConfig.paperTone === toneKey;

                  return (
                    <button
                      key={toneKey}
                      type="button"
                      onClick={() => handleUpdate({ paperTone: toneKey })}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                        isSelected
                          ? 'border-white bg-slate-800 shadow-md ring-2 ring-red-500/50'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-md border shrink-0"
                        style={{
                          backgroundColor: tone.bgHex,
                          borderColor: tone.borderHex,
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-200 text-[11px] truncate">
                          {tone.label.split(' ')[0]} {tone.label.split(' ')[1] || ''}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">{tone.bgHex}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. ADVANCED GRAPH & BENCHMARK TOGGLES */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <input
                  type="checkbox"
                  checked={localConfig.showNormZones}
                  onChange={(e) => handleUpdate({ showNormZones: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="font-bold text-slate-200 text-xs">Show Olympic Norm Zones</div>
                  <div className="text-[10px] text-slate-400">
                    Below Avg, Average, Advanced & Elite bands
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <input
                  type="checkbox"
                  checked={localConfig.showBilateralGauges}
                  onChange={(e) => handleUpdate({ showBilateralGauges: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-700 bg-slate-900"
                />
                <div>
                  <div className="font-bold text-slate-200 text-xs">Visual Bilateral Asymmetry Meters</div>
                  <div className="text-[10px] text-slate-400">
                    Left vs Right equilibrium deviation slider
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* RIGHT COLUMN: SIDE-BY-SIDE LIVE PREVIEW DEMO                 */}
          {/* ------------------------------------------------------------ */}
          <div className="w-full lg:w-7/12 xl:w-8/12 bg-slate-950 flex flex-col min-h-0 overflow-hidden">
            {/* Live Demo Toolbar */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white">
                  <Eye className="w-4 h-4 text-emerald-400" /> Live A4 Paper Demo Preview:
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  ({resolvedTheme.label.split(' ')[0]} • {localConfig.fontFamily} • {localConfig.paperTone})
                </span>
              </div>

              {/* View Switcher: Page 2 (Graphs), Page 1, Both Pages */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewTab('page2')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    previewTab === 'page2'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page 2 (Metric Graphs)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('page1')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    previewTab === 'page1'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page 1 (Radar Profile)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('both')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                    previewTab === 'both'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Both Pages Side-by-Side
                </button>
              </div>
            </div>

            {/* Live Document Preview Viewport */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/80 flex justify-center">
              {previewTab === 'page2' && (
                <div className="w-full max-w-[210mm] transition-all duration-300">
                  <ReportPageTwo assessment={demoAssessment} designConfig={localConfig} />
                </div>
              )}

              {previewTab === 'page1' && (
                <div className="w-full max-w-[210mm] transition-all duration-300">
                  <ReportPageOne
                    assessment={demoAssessment}
                    athlete={demoAthlete}
                    designConfig={localConfig}
                  />
                </div>
              )}

              {previewTab === 'both' && (
                <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">
                      Page 1: Physical Fitness Radar Profile
                    </div>
                    <ReportPageOne
                      assessment={demoAssessment}
                      athlete={demoAthlete}
                      designConfig={localConfig}
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">
                      Page 2: Detailed Results Metric Graphs
                    </div>
                    <ReportPageTwo assessment={demoAssessment} designConfig={localConfig} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 hidden sm:block">
            Previewing: <strong className="text-white">{demoAthlete.fullName}</strong> ({demoAthlete.primaryEventName}) • Changes save automatically
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-black bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg shadow-md shadow-red-950/40 transition"
            >
              Apply & Close Customizer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
