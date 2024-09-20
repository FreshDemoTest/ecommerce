import { Divider, Typography, useTheme, Grid, Paper } from "@mui/material";
import type { SxProps } from "@mui/material";
import { fCurrency, fISODate } from "../../../utils";

interface CheckoutSummaryProps {
  delivery?: {
    date: string;
    time: string;
  };
  subtotalWithoutTax: number;
  tax: number;
  subtotal: number;
  discount?: {
    code?: string;
    amount: number;
  };
  shippingCost?: number;
  packagingCost?: number;
  serviceFee?: number;
  total: number;
  sx?: SxProps;
}

export function CheckoutSummary(props: CheckoutSummaryProps): JSX.Element {
  const {
    delivery,
    subtotalWithoutTax,
    tax,
    subtotal,
    discount,
    shippingCost,
    packagingCost,
    serviceFee,
    total,
    sx,
  } = props;
  const theme = useTheme();
  return (
    <Paper sx={{ ...sx }}>
      <Typography variant="h6" color="text.secondary">
        Resumen de tu pedido
      </Typography>
      {delivery ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, fontWeight: theme.typography.fontWeightRegular }}
        >
          Entrega: {fISODate(delivery.date)} ({delivery.time} hrs)
        </Typography>
      ) : null}
      <Grid container sx={{ mt: 2 }}>
        {/* Subtotal before taxes */}
        <>
          <Grid item xs={8}>
            <Typography variant="overline" color="text.secondary" align="left">
              Subtotal (antes de Impuestos)
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" color="text.secondary" align="right">
              {fCurrency(subtotalWithoutTax)}
            </Typography>
          </Grid>
        </>
        {/* Tax */}
        <>
          <Grid item xs={8}>
            <Typography variant="overline" color="text.secondary" align="left">
              Impuestos
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" color="text.secondary" align="right">
              {fCurrency(tax)}
            </Typography>
          </Grid>
        </>
        {/* Subtotal before taxes */}
        <>
          <Grid item xs={8}>
            <Typography variant="overline" color="text.secondary" align="left">
              Subtotal
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" color="text.secondary" align="right">
              {fCurrency(subtotal)}
            </Typography>
          </Grid>
        </>
        {/* Discount */}
        {discount ? (
          <>
            <Grid item xs={8}>
              <Typography
                variant="overline"
                color="text.secondary"
                align="left"
              >
                Descuentos
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" color="text.secondary" align="right">
                {`- ${fCurrency(discount.amount)}`}
              </Typography>
            </Grid>
          </>
        ) : null}
        {/* Shipping */}
        {shippingCost ? (
          <>
            <Grid item xs={8}>
              <Typography
                variant="overline"
                color="text.secondary"
                align="left"
              >
                Envío
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" color="text.secondary" align="right">
                {fCurrency(shippingCost)}
              </Typography>
            </Grid>
          </>
        ) : null}
        {/* Packaging */}
        {packagingCost ? (
          <>
            <Grid item xs={8}>
              <Typography
                variant="overline"
                color="text.secondary"
                align="left"
              >
                Empaque
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" color="text.secondary" align="right">
                {fCurrency(packagingCost)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={0} />
          </>
        ) : null}
        {/* Service Fee */}
        {serviceFee ? (
          <>
            <Grid item xs={8}>
              <Typography
                variant="overline"
                color="text.secondary"
                align="left"
              >
                Servicio
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" color="text.secondary" align="right">
                {fCurrency(serviceFee)}
              </Typography>
            </Grid>
          </>
        ) : null}
        {/* Divider */}
        <Grid item xs={12}>
          <Divider sx={{ my: 1, mr: 1 }} />
        </Grid>
        {/* Total*/}
        <>
          <Grid item xs={8}>
            <Typography variant="overline" color="text.primary" align="left">
              Total
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle1" color="text.primary" align="right">
              {fCurrency(total)}
            </Typography>
          </Grid>
        </>
      </Grid>
    </Paper>
  );
}
