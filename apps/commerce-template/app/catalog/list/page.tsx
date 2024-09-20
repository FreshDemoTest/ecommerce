import { type Metadata } from "next";
import { Suspense } from "react";
import { CommerceCatalogListServer, getSellerInfo } from "core";
import { LoadingProgress } from "ui";
import { commerceConfig } from "../../config";
import PATHS from "../../paths";

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: `Catálogo | ${commerceConfig.sellerName}`,
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { search: string; page: number; size?: number };
}): Promise<JSX.Element> {
  const query = searchParams?.search || "";
  const currPage = Number(searchParams?.page || 1);
  const pgSize = Number(searchParams?.size || PAGE_SIZE);

  const prodDetsUrlBase = `${PATHS.catalog.product.replace(":id", "")}`;
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );

  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 4 }} />}
      key={query + currPage}
    >
      <CommerceCatalogListServer
        config={sellerInfo.commerceConfig}
        currentPage={currPage}
        detailsUrlBase={prodDetsUrlBase}
        pageSize={pgSize}
        query={query}
      />
    </Suspense>
  );
}
