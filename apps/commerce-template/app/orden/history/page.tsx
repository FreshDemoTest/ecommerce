import { type Metadata } from "next";
import { Suspense } from "react";
import { LoadingProgress } from "ui";
import { inXTime } from "core/utils";
import { fISODate } from "ui/utils";
import { CommerceOrdenHistory, getSellerInfo } from "core";
import { commerceConfig } from "../../config";

const PAGE_SIZE = 10;

export const metadata: Metadata = {
  title: `Historial de Pedidos | ${commerceConfig.sellerName}`,
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    from_date: string;
    to_date: string;
    page: number;
    size?: number;
  };
}): Promise<JSX.Element> {
  const fromDate = searchParams?.from_date
    ? new Date(searchParams.from_date)
    : inXTime(-365); // 1 year ago [TODO] - fix this from backend
  const toDate = searchParams?.to_date
    ? new Date(searchParams.to_date)
    : inXTime(15);
  const currPage = Number(searchParams?.page || 1);
  const pgSize = Number(searchParams?.size || PAGE_SIZE);
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );

  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 4 }} />}
      key={`${fISODate(fromDate)}-${fISODate(toDate)}-${currPage}`}
    >
      <CommerceOrdenHistory
        config={sellerInfo.commerceConfig}
        currentPage={currPage}
        fromDate={fromDate}
        pageSize={pgSize}
        toDate={toDate}
      />
    </Suspense>
  );
}
