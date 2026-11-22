export type ReportColorTheme =
  | 'crimson'
  | 'gold'
  | 'blue'
  | 'emerald'
  | 'navy'
  | 'onyx'
  | 'purple'
  | 'custom';

export type ReportFontFamily = 'sans' | 'impact' | 'serif' | 'mono';

export type ReportPaperTone = 'white' | 'cream' | 'slate' | 'dark';

export type PageTwoGraphMode = 'both' | 'graph-first' | 'table-first';

export interface ReportDesignConfig {
  themeColor: ReportColorTheme;
  customAccentColor?: string;
  fontFamily: ReportFontFamily;
  paperTone: ReportPaperTone;
  pageTwoGraphMode: PageTwoGraphMode;
  showNormZones: boolean;
  headerStyle: 'federation' | 'modern' | 'minimal';
  showBilateralGauges: boolean;
}

export interface ThemeColorPreset {
  id: ReportColorTheme;
  label: string;
  primary: string;
  secondary: string;
  lightBg: string;
  accentBorder: string;
  badgeGradient: string;
  textAccent: string;
}

export const REPORT_THEME_PRESETS: Record<ReportColorTheme, ThemeColorPreset> = {
  crimson: {
    id: 'crimson',
    label: 'National Athletics Crimson',
    primary: '#dc2626',
    secondary: '#991b1b',
    lightBg: '#fef2f2',
    accentBorder: '#f87171',
    badgeGradient: 'from-red-600 to-rose-600',
    textAccent: 'text-red-600',
  },
  gold: {
    id: 'gold',
    label: 'Olympic Gold & Amber',
    primary: '#d97706',
    secondary: '#92400e',
    lightBg: '#fffbeb',
    accentBorder: '#fbbf24',
    badgeGradient: 'from-amber-500 to-yellow-600',
    textAccent: 'text-amber-600',
  },
  blue: {
    id: 'blue',
    label: 'High Performance Cobalt',
    primary: '#2563eb',
    secondary: '#1e40af',
    lightBg: '#eff6ff',
    accentBorder: '#60a5fa',
    badgeGradient: 'from-blue-600 to-cyan-600',
    textAccent: 'text-blue-600',
  },
  emerald: {
    id: 'emerald',
    label: 'Track & Field Emerald',
    primary: '#059669',
    secondary: '#065f46',
    lightBg: '#ecfdf5',
    accentBorder: '#34d399',
    badgeGradient: 'from-emerald-600 to-teal-600',
    textAccent: 'text-emerald-600',
  },
  navy: {
    id: 'navy',
    label: 'Midnight Navy & Indigo',
    primary: '#4338ca',
    secondary: '#312e81',
    lightBg: '#eef2ff',
    accentBorder: '#818cf8',
    badgeGradient: 'from-indigo-600 to-blue-700',
    textAccent: 'text-indigo-600',
  },
  onyx: {
    id: 'onyx',
    label: 'Stealth Onyx & Slate',
    primary: '#0f172a',
    secondary: '#334155',
    lightBg: '#f8fafc',
    accentBorder: '#64748b',
    badgeGradient: 'from-slate-900 to-slate-800',
    textAccent: 'text-slate-900',
  },
  purple: {
    id: 'purple',
    label: 'Championship Purple',
    primary: '#7c3aed',
    secondary: '#5b21b6',
    lightBg: '#f5f3ff',
    accentBorder: '#a78bfa',
    badgeGradient: 'from-violet-600 to-purple-600',
    textAccent: 'text-violet-600',
  },
  custom: {
    id: 'custom',
    label: 'Custom Coach Hex Color',
    primary: '#dc2626',
    secondary: '#991b1b',
    lightBg: '#fef2f2',
    accentBorder: '#f87171',
    badgeGradient: 'from-red-600 to-rose-600',
    textAccent: 'text-red-600',
  },
};

export const REPORT_FONT_PRESETS: Record<
  ReportFontFamily,
  { label: string; description: string; className: string }
> = {
  sans: {
    label: 'Modern Sans (Inter / Clean)',
    description: 'Crisp, contemporary high-readability scientific athletics standard',
    className: 'font-sans',
  },
  impact: {
    label: 'Athletic Championship (Bold)',
    description: 'Punchy, bold Olympic track & field editorial layout',
    className: 'font-sans font-extrabold tracking-tight',
  },
  serif: {
    label: 'Editorial Serif (Prestigious)',
    description: 'Traditional federation certificate & official national records styling',
    className: 'font-serif',
  },
  mono: {
    label: 'Technical Lab Mono (Precision)',
    description: 'Biomechanics & high-frequency timing laboratory format',
    className: 'font-mono',
  },
};

export const REPORT_PAPER_TONES: Record<
  ReportPaperTone,
  {
    label: string;
    bgHex: string;
    textHex: string;
    cardBgHex: string;
    subtleBgHex: string;
    borderHex: string;
  }
> = {
  white: {
    label: 'Crisp Editorial White',
    bgHex: '#ffffff',
    textHex: '#0f172a',
    cardBgHex: '#ffffff',
    subtleBgHex: '#f8fafc',
    borderHex: '#e2e8f0',
  },
  cream: {
    label: 'Warm Editorial Ivory',
    bgHex: '#faf7f2',
    textHex: '#1c1917',
    cardBgHex: '#ffffff',
    subtleBgHex: '#f5efe6',
    borderHex: '#e7dfd5',
  },
  slate: {
    label: 'Technical Cool Slate',
    bgHex: '#f8fafc',
    textHex: '#0f172a',
    cardBgHex: '#ffffff',
    subtleBgHex: '#f1f5f9',
    borderHex: '#cbd5e1',
  },
  dark: {
    label: 'Executive Dark Mode Paper',
    bgHex: '#0e0e13',
    textHex: '#f8fafc',
    cardBgHex: '#15151c',
    subtleBgHex: '#1b1b24',
    borderHex: '#2a2a36',
  },
};

export const DEFAULT_REPORT_DESIGN: ReportDesignConfig = {
  themeColor: 'crimson',
  fontFamily: 'sans',
  paperTone: 'white',
  pageTwoGraphMode: 'both',
  showNormZones: true,
  headerStyle: 'federation',
  showBilateralGauges: true,
};

export function getResolvedThemeColor(config: ReportDesignConfig): ThemeColorPreset {
  if (config.themeColor === 'custom' && config.customAccentColor) {
    const customHex = config.customAccentColor;
    return {
      id: 'custom',
      label: 'Custom Hex Color',
      primary: customHex,
      secondary: customHex,
      lightBg: `${customHex}15`,
      accentBorder: `${customHex}60`,
      badgeGradient: '',
      textAccent: '',
    };
  }
  return REPORT_THEME_PRESETS[config.themeColor] || REPORT_THEME_PRESETS.crimson;
}
