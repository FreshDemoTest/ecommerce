import type { Metadata } from "next";
import { CommerceOrdenDetailsServer, getSellerInfo } from "core";
import { Suspense } from "react";
import { SkeletonOrden, Typography } from "ui";
import { commerceConfig } from "../../config";

export const metadata: Metadata = {
  title: `Detalle del Pedido | ${commerceConfig.sellerName}`,
};

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(commerceConfig.apiUrl, commerceConfig.sellerId);
  if (!params.id) {
    return (
      <Typography sx={{ mt: 8 }} variant="h6">
        No se pudo encontrar tu Pedido
      </Typography>
    );
  }
  return (
    <Suspense fallback={<SkeletonOrden />} key={params.id}>
      <CommerceOrdenDetailsServer config={sellerInfo.commerceConfig} ordenId={params.id} />
    </Suspense>
  );
}
