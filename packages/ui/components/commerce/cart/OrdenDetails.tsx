"use client";

import { useState } from "react";
// material
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  type Theme,
  Typography,
  useTheme,
  MenuItem,
  Button,
} from "@mui/material";
import {
  type OrdenStatusType,
  type OrdenType,
  ordenStatusTypes,
  UOMTypes,
  payStatusTypes,
} from "../../../domain";
import { fCurrency, fISODate, fQuantity } from "../../../utils";
import { SummaryRow } from "../../orden/Summary";
import { MenuPopover } from "../../MenuPopover";

// ----------------------------------------------------------------------

const statusChip = (theme: Theme, status: OrdenStatusType): string => {
  return {
    submitted: theme.palette.info.main,
    accepted: theme.palette.info.main,
    picking: theme.palette.secondary.light,
    shipping: theme.palette.secondary.light,
    delivered: theme.palette.primary.main,
    canceled: theme.palette.error.main,
  }[status];
};

// ----------------------------------------------------------------------

interface OrdenDetailsViewProps {
  notFound: boolean;
  ordenReceipt: OrdenType;
  paymentMethods: Record<string, string>;
  menuOptions: { label: string; action: () => void }[];
}

export function OrdenDetails({
  notFound,
  ordenReceipt,
  paymentMethods,
  menuOptions = [],
}: OrdenDetailsViewProps): JSX.Element {
  // hook vars
  const theme = useTheme();
  const [openMenu, setOpenMenu] = useState(false);

  // summary items
  const summaryItems = [
    {
      label: "Descuento",
      value: ordenReceipt.discount?.amount,
    },
    {
      label: "Envío",
      value: ordenReceipt.shippingCost,
    },
    {
      label: "Empaque",
      value: ordenReceipt.packagingCost,
    },
    {
      label: "Servicio",
      value: ordenReceipt.serviceFee,
    },
  ];

  // render vars
  const payMsg = payStatusTypes[ordenReceipt.payStatus || "unknown"];
  // render method
  return (
    <Box sx={{ mt: theme.spacing(3) }}>
      {/* Options popover */}
      <MenuPopover
        open={openMenu}
        onClose={() => {
          setOpenMenu(false);
        }}
        sx={{
          "& .MuiDialog-paper": {
            overflowY: "visible",
            marginTop: "-50vh",
            marginRight: "20vw",
            width: "16vw",
            height: `${(4 * menuOptions.length || 1) + 2}vh`,
            // mobile bp
            [theme.breakpoints.down("md")]: {
              width: "60vw",
              height: `${(7 * menuOptions.length || 1) + 1}vh`,
              marginTop: "-20vh",
              marginRight: "7vw",
            },
          },
        }}
      >
        {menuOptions.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              option.action();
              setOpenMenu(false);
            }}
            sx={{
              typography: "body2",
              py: 2,
              px: 2.5,
              justifyContent: "center",
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuPopover>
      {notFound ? (
        <Box sx={{ mt: theme.spacing(3) }}>
          <Typography variant="h4" align="center">
            Pedido no encontrado
          </Typography>
        </Box>
      ) : null}
      {!notFound ? (
        <Card
          sx={{
            pt: theme.spacing(2),
            pb: theme.spacing(4),
            px: { xs: theme.spacing(2), md: theme.spacing(4) },
            minHeight: "92vh",
          }}
        >
          <CardHeader
            title={
              // Logo
              <Grid container>
                <Grid item xs={7}>
                  {/* <Logo width={112} paddingTop={0} /> */}
                </Grid>
              </Grid>
            }
          />
          <CardContent>
            <Grid container>
              {/* Nota remision */}
              <Grid
                item
                xs={8}
                sm={8}
                sx={{
                  marginBottom: theme.spacing(2),
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: theme.typography.fontWeightLight }}
                >
                  Nota de Remisión
                </Typography>
                <Typography variant="h6">ID: {ordenReceipt.id}</Typography>
                {ordenReceipt.ordenNumber ? (
                  <Typography variant="subtitle1" color="text.secondary">
                    # Pedido: {ordenReceipt.ordenNumber}
                  </Typography>
                ) : null}
                <Typography variant="body2">
                  Tipo de pago:{" "}
                  {
                    paymentMethods[
                      ordenReceipt.paymentMethod?.toLowerCase() || ""
                    ]
                  }
                </Typography>
              </Grid>
              {/* Status  */}
              <Grid item xs={4} sm={4}>
                <Box sx={{ textAlign: "right" }}>
                  <Chip
                    label={ordenStatusTypes[ordenReceipt.status]}
                    sx={{
                      textTransform: "none",
                      backgroundColor: statusChip(theme, ordenReceipt.status),
                      color: theme.palette.common.white,
                      mb: { md: 0, xs: 1 },
                      fontWeight: theme.typography.fontWeightBold,
                    }}
                  />
                  {payMsg === "Pagado" ? (
                    <Chip
                      label={payMsg}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "success.main",
                        color: theme.palette.common.white,
                        mb: { md: 0, xs: 1 },
                        ml: { md: 1, xs: 0 },
                        fontWeight: theme.typography.fontWeightBold,
                      }}
                    />
                  ) : null}
                  <Button
                    aria-label="options"
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setOpenMenu(true);
                    }}
                    sx={{ ml: { md: 2, xs: 0 } }}
                  >
                    Opciones
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={7} sm={9}>
                {/* Cliente, direccion y fecha de entrega*/}
                <Grid container>
                  {/* Cliente */}
                  <Grid item xs={12} sm={6}>
                    <Typography
                      paragraph
                      variant="overline"
                      sx={{ color: "text.disabled", mb: theme.spacing(0) }}
                    >
                      Cliente
                    </Typography>
                    <Typography variant="body1">
                      <b>{ordenReceipt.restaurantBranch.businessName}</b>
                    </Typography>
                    {ordenReceipt.ordenType.toLowerCase() === "normal" ? (
                      <>
                        <Typography variant="body1" noWrap>
                          Suc. {ordenReceipt.restaurantBranch.branchName}
                        </Typography>
                        <Typography variant="body1">
                          {ordenReceipt.restaurantBranch.displayName}
                        </Typography>
                        {/* <Typography variant="body2">
                            Tel.{' '}
                            {ordenReceipt.restaurantBranch.phoneNumber ||
                              business.phoneNumber}
                          </Typography> */}
                      </>
                    ) : null}
                  </Grid>
                  {/* Direccion de entrega */}
                  <Grid item xs={12} sm={5}>
                    <Typography
                      paragraph
                      variant="overline"
                      sx={{
                        color: "text.disabled",
                        mb: theme.spacing(0),
                        mt: { xs: theme.spacing(1), md: theme.spacing(0) },
                      }}
                    >
                      Dirección{" "}
                      {ordenReceipt.deliveryType === "pickup"
                        ? "del Proveedor"
                        : "de Entrega"}
                    </Typography>

                    {ordenReceipt.deliveryType !== "pickup" && (
                      <Typography variant="body2">
                        {ordenReceipt.restaurantBranch.fullAddress}
                      </Typography>
                    )}
                    {ordenReceipt.deliveryType === "pickup" && (
                      <Typography variant="body2">
                        {ordenReceipt.supplier.displayName}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid container>
                  {/* Fecha de entrega */}
                  <Grid item xs={12} sm={4}>
                    <Typography
                      paragraph
                      variant="overline"
                      sx={{
                        color: "text.disabled",
                        mb: theme.spacing(0),
                        mt: theme.spacing(1),
                      }}
                    >
                      Fecha de Entrega
                    </Typography>
                    <Typography variant="subtitle2">
                      {fISODate(ordenReceipt.deliveryDate)}
                    </Typography>
                    <Typography variant="body2">
                      Entre ({ordenReceipt.deliveryTime}hrs)
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Proveedor  */}
              <Grid item xs={5} sm={3}>
                <Grid container sx={{ pl: theme.spacing(1) }}>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="overline"
                      paragraph
                      sx={{ color: "text.disabled", mb: theme.spacing(0) }}
                    >
                      Proveedor
                    </Typography>
                    <Typography variant="body1">
                      <b>{ordenReceipt.supplier.supplierName}</b>
                    </Typography>
                  </Grid>

                  {/* Tipo de Orden */}
                  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="overline"
                      paragraph
                      sx={{
                        color: "text.disabled",
                        mb: theme.spacing(0),
                        mt: theme.spacing(1),
                      }}
                    >
                      Tipo de Orden
                    </Typography>
                    <Box>
                      <Typography variant="subtitle2">
                        Orden de Compra (
                        {ordenReceipt.deliveryType === "pickup"
                          ? "Recoger en Almacén"
                          : "Entrega"}
                        )
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* comentarios de entrega */}
              <Grid item xs={12} sm={12} sx={{ mt: 1, mb: 3 }}>
                <Typography
                  variant="overline"
                  paragraph
                  sx={{
                    color: "text.disabled",
                    mb: theme.spacing(0),
                  }}
                >
                  Comentarios del Pedido
                </Typography>
                <Typography variant="body2">
                  {" "}
                  {ordenReceipt.comments ? ordenReceipt.comments : "-"}{" "}
                </Typography>
              </Grid>
            </Grid>

            {/* Product List */}
            <TableContainer sx={{ minWidth: 280 }}>
              <Table>
                <TableHead
                  sx={{
                    borderBottom: `solid 1px ${theme.palette.divider}`,
                    "& th": { backgroundColor: "transparent" },
                  }}
                >
                  <TableRow>
                    <TableCell
                      width={20}
                      sx={{ color: theme.palette.text.disabled }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: theme.palette.text.disabled }}
                    >
                      Producto
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: theme.palette.text.disabled }}
                    >
                      Cantidad
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: theme.palette.text.disabled }}
                    >
                      Precio
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ordenReceipt.cart.cartProducts.map((row, index) => (
                    <TableRow
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      sx={{
                        borderBottom: `solid 1px ${theme.palette.divider}`,
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="center" sx={{ maxWidth: 60 }}>
                        <Box>
                          <Typography variant="subtitle2" align="center">
                            {row.supplierProduct.productDescription}
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                              align="center"
                              noWrap
                            >
                              {Object.entries(UOMTypes).find(
                                (su) =>
                                  su[0] ===
                                  row.supplierProduct.sellUnit.toLowerCase()
                              )?.[1] || row.supplierProduct.sellUnit}
                            </Typography>
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {fQuantity(row.quantity)}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          {fCurrency(row.total)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fCurrency(row.price?.amount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Subtotal w/o tax */}
                  <SummaryRow
                    label="Subtotal (antes de Impuestos)"
                    value={ordenReceipt.subtotalWithoutTax}
                  />
                  {/* Impuestos */}
                  <SummaryRow label="Impuestos" value={ordenReceipt.tax} />
                  {/* Subtotal */}
                  <SummaryRow label="Subtotal" value={ordenReceipt.subtotal} />

                  {/* Optional summary items */}
                  {summaryItems
                    .filter((v) => v.value)
                    .map((item) => (
                      <SummaryRow
                        key={item.label}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  {/* Total */}
                  <SummaryRow
                    label="Total"
                    value={ordenReceipt.total}
                    sx={{
                      fontWeight: theme.typography.fontWeightBold,
                      fontSize: theme.typography.h6.fontSize,
                    }}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ) : null}
    </Box>
  );
}
