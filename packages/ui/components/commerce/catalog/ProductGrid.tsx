"use client";

import { Box, Grid, Typography } from "@mui/material";
import type { SupplierProductType } from "../../../domain";
import { ProductGridCard } from "./ProductGridCard";

interface ProductGridProps {
  products: (SupplierProductType & { inCart?: number })[];
  productDetailsUrlBase: string;
  addToCart: (product: SupplierProductType) => void;
  deleteFromCart: (product: SupplierProductType) => void;
  showPrices?: boolean;
  currency?: string;
  defaultIconPath?: string;
}

export function ProductGrid({
  products,
  productDetailsUrlBase,
  addToCart,
  deleteFromCart,
  showPrices = true,
  currency = "MXN",
  defaultIconPath
}: ProductGridProps): JSX.Element {
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
        <Grid key={i} item xs={6} md={3} sx={{ p: 1 }}>
          <ProductGridCard
            product={product}
            productDetailsUrlBase={productDetailsUrlBase}
            addToCart={() => {
              addToCart(product);
            }}
            deleteFromCart={() => {
              deleteFromCart(product);
            }}
            showPrices={showPrices}
            currency={currency}
            defaultIconPath={defaultIconPath}
          />
        </Grid>
      ))}
    </Grid>
  );
}
