import type { SupplierProductType } from "ui/domain";
import { urlFormat } from "ui/utils/helpers";
import type { CatalogData } from "../../../domain/commerce/catalog";
import { ErrorCodes, logErrorMap } from "../../../error";
import {
  type GQLError,
  buildAuthHeaders,
  graphQLFetch,
} from "../../../utils/graphql";
import {
  type EcommerceSellerCatalog,
  getCatalogQry,
  getProductDetailsQry,
} from "./queries";

const GENERIC_CATALOG_ERROR = "CATALOG_NOT_AVAILABLE";

const timeoutResponse: { data: EcommerceSellerCatalog; error: GQLError } = {
  data:
    {
      supplierUnitId: "",
      restaurantBranchId: "",
      catalogType: "",
      products: [],
      categories: [],
      totalResults: 0,

    } as EcommerceSellerCatalog,
  error: {},
};

const timeoutPromise = (ms: number) =>
  new Promise<{ data: EcommerceSellerCatalog; error: GQLError }>((resolve) =>
    setTimeout(() => resolve(timeoutResponse), ms)
  );

export async function getCatalog(
  apiURL: string,
  sellerId: string,
  search: string,
  supplierUnitId: string,
  token?: string,
  restaurantBranchId?: string,
  page = 1,
  limit = 50
): Promise<CatalogData> {
  try {
    const paramVars: {
      secretKey: string;
      unitId: string;
      page: number;
      pageSize: number;
      search?: string;
      branchId?: string;
    } = {
      secretKey: sellerId,
      unitId: supplierUnitId,
      page,
      pageSize: limit,
    };
    if (search) {
      paramVars.search = search;
    }
    if (restaurantBranchId) {
      paramVars.branchId = restaurantBranchId;
    }
    // add authorization aut
    const headrs = token ? buildAuthHeaders(sellerId, token) : {};
    const dataPromise = graphQLFetch({
      graphQLEndpoint: apiURL,
      query: getCatalogQry,
      queryName: "getEcommerceSellerCatalog",
      variables: paramVars,
      headers: headrs,
      cache: "no-store", //TOREV VIZ
    })
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: EcommerceSellerCatalog;
      error: GQLError;
    } = await Promise.race([dataPromise, timeoutPromise(20000)]); // Race between fetch and timeout
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_CATALOG_ERROR]
      );
    }
    const filtData: SupplierProductType[] = [...data.products];
    const catgs = [...data.categories];

    return {
      products: filtData,
      totalResults: data.totalResults,
      categories: catgs.map((c) => ({
        title: c,
        path: `/catalog/list?search=${urlFormat(c, "+")}`,
      })),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Catalog error", error);
    return {
      products: [],
      totalResults: 0,
      categories: [],
    };
  }
}

export async function getProductDetails(
  apiURL: string,
  sellerId: string,
  supplierUnitId: string,
  supplierProductId: string,
  token?: string,
  restaurantBranchId?: string
): Promise<SupplierProductType | undefined> {
  try {
    const paramVars: {
      secretKey: string;
      unitId: string;
      prodId: string;
      branchId?: string;
    } = {
      secretKey: sellerId,
      unitId: supplierUnitId,
      prodId: supplierProductId,
    };
    if (restaurantBranchId) {
      paramVars.branchId = restaurantBranchId;
    }
    if (supplierProductId === "" || supplierProductId === " ") {
      throw new Error(logErrorMap.SUPPLIER_PRODUCT_ID_IS_EMPTY);
    }
    // add authorization aut
    const headrs = token ? buildAuthHeaders(sellerId, token) : {};
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: EcommerceSellerCatalog;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: getProductDetailsQry,
      queryName: "getEcommerceSellerProductDetails",
      variables: paramVars,
      headers: headrs,
      cache: "no-store",
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_CATALOG_ERROR]
      );
    }
    const filtData: SupplierProductType[] = [...data.products];
    if (filtData.length > 0) {
      return filtData[0];
    }
    return undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Product details error", error);
    return undefined;
  }
}
