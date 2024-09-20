import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { LoadingProgress, ThemeRegistry } from "ui";
import {
  CommerceDisabled,
  CommerceTopNavBarLayout,
  CoreModals,
  CoreProviders,
  SessionWatch,
  getSellerInfo,
} from "core";
import { CommerceFooterLayout } from "core/components/layout/CommerceLayout";
import { Suspense } from "react";
import { theme } from "./theme";
import { commerceConfig } from "./config";
import PATHS from "./paths";

export async function generateMetadata(): Promise<Metadata> {
  // read route params
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );
  return sellerInfo.commerceMetadata;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );

  // if disabled redirect to Disabled page
  if (!sellerInfo.commerceConfig.activeAccount) {
    return (
      <html lang="es">
        <body>
          <Suspense
            fallback={
              <LoadingProgress sx={{ my: 10, backgroundColor: "inherit" }} />
            }
            key="disabled"
          >
            <ThemeRegistry
              stylesJson={sellerInfo.commerceConfig.stylesJSON}
              theme={theme}
            >
              <CommerceDisabled
                apiURL={commerceConfig.apiUrl}
                logoSrc={sellerInfo.commerceConfig.logoPath}
                reactivatedLink={PATHS.home.root}
                sellerId={commerceConfig.sellerId}
              />
            </ThemeRegistry>
          </Suspense>
        </body>
      </html>
    );
  }
  return (
    <html lang="es">
      {commerceConfig.googleTagManagerKey ? (
        <GoogleTagManager gtmId={commerceConfig.googleTagManagerKey} />
      ) : null}
      <body>
        <Suspense
          fallback={
            <LoadingProgress sx={{ my: 30, backgroundColor: "inherit" }} />
          }
          key=""
        >
          <ThemeRegistry
            stylesJson={sellerInfo.commerceConfig.stylesJSON}
            theme={theme}
          >
            <CoreProviders
              apiURL={sellerInfo.commerceConfig.apiUrl}
              sellerId={sellerInfo.commerceConfig.sellerId}
            >
              <SessionWatch config={sellerInfo.commerceConfig}>
                <CoreModals
                  cartModalProps={{
                    checkoutUrl: PATHS.checkout.root,
                    defaultIconPath: sellerInfo.commerceConfig.iconPath,
                  }}
                >
                  <CommerceTopNavBarLayout
                    config={sellerInfo.commerceConfig}
                    copy={sellerInfo.commerceCTACopies}
                  />

                  {children}
                  <CommerceFooterLayout
                    config={sellerInfo.commerceConfig}
                    copy={sellerInfo.commerceCTACopies}
                  />
                </CoreModals>
              </SessionWatch>
            </CoreProviders>
          </ThemeRegistry>
        </Suspense>
      </body>
    </html>
  );
}
