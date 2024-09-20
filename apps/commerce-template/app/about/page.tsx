import type { Metadata } from "next";
import { CommerceAboutSeller, getSellerInfo } from "core";
import { Suspense } from "react";
import { LoadingProgress } from "ui";
import { commerceConfig } from "../config";

export const metadata: Metadata = {
  title: `Nosotros | ${commerceConfig.sellerName}`,
};

export default async function Page(): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );
  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 30, backgroundColor: "inherit" }} />}
      key=""
    >
      <CommerceAboutSeller
        sellerName={sellerInfo.commerceConfig.sellerName}
        seoDescription={sellerInfo.commerceMetadata.description || ""}
      />
    </Suspense>
  );
}
