"use client";

import { Grid } from "@mui/material";
import type { SupplierProductType } from "../../../domain";
import { ProductDetailsCarousel } from "./ProductDetailsCarrousel";
import { ProductDetailsSummary } from "./ProductDetailsSummary";

// ------------------------------------------------------------

// ------------------------------------------------------------

interface ProductDetailsProps {
  product: SupplierProductType;
  inCart?: number;
  currency: string;
  addToCart: () => void;
  removeFromCart: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  setQuantity: (v: number) => void;
  checkoutUrl: string;
  showPrices: boolean;
  defaultIconPath: string;
  showMinQuantity: boolean;
}

export function ProductDetails({
  product,
  inCart,
  currency,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  checkoutUrl,
  showPrices,
  defaultIconPath,
  showMinQuantity,
}: ProductDetailsProps): JSX.Element {
  return (
    <Grid
      container
      sx={{
        pl: { xs: 2, md: 30 },
        py: { xs: 2, md: 10 },
        pr: { xs: 2, md: 10 },
      }}
    >
      <Grid item xs={12} md={5}>
        <ProductDetailsCarousel product={product} defaultIconPath={defaultIconPath}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <ProductDetailsSummary
          product={product}
          currency={currency}
          inCart={inCart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          setQuantity={setQuantity}
          checkoutUrl={checkoutUrl}
          showPrices={showPrices}
          showMinQuantity={showMinQuantity}
        />
      </Grid>
    </Grid>
  );
}
