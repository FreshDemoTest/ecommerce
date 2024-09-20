"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  DesktopFilterDrawer,
  Grid,
  Hidden,
  MobileFilterDrawer,
  Pagination,
  Paper,
  ProductGrid,
  Typography,
} from "ui";
import type { SupplierProductType } from "ui/domain";
import {
  useCart,
  useClientInfo,
  useSellerInfo,
} from "../../../providers/hooks";
import { generateDeliveryInfoStrip } from "../../../utils/generators";
import type { CategoryFilter } from "../../../domain/commerce/catalog";
import type { CommerceProductDisplay } from "../../..";

// ------------------------------------------------------------

const baseRedirectTo = "/catalog/list";
const loginRedirectTo = "/login";

interface CommerceCatalogListProps {
  commerceDisplay: CommerceProductDisplay;
  search: string;
  products: SupplierProductType[];
  categories: CategoryFilter[];
  totalResults: number;
  currentPage: number;
  pages: number;
  detailsUrlBase: string;
  currency: string;
  defaultIconPath?: string;
}

export function CommerceCatalogList({
  commerceDisplay,
  search,
  products,
  categories,
  totalResults,
  currentPage,
  pages,
  detailsUrlBase,
  currency,
  defaultIconPath
}: CommerceCatalogListProps): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { sellerUnits } = useSellerInfo();
  const { isAuthenticated } = useClientInfo();
  const { cartDetails, addItem, removeItem, handleCartClick } = useCart();
  const [productsWithCart, setProductsWithCart] = useState<
    (SupplierProductType & { inCart?: number })[]
  >([]);

  const addItemWrapper = (product: SupplierProductType): void => {
    addItem(product);
    handleCartClick();
  };

  useEffect(() => {
    const cartItems = Object.values(cartDetails);
    if (cartItems.length === 0) {
      setProductsWithCart([...products]);
    } else {
      const _prodsWC = products.map((product) => {
        const cartItem = cartItems.find((ci) => ci.id === product.id);
        if (cartItem) {
          return { ...product, inCart: cartItem.quantity };
        }
        return product;
      });
      setProductsWithCart(_prodsWC);
    }
  }, [cartDetails, products]);

  // if commerceDisplay is closed, and not logged in redirect to Login
  if (commerceDisplay === "closed" && !isAuthenticated) {
    redirect(loginRedirectTo);
  }
  const showPrices = commerceDisplay === "open" || isAuthenticated;

  // pagintaion
  function handleCatalogPagination(page: number): void {
    // fetch params
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${baseRedirectTo}?${params.toString()}`);
  }

  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Grid container>
          {/* Delivery info banner */}
          <Grid item xs={12} md={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                py: 1,
                mb: 2,
                pl: { xs: 2, md: 0 },
                backgroundColor: "secondary.light",
                color: "secondary.contrastText",
              }}
            >
              <Typography variant="subtitle2">
                {generateDeliveryInfoStrip(sellerUnits)}
              </Typography>
            </Box>
          </Grid>
          {/* Search string */}
          <Grid item xs={12} md={12}>
            <Grid container>
              <Grid item xs={0} md={3} />
              <Grid item xs={12} md={9}>
                {search ? (
                  <Box
                    sx={{
                      ml: 4,
                      display: { xs: "block", md: "flex" },
                      justifyContent: "left",
                    }}
                  >
                    <Typography variant="h6">
                      Búsqueda: {`"${search}"`}&nbsp;
                    </Typography>
                    <Typography variant="body1" sx={{ pt: 0.5 }}>
                      {` (${totalResults} resultados)`}{" "}
                    </Typography>
                  </Box>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        <Grid container>
          {/* Filters */}
          <Grid item xs={12} md={3} sx={{ mt: 2 }}>
            {/* Desktop */}
            <Hidden smDown>
              <Paper sx={{ ml: 2, pt: 2, px: 3, pb: 2, mr: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Categorías
                </Typography>
                <Box sx={{ pl: 3, overflowY: "scroll", height: "70vh" }}>
                  <DesktopFilterDrawer
                    navOptions={[
                      {
                        title: "Todos los productos",
                        path: baseRedirectTo,
                      },
                      ...categories,
                    ]}
                    currentCateg={searchParams.get("search") || ""}
                  />
                </Box>
              </Paper>
            </Hidden>
            {/* Mobile */}
            <Hidden mdUp>
              <MobileFilterDrawer
                navOptions={[
                  {
                    title: "Todos los productos",
                    path: baseRedirectTo,
                  },
                  ...categories,
                ]}
                currentCateg={searchParams.get("search") || ""}
                dialogTitleMsg="Categorías"
              />
            </Hidden>
          </Grid>
          {/* Product Grid */}
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: { xs: 2, md: 1 },
                mb: 2,
                px: { xs: 1, md: 8 },
              }}
            >
              <ProductGrid
                products={productsWithCart}
                productDetailsUrlBase={detailsUrlBase}
                addToCart={addItemWrapper}
                deleteFromCart={(p) => {
                  removeItem(p.id);
                }}
                showPrices={showPrices}
                currency={currency}
                defaultIconPath={defaultIconPath}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={0} md={1} />
      <Grid item xs={12} md={10}>
        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            mt: 1,
            mb: 2,
          }}
        >
          <Pagination
            count={pages}
            variant="outlined"
            color="standard"
            page={currentPage}
            onChange={(event, page) => {
              handleCatalogPagination(page);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
