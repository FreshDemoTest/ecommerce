"use client";

import { useEffect, useState } from "react";
import { Alert, CartModal, LoadingProgress, Snackbar } from "ui";
import { useCart, useSellerInfo } from "../../../providers/hooks";
import type { CartEntry } from "../../..";
import { isMinimumQtyReached } from "../../../utils";

interface CartModalProps {
  checkoutUrl: string;
  defaultIconPath?: string;
}

export function CommerceCartModal({
  checkoutUrl,
  defaultIconPath,
}: CartModalProps): JSX.Element {
  const {
    cartDetails,
    totalPrice,
    decrementItem,
    incrementItem,
    removeItem,
    setItemQuantity,
    clearCart,
    shouldDisplayCart,
    handleCartClick,
    loading,
    loadCart,
  } = useCart();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const { seller } = useSellerInfo();

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldDisplayCart]);

  // handlers
  const handleClick = (): void => {
    handleCartClick();
  };

  // loading render
  if (loading) {
    return <LoadingProgress sx={{ my: 2 }} />;
  }

  // min reach computation
  const minReached = isMinimumQtyReached(
    Object.values(cartDetails),
    seller?.minQuantity || 1,
    seller?.minQuantityUnit || "pesos"
  );

  return (
    <>
      <CartModal
        open={shouldDisplayCart}
        onClose={handleClick}
        checkoutUrl={checkoutUrl}
        products={Object.values(cartDetails)}
        subtotal={totalPrice}
        onDelete={(ce: CartEntry) => {
          removeItem(ce.id!);
        }}
        onDecreaseQuantity={(ce: CartEntry) => {
          const unitMultiple = ce.supplierProduct.unitMultiple || 1;
          const minimumQuantity = ce.supplierProduct.minimumQuantity || 1;
          const maxQty = ce.quantity <= minimumQuantity * (1 / unitMultiple);

          if (maxQty) {
            removeItem(ce.id!);
          } else {
            decrementItem(ce.id!);
          }
        }}
        onIncreaseQuantity={(ce: CartEntry) => {
          // stock rule
          const stockEnabled = ce.supplierProduct.stock
            ? ce.supplierProduct.stock.active &&
              !ce.supplierProduct.stock.keepSellingWithoutStock
            : false;
          const unitMultiple = ce.supplierProduct.unitMultiple || 1;
          const minimumQuantity = ce.supplierProduct.minimumQuantity || 1;
          const stockAmount = ce.supplierProduct.stock?.amount || 0;
          const hasStock = stockAmount > 0;
          const minQty =
            ce.quantity > 0 ? 1 : minimumQuantity * (1 / unitMultiple);

          // if stock not enabled:
          if (!stockEnabled) {
            incrementItem(ce.id!);
          } else {
            if (!hasStock) {
              // show alert("No hay stock disponible");
              setFeedbackMsg(
                `No hay más inventario disponible de ${ce.supplierProduct.productDescription}`
              );
              return;
            }
            const qtyToAdd = ce.quantity + minQty;
            const reachedStockOut = qtyToAdd * unitMultiple > stockAmount;
            if (!reachedStockOut) {
              incrementItem(ce.id!, { count: minQty });
            } else {
              // show alert("No hay stock suficiente");
              setFeedbackMsg(
                `No hay más inventario disponible de ${ce.supplierProduct.productDescription}`
              );
              if (stockAmount >= ce.supplierProduct.minimumQuantity) {
                // get last multiple of unitMultiple after stockAmount
                const lastMultiple =
                  Math.floor(stockAmount / unitMultiple) * unitMultiple;
                setItemQuantity(ce.id!, lastMultiple * (1 / unitMultiple));
                // setChangeMaxQuantity(product.supplierProduct.id);
              } else {
                setItemQuantity(ce.id!, 0);
                // setChangeMaxQuantity(ce.id!.supplierProduct.id);
              }
            }
          }
        }}
        onChangeQuantity={(ce: CartEntry, value: number) => {
          // stock rule
          const stockEnabled = ce.supplierProduct.stock
            ? ce.supplierProduct.stock.active &&
              !ce.supplierProduct.stock.keepSellingWithoutStock
            : false;
          const stockAmount = ce.supplierProduct.stock?.amount || 0;
          const hasStock = stockAmount > 0;
          const unitMultiple = ce.supplierProduct.unitMultiple || 1;
          const minimumQuantity = ce.supplierProduct.minimumQuantity || 1;

          // if stock not enabled:
          if (!stockEnabled) {
            setItemQuantity(ce.id!, value);
          } else {
            if (!hasStock) {
              // show alert("No hay stock disponible");
              setFeedbackMsg(
                `No hay más inventario disponible de ${ce.supplierProduct.productDescription}`
              );
              return;
            }
            const qtyToAdd = value;
            const reachedStockOut =
              qtyToAdd >= stockAmount * (1 / unitMultiple);
            if (!reachedStockOut) {
              setItemQuantity(ce.id!, value);
            } else {
              // show alert("No hay stock suficiente");
              setFeedbackMsg(
                `No hay más inventario disponible de ${ce.supplierProduct.productDescription}`
              );
              if (stockAmount >= minimumQuantity) {
                const lastMultiple =
                  Math.floor(stockAmount / unitMultiple) * unitMultiple;
                setItemQuantity(ce.id!, lastMultiple * (1 / unitMultiple));
                // setChangeMaxQuantity(product.supplierProduct.id);
              } else {
                setItemQuantity(ce.id!, 0);
                // setChangeMaxQuantity(product.supplierProduct.id);
              }
              // setItemQuantity(ce.id!, stockAmount);
            }
          }
        }}
        emptyCart={clearCart}
        minReached={minReached}
        defaultIconPath={defaultIconPath}
      />
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
