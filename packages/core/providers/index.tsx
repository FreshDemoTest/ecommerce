"use client";

import { CartProvider } from "./CartProvider";
import { SellerInfoProvider } from "./BusinessInfoProvider";
import { ClientInfoProvider } from "./ClientInfoProvider";
import { SessionWatch } from "./guards";
import { useSellerInfo, useCart, useClientInfo } from "./hooks";
// [TODO] Auth User Provider

interface CoreProvidersProps {
  apiURL: string;
  children: React.ReactNode;
  sellerId: string;
}

function CoreProviders({
  sellerId,
  apiURL,
  children,
}: CoreProvidersProps): JSX.Element {
  return (
    <CartProvider>
      <SellerInfoProvider apiURL={apiURL}>
        <ClientInfoProvider apiURL={apiURL} sellerId={sellerId}>
          {children}
        </ClientInfoProvider>
      </SellerInfoProvider>
    </CartProvider>
  );
}

// providers
export { CoreProviders };
// guards
export { SessionWatch };
// hooks
export { useSellerInfo, useCart, useClientInfo };
