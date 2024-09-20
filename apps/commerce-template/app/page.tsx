import { Suspense } from "react";
import { CommerceHomeBanner, CommerceHomeSections, getSellerInfo } from "core";
import { Box, LoadingProgress } from "ui";
import { commerceConfig } from "./config";
import PATHS from "./paths";

export default async function Page(): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );
  return (
    <Box>
      {/* banner */}
      <CommerceHomeBanner
        bannerSrc={
          sellerInfo.commerceConfig.bannerPath || { path: "/assets/banner.png" }
        }
        commerceDisplay={sellerInfo.commerceConfig.commerceDisplay}
        loginLink={PATHS.auth.login}
      />
      {/* categories & products */}
      <Suspense
        fallback={
          <LoadingProgress sx={{ my: 30, backgroundColor: "inherit" }} />
        }
        key="home"
      >
        <CommerceHomeSections config={sellerInfo.commerceConfig} />
      </Suspense>
    </Box>
  );
}
