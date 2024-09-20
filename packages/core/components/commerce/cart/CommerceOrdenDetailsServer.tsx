"use server";

import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { type OrdenType, type InvoiceType } from "ui/domain";
import { type CommerceConfigType } from "../../..";
import { getOrdenDetails } from "../../../data/api";
import { CommerceOrdenDetails } from "./CommerceOrdenDetails";

// ------------------------------------------------------------

async function getData(
  apiURL: string,
  ordenId: string,
  sellerId: string,
  token?: string
): Promise<{
  pedido: OrdenType | undefined;
  factura: InvoiceType | undefined;
}> {
  // Fetch product data from API
  // const pedido = await getExternalOrdenDetails(apiURL, ordenId);
  const pedidoAndInvoice = await getOrdenDetails(
    apiURL,
    ordenId,
    sellerId,
    token
  );
  return pedidoAndInvoice;
}

// ------------------------------------------------------------

interface CommerceOrdenDetailsServerProps {
  config: CommerceConfigType;
  ordenId: string;
}

export async function CommerceOrdenDetailsServer({
  config,
  ordenId,
}: CommerceOrdenDetailsServerProps): Promise<JSX.Element> {
  const token = getCookie("token", { cookies });
  const { pedido, factura } = await getData(
    config.apiUrl,
    ordenId,
    config.sellerId,
    token
  );

  return (
    <CommerceOrdenDetails
      displayOrden={pedido}
      notFound={pedido === undefined}
      displayInvoice={factura}
    />
  );
}
