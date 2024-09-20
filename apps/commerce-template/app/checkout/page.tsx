import { type Metadata } from "next";
import {
  CommerceCheckout,
  CommerceCheckoutDelivery,
  CommerceCheckoutPayment,
  CommerceCheckoutStepsLayout,
  getSellerInfo,
} from "core";
import { commerceConfig } from "../config";
import PATHS from "../paths";

export const metadata: Metadata = {
  title: `Carrito | ${commerceConfig.sellerName}`,
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { step: "products" | "delivery" | "payment" };
}): Promise<JSX.Element> {
  const { step } = searchParams || { step: "products" };
  const sellerInfo = await getSellerInfo(commerceConfig.apiUrl, commerceConfig.sellerId);
  const { shipping } = sellerInfo.commerceConfig;
  return (
    <CommerceCheckoutStepsLayout loginLink={PATHS.auth.login}>
      {step === "products" ? <CommerceCheckout defaultIconPath={sellerInfo.commerceConfig.iconPath}/> : ""}
      {step === "delivery" ? <CommerceCheckoutDelivery /> : ""}
      {step === "payment" ? (
        <CommerceCheckoutPayment shipping={shipping} />
      ) : (
        ""
      )}
    </CommerceCheckoutStepsLayout>
  );
}
