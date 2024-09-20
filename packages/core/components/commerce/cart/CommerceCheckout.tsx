"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  CheckoutSummary,
  Grid,
  Paper,
  Snackbar,
  Typography,
} from "ui";
import { ProductSelector } from "ui/components/commerce/cart/ProductSelector";
import type { CartEntry, ShippingRule } from "../../../domain";
import {
  useCart,
  useClientInfo,
  useSellerInfo,
} from "../../../providers/hooks";
import { calculateShipping, isMinimumQtyReached } from "../../../utils";
import { newEcommerceOrden } from "../../../data/api";
import { CommerceDelivery } from "./CommerceDelivery";
import { CommercePayment } from "./CommercePayment";

const CHECKOUT_PRODUCTS_PATH = "/checkout?step=products";
const CHECKOUT_DELIVERY_PATH = "/checkout?step=delivery";
const CHECKOUT_PAYMENT_PATH = "/checkout?step=payment";
const ON_SUCCESS_REDIRECT = "/orden/";

// ----------------------------------

function CheckoutGrid({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <Grid item xs={0} md={1} />
      {/* Checkout */}
      <Grid item xs={12} md={7}>
        <Grid container>
          {/* Products */}
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

function SummaryGrid({
  shippingCost,
  children,
}: {
  shippingCost?: number;
  children: React.ReactNode;
}): JSX.Element {
  const { totalPrice: subtotalPrice, subtotalPriceWOTax, taxPrice } = useCart();
  const finalTotal = subtotalPrice + (shippingCost || 0);
  return (
    <Grid
      item
      xs={12}
      md={3}
      sx={{ pl: { xs: 1, md: 0 }, pr: { xs: 1, md: 8 }, mb: 4 }}
    >
      <CheckoutSummary
        subtotalWithoutTax={subtotalPriceWOTax}
        tax={taxPrice}
        subtotal={subtotalPrice}
        shippingCost={shippingCost}
        total={finalTotal}
        sx={{
          py: 3,
          px: 3,
        }}
      />
      {children}
    </Grid>
  );
}

interface CommerceCheckoutProps {
  defaultIconPath?: string;
}
// ----------------------------------
/**
 * Checkout Component for the Products section
 * @returns
 */
export function CommerceCheckout({
  defaultIconPath,
}: CommerceCheckoutProps): JSX.Element {
  const {
    cartDetails,
    changeCheckoutStep,
    decrementItem,
    incrementItem,
    removeItem,
    setItemQuantity,
  } = useCart();
  const { seller } = useSellerInfo();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  // const { products, setProducts } = useState<CartEntry[]>(Object.values(cartDetails));

  const products = Object.values(cartDetails);
  // iterate in cart products

  // min reach computation
  const minReached = isMinimumQtyReached(
    products,
    seller?.minQuantity || 1,
    seller?.minQuantityUnit || "pesos"
  );

  useEffect(() => {
    changeCheckoutStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container sx={{ minHeight: "70vh" }}>
        <CheckoutGrid>
          <Box sx={{ px: { xs: 1, md: 10 }, mb: { xs: 3, md: 6 } }}>
            <Paper sx={{ p: 2 }}>
              {/* products list */}
              {products.length > 0 ? (
                <ProductSelector
                  title="Tu Carrito"
                  products={products}
                  onDelete={(ce: CartEntry) => {
                    removeItem(ce.id!);
                  }}
                  onDecreaseQuantity={(ce: CartEntry) => {
                    const unitMultiple = ce.supplierProduct.unitMultiple || 1;
                    const minimumQuantity =
                      ce.supplierProduct.minimumQuantity || 1;
                    const maxQty =
                      ce.quantity <= minimumQuantity * (1 / unitMultiple);

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
                    const minimumQuantity =
                      ce.supplierProduct.minimumQuantity || 1;
                    const stockAmount = ce.supplierProduct.stock?.amount || 0;
                    const hasStock = stockAmount > 0;
                    const minQty =
                      ce.quantity > 0
                        ? 1
                        : minimumQuantity * (1 / unitMultiple);

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
                      const reachedStockOut =
                        qtyToAdd * unitMultiple > stockAmount;
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
                            Math.floor(stockAmount / unitMultiple) *
                            unitMultiple;
                          setItemQuantity(
                            ce.id!,
                            lastMultiple * (1 / unitMultiple)
                          );
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
                    const minimumQuantity =
                      ce.supplierProduct.minimumQuantity || 1;

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
                            Math.floor(stockAmount / unitMultiple) *
                            unitMultiple;
                          setItemQuantity(
                            ce.id!,
                            lastMultiple * (1 / unitMultiple)
                          );
                          // setChangeMaxQuantity(product.supplierProduct.id);
                        } else {
                          setItemQuantity(ce.id!, 0);
                          // setChangeMaxQuantity(product.supplierProduct.id);
                        }
                        // setItemQuantity(ce.id!, stockAmount);
                      }
                    }
                  }}
                  minReached={minReached}
                  maxHeight="100%"
                  defaultIconPath={defaultIconPath}
                />
              ) : null}

              {/* message no products */}
              {products.length === 0 ? (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 8,
                    }}
                  >
                    <Typography variant="h6">Carrito vacío</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, mb: 8 }}
                    align="center"
                  >
                    No has agregado productos a tu carrito.
                  </Typography>
                </Box>
              ) : null}
            </Paper>
            <Link href="/catalog/list" passHref>
              <Button
                variant="text"
                sx={{ mt: { xs: 1, md: 1 } }}
              >{`\u2190  Seguir comprando`}</Button>
            </Link>
          </Box>
        </CheckoutGrid>

        {/* Summary */}
        <SummaryGrid>
          {/* continue */}
          <Box sx={{ pt: 2, px: 0.5 }}>
            <Link href={minReached.flag ? CHECKOUT_DELIVERY_PATH : {}} passHref>
              {/* Cannot move forward if it doesn't meet the minimum quantity */}
              <Button fullWidth variant="contained" disabled={!minReached.flag}>
                {" "}
                Continuar
              </Button>
            </Link>
          </Box>
        </SummaryGrid>
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

/**
 * Checkout Component for the Delivery section (address, day of delivery)
 * @returns
 */
export function CommerceCheckoutDelivery(): JSX.Element {
  const {
    changeCheckoutStep,
    deliveryDate,
    deliveryTime,
    deliveryType,
    deliveryAddress,
    serviceAvailable,
  } = useCart();

  useEffect(() => {
    changeCheckoutStep(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render vars
  const addressSelected =
    (deliveryType === "delivery" && deliveryAddress) ||
    deliveryType === "pickup";
  // can continue if delivery date, time and type are set
  const canContinue =
    deliveryDate && deliveryTime && addressSelected && serviceAvailable;

  return (
    <Grid container sx={{ minHeight: "70vh" }}>
      <CheckoutGrid>
        <CommerceDelivery />
      </CheckoutGrid>

      {/* Summary */}
      <SummaryGrid>
        {/* message no products */}
        {!serviceAvailable ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Alert severity="error">
                <b>Servicio No disponible</b> <br />
                Por el momento no tenemos servicio en tu zona.
              </Alert>
            </Box>
          </Box>
        ) : null}
        {/* continue */}
        <Box sx={{ pt: 2, px: 0.5 }}>
          <Link href={canContinue ? CHECKOUT_PAYMENT_PATH : {}} passHref>
            {/* Disabled - if cannot continue */}
            <Button fullWidth variant="contained" disabled={!canContinue}>
              {" "}
              Continuar
            </Button>
          </Link>
          <Link href={CHECKOUT_PRODUCTS_PATH} passHref>
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} color="info">
              {" "}
              Regresar
            </Button>
          </Link>
        </Box>
      </SummaryGrid>
    </Grid>
  );
}

interface CommerceCheckoutPaymentProps {
  shipping: {
    enabled: boolean;
    rule: ShippingRule;
  };
}

/**
 * Checkout Component for the Payment section
 * @returns
 */
export function CommerceCheckoutPayment({
  shipping,
}: CommerceCheckoutPaymentProps): JSX.Element {
  const {
    cartDetails,
    changeCheckoutStep,
    deliveryDate,
    deliveryTime,
    deliveryType,
    deliveryAddress,
    serviceAvailable,
    paymentMethod,
    comments,
    clearCart,
  } = useCart();
  const { apiURL, sellerId, token } = useClientInfo();
  const { seller, assignedUnit } = useSellerInfo();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [ordenSubmitted, setOrdenSubmitted] = useState<{
    status: boolean;
    id?: string;
  }>({ status: false });

  useEffect(() => {
    changeCheckoutStep(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render vars
  const addressSelected =
    (deliveryType === "delivery" && deliveryAddress) ||
    deliveryType === "pickup";
  const products = Object.values(cartDetails);
  // min reach computation
  const minReached = isMinimumQtyReached(
    products,
    seller?.minQuantity || 1,
    seller?.minQuantityUnit || "pesos"
  );
  const shippingCheck = calculateShipping(
    products,
    shipping.enabled,
    shipping.rule,
    seller?.minQuantity || 1,
    seller?.minQuantityUnit || "pesos"
  );
  // can continue if delivery date, time, address, service is avail, paymethod & minQ is reached
  const canContinue =
    deliveryDate &&
    deliveryTime &&
    addressSelected &&
    serviceAvailable &&
    paymentMethod &&
    shippingCheck.flag &&
    minReached.flag;

  // handlers
  const handleNewOrden = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      if (
        !token ||
        !deliveryAddress ||
        !assignedUnit ||
        !deliveryDate ||
        !deliveryTime ||
        !paymentMethod
      ) {
        setFeedbackMsg("Faltan datos para crear el pedido");
        setIsSubmitting(false);
        return;
      }
      const orden = await newEcommerceOrden(
        apiURL,
        sellerId || "",
        token,
        cartDetails,
        deliveryAddress.id!,
        assignedUnit.id!,
        deliveryDate,
        deliveryTime,
        deliveryType,
        paymentMethod,
        comments,
        shippingCheck.cost
      );
      if (!orden.id) throw new Error("Error al crear el pedido");
      // clear cart
      clearCart();
      setIsSubmitting(false);
      setOrdenSubmitted({
        ...ordenSubmitted,
        status: true,
        id: orden.id,
      });
    } catch (error) {
      setFeedbackMsg("Error al crear el pedido");
      setIsSubmitting(false);
    }
  };

  if (ordenSubmitted.status) {
    // redirect to order detail
    redirect(`${ON_SUCCESS_REDIRECT}${ordenSubmitted.id}`);
  }

  return (
    <Grid container sx={{ minHeight: "70vh" }}>
      {/* Feedback msg */}
      <Snackbar
        open={feedbackMsg !== null}
        autoHideDuration={4000}
        onClose={() => {
          setFeedbackMsg(null);
        }}
      >
        <Alert severity="warning">{feedbackMsg}</Alert>
      </Snackbar>

      <CheckoutGrid>
        <CommercePayment />
      </CheckoutGrid>

      {/* Summary */}
      <SummaryGrid shippingCost={shippingCheck.cost}>
        {/* message not enough min */}
        {!minReached.flag ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Alert severity="error" sx={{ width: "100%" }}>
                Tu pedido no llega al mínimo: <br /> {minReached.amountStr}
              </Alert>
            </Box>
          </Box>
        ) : null}
        {/* message when shipping cost is not 0 */}
        {shippingCheck.cost > 0 ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Alert severity="info" sx={{ width: "100%" }}>
                Te falta <b>{shippingCheck.amountStr}</b> para que tu envío sea
                gratis.
              </Alert>
            </Box>
          </Box>
        ) : null}
        {/* message not avail */}
        {!serviceAvailable ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Alert severity="error">
                <b>Servicio No disponible</b> <br />
                Por el momento no tenemos servicio en tu zona.
              </Alert>
            </Box>
          </Box>
        ) : null}
        {/* continue */}
        <Box sx={{ pt: 2, px: 0.5 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={!canContinue || isSubmitting}
            onClick={() => {
              void handleNewOrden();
            }}
          >
            {" "}
            {!isSubmitting ? "Crear Pedido" : "Creando Pedido..."}
          </Button>
          <Link href={CHECKOUT_DELIVERY_PATH} passHref>
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} color="info">
              {" "}
              Regresar
            </Button>
          </Link>
        </Box>
      </SummaryGrid>
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
    </Grid>
  );
}
