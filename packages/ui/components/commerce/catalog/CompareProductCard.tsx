"use client";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { fCurrency, generateCloudinaryVersion, urlFormat } from "../../../utils/helpers";
import { UOMTypes, type SupplierProductType } from "../../../domain";

// ------------------------------------------------------------

const IMAGE_CDN = "https://res.cloudinary.com/neutro-mx/image/upload/v1/";

const LOGO_ICON_DEFAULT = (
  process.env.NEXT_PUBLIC_SELLER_LOGO || "/logo.png"
).replace(".png", "_icon.png");

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
  paddingTop: "80%",
  position: "relative",
}));

// ------------------------------------------------------------

interface CompareProductCardProps {
  product: SupplierProductType & { supplierName?: string };
  productDetailsUrlBase: string;
  showPrices?: boolean;
  currency?: string;
}

export function CompareProductCard({
  product,
  productDetailsUrlBase,
  showPrices = true,
  currency = "MXN",
}: CompareProductCardProps): JSX.Element {
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
  const stockEnabled = Boolean(product.stock);
  const hasStock = (product.stock?.amount || 0) > 0;
  const hasValidity = Boolean(validUntil);
  const isValidDate = validUntil && validUntil >= new Date();
  const productAvailable =
    (stockEnabled && hasStock && hasValidity && isValidDate) ||
    (!stockEnabled && hasValidity && isValidDate) ||
    false;
  // unit
  const sUnit =
    Object.entries(UOMTypes).find(
      (s) => s[0].toUpperCase() === product.sellUnit.toUpperCase()
    )?.[1] || product.sellUnit;
  // product image
  const _img =
    product.images && product.images.length > 0
      ? `${IMAGE_CDN.replace("/v1/", generateCloudinaryVersion())}${product.images[0]}`
      : LOGO_ICON_DEFAULT;
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
          data-sizes="auto"
          src={cover.small}
          data-srcset={`${cover.small} 600w, ${cover.medium} 960w`}
          sx={{
            top: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />
      </StyledMediaCardWrap>
      <CardContent>
        <Box>
          <Link
            href={linkTo}
            target="_blank"
            style={{ color: theme.palette.info.main }}
          >
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
          {showPrices && !productAvailable ? (
            <Typography
              variant="body1"
              sx={{ mt: 1, color: "text.disabled" }}
              noWrap
            >
              (No disponible)
            </Typography>
          ) : null}
          {product.supplierName ? (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Por {sUnit}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                <b>{product.supplierName}</b>
              </Typography>
            </Box>
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
            <Link href={linkTo} target="_blank" passHref>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={!productAvailable}
              >
                Ver producto
              </Button>
            </Link>
          </Box>
        ) : null}
      </CardContent>
    </StyledCard>
  );
}
