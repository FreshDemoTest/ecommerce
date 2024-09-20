"use client";

import { useEffect, useState } from "react";
import { Box, Grid, ProductGrid, Typography } from "ui";
import type { SupplierProductType } from "ui/domain";
import { useCart, useClientInfo } from "../../../providers/hooks";
import type { CommerceProductDisplay } from "../../..";

const MAX_PRODS_PER_CATEG = 8;
const BASE_DETAILS_URL = "/catalog/product/";

interface CommerceRecommendedProps {
  products: SupplierProductType[];
  currency: string;
  commerceDisplay: CommerceProductDisplay;
  defaultIconPath?: string;
}

export function CommerceRecommendedProducts({
  products,
  currency,
  commerceDisplay,
  defaultIconPath
}: CommerceRecommendedProps): JSX.Element {
  const { isAuthenticated } = useClientInfo();
  const { cartDetails, addItem, removeItem, handleCartClick } = useCart();
  const [productsWithCart, setProductsWithCart] = useState<
    (SupplierProductType & { inCart?: number })[]
  >([]);

  const sectionName = "Productos Recomendados";
  const showPrices = commerceDisplay === "open" || isAuthenticated;

  const addItemWrapper = (product: SupplierProductType): void => {
    addItem(product);
    handleCartClick();
  };

  useEffect(() => {
    const cartItems = Object.values(cartDetails);
    if (cartItems.length === 0) {
      setProductsWithCart([...products]);
    } else {
      const _prodsWC = products.map((product) => {
        const cartItem = cartItems.find((ci) => ci.id === product.id);
        if (cartItem) {
          return { ...product, inCart: cartItem.quantity };
        }
        return product;
      });
      setProductsWithCart(_prodsWC);
    }
  }, [cartDetails, products]);

  return (
    <Box key={sectionName} sx={{ mt: 2, mx: { xs: 1, md: 32 } }}>
      <Grid container>
        {/* Section name */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" align="left" sx={{ mb: 1 }}>
            {sectionName}
          </Typography>
        </Grid>
        {/* products */}
        <Grid item xs={12} md={12}>
          <ProductGrid
            products={productsWithCart.slice(0, MAX_PRODS_PER_CATEG)}
            productDetailsUrlBase={BASE_DETAILS_URL}
            addToCart={addItemWrapper}
            deleteFromCart={(p) => {
              removeItem(p.id);
            }}
            showPrices={showPrices}
            currency={currency}
            defaultIconPath={defaultIconPath}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
