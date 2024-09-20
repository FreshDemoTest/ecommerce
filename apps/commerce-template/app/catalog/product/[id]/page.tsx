import { type Metadata } from "next";
import {
  CommerceProductDetailsServer,
  getProductDetails,
  getSellerInfo,
} from "core";
import { Suspense } from "react";
import { SkeletonProduct, Typography } from "ui";
import { commerceConfig } from "../../../config";
import PATHS from "../../../paths";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const supProdId = params.id.split("_").reverse()[0];

  if (!supProdId) {
    return {
      title: `Producto No Encontrado | ${commerceConfig.sellerName}`,
    };
  }
  // fetch data
  const product = await getProductDetails(
    commerceConfig.apiUrl,
    commerceConfig.sellerId,
    commerceConfig.defaultSupplierUnitId,
    supProdId
  );

  return {
    title: `${product?.productDescription} | ${commerceConfig.sellerName}`,
    openGraph: {
      images: product?.images || [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const supProdId = params.id.split("_").reverse()[0];
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );

  if (!supProdId) {
    return (
      <Typography sx={{ mt: 8 }} variant="h6">
        No se pudo encontrar tu Producto
      </Typography>
    );
  }

  return (
    <Suspense fallback={<SkeletonProduct />} key={supProdId}>
      <CommerceProductDetailsServer
        checkoutUrl={PATHS.checkout.root}
        config={sellerInfo.commerceConfig}
        supplierProductId={supProdId}
      />
    </Suspense>
  );
}
