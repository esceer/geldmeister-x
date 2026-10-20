// Midnight Glass design tokens — source of truth: docs/design/README.md

export const colors = {
  bg: '#0B0D17',
  blobs: { violet: '#5B4BFF', teal: '#0FB5A0', pink: '#E0458B' },
  text: '#F4F5FA',
  textMuted: 'rgba(235,237,250,0.64)',
  textActive: '#FFFFFF',
  accent: '#8E9BFF',
  onAccent: '#0B0D17',
  link: '#AEB8FF',
  danger: '#FF7A7A',
  dangerText: '#FFA3A3',
  positive: '#6EEAD8',
  positiveBg: 'rgba(61,220,197,0.16)',
  card: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.12)',
  // Design: rgba(28,30,48,0.62) + blur 40. Android can't blur across screens, so opaque.
  sheet: '#161826',
  sheetBorder: 'rgba(255,255,255,0.16)',
  scrim: 'rgba(5,6,12,0.45)',
  nav: 'rgba(22,24,40,0.55)',
  navBorder: 'rgba(255,255,255,0.14)',
  chip: 'rgba(255,255,255,0.08)',
} as const;

export const radius = { chip: 16, control: 14, card: 24, sheet: 32, nav: 34 } as const;

export const spacing = { screen: 20, section: 16, gap: 8 } as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;
