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
import { SportZone } from '@/types/zone';
import { db } from '@/lib/storage/local-storage-db';
import { generateRandomDemoReport } from '@/lib/data/demo-report-presets';
import { ReportPageOne } from './report-page-one';
import { ReportPageTwo } from './report-page-two';
import {
  Palette,
  Type,
  FileSpreadsheet,
  Check,
  RotateCcw,
  X,
  LayoutTemplate,
  Building2,
  User,
  Scale,
  Award,
  Shuffle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface ReportDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReportDesignConfig;
  onChange: (config: ReportDesignConfig) => void;
  sampleAssessment?: Assessment;
  sampleAthlete?: AthleteProfile;
  preferRandomDemo?: boolean;
  activeZone?: SportZone;
}

export function ReportDesignModal(props: ReportDesignModalProps) {
  if (!props.isOpen) return null;
  return <ReportDesignModalContent {...props} />;
}

function ReportDesignModalContent({
  onClose,
  config,
  onChange,
  sampleAssessment,
  sampleAthlete,
  preferRandomDemo = true,
  activeZone,
}: ReportDesignModalProps) {
  const [localConfig, setLocalConfig] = useState<ReportDesignConfig>(config);
  const [previewTab, setPreviewTab] = useState<'page2' | 'page1' | 'both'>('both');
  const [mobileSection, setMobileSection] = useState<'controls' | 'preview'>('preview');

  const hasPopulatedRealSample = Boolean(
    sampleAssessment && (sampleAssessment.testResults?.length ?? 0) > 0
  );
  const [useRandomDemo, setUseRandomDemo] = useState<boolean>(
    !hasPopulatedRealSample || preferRandomDemo
  );
  const [demoSeed, setDemoSeed] = useState<number>(101);

  const activeCoach = db.getCurrentUser().fullName;
  const randomDemoBundle = generateRandomDemoReport(demoSeed, {
    coachName: activeCoach || undefined,
    preferredZone: activeZone,
  });

  const demoAssessment =
    !useRandomDemo && hasPopulatedRealSample && sampleAssessment
      ? sampleAssessment
      : randomDemoBundle.assessment;

  const demoAthlete =
    !useRandomDemo && hasPopulatedRealSample
      ? sampleAthlete ||
        db.getAthletes().find((a) => a.id === demoAssessment.athleteId) ||
        randomDemoBundle.athlete
      : randomDemoBundle.athlete;

  const demoPreviousAssessment =
    !useRandomDemo && hasPopulatedRealSample
      ? undefined
      : randomDemoBundle.previousAssessment;

  const handleShuffleDemo = () => {
    setUseRandomDemo(true);
    setDemoSeed((prev) => ((prev * 1103515245 + 12345 + Math.floor(Math.random() * 500)) % 99999) + 1);
  };

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

  const centerPresets = [
    'National Athletics High Performance Centre',
    'Olympic Training Academy',
    'Team SCCS Athletics Center',
    'Apex Speed & Power Lab',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-print"
    >
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-7xl w-full overflow-hidden my-auto flex flex-col h-[94vh]">
        {/* Header Bar */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white flex items-center justify-center font-black shadow-md shrink-0"
              style={{ backgroundColor: resolvedTheme.primary }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  Report Paper Design Customizer
                </h3>
                <span
                  className="text-[10px] uppercase font-black px-2 py-0.5 rounded text-white shadow-xs shrink-0"
                  style={{ backgroundColor: resolvedTheme.primary }}
                >
                  {useRandomDemo ? 'Live Random Demo' : 'Live Athlete Preview'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Customize colors, typography, branding &amp; layouts — see real-time Demo Report results immediately
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShuffleDemo}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-600/15 hover:bg-rose-600/30 text-xs text-rose-300 hover:text-white font-bold transition items-center gap-1.5 cursor-pointer"
              title="Generate another random demo athlete report to preview how your design looks"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Demo Report</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="hidden md:flex px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium transition items-center gap-1.5"
              title="Reset to default design"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile/Tablet View Switcher (< md screens) */}
        <div className="flex md:hidden items-center justify-between gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-1">
            <button
              type="button"
              onClick={() => setMobileSection('controls')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                mobileSection === 'controls'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileSection('preview')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                mobileSection === 'preview'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Demo Report</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleShuffleDemo}
            className="px-2.5 py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1 shrink-0"
            title="Shuffle Random Demo Report"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random</span>
          </button>
        </div>

        {/* Modal Main Body: Controls on Left, Live Preview on Right */}
        <div className="flex flex-1 flex-col md:flex-row min-h-0 overflow-hidden">
          {/* ------------------------------------------------------------ */}
          {/* LEFT COLUMN: 8 ORDERED DESIGN SETTINGS CONTROLS (Scrollable)  */}
          {/* ------------------------------------------------------------ */}
          <div
            className={`${
              mobileSection === 'controls' ? 'block' : 'hidden md:block'
            } w-full md:w-5/12 xl:w-4/12 overflow-y-auto p-4 sm:p-5 space-y-6 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900 shrink-0`}
          >
            {/* ========================================================== */}
            {/* 1ST: COLOUR CHOICE                                         */}
            {/* ========================================================== */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-rose-500" /> 1. Colour Choice
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
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
                    <div className="text-[9px] text-slate-400">Any team or federation color</div>
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

            {/* ========================================================== */}
            {/* 2ND: FONT (TYPOGRAPHY & FONT STYLES)                       */}
            {/* ========================================================== */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
                <Type className="w-4 h-4 text-rose-500" /> 2. Font & Typography
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

            {/* ========================================================== */}
            {/* 3RD: PERFORMANCE CENTER NAME (TOP OF BOTH PAGES)           */}
            {/* ========================================================== */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-rose-500" /> 3. Performance Center Name
                </span>
                <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">Sporty Font</span>
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Displays prominently on the top banner of Page 1 and Page 2 in unique sporty font.
              </p>

              <input
                type="text"
                value={localConfig.performanceCenterName || ''}
                onChange={(e) => handleUpdate({ performanceCenterName: e.target.value })}
                placeholder="National Athletics High Performance Centre"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />

              {/* Quick Pick Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {centerPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleUpdate({ performanceCenterName: preset })}
                    className="text-[10px] px-2 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition truncate max-w-full"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================================== */}
            {/* 4TH: ATHLETE BIO DATA SECTION SPECIFIC (NAME & DETAILS BOX) */}
            {/* ========================================================== */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-rose-500" /> 4. Athlete Bio Data Box Style
                </span>
                <span className="text-[10px] text-rose-400 font-bold uppercase">Page 1 Bio</span>
              </label>

              <div className="space-y-2">
                {/* 1. Athletic Squad Badge */}
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate({ athleteBioBoxStyle: 'athletic-badge' });
                    if (previewTab !== 'both') setPreviewTab('page1');
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition ${
                    localConfig.athleteBioBoxStyle === 'athletic-badge'
                      ? 'border-white bg-slate-800 ring-2 ring-red-500/50 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                      🏅 Athletic Squad Badge (Sporty Avatar)
                    </span>
                    {localConfig.athleteBioBoxStyle === 'athletic-badge' && (
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    High-impact initials avatar badge, prominent name, event pill & micro-stats.
                  </p>
                </button>

                {/* 2. Modern Card Grid */}
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate({ athleteBioBoxStyle: 'card-grid' });
                    if (previewTab !== 'both') setPreviewTab('page1');
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition ${
                    localConfig.athleteBioBoxStyle === 'card-grid'
                      ? 'border-white bg-slate-800 ring-2 ring-red-500/50 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                      📊 Modern Card Grid (4 Columns)
                    </span>
                    {localConfig.athleteBioBoxStyle === 'card-grid' && (
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Clean, balanced 4-column demographic metadata grid with subtle card containers.
                  </p>
                </button>

                {/* 3. Official Federation Dossier */}
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate({ athleteBioBoxStyle: 'federation-dossier' });
                    if (previewTab !== 'both') setPreviewTab('page1');
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition ${
                    localConfig.athleteBioBoxStyle === 'federation-dossier'
                      ? 'border-white bg-slate-800 ring-2 ring-red-500/50 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                      📜 Official Federation Dossier (Passport)
                    </span>
                    {localConfig.athleteBioBoxStyle === 'federation-dossier' && (
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    National federation passport styling with thick left accent bar and registration stamp.
                  </p>
                </button>
              </div>
            </div>

            {/* ========================================================== */}
            {/* 5TH: PAGE 2 REPORT LAYOUT                                  */}
            {/* ========================================================== */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-1.5">
                  <LayoutTemplate className="w-4 h-4 text-red-500" /> 5. Page 2 Report Layout
                </span>
                <span className="text-[10px] text-red-400 font-bold uppercase">Select Format</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate({ pageTwoLayoutType: 'scorecard' });
                    if (previewTab !== 'both') setPreviewTab('page2');
                  }}
                  className={`p-3 rounded-xl border text-left transition relative ${
                    localConfig.pageTwoLayoutType === 'scorecard'
                      ? 'border-white bg-slate-800 ring-2 ring-red-500/60 shadow-lg'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                      📊 Visual Performance Scorecard (Demo Layout)
                    </span>
                    {localConfig.pageTwoLayoutType === 'scorecard' && (
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Demo format with 0–100 horizontal gauges, Category blocks, 3-dot ratings, Excellent At targets & dual L/R balance meters.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleUpdate({ pageTwoLayoutType: 'scientific' });
                    if (previewTab !== 'both') setPreviewTab('page2');
                  }}
                  className={`p-3 rounded-xl border text-left transition relative ${
                    localConfig.pageTwoLayoutType === 'scientific'
                      ? 'border-white bg-slate-800 ring-2 ring-red-500/60 shadow-lg'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                      📋 Detailed Scientific & Tabular Matrix (Classic Layout)
                    </span>
                    {localConfig.pageTwoLayoutType === 'scientific' && (
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Earlier comprehensive metrics matrix with longitudinal baseline deltas, Eurofit normative sources, bilateral equilibrium sliders & coach sign-off.
                  </p>
                </button>
              </div>
            </div>

            {/* ========================================================== */}
            {/* 6TH: PAPER BACKGROUND TONE                                 */}
            {/* ========================================================== */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
                <FileSpreadsheet className="w-4 h-4 text-rose-500" /> 6. Paper Background Tone
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

            {/* ========================================================== */}
            {/* 7TH & 8TH: WORKABLE TOGGLES                                */}
            {/* ========================================================== */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              {/* 7. SHOW OLYMPIC NORM REFERENCE ZONES */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <input
                  type="checkbox"
                  checked={localConfig.showNormZones}
                  onChange={(e) => handleUpdate({ showNormZones: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-slate-700 bg-slate-900 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-rose-400" />
                    <span>7. Olympic Norm Reference Zones</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {localConfig.showNormZones
                      ? 'Enabled: Displaying norm tier reference bands (<50%, 50-74%, 75-89%, 90%+) and 40/70 benchmark threshold ticks across reports.'
                      : 'Disabled: Clean report presentation with norm reference tiers and threshold markers hidden.'}
                  </div>
                </div>
              </label>

              {/* 8. SHOW BILATERAL BALANCE EQUILIBRIUM GAUGES */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-800/50 transition">
                <input
                  type="checkbox"
                  checked={localConfig.showBilateralGauges}
                  onChange={(e) => handleUpdate({ showBilateralGauges: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-slate-700 bg-slate-900 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-rose-400" />
                    <span>8. Bilateral Balance Equilibrium Gauges</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {localConfig.showBilateralGauges
                      ? 'Enabled: Showing Left vs. Right dual diverging balance meters on Page 2 and symmetry status on Page 1.'
                      : 'Disabled: Bilateral meter hidden; Coach Observations automatically expanded to full width.'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* RIGHT COLUMN: SIDE-BY-SIDE LIVE PREVIEW                      */}
          {/* ------------------------------------------------------------ */}
          <div
            className={`${
              mobileSection === 'preview' ? 'flex' : 'hidden md:flex'
            } flex-1 bg-slate-950 flex-col min-h-0 overflow-hidden`}
          >
            {/* Preview Toolbar */}
            <div className="p-2.5 sm:p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewTab('both')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    previewTab === 'both'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Both Pages
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('page1')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    previewTab === 'page1'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page 1
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('page2')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    previewTab === 'page2'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page 2 ({localConfig.pageTwoLayoutType === 'scientific' ? 'Scientific' : 'Scorecard'})
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {hasPopulatedRealSample && (
                  <button
                    type="button"
                    onClick={() => setUseRandomDemo((prev) => !prev)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                      !useRandomDemo
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {useRandomDemo ? 'Switch to My Athlete' : 'Using Real Athlete'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShuffleDemo}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[11px] font-black shadow-sm transition cursor-pointer active:scale-95"
                  title="Generate a fresh random athlete & assessment demo report to inspect styling"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>New Random Demo</span>
                </button>
              </div>
            </div>

            {/* Active Demo Banner */}
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                  {useRandomDemo ? 'Random Demo Preview' : 'Athlete Sample'}
                </span>
                <span className="font-bold text-white truncate">{demoAthlete.fullName}</span>
                <span className="text-slate-400 truncate">
                  • {demoAthlete.sportName || demoAthlete.primaryEventName} • Score:{' '}
                  <strong className="text-rose-400 font-mono">
                    {demoAssessment.overallFitnessScore?.toFixed(1) ?? '—'}
                  </strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono hidden lg:flex items-center gap-2">
                <span>Theme: <strong className="text-white uppercase">{localConfig.themeColor}</strong></span>
                <span>•</span>
                <span>Paper: <strong className="text-white capitalize">{localConfig.paperTone}</strong></span>
              </div>
            </div>

            {/* Scrollable Live Document Preview */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950/80">
              <div className="max-w-5xl mx-auto space-y-8">
                {(previewTab === 'page1' || previewTab === 'both') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-2">
                      <span className="uppercase tracking-wider">Page 1 • Physical Profile &amp; Radar</span>
                      <span className="font-mono text-[10px] text-red-400">Live Render</span>
                    </div>
                    <div className="transform origin-top transition-all">
                      <ReportPageOne
                        assessment={demoAssessment}
                        previousAssessment={demoPreviousAssessment}
                        athlete={demoAthlete}
                        designConfig={localConfig}
                      />
                    </div>
                  </div>
                )}

                {(previewTab === 'page2' || previewTab === 'both') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-2">
                      <span className="uppercase tracking-wider">
                        Page 2 • Detailed Test Measurements ({localConfig.pageTwoLayoutType === 'scientific' ? 'Scientific Matrix' : 'Visual Scorecard'})
                      </span>
                      <span className="font-mono text-[10px] text-red-400">Live Render</span>
                    </div>
                    <div className="transform origin-top transition-all">
                      <ReportPageTwo assessment={demoAssessment} designConfig={localConfig} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex flex-wrap bg-slate-950 px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-800 items-center justify-between gap-2 shrink-0">
          <div className="hidden md:block text-xs text-slate-400">
            Design preferences are automatically saved and applied to all A4 export dossier generation.
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="md:hidden px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-bold transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 sm:px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-200 font-bold transition"
              >
                Done / Close
              </button>
              <button
                type="button"
                onClick={() => {
                  db.saveReportDesignConfig(localConfig);
                  onChange(localConfig);
                  onClose();
                }}
                className="px-4 sm:px-5 py-2 rounded-xl text-xs font-black text-white shadow-lg shadow-red-950/50 transition"
                style={{ backgroundColor: resolvedTheme.primary }}
              >
                Apply &amp; Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
