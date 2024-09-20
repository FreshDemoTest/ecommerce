import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingProgress } from "ui";
import { CommerceSignUp, getSellerInfo } from "core";
import { commerceConfig } from "../../config";
import PATHS from "../../paths";

export const metadata: Metadata = {
  title: `Registro | ${commerceConfig.sellerName}`,
};

export default async function Page(): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );
  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />}
    >
      <CommerceSignUp
        commerceUrl={sellerInfo.commerceConfig.baseUrl}
        loginLink={PATHS.auth.login}
        privacyLink={PATHS.home.privacy}
        sellerName={sellerInfo.commerceConfig.sellerName}
        tycLink={PATHS.home.tyc}
      />
    </Suspense>
  );
}
