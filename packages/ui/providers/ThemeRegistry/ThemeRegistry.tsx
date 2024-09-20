"use client";

import type { NextFont } from "next/dist/compiled/@next/font";
import type { Theme } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { GREY, generateColorGradients, generateColorScheme, generateShadows } from "../../utils";
import { FontOptions, type FontWeightScheme, defaultFont, generateTypography } from "../../utils/typography";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";
import { theme as defaultTheme } from "./theme";
import { GlobalStyles } from "./GlobalStyles";

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

function parseTheme(stylesJSON: string): Theme {
  const _parsedStyles = JSON.parse(stylesJSON) as StylesJsonType;

  // color palette
  const _colorScheme = generateColorScheme(
    _parsedStyles.palette || {
      primary: "#15430F",
      secondary: "#FEEA9A",
      info: "#F59D5D",
      success: "#54D62C",
      warning: "#FFC107",
      error: "#FF4842",
    }
  );

  const _colorGradients = generateColorGradients(_colorScheme);

  const _commonPalette = {
    ..._colorScheme,
    common: { black: "#000", white: "#fff" },
    grey: GREY,
    gradients: _colorGradients,
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

  const _shape = _parsedStyles.shape || {
    borderRadius: 8,
    borderRadiusSm: 12,
    borderRadiusMd: 16,
  };

  // typography
  const _typoFam = FontOptions[_parsedStyles.typo || "Raleway"];

  const _typoWeight =
    _typoFam?.weights ||
    ({
      bold: "700",
      medium: "500",
      regular: "400",
      light: "300",
    } as FontWeightScheme);

  const _typoFont: NextFont = _typoFam?.family || defaultFont;

  const _typography = generateTypography(_typoFont.style.fontFamily, _typoWeight);

  // breakpoints

  const _breakpoints = {
    values: {
      xs: 0,
      sm: 600,
      md: 900, // OLD 960
      lg: 1200, // OLD 1280
      xl: 1536, // OLD 1920
    },
  };

  // shadows
  
  const _shadows = generateShadows("custom", _colorScheme);

  const _themeOptions = {
    palette: {
      ..._commonPalette,
      text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
      background: { paper: "#fff", default: GREY[200], neutral: GREY[200] },
      action: { active: GREY[600], ..._commonPalette.action },
    },
    typography: {
      ..._typography,
    },
    shape: { ..._shape },
    breakpoints: { ..._breakpoints },
    shadows: {
      ..._shadows,
    },
  };
  
  return createTheme(_themeOptions);
}

interface ThemeRegistryProps {
  theme?: Theme;
  stylesJson?: string;
  children: React.ReactNode;
}

export function ThemeRegistry({
  theme = defaultTheme,
  stylesJson,
  children,
}: ThemeRegistryProps): JSX.Element {
  const [customTheme, setCustomTheme] = useState<Theme>(theme);

  useEffect(() => {
    if (!stylesJson) return;
    // Load custom theme from API
    const _customTheme = parseTheme(stylesJson);
    setCustomTheme(_customTheme);
  }, [stylesJson]);
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
