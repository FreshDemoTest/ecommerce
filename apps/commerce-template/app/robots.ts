import type { MetadataRoute } from "next";
import { getSellerInfo } from "core";
import { commerceConfig } from "./config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const sellerInfo = await getSellerInfo(commerceConfig.apiUrl, commerceConfig.sellerId);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${sellerInfo.commerceConfig.baseUrl}/sitemap.xml`,
  };
}
