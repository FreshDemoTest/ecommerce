import type { EnvCommerceConfigType } from "core";

console.log(process.env)
const graphQLAPIUrl: string =
  process.env.NEXT_PUBLIC_GQLAPI_ENV === "production"
    ? "https://gql-standalone.onrender.com/graphql"
    // : "https://gqlapi.stg.alima.la/graphql";
:"http://localhost:8004/graphql";

export const commerceConfig: EnvCommerceConfigType = {
  apiUrl: graphQLAPIUrl,
  sellerId: process.env.NEXT_PUBLIC_SELLER_ID || "sellerId",
  defaultSupplierUnitId: process.env.NEXT_PUBLIC_SUNIT_ID || "supplierUnitId",
  sellerName: process.env.NEXT_PUBLIC_SELLER_NAME || "Seller Name",
  googleTagManagerKey: process.env.NEXT_PUBLIC_GTM_KEY,
};

export const appVersion = "1.0.1";
