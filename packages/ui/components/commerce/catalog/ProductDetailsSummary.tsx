import Link from "next/link";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
  Chip,
  // Hidden,
} from "@mui/material";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { UOMTypes, type SupplierProductType } from "../../../domain";
import { fCurrency } from "../../../utils";
import { Incrementer } from "./Incrementer";

// ----------------------------------------------------------------------

const loginRedirect = "/login";

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

const computeTotal = (prod: SupplierProductType, quantity: number): number => {
  return (prod.price?.amount || 0) * quantity * (prod.unitMultiple || 1);
};

// ----------------------------------------------------------------------

interface ProductDetailsSummaryProps {
  inCart?: number;
  product: SupplierProductType;
  currency: string;
  addToCart: () => void;
  removeFromCart: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  setQuantity: (v: number) => void;
  checkoutUrl: string;
  showPrices: boolean;
  showMinQuantity: boolean;
}

export function ProductDetailsSummary({
  inCart,
  product,
  currency,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  checkoutUrl,
  showPrices,
  showMinQuantity,
}: ProductDetailsSummaryProps): JSX.Element {
  const theme = useTheme();
  const validUntil =
    typeof product.price?.validUntil === "string"
      ? new Date(product.price.validUntil)
      : product.price?.validUntil;
  // product availability
  // - if stock is undefined, return validUntil? > now
  // - else verify if there is stock and validUntil? > now
  const stockEnabled = product.stock
    ? product.stock.active && !product.stock.keepSellingWithoutStock
    : false;
  const stockAmount = product.stock?.amount || 0;
  const hasStock = stockAmount > 0;
  const hasValidity = Boolean(validUntil);
  const isValidDate = validUntil && validUntil >= new Date();
  const productAvailable =
    (stockEnabled && hasStock && hasValidity && isValidDate) ||
    (!stockEnabled && hasValidity && isValidDate) ||
    false;
  const amountInCart = (inCart || 0) + product.minimumQuantity * (product.unitMultiple || 1);
  const reachedStockOut =
    stockEnabled && hasStock && amountInCart > stockAmount;
  // unit
  const sUnit =
    Object.entries(UOMTypes).find(
      (s) => s[0].toUpperCase() === product.sellUnit.toUpperCase()
    )?.[1] || product.sellUnit;

  //   const price = product.price?.amount || 0;
  //   const priceSale = undefined;

  return (
    <RootStyle>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Chip
          variant="filled"
          label={productAvailable ? "Disponible" : "No disponible"}
          color={productAvailable ? "success" : "error"}
          sx={{ textTransform: "uppercase" }}
        />
      </Box>

      <Typography
        component="h1"
        sx={{ fontSize: theme.typography.h1.fontSize }}
      >
        {product.productDescription}
      </Typography>

      <Box sx={{ display: "flex" }}>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          {sUnit}
        </Typography>
        {showMinQuantity ? (
          <Typography variant="body1" sx={{ ml: 8, color: "text.secondary" }}>
            (Min. {product.minimumQuantity} {sUnit}s)
          </Typography>
        ) : null}
      </Box>
      {/* [TODO] Discounted price */}
      {/* {priceSale ? (
        <Typography
          variant="overline"
          sx={{
            mt: 2,
            mb: 1,
            display: "block",
            color: "error.main",
          }}
        >
          {`${fPercent((100 * (price - priceSale)) / price)} de Descuento`}
        </Typography>
      ) : null} */}

      {showPrices ? (
        <Typography variant="h4" sx={{ mt: 1 }}>
          {/* <Box
          component="span"
          sx={{ color: "text.disabled", textDecoration: "line-through" }}
        >
          {priceSale ? fCurrency(priceSale) : null}
        </Box> */}
          &nbsp;{fCurrency(product.price?.amount)} {currency}
        </Typography>
      ) : null}

      <Divider sx={{ mt: 3, borderStyle: "dashed" }} />

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          {showPrices && !productAvailable ? (
            <Typography
              variant="body1"
              sx={{ mt: 1, color: "text.disabled" }}
              noWrap
            >
              (No disponible)
            </Typography>
          ) : null}
        </div>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
        {showPrices && inCart && inCart > 0 ? (
          <>
            <Incrementer
              product={{
                id: product.id,
                supplierProduct: product,
                quantity: inCart,
                total: computeTotal(product, inCart),
              }}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onQuantityChange={setQuantity}
              onDelete={removeFromCart}
            />
            <Link href={checkoutUrl} passHref style={{ marginRight: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                color="info"
                size="medium"
                sx={{ height: "5vh" }}
                startIcon={<ShoppingCart />}
              >
                Continuar Compra
              </Button>
            </Link>
          </>
        ) : null}
        {/* add to cart */}
        {showPrices && (!inCart || inCart === 0) ? (
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ mt: 2, width: "100%", height: "5vh" }}
            onClick={addToCart}
            disabled={!productAvailable || reachedStockOut}
          >
            Agregar
          </Button>
        ) : null}
        {/* redirect to login if not authenticated */}
        {!showPrices ? (
          <Link href={loginRedirect} passHref style={{ width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="medium"
              sx={{ mt: 2, width: "100%", height: "5vh" }}
            >
              Agregar
            </Button>
          </Link>
        ) : null}
      </Stack>

      <Stack direction="column" justifyContent="space-between" sx={{ my: 3 }}>
        <Divider sx={{ mb: 3, borderStyle: "dashed" }} />
        <div
          dangerouslySetInnerHTML={{ __html: product.longDescription || "" }}
        />
      </Stack>
    </RootStyle>
  );
}
