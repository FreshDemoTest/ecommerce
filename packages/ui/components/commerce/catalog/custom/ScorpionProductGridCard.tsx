"use client";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Hidden,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import TrashIcon from "@mui/icons-material/Delete";
import { fCurrency, generateCloudinaryVersion, urlFormat } from "../../../../utils/helpers";
import {
  IntegerUOMTypes,
  UOMTypes,
  type SupplierProductType,
} from "../../../../domain";
import { PreviewQuantity } from "../PreviewQuantity";

// ------------------------------------------------------------

const IMAGE_CDN = "https://res.cloudinary.com/neutro-mx/q_auto,w_360/v1/";

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  minHeight: "180px",
  cursor: "pointer",
  [theme.breakpoints.up("sm")]: {
    minHeight: "180px",
  },
  zIndex: 1,
}));

const StyledMediaCardWrap = styled("div")(() => ({
  paddingTop: "100%",
  position: "relative",
}));

// ------------------------------------------------------------

interface ProductGridCardProps {
  product: SupplierProductType & { inCart?: number };
  productDetailsUrlBase: string;
  addToCart: () => void;
  deleteFromCart: () => void;
  showPrices?: boolean;
  currency?: string;
  defaultIconPath?: string;
}

export function ScorpionProductGridCard({
  product,
  productDetailsUrlBase,
  addToCart,
  deleteFromCart,
  showPrices = true,
  currency = "MXN",
  defaultIconPath,
}: ProductGridCardProps): JSX.Element {
  const theme = useTheme();
  // generate link
  const linkTo = `${productDetailsUrlBase}${urlFormat(
    product.productDescription
  )}_${product.id}`;
  // price valid until
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
  const amountInCart = (product.inCart || 0) * (product.unitMultiple || 1);
  const reachedStockOut =
    stockEnabled &&
    hasStock &&
    amountInCart + product.minimumQuantity > stockAmount;

  // unit [TODO FERNANDO: change this to use the new UOMTypes enum]
  const sUnit =
    Object.entries(UOMTypes).find(
      (s) => s[0].toUpperCase() === product.sellUnit.toUpperCase()
    )?.[1] || product.sellUnit;
  // product image
  const _img =
    product.images && product.images.length > 0
      ? `${IMAGE_CDN.replace("/v1/", generateCloudinaryVersion())}${product.images[0]}`
      : defaultIconPath || "";
  const cover = {
    small: _img,
    medium: _img,
  };
  // price
  const price = product.price?.amount;
  const priceWODiscount = product.price?.amount; // [TODO] change into actual price without discount
  const descriptionLineHeight = (): string => {
    try {
      if (typeof theme.typography.subtitle1.lineHeight === "string") {
        return `${parseFloat(theme.typography.subtitle1.lineHeight) * 2}em`;
      } else if (typeof theme.typography.subtitle1.lineHeight === "number") {
        return `${theme.typography.subtitle1.lineHeight * 2}em`;
      }
      return "3em";
    } catch (e) {
      return "3em";
    }
  };

  return (
    <StyledCard>
      <StyledMediaCardWrap>
        <CardMedia
          component="img"
          title={product.productDescription}
          data-src={cover.small}
          alt={product.productDescription}
          src={cover.small}
          data-srcset={`${cover.small} 600w, ${cover.medium} 600w`}
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </StyledMediaCardWrap>
      {showPrices ? (
        <PreviewQuantity
          quants={amountInCart}
          integerQuant={IntegerUOMTypes.includes(product.sellUnit)}
          unit={sUnit}
          sx={{
            opacity: "90%",
            position: "absolute",
            zIndex: 0,
            top: 10,
            right: 10,
          }}
          unitMultiple={product.unitMultiple}
        />
      ) : null}
      <CardContent>
        <Box>
          <Link href={linkTo} style={{ color: theme.palette.info.main }}>
            <Typography
              variant="subtitle1"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: theme.typography.subtitle1.lineHeight,
                height: descriptionLineHeight(),
              }}
            >
              {product.productDescription}
            </Typography>
          </Link>
          <Hidden mdUp>
            {/* Mobile */}
            <Box>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {sUnit}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                (Min. {product.minimumQuantity} {sUnit}s)
              </Typography>
            </Box>
          </Hidden>
          <Hidden mdDown>
            {/* Desktop */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {sUnit}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                (Min. {product.minimumQuantity} {sUnit}s)
              </Typography>
            </Box>
          </Hidden>
          {showPrices &&
          (!productAvailable || (reachedStockOut && amountInCart === 0)) ? (
            <Typography
              variant="body1"
              sx={{ mt: 1, color: "text.disabled" }}
              noWrap
            >
              (No disponible)
            </Typography>
          ) : null}
        </Box>

        {showPrices && price && price > 0 && productAvailable ? (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography color="textPrimary" variant="subtitle1">
              {priceWODiscount && price / priceWODiscount < 0.99 ? (
                <>
                  <Box
                    component="span"
                    sx={{
                      typography: "body2",
                      color: "text.disabled",
                      textDecoration: "line-through",
                      fontSize: "80%",
                    }}
                  >
                    {`fCurrency(priceWODiscount) ${currency}`}
                  </Box>
                  &nbsp;&nbsp;&nbsp;
                  <br />
                </>
              ) : null}
              {fCurrency(price)}&nbsp;{currency}
            </Typography>
          </Box>
        ) : null}
        {/* action buttons */}
        {showPrices ? (
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Hidden mdUp>
              {/* Mobile */}
              <Button
                aria-label="delete"
                variant="text"
                color="info"
                onClick={deleteFromCart}
                sx={{
                  mt: 2,
                  mr: 0,
                  p: 0,
                  minWidth: "auto",
                  visibility:
                    (product.inCart || 0) === 0 ? "hidden" : "visible",
                }}
                startIcon={<TrashIcon />}
              />
            </Hidden>
            <Hidden mdDown>
              {/* Desktop */}
              <Button
                aria-label="delete"
                variant="text"
                size="small"
                color="info"
                onClick={deleteFromCart}
                sx={{
                  mt: 2,
                  mr: 2,
                  visibility:
                    (product.inCart || 0) === 0 ? "hidden" : "visible",
                }}
                startIcon={<TrashIcon />}
              >
                Eliminar
              </Button>
            </Hidden>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, px: { md: 1, xs: 2 } }}
              onClick={addToCart}
              disabled={!productAvailable || reachedStockOut}
            >
              {(product.inCart || 0) === 0 ? ` Agregar ` : ` Agregar más `}
            </Button>
          </Box>
        ) : null}
      </CardContent>
    </StyledCard>
  );
}
