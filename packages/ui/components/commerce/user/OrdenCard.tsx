import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import {
  payStatusTypes,
  type InvoiceType,
  type OrdenType,
} from "../../../domain";
import { fCurrency, fISODate } from "../../../utils";

// ------------------------------------------------------------

const statusColorMap = {
  submitted: "info.main",
  accepted: "secondary.main",
  canceled: "error.main",
  delivered: "success.main",
} as Record<string, string>;

const statusMsgMap = {
  submitted: "Enviado",
  accepted: "Confirmado",
  canceled: "Cancelado",
  delivered: "Entregado",
} as Record<string, string>;

const paymentMethodMap = {
  cash: "Efectivo",
  card: "Tarjeta",
  money_order: "Cheque",
  "direct-transfer": "Transferencia",
  credit: "Crédito",
} as Record<string, string>;

// ------------------------------------------------------------

interface OrdenCardProps {
  orden: OrdenType;
  invoice?: InvoiceType;
}

export function OrdenCard({ orden, invoice }: OrdenCardProps): JSX.Element {
  const colorChip = statusColorMap[orden.status] || "gray";
  const statusMsg = statusMsgMap[orden.status] || "Desconocido";
  const paystatusMsg = payStatusTypes[orden.payStatus || "unknown"];
  const payMethodMsg = orden.paymentMethod
    ? paymentMethodMap[orden.paymentMethod] || "-"
    : "-";
  return (
    <Card sx={{ my: 1 }}>
      <CardContent>
        <Grid container spacing={1} sx={{ mt: 1, cursor: "pointer" }}>
          <Grid item xs={6} lg={8}>
            <Typography variant="subtitle1" noWrap>
              Pedido #{orden.ordenNumber || ""}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {orden.supplier.supplierName}{" "}
              {orden.deliveryType === "pickup"
                ? " (Recoge en Almacén)"
                : " (Entrega)"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              <b>{orden.total ? fCurrency(orden.total) : ""}</b>
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {payMethodMsg}
            </Typography>
          </Grid>
          <Grid item xs={6} lg={3} sx={{ textAlign: "center" }}>
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Fecha:{" "}
                {`${fISODate(orden.deliveryDate)} (${orden.deliveryTime}hrs)`}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Chip
                label={statusMsg}
                sx={{
                  mt: 0.5,
                  px: 2,
                  backgroundColor: colorChip,
                  color: "common.white",
                  fontWeight: "bold",
                }}
              />
              {paystatusMsg === "Pagado" ? (
                <Chip
                  label={paystatusMsg}
                  sx={{
                    mt: 0.5,
                    px: 2,
                    ml: { md: 1, xs: 0 },
                    backgroundColor: "success.main",
                    color: "common.white",
                    fontWeight: "bold",
                  }}
                />
              ) : null}
            </Box>
            {invoice ? (
              <Box sx={{ textAlign: "center" }}>
                <Chip
                  label="c/ Factura"
                  sx={{
                    mt: 0.5,
                    px: 1,
                    backgroundColor: "secondary.dark",
                    color: "common.white",
                    fontWeight: "bold",
                  }}
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
