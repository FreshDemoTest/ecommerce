// @mui
import { Box, Grid, Skeleton } from "@mui/material";

// ----------------------------------------------------------------------

export function SkeletonProduct(): JSX.Element {
  return (
    <Box
      sx={{
        pl: { xs: 2, md: 30 },
        py: { xs: 2, md: 10 },
        pr: { xs: 2, md: 10 },
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={7}>
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{ paddingTop: "100%", borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <Skeleton variant="circular" width={80} height={80} />
          <Skeleton variant="text" height={240} />
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={40} />
        </Grid>
      </Grid>
    </Box>
  );
}
