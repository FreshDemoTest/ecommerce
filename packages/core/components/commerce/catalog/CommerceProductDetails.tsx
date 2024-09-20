"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CatalogBreadcrumbs,
  Grid,
  ProductDetails,
  Snackbar,
  Typography,
} from "ui";
import type { SupplierProductType } from "ui/domain";
import { urlFormat } from "ui/utils";
import { useCart, useClientInfo } from "../../../providers/hooks";
import type { CommerceProductDisplay } from "../../..";

// ------------------------------------------------------------

const loginRedirectTo = "/login";

interface CommerceProductDetailsProps {
  commerceDisplay: CommerceProductDisplay;
  product: SupplierProductType | undefined;
  currency: string;
  checkoutUrl: string;
  defaultIconPath: string;
  showMinQuantity?: boolean;
}

export function CommerceProductDetails({
  commerceDisplay,
  product,
  currency,
  checkoutUrl,
  defaultIconPath,
  showMinQuantity = false,
}: CommerceProductDetailsProps): JSX.Element {
  const [inCart, setInCart] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const {
    cartDetails,
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
    setItemQuantity,
  } = useCart();
  const { isAuthenticated } = useClientInfo();

  useEffect(() => {
    const item = Object.values(cartDetails).find((i) => i.id === product?.id);
    if (item) {
      setInCart(item.quantity);
    } else {
      setInCart(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartDetails]);

  // if commerceDisplay is closed, and not logged in redirect to Login
  if (commerceDisplay === "closed" && !isAuthenticated) {
    redirect(loginRedirectTo);
  }
  const showPrices = commerceDisplay === "open" || isAuthenticated;
  // stock rule
  const stockEnabled = product?.stock
    ? product.stock.active && !product.stock.keepSellingWithoutStock
    : false;
  const stockAmount = product?.stock?.amount || 0;
  const hasStock = stockAmount > 0;
  const minQty = (product?.minimumQuantity || 1) / (product?.unitMultiple || 1);

  if (!product) {
    return (
      <Grid container>
        <Grid item xs={12} md={12}>
          <Box sx={{ display: "flex", justifyContent: "center", my: 30 }}>
            <Typography variant="h4" color="grey">
              Este producto no fue encontrado.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Box sx={{ mt: 3, ml: 2, color: "grey" }}>
            <CatalogBreadcrumbs
              section={{
                name: product.productCategory || "",
                url: `/catalog/list?search=${urlFormat(
                  product.productCategory || ""
                )}`,
                children: {
                  name: product.productDescription,
                  url: `/catalog/list?search=${urlFormat(
                    product.productDescription
                  )}`,
                },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <ProductDetails
            product={product}
            inCart={inCart}
            currency={currency}
            addToCart={() => {
              addItem(product);
            }}
            removeFromCart={() => {
              removeItem(product.id);
            }}
            increaseQuantity={() => {
              if (!stockEnabled) {
                incrementItem(product.id);
              } else {
                if (!hasStock) {
                  // show alert("No hay stock disponible");
                  setFeedbackMsg(
                    `No hay más inventario disponible de ${product.productDescription}`
                  );
                  return;
                }
                const qtyToAdd = inCart + minQty;
                const reachedStockOut = qtyToAdd > stockAmount;
                if (!reachedStockOut) {
                  incrementItem(product.id);
                } else {
                  // show alert("No hay stock suficiente");
                  setFeedbackMsg(
                    `No hay más inventario disponible de ${product.productDescription}`
                  );
                }
              }
            }}
            decreaseQuantity={() => {
              decrementItem(product.id);
            }}
            setQuantity={(qty: number) => {
              setItemQuantity(product.id, qty);
              // if stock not enabled:
              if (!stockEnabled) {
                setItemQuantity(product.id, qty);
              } else {
                if (!hasStock) {
                  // show alert("No hay stock disponible");
                  setFeedbackMsg(
                    `No hay más inventario disponible de ${product.productDescription}`
                  );
                  return;
                }
                const reachedStockOut = qty >= stockAmount;
                if (!reachedStockOut) {
                  setItemQuantity(product.id, qty);
                } else {
                  // show alert("No hay stock suficiente");
                  setFeedbackMsg(
                    `No hay más inventario disponible de ${product.productDescription}`
                  );
                }
              }
            }}
            checkoutUrl={checkoutUrl}
            showPrices={showPrices}
            defaultIconPath={defaultIconPath}
            showMinQuantity={showMinQuantity}
          />
        </Grid>
      </Grid>
      {/* Feedback msg */}
      <Snackbar
        open={feedbackMsg !== null}
        autoHideDuration={3000}
        onClose={() => {
          setFeedbackMsg(null);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert severity="error">{feedbackMsg}</Alert>
      </Snackbar>
    </>
  );
}
