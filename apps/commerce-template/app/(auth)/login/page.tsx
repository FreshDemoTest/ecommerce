import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingProgress } from "ui";
import { CommerceLogin, getSellerInfo } from "core";
import { commerceConfig } from "../../config";
import PATHS from "../../paths";

export const metadata: Metadata = {
  title: `Inicio de Sesión | ${commerceConfig.sellerName}`,
};

export default async function Page(): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(commerceConfig.apiUrl, commerceConfig.sellerId);
  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />}
    >
      <CommerceLogin
        forgotPasswordLink={PATHS.auth.forgotPassword}
        registerLink={PATHS.auth.signup}
        sellerName={sellerInfo.commerceConfig.sellerName}
      />
    </Suspense>
  );
}
