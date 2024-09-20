import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingProgress } from "ui";
import { CommerceResetPassword, getSellerInfo } from "core";
import { commerceConfig } from "../../config";

export const metadata: Metadata = {
  title: `Reestablece Contraseña | ${commerceConfig.sellerName}`,
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { restore_token?: string };
}): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );
  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 6, backgroundColor: "inherit" }} />}
    >
      <CommerceResetPassword
        resetToken={searchParams?.restore_token}
        sellerName={sellerInfo.commerceConfig.sellerName}
      />
    </Suspense>
  );
}
