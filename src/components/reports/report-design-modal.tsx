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
  PageTwoLayoutType,
  AthleteBioBoxStyle,
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
  Check,
  RotateCcw,
  X,
  Layers,
  LayoutTemplate,
  Building2,
  User,
  Scale,
  Award,
  Zap,
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
      createdAt: '2026-11-22T00:00:00.000Z',
      updatedAt: '2026-11-22T00:00:00.000Z',
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
      createdAt: '2026-11-22T00:00:00.000Z',
      updatedAt: '2026-11-22T00:00:00.000Z',
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
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-black shadow-md"
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
                Configure colors, typography, performance center branding, bio data layout & page styles with real-time preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="hidden md:flex px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium transition items-center gap-1.5"
              title="Reset to default design"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Guard: Message to open in desktop */}
        <div className="block md:hidden p-6 sm:p-8 text-center space-y-4 my-auto">
          <div
            className="w-16 h-16 rounded-2xl text-white flex items-center justify-center font-black mx-auto shadow-lg"
            style={{ backgroundColor: resolvedTheme.primary }}
          >
            <Palette className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span
              className="text-[10px] uppercase font-black px-2 py-0.5 rounded text-white shadow-xs inline-block"
              style={{ backgroundColor: resolvedTheme.primary }}
            >
              Desktop Only Feature
            </span>
            <h3 className="text-lg font-black text-white">
              Open in Desktop to Customise the Report Page Design
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              The A4 PDF Report Design Customizer includes dual-page live print preview, custom brand color palettes, typography pairing, and Page 2 metric graphing controls designed specifically for larger desktop and laptop displays.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shadow-md"
            >
              Got It, Close
            </button>
          </div>
        </div>

        {/* Modal Main Body: Controls on Left, Live Preview on Right */}
        <div className="hidden md:flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* ------------------------------------------------------------ */}
          {/* LEFT COLUMN: 8 ORDERED DESIGN SETTINGS CONTROLS (Scrollable)  */}
          {/* ------------------------------------------------------------ */}
          <div className="w-full lg:w-5/12 xl:w-4/12 overflow-y-auto p-5 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900 shrink-0">
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
                    setPreviewTab('page1');
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
                    setPreviewTab('page1');
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
                    setPreviewTab('page1');
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
                    setPreviewTab('page2');
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
                    setPreviewTab('page2');
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
          <div className="flex-1 bg-slate-950 flex flex-col min-h-0 overflow-hidden">
            {/* Preview Toolbar */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPreviewTab('page1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    previewTab === 'page1'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page 1 Preview
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('page2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    previewTab === 'page2'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page 2 Preview ({localConfig.pageTwoLayoutType === 'scientific' ? 'Scientific' : 'Scorecard'})
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('both')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    previewTab === 'both'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Side-by-Side (Both Pages)
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-2">
                <span>Theme: <strong className="text-white uppercase">{localConfig.themeColor}</strong></span>
                <span>•</span>
                <span>Paper: <strong className="text-white capitalize">{localConfig.paperTone}</strong></span>
              </div>
            </div>

            {/* Scrollable Live Document Preview */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/80">
              <div className="max-w-5xl mx-auto space-y-8">
                {(previewTab === 'page1' || previewTab === 'both') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-2">
                      <span className="uppercase tracking-wider">Page 1 • Physical Profile & Radar</span>
                      <span className="font-mono text-[10px] text-red-400">Live Render</span>
                    </div>
                    <div className="transform origin-top scale-[0.88] sm:scale-100 transition-all">
                      <ReportPageOne
                        assessment={demoAssessment}
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
                    <div className="transform origin-top scale-[0.88] sm:scale-100 transition-all">
                      <ReportPageTwo assessment={demoAssessment} designConfig={localConfig} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar (Desktop only) */}
        <div className="hidden md:flex bg-slate-950 px-6 py-3.5 border-t border-slate-800 items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Design preferences are automatically saved and applied to all A4 export dossier generation.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-200 font-bold transition"
            >
              Done / Close
            </button>
            <button
              onClick={() => {
                db.saveReportDesignConfig(localConfig);
                onChange(localConfig);
                onClose();
              }}
              className="px-5 py-2 rounded-xl text-xs font-black text-white shadow-lg shadow-red-950/50 transition"
              style={{ backgroundColor: resolvedTheme.primary }}
            >
              Apply & Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
