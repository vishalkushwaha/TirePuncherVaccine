// Default Factory Color Presets for Tyre Puncture Vaccine Products
export const DEFAULT_PRODUCT_THEMES = {
  gulf: {
    code: 'gulf',
    name: 'Gulf',
    tagline: 'Everyday Commuter & Tubeless Protection',
    primary: '#6C024A',      // Deep Berry Wine
    secondary: '#E11D48',    // Vivid Fuchsia Rose
    accent: '#BE185D',       // Berry Pink
    bgLight: '#FFF1F8',      // Soft Rose Blush
    bgBadge: '#FCE7F3',      // Rose Pill
    textContrast: '#1E293B', // High contrast charcoal slate
    border: '#FBCFE8',       // Rose Border
    btnPrimary: '#6C024A',   // Button Base
    btnHover: '#831843'      // Button Hover
  },
  rock: {
    code: 'rock',
    name: 'Rock',
    tagline: 'High Endurance & Extreme Thermal Stability',
    primary: '#0F172A',      // Deep Stone Slate
    secondary: '#D97706',    // Rugged Amber Gold
    accent: '#B45309',       // Warm Bronze Gold
    bgLight: '#FFFBEB',      // Warm Desert Amber
    bgBadge: '#FEF3C7',      // Amber Pill
    textContrast: '#1E293B', // High contrast charcoal slate
    border: '#FDE68A',       // Amber Border
    btnPrimary: '#0F172A',   // Button Base
    btnHover: '#D97706'      // Button Hover
  },
  thor: {
    code: 'thor',
    name: 'Thor',
    tagline: 'Heavy Commercial Fleet & High Tonnage Haulage',
    primary: '#0B2744',      // Industrial Cobalt Navy
    secondary: '#0284C7',    // Electric Sky Cyan
    accent: '#EAB308',       // Safety Warning Yellow
    bgLight: '#F0F9FF',      // Cool Sky Ice
    bgBadge: '#E0F2FE',      // Cobalt Pill
    textContrast: '#1E293B', // High contrast charcoal slate
    border: '#BAE6FD',       // Electric Border
    btnPrimary: '#0B2744',   // Button Base
    btnHover: '#0284C7'      // Button Hover
  }
};

// Helper to determine optimal text color (white or dark) based on background hex
export function getContrastTextColor(hexColor) {
  if (!hexColor || !hexColor.startsWith('#')) return '#FFFFFF';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  // Calculate relative luminance (YIQ equation)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#0F172A' : '#FFFFFF';
}

// Validate HEX color string
export function isValidHex(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

