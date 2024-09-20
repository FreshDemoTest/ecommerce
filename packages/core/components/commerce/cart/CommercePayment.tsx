"use client";

import { useEffect, useState } from "react";
import { Alert, Box, MenuItem, Paper, TextField, Typography } from "ui";
import { useSellerInfo, useCart } from "../../../providers/hooks";
import {
  type CommercePaymentMethod,
  paymentMethodLabels,
} from "../../../domain";

export function CommercePayment(): JSX.Element {
  const { assignedUnit, sellerUnits } = useSellerInfo();
  const { paymentMethod, changePaymentMethod } = useCart();
  const [selectedUnit, setSelectedUnit] = useState(assignedUnit);
  // hook - if assignedUnit is not set, set it to the first unit
  useEffect(() => {
    if (!assignedUnit && sellerUnits.length > 0) {
      setSelectedUnit(sellerUnits[0]);
    } else if (assignedUnit) {
      setSelectedUnit(assignedUnit);
    }
  }, [assignedUnit, sellerUnits]);
  const allowedPaymentMethods = (selectedUnit?.paymentMethods || []).map(
    (pm) => ({
      value: pm.toLowerCase(),
      label: paymentMethodLabels[pm],
    })
  );
  return (
    <Box sx={{ px: { xs: 1, md: 10 }, mb: { xs: 3, md: 6 } }}>
      <Paper sx={{ py: 3 }}>
        <Box sx={{ mt: 1, px: { xs: 2, md: 4 } }}>
          <Typography variant="h6" color="text.secondary">
            Escoge tu método de Pago.
          </Typography>
        </Box>
        <Box sx={{ mt: 2, px: { xs: 2, md: 4 } }}>
          <TextField
            fullWidth
            select
            label="Método de pago"
            value={paymentMethod?.toLowerCase()}
            onChange={(e) => {
              changePaymentMethod(e.target.value as CommercePaymentMethod);
            }}
          >
            {allowedPaymentMethods.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {paymentMethod &&
          paymentMethod.toLowerCase() === "direct-transfer" ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Favor de realizar el pago a esta cuenta antes de recibir el
              pedido: <br />
              <b>CLABE: {selectedUnit?.accountNumber}</b>
            </Alert>
          ) : null}
        </Box>
      </Paper>
    </Box>
  );
}
