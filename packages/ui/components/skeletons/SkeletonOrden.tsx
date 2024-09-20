// @mui
import { Grid, Skeleton } from "@mui/material";

// ----------------------------------------------------------------------

export function SkeletonOrden(): JSX.Element {
  return (
    <Grid container spacing={3} sx={{ my: 4 }}>
      <Grid item xs={12} md={2} />
      <Grid item xs={12} md={8}>
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ paddingTop: "100%", borderRadius: 2 }}
        />
      </Grid>
    </Grid>
  );
}
