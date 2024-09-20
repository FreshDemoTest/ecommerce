"use client";

import { type SyntheticEvent, useState } from "react";
import {
  Alert,
  Box,
  Grid,
  InvoiceDetails,
  OrdenDetails,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "ui";
import { type InvoiceType, type OrdenType } from "ui/domain";
import { paymentMethodLabels } from "../../../domain";
import { useCart, useClientInfo } from "../../../providers/hooks";

// ----------------------------------------------------------------------

interface CommerceOrdenDetailsProps {
  displayOrden?: OrdenType;
  notFound: boolean;
  displayInvoice?: InvoiceType;
}

export function CommerceOrdenDetails({
  displayOrden,
  displayInvoice,
  notFound = false,
}: CommerceOrdenDetailsProps): JSX.Element {
  const { addItem, handleCartClick, refreshCart } = useCart();
  const { apiURL, sellerId } = useClientInfo();
  const [activeTab, setActiveTab] = useState<"pedido" | "factura">("pedido");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  
  const handleChange = (event: SyntheticEvent, newValue: string): void => {
    setActiveTab(newValue as "pedido" | "factura");
  };

  const menuOptions = [
    {
      label: "Duplicar Pedido",
      action: () => {
        displayOrden?.cart.cartProducts.forEach((prd) => {
          addItem(
            { ...prd.supplierProduct, price: prd.price },
            { count: prd.quantity / (prd.supplierProduct.unitMultiple || 1) }
          );
        });
        setFeedbackMsg("Revisa que los productos se hayan añadido correctamente al carrito. Si no es así, es probable que no haya stock suficiente.");
        const dispatchRefreshCart = async (): Promise<void> => {
          // 1 second delay
          refreshCart(apiURL, sellerId || "");
          await new Promise((resolve) => {
            setTimeout(resolve, 800);
          });
          handleCartClick();
        };
        void dispatchRefreshCart();
      },
    },
  ];

  return (
    <Grid container>
      <Grid item xs={0} md={2} />
      <Grid item xs={12} md={8}>
        <Box sx={{ mx: { md: 10 }, pb: { sm: 3 } }}>
          {/* If orden and display orden. Show success message. */}
          {displayOrden ? (
            <>
              <Tabs
                value={activeTab}
                onChange={handleChange}
                aria-label="info pedido-factura tabs"
                centered
              >
                <Tab
                  label="Pedido"
                  value="pedido"
                  sx={{
                    minWidth: { xs: 20, md: 240 },
                  }}
                />
                <Tab
                  label="Factura"
                  value="factura"
                  sx={{
                    minWidth: { xs: 20, md: 240 },
                  }}
                />
              </Tabs>
              {activeTab === "pedido" ? (
                <OrdenDetails
                  notFound={false}
                  ordenReceipt={displayOrden}
                  paymentMethods={paymentMethodLabels}
                  menuOptions={menuOptions}
                />
              ) : null}
              {activeTab === "factura" ? (
                <InvoiceDetails
                  invoiceDetails={displayInvoice}
                  paymentMethods={paymentMethodLabels}
                />
              ) : null}
            </>
          ) : null}
          {/* If no order details. Show not found. */}
          {notFound ? (
            <Stack direction="row" alignItems="center" sx={{ mt: 24, mb: 24 }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  No se encontró el pedido.
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  El pedido que estás buscando no existe o ya no está
                  disponible.
                </Typography>
              </Box>
            </Stack>
          ) : null}
        </Box>
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
      </Grid>
    </Grid>
  );
}
