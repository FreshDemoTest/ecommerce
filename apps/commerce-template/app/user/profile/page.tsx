import type { Metadata } from "next";
import { Suspense } from "react";
import { CommerceProfile, getSellerInfo} from "core";
import { LoadingProgress } from "ui";
import PATHS from "../../paths";
import { commerceConfig } from "../../config";

export const metadata: Metadata = {
  title: `Mi Perfil | ${commerceConfig.sellerName}`,
};

export default async function Page(): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(commerceConfig.apiUrl, commerceConfig.sellerId);
  if (!sellerInfo.commerceConfig.baseUrl) {
    // redirect to 500 
    // redirect(PATHS.error.internalServerError, commerceConfig.apiUrl );
    return <LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />;
  }
  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />}
    >
      <CommerceProfile
        loginLink={PATHS.auth.login}
        sellerName={commerceConfig.sellerName}
      />
    </Suspense>
  );
}
