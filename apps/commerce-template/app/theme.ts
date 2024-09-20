"use client";

import type { NextFont } from "next/dist/compiled/@next/font";
import { createTheme } from "ui";
import type { FontWeightScheme } from "ui/utils";
import {
  GREY,
  generateColorGradients,
  generateColorScheme,
  generateShadows,
  generateTypography,
} from "ui/utils";
import { FontOptions, defaultFont } from "ui/utils/typography";

interface StylesJsonType {
  palette?: {
    primary: string;
    secondary: string;
    info: string;
    success: string;
    warning: string;
    error: string;
  };
  typo?: string;
  shape?: {
    borderRadius: number;
    borderRadiusSm: number;
    borderRadiusMd: number;
  };
}

const parsedStyles = JSON.parse(
  '{"palette":{"primary":"#EFEEEE","secondary":"#E5E9EC","info":"#EFEEEE","success":"#E5E9EC","warning":"#EFEEEE","error":"#E5E9EC"},"shape":{"borderRadius":8,"borderRadiusSm":12,"borderRadiusMd":16},"type":"Montserrat"}'
) as StylesJsonType;

// color palette
const colorScheme = generateColorScheme(
  parsedStyles.palette || {
    primary: "#EFEEEE",
    secondary: "#E5E9EC",
    info: "#EFEEEE",
    success: "#E5E9EC",
    warning: "#EFEEEE",
    error: "#E5E9EC",
  }
);

const colorGradients = generateColorGradients(colorScheme);

const commonPalette = {
  ...colorScheme,
  common: { black: "#000", white: "#fff" },
  grey: GREY,
  gradients: colorGradients,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

// shape

const shape = parsedStyles.shape || {
  borderRadius: 8,
  borderRadiusSm: 12,
  borderRadiusMd: 16,
};

// typography
const typoFam = FontOptions[parsedStyles.typo || "Raleway"];

const typoWeight =
  typoFam?.weights ||
  ({
    bold: "700",
    medium: "500",
    regular: "400",
    light: "300",
  } as FontWeightScheme);

export const typoFont: NextFont = typoFam?.family || defaultFont;

const typography = generateTypography(typoFont.style.fontFamily, typoWeight);

// breakpoints

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900, // OLD 960
    lg: 1200, // OLD 1280
    xl: 1536, // OLD 1920
  },
};

// shadows

const shadows = generateShadows("custom", colorScheme);

const themeOptions = {
  palette: {
    ...commonPalette,
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: "#fff", default: GREY[200], neutral: GREY[200] },
    action: { active: GREY[600], ...commonPalette.action },
  },
  typography: {
    ...typography,
  },
  shape: { ...shape },
  breakpoints: { ...breakpoints },
  shadows: {
    ...shadows,
  },
};

export const theme = createTheme(themeOptions);
