import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import type { SupplierProductType } from "ui/domain";
import { type CommerceConfigType } from "../../..";
import { getProductDetails } from "../../../data/api";
import { CommerceProductDetails } from "./CommerceProductDetails";

// ------------------------------------------------------------

async function getData(
  apiURL: string,
  sellerId: string,
  supplierProductId: string,
  suppliertUnitId: string,
  token?: string,
  addressId?: string
): Promise<SupplierProductType | undefined> {
  // Fetch product data from API
  const product = await getProductDetails(
    apiURL,
    sellerId,
    suppliertUnitId,
    supplierProductId,
    token,
    addressId
  );
  return product;
}

// ------------------------------------------------------------

interface CommerceCatalogListServerProps {
  config: CommerceConfigType;
  supplierProductId: string;
  checkoutUrl: string;
  showMinQuantity?: boolean;
}

export async function CommerceProductDetailsServer({
  config,
  supplierProductId,
  checkoutUrl,
  showMinQuantity,
}: CommerceCatalogListServerProps): Promise<JSX.Element> {
  // get cookies
  const supUnitId = getCookie("supplierUnitId", { cookies });
  const token = getCookie("token", { cookies });
  const addressId = getCookie("defaultAddressId", { cookies });

  const product = await getData(
    config.apiUrl,
    config.sellerId,
    supplierProductId,
    supUnitId || config.defaultSupplierUnitId,
    token,
    addressId
  );

  return (
    <CommerceProductDetails
      commerceDisplay={config.commerceDisplay}
      product={product}
      currency={config.currency}
      checkoutUrl={checkoutUrl}
      defaultIconPath={config.iconPath}
      showMinQuantity={showMinQuantity}
    />
  );
}
