"use client";
import { useEffect, useState } from "react";
import { Box, IconButton, TextField, debounce, useTheme } from "@mui/material";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";
import TrashIcon from "@mui/icons-material/Delete";
import type { CartEntry } from "../cart/ProductSelector";

interface IncrementerProps {
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
  onQuantityChange: (value: number) => void;
  product: CartEntry;
}

export function Incrementer({
  onIncrease,
  onDecrease,
  onDelete,
  onQuantityChange,
  product,
}: IncrementerProps): JSX.Element {
  const theme = useTheme();
  const [quant, setQuant] = useState<number | string>(
    product.quantity * (product.supplierProduct.unitMultiple || 1)
  );
  // stock rule
  const stockEnabled = product.supplierProduct.stock
    ? product.supplierProduct.stock.active &&
      !product.supplierProduct.stock.keepSellingWithoutStock
    : false;
  const stockAmount = product.supplierProduct.stock?.amount || 0;
  const hasStock = stockAmount > 0;

  const updateQuantState = (value: number | string): void => {
    if (typeof value === "string") {
      setQuant(value);
    } else {
      if (value.toString() === "NaN") {
        setQuant(0);
        onDelete();
        return;
      }
      if (value <= 0) {
        onDelete();
        setQuant(0);
        return;
      }
      const _val = Math.trunc(value * 100) / 100;
      setQuant(_val);
    }
  };

  useEffect(() => {
    updateQuantState(
      product.quantity * (product.supplierProduct.unitMultiple || 1)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.quantity, product.supplierProduct.unitMultiple]);

  const validateMultiple = (v: number): void => {
    /**
     * validates rounding to nearest unit_multiple
     * debounces to take final quantities
     */

    let value: number;
    // if stock not enabled
    if (!stockEnabled) {
      value = v;
    } else {
      // if no stock - return
      if (!hasStock) {
        return;
      }
      const reachedStockOut = v >= stockAmount;
      // if did not reach stock out - set value
      if (!reachedStockOut) {
        value = v;
      } else if (stockAmount >= product.supplierProduct.minimumQuantity) {
        // else if stockAmount larger than MinQ - cap at stock amount
        value = stockAmount;
      } else {
        // else - set to 0
        value = 0.0;
      }
    }

    updateQuantState(value);
    // avoids NaN and empy values
    const textValue = Math.round(
      value / (product.supplierProduct.unitMultiple || 1)
    );

    debounce(() => {
      const dataVal =
        Math.round(value / (product.supplierProduct.unitMultiple || 1)) *
        (product.supplierProduct.unitMultiple || 1);
      if (dataVal >= product.supplierProduct.minimumQuantity) {
        updateQuantState(dataVal);
        onQuantityChange(textValue);
      } else if (dataVal === 0) {
        updateQuantState(0);
      } else {
        updateQuantState(product.supplierProduct.minimumQuantity);
      }
    }, 500)();
  };

  const incQuantity = (): void => {
    onIncrease();
    if (product.quantity === 0) {
      updateQuantState(1);
    } else {
      updateQuantState(
        product.quantity * (product.supplierProduct.unitMultiple || 1)
      );
    }
  };

  const decQuantity = (): void => {
    onDecrease();
    updateQuantState(
      product.quantity * (product.supplierProduct.unitMultiple || 1)
    );
  };

  const handleDelete = (): void => {
    onDelete();
  };

  return (
    <Box sx={{ width: 140, textAlign: "right" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: theme.spacing(0.5),
          padding: theme.spacing(0.5, 0.75),
          borderRadius: theme.shape.borderRadius,
          border: `solid 1px ${theme.palette.text.disabled}`,
        }}
      >
        {product.quantity !== product.supplierProduct.minimumQuantity ? (
          <IconButton
            size="small"
            color="inherit"
            onClick={decQuantity}
            disabled={product.quantity <= 1}
          >
            <MinusIcon width={16} height={16} />
          </IconButton>
        ) : (
          <IconButton size="small" color="primary" onClick={handleDelete}>
            <TrashIcon width={16} height={16} />
          </IconButton>
        )}

        <TextField
          value={quant}
          type="number"
          // onChange={(e) => validateMultiple(parseFloat(e.target.value))}
          onChange={(e) => {
            updateQuantState(e.target.value);
          }}
          onBlur={(e) => {
            validateMultiple(parseFloat(e.target.value));
          }}
          size="small"
          sx={{ minWidth: 60 }}
          inputProps={{
            inputMode: "decimal",
            pattern: "[0-9]*",
            style: { paddingLeft: 0, paddingRight: 0, textAlign: "center" },
          }}
        />

        <IconButton size="small" color="inherit" onClick={incQuantity}>
          <PlusIcon width={16} height={16} />
        </IconButton>
      </div>
    </Box>
  );
}
