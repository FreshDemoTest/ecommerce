"use server";

import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { type CommerceConfigType } from "../../..";
import { getCatalog } from "../../../data/api";
import type { CatalogData } from "../../../domain/commerce/catalog";
import { CommerceCatalogList } from "./CommerceCatalogList";

// ------------------------------------------------------------

async function getData(
  apiURL: string,
  sellerId: string,
  search: string,
  page: number,
  size: number,
  suppliertUnitId: string,
  token?: string,
  addressId?: string
): Promise<CatalogData> {
  if (!suppliertUnitId) {
    return {
      products: [],
      totalResults: 0,
      categories: [],
    };
  }
  // Fetch product data from API
  const { products, totalResults, categories } = await getCatalog(
    apiURL,
    sellerId,
    search,
    suppliertUnitId,
    token,
    addressId,
    page,
    size
  );
  // [TODO] add total results from endpoint
  return {
    products,
    totalResults,
    categories,
  };
}

// ------------------------------------------------------------

interface CommerceCatalogListServerProps {
  config: CommerceConfigType;
  detailsUrlBase: string;
  query: string;
  currentPage: number;
  pageSize: number;
}

export async function CommerceCatalogListServer({
  config,
  detailsUrlBase,
  query,
  currentPage,
  pageSize,
}: CommerceCatalogListServerProps): Promise<JSX.Element> {
  // get cookies
  const supUnitId = getCookie("supplierUnitId", { cookies });
  const token = getCookie("token", { cookies });
  const addressId = getCookie("defaultAddressId", { cookies });
  // call API
  const { products, totalResults, categories } = await getData(
    config.apiUrl,
    config.sellerId,
    query,
    currentPage,
    pageSize,
    supUnitId || config.defaultSupplierUnitId,
    token,
    addressId
  );

  return (
    <CommerceCatalogList
      commerceDisplay={config.commerceDisplay}
      search={query}
      products={products}
      categories={categories}
      totalResults={totalResults}
      pages={Math.ceil(totalResults / pageSize)}
      currentPage={currentPage}
      detailsUrlBase={detailsUrlBase}
      currency={config.currency}
      defaultIconPath={config.iconPath}
    />
  );
}
