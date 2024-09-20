"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Hidden,
  MobileFilterDrawer,
  ProductGrid,
  Typography,
} from "ui";
import Link from "next/link";
import type { SupplierProductType } from "ui/domain";
import { urlFormat } from "ui/utils";
import { useCart, useClientInfo } from "../../../providers/hooks";
import type {
  CatalogData,
  CategoryFilter,
} from "../../../domain/commerce/catalog";
import type { CommerceProductDisplay } from "../../..";

const MAX_PRODS_PER_CATEG = 4;
const BASE_CATEG_URL = "/catalog/list";
const BASE_DETAILS_URL = "/catalog/product/";

interface CommerceCategoriesProps {
  allCategories: CategoryFilter[];
  categories: (CatalogData & { categName?: string })[];
  currency: string;
  commerceDisplay: CommerceProductDisplay;
  defaultIconPath?: string;
}

export function CommerceCategoriesHighlight({
  allCategories,
  categories,
  currency,
  commerceDisplay,
  defaultIconPath
}: CommerceCategoriesProps): JSX.Element {
  const { cartDetails, addItem, removeItem, handleCartClick } = useCart();
  const { isAuthenticated } = useClientInfo();
  const [productsWithCart, setProductsWithCart] = useState<
    { key: string; products: (SupplierProductType & { inCart?: number })[] }[]
  >([]);

  const addItemWrapper = (product: SupplierProductType): void => {
    addItem(product);
    handleCartClick();
  };

  useEffect(() => {
    const cartItems = Object.values(cartDetails);
    const categsCp = [...categories];
    if (cartItems.length === 0) {
      // fill the dictionary with all the products from categories
      setProductsWithCart(
        categsCp.map((c) => ({
          key: c.categName || "",
          products: c.products,
        }))
      );
    } else {
      const newProdsWC: {
        key: string;
        products: (SupplierProductType & { inCart?: number })[];
      }[] = [];
      categsCp.forEach((c) => {
        const _prodsWC = c.products.map((product) => {
          const cartItem = cartItems.find((ci) => ci.id === product.id);
          if (cartItem) {
            return { ...product, inCart: cartItem.quantity };
          }
          return product;
        });
        newProdsWC.push({
          key: c.categName || "",
          products: _prodsWC,
        });
      });

      setProductsWithCart(newProdsWC);
    }
  }, [cartDetails, categories]);

  const showPrices = commerceDisplay === "open" || isAuthenticated;
  return (
    <>
      {/* Categories nav */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "left" },
          width: "100%",
          pl: 3,
          py: 1,
          mb: 2,
          backgroundColor: "secondary.light",
          color: "secondary.contrastText",
        }}
      >
        {/* Mobile category nav */}
        <MobileFilterDrawer
          navOptions={[
            {
              title: "Todos los productos",
              path: BASE_CATEG_URL,
            },
            ...allCategories,
          ]}
          currentCateg=""
          dialogTitleMsg="Categorías"
          btnMsg="Todas las Categorías"
          alignBtn="flex-start"
          withIcon={false}
          btnType="outlined"
          transitionStart="left"
        />

        <Hidden smDown>
          {/* Desktop category nav */}
          <Box>
            <Link href={BASE_CATEG_URL} passHref>
              <Button
                variant="text"
                color="primary"
                size="large"
                sx={{
                  ml: 2,
                }}
              >
                Todos los productos
              </Button>
            </Link>
            {categories.map((category) => {
              const categName = category.categName || "";
              const categUrl = `${BASE_CATEG_URL}?search=${urlFormat(
                categName,
                "+"
              )}`;
              return (
                <Link href={categUrl} passHref key={categName}>
                  <Button
                    variant="text"
                    color="primary"
                    size="large"
                    sx={{
                      ml: 2,
                    }}
                  >
                    {categName}
                  </Button>
                </Link>
              );
            })}
          </Box>
        </Hidden>
      </Box>

      {/* Main categories */}
      <Box sx={{ mt: 2, mx: { xs: 1, md: 32 } }}>
        {categories.map((category) => {
          const categName = category.categName || "";
          const categUrl = `${BASE_CATEG_URL}?search=${urlFormat(
            categName,
            "+"
          )}`;
          const prodsWCartDict = productsWithCart.find(
            (p) => p.key === categName
          );
          const prodsWCart = prodsWCartDict?.products || [];
          return (
            <Box key={categName} sx={{ mb: 3 }}>
              <Grid container>
                {/* Categ name and url */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" align="left" sx={{ mb: 1 }}>
                    {categName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Link href={categUrl} passHref>
                      <Button variant="text" color="info">
                        Ver todos &nbsp;{` >`}
                      </Button>
                    </Link>
                  </Box>
                </Grid>
                {/* products */}
                <Grid item xs={12} md={12}>
                  <ProductGrid
                    products={prodsWCart.slice(0, MAX_PRODS_PER_CATEG)}
                    productDetailsUrlBase={BASE_DETAILS_URL}
                    addToCart={addItemWrapper}
                    deleteFromCart={(p) => {
                      removeItem(p.id);
                    }}
                    showPrices={showPrices}
                    currency={currency}
                    defaultIconPath={defaultIconPath}
                  />
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
