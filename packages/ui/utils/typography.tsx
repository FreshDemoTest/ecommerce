"use client";

import {
  Raleway,
  Roboto,
  Montserrat,
  Work_Sans as WorkSans,
  Open_Sans as OpenSans,
} from "next/font/google";
import type { TypographyOptions } from "@mui/material/styles/createTypography";
import type { NextFont } from "next/dist/compiled/@next/font";

export type FontWeight = "100" | "300" | "400" | "500" | "700" | "900";
export interface FontWeightScheme {
  bold: FontWeight;
  medium: FontWeight;
  regular: FontWeight;
  light: FontWeight;
}

export function pxToRem(value: number): string {
  return `${value / 16}rem`;
}

export function responsiveFontSizes(fsz: {
  sm: number;
  md: number;
  lg: number;
}): Record<string, { fontSize: string }> {
  const { sm, md, lg } = fsz;
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
}

export function generateTypography(
  fontFamily: string,
  fontWeightScheme: FontWeightScheme
): TypographyOptions {
  return {
    fontFamily,
    fontWeightLight: fontWeightScheme.light,
    fontWeightRegular: fontWeightScheme.regular,
    fontWeightMedium: fontWeightScheme.medium,
    fontWeightBold: fontWeightScheme.bold,
    h1: {
      fontWeight: fontWeightScheme.bold,
      lineHeight: 80 / 64,
      fontSize: pxToRem(40),
      ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
    },
    h2: {
      fontWeight: fontWeightScheme.bold,
      lineHeight: 64 / 48,
      fontSize: pxToRem(32),
      ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
    },
    h3: {
      fontWeight: fontWeightScheme.bold,
      lineHeight: 1.5,
      fontSize: pxToRem(24),
      ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
    },
    h4: {
      fontWeight: fontWeightScheme.bold,
      lineHeight: 1.5,
      fontSize: pxToRem(20),
      ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
    },
    h5: {
      fontWeight: fontWeightScheme.bold,
      lineHeight: 1.5,
      fontSize: pxToRem(18),
      ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
    },
    h6: {
      fontWeight: fontWeightScheme.bold,
      lineHeight: 28 / 18,
      fontSize: pxToRem(17),
      ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
    },
    subtitle1: {
      fontWeight: fontWeightScheme.medium,
      lineHeight: 1.5,
      fontSize: pxToRem(16),
    },
    subtitle2: {
      fontWeight: fontWeightScheme.medium,
      lineHeight: 22 / 14,
      fontSize: pxToRem(14),
    },
    body1: {
      lineHeight: 1.5,
      fontSize: pxToRem(16),
    },
    body2: {
      lineHeight: 22 / 14,
      fontSize: pxToRem(14),
    },
    caption: {
      lineHeight: 1.5,
      fontSize: pxToRem(12),
    },
    overline: {
      fontWeight: fontWeightScheme.bold,
      lineHeight: 1.5,
      fontSize: pxToRem(12),
      allVariants: {
        letterSpacing: 1.1,
        textTransform: "uppercase",
      },
    },
    button: {
      fontWeight: fontWeightScheme.bold,
      lineHeight: 24 / 14,
      fontSize: pxToRem(14),
      allVariants: {
        textTransform: "uppercase",
      },
    },
  };
}

interface FontOptionsType {
  family: NextFont;
  weights: FontWeightScheme;
}

const ralewayFont = Raleway({
  weight: ["700", "500", "400", "300"],
  subsets: ["latin"],
  display: "swap",
});

const robotoFont = Roboto({
  weight: ["700", "500", "400", "300"],
  subsets: ["latin"],
  display: "swap",
});

const montserratFont = Montserrat({
  weight: ["700", "500", "400", "300"],
  subsets: ["latin"],
  display: "swap",
});

const workSansFont = WorkSans({
  weight: ["700", "500", "400", "300"],
  subsets: ["latin"],
  display: "swap",
});

const openSansFont = OpenSans({
  weight: ["700", "500", "400", "300"],
  subsets: ["latin"],
  display: "swap",
});

export const defaultFont = ralewayFont;

export const FontOptions: Record<string, FontOptionsType> = {
  Raleway: {
    family: ralewayFont,
    weights: {
      bold: "700",
      medium: "500",
      regular: "400",
      light: "300",
    },
  },
  Roboto: {
    family: robotoFont,
    weights: {
      bold: "700",
      medium: "500",
      regular: "400",
      light: "300",
    },
  },
  Montserrat: {
    family: montserratFont,
    weights: {
      bold: "700",
      medium: "500",
      regular: "400",
      light: "300",
    },
  },
  WorkSans: {
    family: workSansFont,
    weights: {
      bold: "700",
      medium: "500",
      regular: "400",
      light: "300",
    },
  },
  OpenSans: {
    family: openSansFont,
    weights: {
      bold: "700",
      medium: "500",
      regular: "400",
      light: "300",
    },
  },
};
