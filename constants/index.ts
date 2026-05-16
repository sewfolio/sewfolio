// ─── API ──────────────────────────────────────────────────────────────────────
export const API_URL = 'http://192.168.50.198:3000/api/v1';

// ─── Color Palette ────────────────────────────────────────────────────────────
export const Colors = {
  cream: '#FAF7F2',
  ivory: '#F5EFE9',
  oatmeal: '#E9DED6',
  white: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceWarm: '#F5EFE9',
  charcoal: '#1F2A24',
  text: '#1F2A24',
  textSecondary: '#5C5C52',
  textMuted: '#A99B8E',
  textInverse: '#FFFFFF',
  sage: '#6B6F62',
  olive: '#4A4F45',
  linen: '#A99B8E',
  clay: '#C9827A',
  clayLight: '#E8C4BF',
  success: '#5A7A5E',
  warning: '#B8924A',
  error: '#B85C5C',
  border: '#E2D8CE',
  borderLight: '#EDE6DE',
  borderDark: '#C8BBB0',
  statusSaved: '#A99B8E',
  statusPlanned: '#6B6F62',
  statusInProgress: '#4A4F45',
  statusFinished: '#5A7A5E',
  statusArchived: '#C8BBB0',
  // Aliases used in existing code
  background: '#FAF7F2',
  backgroundDark: '#F5EFE9',
  primary: '#4A4F45',
  primaryLight: '#6B6F62',
  primaryDark: '#1F2A24',
  secondary: '#6B6F62',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const Typography = {
  serifXL:   { fontSize: 38, fontWeight: '300' as const, letterSpacing: -0.5, lineHeight: 46 },
  serifLg:   { fontSize: 28, fontWeight: '300' as const, letterSpacing: -0.3, lineHeight: 36 },
  serifMd:   { fontSize: 22, fontWeight: '400' as const, letterSpacing: -0.2, lineHeight: 30 },
  displayLg: { fontSize: 32, fontWeight: '600' as const, letterSpacing: -0.8, lineHeight: 40 },
  displayMedium: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.5, lineHeight: 32 },
  h1:        { fontSize: 20, fontWeight: '600' as const, letterSpacing: -0.3, lineHeight: 28 },
  h2:        { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2, lineHeight: 24 },
  h3:        { fontSize: 15, fontWeight: '600' as const, letterSpacing: -0.1, lineHeight: 22 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
  body:      { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
  caption:   { fontSize: 11, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 0.6 },
  label:     { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.2, lineHeight: 16 },
  labelSmall:{ fontSize: 10, fontWeight: '600' as const, letterSpacing: 1.0, lineHeight: 14 },
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const Shadows = {
  none: {},
  xs:  { shadowColor: '#1F2A24', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2,  elevation: 1 },
  sm:  { shadowColor: '#1F2A24', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8,  elevation: 2 },
  md:  { shadowColor: '#1F2A24', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  lg:  { shadowColor: '#1F2A24', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 24, elevation: 8 },
} as const;

// ─── Project Statuses ─────────────────────────────────────────────────────────
export const PROJECT_STATUSES = [
  { value: 'SAVED',       label: 'Saved',       color: '#A99B8E', emoji: '·' },
  { value: 'PLANNED',     label: 'Planned',     color: '#6B6F62', emoji: '·' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#4A4F45', emoji: '·' },
  { value: 'FINISHED',    label: 'Finished',    color: '#5A7A5E', emoji: '·' },
  { value: 'ARCHIVED',    label: 'Archived',    color: '#C8BBB0', emoji: '·' },
];

// ─── Source Types ─────────────────────────────────────────────────────────────
export const SOURCE_TYPES = [
  { value: 'YOUTUBE',   label: 'YouTube',   emoji: '▶' },
  { value: 'TIKTOK',    label: 'TikTok',    emoji: '♪' },
  { value: 'INSTAGRAM', label: 'Instagram', emoji: '◎' },
  { value: 'PINTEREST', label: 'Pinterest', emoji: '⊕' },
  { value: 'PDF',       label: 'PDF',       emoji: '⬜' },
  { value: 'IMAGE',     label: 'Image',     emoji: '◫' },
  { value: 'MANUAL',    label: 'Manual',    emoji: '✎' },
  { value: 'OTHER',     label: 'Other',     emoji: '⊙' },
];

// ─── Material Types ───────────────────────────────────────────────────────────
export const MATERIAL_TYPES = [
  { value: 'FABRIC',      label: 'Fabric',      emoji: '▣' },
  { value: 'THREAD',      label: 'Thread',      emoji: '〰' },
  { value: 'ZIPPER',      label: 'Zipper',      emoji: '⋮' },
  { value: 'BUTTON',      label: 'Button',      emoji: '○' },
  { value: 'ELASTIC',     label: 'Elastic',     emoji: '—' },
  { value: 'INTERFACING', label: 'Interfacing', emoji: '□' },
  { value: 'TRIM',        label: 'Trim',        emoji: '✂' },
  { value: 'HARDWARE',    label: 'Hardware',    emoji: '⬡' },
  { value: 'OTHER',       label: 'Other',       emoji: '◇' },
];
