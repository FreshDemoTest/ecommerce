import { getCatalog, getSellerInfo } from "core";
import { urlFormat } from "ui/utils";
import { type MetadataRoute } from "next";
import { commerceConfig } from "./config";
import PATHS from "./paths";

const MAX_CATALOG_SIZE = 50000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sellerInfo = await getSellerInfo(commerceConfig.apiUrl, commerceConfig.sellerId);
  const { baseUrl, apiUrl, sellerId, defaultSupplierUnitId } = sellerInfo.commerceConfig;
  const { products, categories } = await getCatalog(
    apiUrl,
    sellerId,
    "",
    defaultSupplierUnitId,
    undefined,
    undefined,
    1,
    MAX_CATALOG_SIZE
  );

  const categUrls: MetadataRoute.Sitemap =
  sellerInfo.commerceConfig.commerceDisplay !== "closed"
      ? categories.map((c) => {
          return {
            url: `${baseUrl}${c.path}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
          };
        })
      : [];

  const prodUrls: MetadataRoute.Sitemap =
  sellerInfo.commerceConfig.commerceDisplay !== "closed"
      ? products.map((p) => {
          const prodSlug = `${urlFormat(p.productDescription)}_${p.id}`;
          return {
            url: `${baseUrl}${PATHS.catalog.product.replace(":id", prodSlug)}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          };
        })
      : [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}${PATHS.home.about}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}${PATHS.home.tyc}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}${PATHS.home.privacy}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...categUrls,
    ...prodUrls,
  ];
}
