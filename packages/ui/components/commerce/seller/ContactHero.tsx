"use client";

import { Box, Container, Typography, useTheme } from "@mui/material";

export function ContactHero({
  sellerName,
  seoDescription,
}: {
  sellerName: string;
  seoDescription: string;
}): JSX.Element {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `linear-gradient(to top right, ${theme.palette.info.dark}, ${theme.palette.secondary.main})`,
        py: { xs: 10, md: 0 },
        px: { xs: 0, md: 0 },
        height: { xs: "auto", md: 540 },
      }}
    >
      <Container sx={{ position: "relative", height: "100%" }}>
        <Box
          sx={{
            textAlign: { xs: "center", md: "left" },
            position: { xs: "inherit", md: "absolute" },
            bottom: { xs: "inherit", md: "40%" },
          }}
        >
          <Typography variant="h1" sx={{ color: "primary.main" }}>
            {`Somos ${sellerName}`}
          </Typography>
          <br />
          <Box sx={{ display: "inline-flex", color: "common.white" }}>
            {seoDescription}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
