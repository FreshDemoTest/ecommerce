"use client";

import type { PaletteColor } from "@mui/material";
import { alpha, darken, getContrastRatio, lighten } from "@mui/material";

// ----------------------------------------------------------

export function createGradient(color1: string, color2: string): string {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
export const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
};

export function augmentColor(
  color: string
): PaletteColor & { lighter: string; darker: string } {
  return {
    lighter: lighten(color, 0.8),
    light: lighten(color, 0.2),
    main: color,
    dark: darken(color, 0.2),
    darker: darken(color, 0.8),
    contrastText: getContrastRatio("#fff", color) >= 3 ? "#fff" : GREY[800],
  };
}

export interface ColorSchemeType {
  primary: PaletteColor;
  secondary: PaletteColor;
  info: PaletteColor;
  success: PaletteColor;
  warning: PaletteColor;
  error: PaletteColor;
}

export function generateColorScheme(baseSx: {
  primary: string;
  secondary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}): ColorSchemeType {
  const { primary, secondary, info, success, warning, error } = baseSx;
  return {
    primary: augmentColor(primary),
    secondary: augmentColor(secondary),
    info: augmentColor(info),
    success: augmentColor(success),
    warning: augmentColor(warning),
    error: augmentColor(error),
  };
}

export function generateColorGradients(cScheme: ColorSchemeType): {
  [key in keyof ColorSchemeType]: string;
} {
  return {
    primary: createGradient(cScheme.primary.light, cScheme.primary.main),
    secondary: createGradient(cScheme.secondary.light, cScheme.secondary.main),
    info: createGradient(cScheme.info.light, cScheme.info.main),
    success: createGradient(cScheme.success.light, cScheme.success.main),
    warning: createGradient(cScheme.warning.light, cScheme.warning.main),
    error: createGradient(cScheme.error.light, cScheme.error.main),
  };
}
