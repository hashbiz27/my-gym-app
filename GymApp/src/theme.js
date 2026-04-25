// Shared design tokens — mirrors the web app colour system.
// Use these constants for any inline `color=`, `style={}`, or prop value
// that cannot be expressed as a NativeWind className.

// ─── Colour palette ───────────────────────────────────────────────────────────

export const Colors = {
  // Brand — indigo (primary interactive elements)
  primary:      "#4f46e5",
  primaryDark:  "#3730a3",
  primaryLight: "#e0e7ff",
  primaryMid:   "#818cf8",  // Switch track when active

  // Backgrounds
  bgApp:     "#f8f7f4",   // warm off-white — mirrors web app bg
  bgCard:    "#ffffff",
  bgCardAlt: "#f9fafb",
  bgDark:    "#111827",   // workout header (gray-900)

  // Borders
  border:      "#e5e5e5",
  borderLight: "#f3f4f6",
  borderInput: "#e0e0e0",

  // Text
  text:          "#1a1a1a",
  textSecondary: "#555555",
  textMuted:     "#9ca3af",
  textLight:     "#d1d5db",
  textInverse:   "#f8f7f4",

  // Success / workout green
  success:      "#16a34a",
  successDark:  "#15803d",
  successLight: "#e8f5e9",
  successMuted: "#f1f8f1",

  // Danger / red
  danger:       "#dc2626",
  dangerLight:  "#fee2e2",
  dangerBorder: "#fecaca",

  // Warning / amber
  warning:      "#f59e0b",
  warningLight: "#fff8e1",

  // Info / sync indicator
  info: "#60a5fa",

  // Named greys for Ionicons and inline styles
  gray50:  "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",

  white: "#ffffff",
  black: "#000000",
};

// ─── Per-regime accent colours (taken from gymData.js) ────────────────────────

export const RegimeColors = {
  hypertrophy: { primary: "#1b5e20", light: "#e8f5e9" },
  strength:    { primary: "#7f1d1d", light: "#fee2e2" },
  power:       { primary: "#1e3a5f", light: "#dbeafe" },
  endurance:   { primary: "#065f46", light: "#d1fae5" },
  stability:   { primary: "#4c1d95", light: "#ede9fe" },
  flexibility: { primary: "#7c3aed", light: "#f5f3ff" },
  custom:      { primary: "#0f766e", light: "#ccfbf1" },
};

// ─── Typography ───────────────────────────────────────────────────────────────

export const FontSize = {
  xs:   11,
  sm:   13,
  base: 15,
  lg:   17,
  xl:   20,
  xxl:  24,
  xxxl: 30,
};

export const FontWeight = {
  regular:  "400",
  medium:   "500",
  semibold: "600",
  bold:     "700",
};

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  xs:     4,
  sm:     8,
  md:     12,
  lg:     16,
  xl:     20,
  xxl:    24,
  xxxl:   32,
  screen: 20,
  card:   16,
};

// ─── Border radii ─────────────────────────────────────────────────────────────

export const Radii = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   18,
  full: 9999,
};

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const Shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
};
