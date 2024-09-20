import { useState, useEffect } from "react";
import { Box, Chip, styled, useTheme } from "@mui/material";
import type { ChipProps } from "@mui/material";
import { fQuantity } from "../../../utils/helpers";

// ----------------------------------------------------------------------

const StyledBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "flex-end",
}));

function StyledChip({
  isAnimating,
  chipProps,
}: {
  isAnimating: boolean;
  chipProps: ChipProps;
}): JSX.Element {
  const theme = useTheme();
  return (
    <Chip
      sx={{
        backgroundColor: isAnimating
          ? theme.palette.warning.main
          : theme.palette.info.main,
        fontWeight: theme.typography.fontWeightBold,
        color: theme.palette.getContrastText(theme.palette.info.dark),
        borderColor: theme.palette.info.main,
        boxShadow: theme.shadows[4],
        transition: "background-color 0.3s, transform 0.3s",
        transform: isAnimating ? "scale(1.1)" : "scale(1)",
      }}
      {...chipProps}
    />
  );
}

// ----------------------------------------------------------------------

interface PreviewQuantityProps {
  quants: number;
  integerQuant?: boolean;
  unit?: string;
  unitMultiple?: number;
  sx?: any;
}

export function PreviewQuantity({
  quants,
  integerQuant = false,
  unit = "unidad",
  unitMultiple = 1,
  sx,
}: PreviewQuantityProps): JSX.Element {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [quants]);

  const fQuantityWrapper = (q: number): string => {
    if (unitMultiple >= 0.01) {
      return fQuantity(q);
    }
    return fQuantity(q, 3);
  };

  const fmtQty = integerQuant
    ? fQuantityWrapper(quants).split(".")[0]
    : fQuantityWrapper(quants);
  return (
    <StyledBox component="span" {...sx}>
      {quants > 0 && (
        <StyledChip
          chipProps={{
            label: `${fmtQty} ${unit}${quants > 1 ? "s" : ""}`,
            variant: "outlined",
          }}
          isAnimating={isAnimating}
        />
      )}
    </StyledBox>
  );
}
