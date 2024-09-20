import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingProgress } from "ui";
import { CommerceForgotPassword, getSellerInfo } from "core";
import { commerceConfig } from "../../config";
import PATHS from "../../paths";

export const metadata: Metadata = {
  title: `¿Olvidaste tu contraseña? | ${commerceConfig.sellerName}`,
};

export default async function Page(): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(commerceConfig.apiUrl, commerceConfig.sellerId);
  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />}
    >
      <CommerceForgotPassword
        resetPasswordLink={`${sellerInfo.commerceConfig.baseUrl}${PATHS.auth.resetPassword}`}
        sellerName={sellerInfo.commerceConfig.sellerName}
      />
    </Suspense>
  );
}
