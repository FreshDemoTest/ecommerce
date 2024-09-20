"use server";

import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import type { InvoiceType, OrdenType } from "ui/domain";
import { getOrdenHistory } from "../../../data/api";
import { type CommerceConfigType } from "../../..";
import { CommerceOrdenHistory } from "./CommerceOrdenHistory";

// ------------------------------------------------------------

async function getData(
  apiURL: string,
  sellerId: string,
  fromDate: Date,
  toDate: Date,
  page: number,
  size: number,
  token?: string
): Promise<{
  pedidos: { orden: OrdenType; invoice?: InvoiceType }[];
  totalResults: number;
}> {
  // Fetch ordenes data from API
  const { pedidos, totalResults } = await getOrdenHistory(
    apiURL,
    sellerId,
    fromDate,
    toDate,
    token,
    page,
    size
  );
  return {
    pedidos,
    totalResults,
  };
}

// ------------------------------------------------------------

interface CommerceOrdenHistoryProps {
  config: CommerceConfigType;
  fromDate: Date;
  toDate: Date;
  currentPage: number;
  pageSize: number;
}

export async function CommerceOrdenHistoryServer({
  config,
  fromDate,
  toDate,
  currentPage,
  pageSize,
}: CommerceOrdenHistoryProps): Promise<JSX.Element> {
  // get cookies
  const token = getCookie("token", { cookies });
  // call API
  const { pedidos, totalResults } = await getData(
    config.apiUrl,
    config.sellerId,
    fromDate,
    toDate,
    currentPage,
    pageSize,
    token
  );

  return (
    <CommerceOrdenHistory
      fromDate={fromDate}
      toDate={toDate}
      currentPage={currentPage}
      pages={Math.ceil(totalResults / pageSize)}
      pedidos={pedidos}
      totalResults={totalResults}
    />
  );
}
