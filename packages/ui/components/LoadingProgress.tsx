"use client";
import type { SxProps } from "@mui/material";
import { Box, CircularProgress } from "@mui/material";

export function LoadingProgress({ sx }: { sx?: SxProps }): JSX.Element {
  const circSx = {
    color:
      typeof sx === "object" && sx !== null && "color" in sx
        ? (sx.color as string)
        : "primary.main",
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        ...sx,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress sx={circSx} />
      </Box>
    </Box>
  );
}
