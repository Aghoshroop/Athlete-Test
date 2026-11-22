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
  PageTwoGraphMode,
  DEFAULT_REPORT_DESIGN,
} from '@/types/report-design';
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
} from 'lucide-react';

interface ReportDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReportDesignConfig;
  onChange: (config: ReportDesignConfig) => void;
}

export function ReportDesignModal({
  isOpen,
  onClose,
  config,
  onChange,
}: ReportDesignModalProps) {
  const [localConfig, setLocalConfig] = useState<ReportDesignConfig>(config);

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto no-print"
    >
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black shadow-md shadow-red-950/40">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Report Paper Design & Layout Customizer
                </h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-red-600 text-white">
                  Live Preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customize colors, fonts, paper tones, and Page 2 metric graphing styles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition"
            title="Close Customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* SECTION 1: REPORT ACCENT COLOR */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-rose-500" /> 1. Report Accent & Brand Color
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Applies to headers, badges, radar charts & progress gauges
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 relative ${
                        isSelected
                          ? 'border-white bg-slate-800 shadow-md ring-2 ring-red-500/50'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full shrink-0 border border-white/20 shadow-xs flex items-center justify-center"
                        style={{ backgroundColor: preset.primary }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-200 text-[11px] truncate">
                          {preset.label.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {preset.primary}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Custom Hex Color Picker */}
            <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={localConfig.customAccentColor || '#dc2626'}
                  onChange={(e) =>
                    handleUpdate({ themeColor: 'custom', customAccentColor: e.target.value })
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  title="Pick custom color"
                />
                <div>
                  <div className="font-bold text-slate-200 text-xs">Custom Hex Accent</div>
                  <div className="text-[10px] text-slate-400">
                    Pick any federation or squad color
                  </div>
                </div>
              </div>
              <input
                type="text"
                placeholder="#dc2626"
                value={localConfig.customAccentColor || ''}
                onChange={(e) =>
                  handleUpdate({ themeColor: 'custom', customAccentColor: e.target.value })
                }
                className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white text-center focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* SECTION 2: FONT & TYPOGRAPHY */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
              <Type className="w-4 h-4 text-rose-500" /> 2. Typography & Font Style
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(REPORT_FONT_PRESETS) as ReportFontFamily[]).map((fontKey) => {
                const font = REPORT_FONT_PRESETS[fontKey];
                const isSelected = localConfig.fontFamily === fontKey;

                return (
                  <button
                    key={fontKey}
                    type="button"
                    onClick={() => handleUpdate({ fontFamily: fontKey })}
                    className={`p-3.5 rounded-xl border text-left transition relative ${
                      isSelected
                        ? 'border-white bg-slate-800 shadow-md ring-2 ring-red-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200 text-xs">{font.label}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">{font.description}</p>
                    <div
                      className={`text-xs p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 ${font.className}`}
                    >
                      Official Assessment • 100m Sprint 10.42s • 88th %ile
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: PAGE 2 DETAILED RESULTS GRAPH SHOW */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-rose-500" /> 3. Page 2 Detailed Results Graph Presentation
              </span>
              <span className="text-[10px] text-rose-400 font-bold uppercase">
                Visual Graph Metrics
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleUpdate({ pageTwoGraphMode: 'both' })}
                className={`p-3 rounded-xl border text-left transition ${
                  localConfig.pageTwoGraphMode === 'both'
                    ? 'border-white bg-slate-800 ring-2 ring-red-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                }`}
              >
                <div className="font-bold text-xs text-white mb-1 flex items-center justify-between">
                  <span>📊 Both Graphs & Table</span>
                  {localConfig.pageTwoGraphMode === 'both' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Full event benchmark percentile distribution chart + detailed measurements table with inline visual progress bars.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUpdate({ pageTwoGraphMode: 'graph-first' })}
                className={`p-3 rounded-xl border text-left transition ${
                  localConfig.pageTwoGraphMode === 'graph-first'
                    ? 'border-white bg-slate-800 ring-2 ring-red-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                }`}
              >
                <div className="font-bold text-xs text-white mb-1 flex items-center justify-between">
                  <span>📈 Graph-First Focus</span>
                  {localConfig.pageTwoGraphMode === 'graph-first' && (
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Prominent visual metric horizontal comparison bars with Olympic normative standard zones highlighted.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleUpdate({ pageTwoGraphMode: 'table-first' })}
                className={`p-3 rounded-xl border text-left transition ${
                  localConfig.pageTwoGraphMode === 'table-first'
                    ? 'border-white bg-slate-800 ring-2 ring-red-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                }`}
              >
                <div className="font-bold text-xs text-white mb-1 flex items-center justify-between">
                  <span>📋 Table with Micro-Gauges</span>
                  {localConfig.pageTwoGraphMode === 'table-first' && (
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Classic scientific table enhanced with inline 0-100% percentile gauge bars in every test row.
                </p>
              </button>
            </div>
          </div>

          {/* SECTION 4: PAPER BACKGROUND TONE */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
              <FileSpreadsheet className="w-4 h-4 text-rose-500" /> 4. Report Paper Background Tone
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(REPORT_PAPER_TONES) as ReportPaperTone[]).map((toneKey) => {
                const tone = REPORT_PAPER_TONES[toneKey];
                const isSelected = localConfig.paperTone === toneKey;

                return (
                  <button
                    key={toneKey}
                    type="button"
                    onClick={() => handleUpdate({ paperTone: toneKey })}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-white bg-slate-800 shadow-md ring-2 ring-red-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-md border shrink-0"
                      style={{
                        backgroundColor: tone.bgHex,
                        borderColor: tone.borderHex,
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-200 text-[11px] truncate">
                        {tone.label.split(' ')[0]} {tone.label.split(' ')[1] || ''}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {tone.bgHex}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 5: ADVANCED GRAPH & BENCHMARK TOGGLES */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
              <input
                type="checkbox"
                checked={localConfig.showNormZones}
                onChange={(e) => handleUpdate({ showNormZones: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-700 bg-slate-900"
              />
              <div>
                <div className="font-bold text-slate-200 text-xs">Show Olympic Norm Zones</div>
                <div className="text-[10px] text-slate-400">
                  Highlight Below Avg, Good, Advanced & Elite bands
                </div>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
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

        {/* Footer Controls */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Athletics Standard
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg shadow-md shadow-red-950/40 transition"
            >
              Apply Design Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
