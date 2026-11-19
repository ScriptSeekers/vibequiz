/**
 * Vibe Quiz Design Tokens
 * Master specification for colors, typography, spacing, radii, shadows, and breakpoints.
 */

export const DESIGN_TOKENS = {
  colors: {
    primary: {
      DEFAULT: "#7655E8",
      hover: "#6342D6",
      light: "#F3F0FE",
      subtle: "#EADEFD",
      dark: "#4B32A6",
    },
    blue: {
      DEFAULT: "#477CF4",
      hover: "#336BE5",
      light: "#EEF3FE",
      subtle: "#D9E5FD",
      dark: "#2A55B8",
    },
    pink: {
      DEFAULT: "#F06C9B",
      hover: "#DF5284",
      light: "#FDF0F5",
      subtle: "#F9DAE6",
      dark: "#B83B67",
    },
    orange: {
      DEFAULT: "#FFAA55",
      hover: "#F3983B",
      light: "#FFF6EE",
      subtle: "#FEE7D0",
      dark: "#D47716",
    },
    green: {
      DEFAULT: "#25B98A",
      hover: "#1DA378",
      light: "#EDFAF4",
      subtle: "#C6F2DF",
      dark: "#147455",
    },
    neutral: {
      50: "#FAFAFD",
      100: "#F3F4F8",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
      950: "#090D16",
    },
    surface: {
      ground: "#F8F9FD",
      card: "#FFFFFF",
      cardHover: "#FAFBFD",
      border: "#E9ECF2",
      borderLight: "#F1F3F8",
      borderFocus: "#7655E8",
    },
  },
  typography: {
    fontSans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontHeading: "Plus Jakarta Sans, Inter, -apple-system, sans-serif",
    sizes: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",   // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
      "5xl": "3rem",     // 48px
      "6xl": "3.75rem",  // 60px
    },
  },
  radii: {
    sm: "0.375rem",   // 6px
    md: "0.5rem",     // 8px
    lg: "0.75rem",    // 12px
    xl: "1rem",       // 16px
    "2xl": "1.25rem",  // 20px
    "3xl": "1.5rem",   // 24px
    full: "9999px",
  },
  shadows: {
    subtle: "0 1px 3px 0 rgba(16, 24, 40, 0.05), 0 1px 2px -1px rgba(16, 24, 40, 0.05)",
    card: "0 4px 12px -2px rgba(16, 24, 40, 0.06), 0 2px 6px -2px rgba(16, 24, 40, 0.03)",
    elevated: "0 12px 24px -4px rgba(16, 24, 40, 0.08), 0 4px 8px -2px rgba(16, 24, 40, 0.04)",
    floating: "0 20px 32px -8px rgba(118, 85, 232, 0.15), 0 8px 16px -4px rgba(16, 24, 40, 0.05)",
    glowPurple: "0 0 20px -2px rgba(118, 85, 232, 0.35)",
  },
  breakpoints: {
    mobileSmall: 320,
    mobileStandard: 375,
    mobileLarge: 430,
    tablet: 601,
    laptop: 1025,
    desktop: 1441,
  },
  touchTargetMin: "44px",
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
