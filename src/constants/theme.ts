/**
 * Dark Islamic Theme — "Midnight Oasis"
 * Deep gradient navy, luminous gold & emerald accents, glass-morphism cards
 */
export const COLORS = {
  // Backgrounds
  bg: '#080F1A',          // Deep midnight — main background
  bgCard: 'rgba(25,40,62,0.65)', // Glass-morphism card
  bgCardSolid: '#19283E', // Solid variant for modals
  bgElevated: '#1E3148',  // Elevated cards / active states
  bgInput: '#0F1D2E',     // Input fields

  // Gradient stops (for LinearGradient)
  gradientStart: '#0A1628',
  gradientMid: '#0D1F35',
  gradientEnd: '#071018',

  // Accents
  gold: '#E8B976',        // Primary gold accent (brighter)
  goldLight: '#F5D5A0',   // Light gold for text highlights
  goldDim: '#9A7B52',     // Muted gold for secondary elements
  goldGlow: 'rgba(232,185,118,0.15)', // Glow effect
  emerald: '#34D399',     // Emerald green accent (brighter)
  emeraldDark: '#16A085', // Darker emerald for buttons
  emeraldGlow: 'rgba(52,211,153,0.12)', // Glow effect

  // Text
  textPrimary: '#F5EDE0', // Warm cream white
  textSecondary: '#8B9DB7',// Muted blue-gray
  textMuted: '#4A5D75',   // Dimmed text
  textGold: '#E8B976',    // Gold text
  textOnAccent: '#080F1A',// Dark text on gold buttons

  // Status
  statusAhead: '#34D399',    // Ahead of schedule — emerald
  statusOnTime: '#E8B976',   // On time — gold
  statusBehind: '#FB7185',   // Behind — soft rose

  // Borders & separators
  border: 'rgba(255,255,255,0.06)',
  borderLight: 'rgba(255,255,255,0.03)',
  borderGold: 'rgba(232,185,118,0.2)',

  // Misc
  overlay: 'rgba(0,0,0,0.65)',
  white: '#FFFFFF',
  black: '#000000',

  // Prayer card gradient effect
  prayerHighlight: '#1A3A2E',

  // Quran reader (keep warm paper feel)
  readerBg: '#FDF5E6',
  readerText: '#1a1a1a',
  readerAccent: '#1b5e20',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  tiny: 10,
  caption: 12,
  body: 14,
  bodyLarge: 16,
  subtitle: 18,
  title: 22,
  heading: 28,
  display: 36,
  hero: 52,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

/** Shared shadow for elevated cards — deeper for glass effect */
export const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 16,
  elevation: 8,
} as const;

/** Subtle shadow for lighter elements */
export const LIGHT_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
} as const;

/** Glass card style mixin */
export const GLASS_CARD = {
  backgroundColor: 'rgba(25,40,62,0.55)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.08)',
  ...CARD_SHADOW,
} as const;
