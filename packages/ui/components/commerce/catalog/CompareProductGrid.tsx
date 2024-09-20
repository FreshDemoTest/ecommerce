"use client";

import { Box, Grid, Typography } from "@mui/material";
import type { SupplierProductType } from "../../../domain";
import { CompareProductCard } from "./CompareProductCard";

interface CompareProductGridProps {
  products: (SupplierProductType & {
    redirectUrl: string;
    supplierName?: string;
  })[];
  showPrices?: boolean;
  currency?: string;
  defaultIconPath?: string;
}

export function CompareProductGrid({
  products,
  showPrices = true,
  currency = "MXN",
}: CompareProductGridProps): JSX.Element {
  if (products.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "50vh",
          pt: 12,
        }}
      >
        <Typography variant="h6">No hay productos disponibles</Typography>
      </Box>
    );
  }
  return (
    <Grid container>
      {products.map((product, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid key={i} item xs={12} md={3} sx={{ p: 1 }}>
          <CompareProductCard
            product={product}
            productDetailsUrlBase={product.redirectUrl}
            showPrices={showPrices}
            currency={currency}
          />
        </Grid>
      ))}
    </Grid>
  );
}
