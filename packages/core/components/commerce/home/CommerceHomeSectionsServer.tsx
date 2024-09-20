import { Box, Button } from "ui";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import type { SupplierProductType } from "ui/domain";
import type { CommerceConfigType } from "../../../domain/commerce";
import {
  getProductDetails,
  getCatalog,
} from "../../../data/api";
import type { CatalogData } from "../../../domain/commerce/catalog";
import { CommerceCategoriesHighlight } from "./CommerceCategoriesHighlight";
import { CommerceRecommendedProducts } from "./CommerceRecommendedProducts";

// ------------------------------------------------------------

async function getCategoriesData(
  apiURL: string,
  sellerId: string,
  categs: string[],
  suppliertUnitId: string,
  token?: string,
  addressId?: string
): Promise<(CatalogData & { categName?: string })[]> {
  // Fetch categories data from API
  const categoryPromises = categs.map((categ) =>
    getCatalog(apiURL, sellerId, categ, suppliertUnitId, token, addressId, 1, 4)
  );
  const categories = await Promise.all(categoryPromises);

  return categories.map((categ, idx) => ({
    ...categ,
    categName: categs[idx],
  }));
}

async function getRecProductsData(
  apiURL: string,
  sellerId: string,
  prods: string[],
  suppliertUnitId: string,
  token?: string,
  addressId?: string
): Promise<SupplierProductType[]> {
  // Fetch rec prods data from API
  const prodsPromises = prods
    .filter((p) => p)
    .map((prod) =>
      getProductDetails(
        apiURL,
        sellerId,
        suppliertUnitId,
        prod,
        token,
        addressId
      )
    );
  const products = (await Promise.all(prodsPromises)).filter(
    (p) => p !== undefined
  ) as SupplierProductType[];
  return products;
}

// ------------------------------------------------------------

interface CommerceHomeSectionsProps {
  config: CommerceConfigType;
}

export async function CommerceHomeSections(
  props: CommerceHomeSectionsProps
): Promise<JSX.Element> {
  // get cookies
  const supUnitId = getCookie("supplierUnitId", { cookies });
  const token = getCookie("token", { cookies });
  const addressId = getCookie("defaultAddressId", { cookies });
  const { categories, products } = props.config.homeHighlights;
  const { currency, commerceDisplay, defaultSupplierUnitId } = props.config;

  const dataPromises = [];
  if (categories) {
    dataPromises.push(
      getCategoriesData(
        props.config.apiUrl,
        props.config.sellerId,
        categories,
        supUnitId || defaultSupplierUnitId,
        token,
        addressId
      )
    );
  }
  if (products) {
    dataPromises.push(
      getRecProductsData(
        props.config.apiUrl,
        props.config.sellerId,
        products,
        supUnitId || defaultSupplierUnitId,
        token,
        addressId
      )
    );
  }

  const [categData, prodsData] = await Promise.all(dataPromises);
  const allCategories =
    categData && categData.length > 0
      ? (categData[0] as CatalogData).categories
      : [];

  // fetch data
  return (
    <Box sx={{ mb: 6 }}>
      <CommerceCategoriesHighlight
        allCategories={allCategories}
        categories={categData as CatalogData[]}
        currency={currency}
        commerceDisplay={commerceDisplay}
        defaultIconPath={props.config.iconPath}
      />

      <CommerceRecommendedProducts
        products={prodsData as SupplierProductType[]}
        currency={currency}
        commerceDisplay={commerceDisplay}
        defaultIconPath={props.config.iconPath}
      />

      <Box sx={{ mt: 4, mb: 2, display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" color="primary" href="/catalog/list">
          Ver Todos los productos
        </Button>
      </Box>
    </Box>
  );
}
