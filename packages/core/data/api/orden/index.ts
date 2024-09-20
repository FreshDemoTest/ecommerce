import {
  type PayStatusType,
  type InvoiceType,
  type OrdenStatusType,
  type OrdenType,
} from "ui/domain";
import { fISODate } from "ui/utils";
import {
  type GQLError,
  graphQLFetch,
  buildAuthHeaders,
} from "../../../utils/graphql";
import { ErrorCodes } from "../../../error";
import {
  type OrdenGQL,
  getExternalOrdenDetailsQry,
  getEcommOrdenDetailsQry,
  type B2BEcommerceOrdenInfo,
  geEcommOrdenHistoryQry,
  type B2BEcommerceHistorialOrdenes,
} from "./queries";

const GENERIC_ORDEN_ERROR = "CART_ISSUES_CREATNG_ORDER";

/**
 * [DEPRECATED]
 * @param apiURL
 * @param ordenId
 * @returns
 */
export async function getExternalOrdenDetails(
  apiURL: string,
  ordenId: string
): Promise<OrdenType | undefined> {
  try {
    if (!ordenId) {
      return undefined;
    }
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: { data: OrdenGQL; error: GQLError } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: getExternalOrdenDetailsQry,
      queryName: "getExternalOrden",
      variables: {
        ordenId,
      },
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_ORDEN_ERROR]
      );
    }
    const o = data;
    const v = o.branch!;
    const cr = o.cart!;

    return {
      id: o.id,
      subtotalWithoutTax: o.details!.subtotalWithoutTax,
      tax: o.details!.tax,
      subtotal: o.details!.subtotal,
      shippingCost: o.details!.shippingCost,
      total: o.details!.total,
      version: o.details!.version.toString(),
      comments: o.details!.comments,
      ordenType: o.ordenType,
      status: o.status.status.toLowerCase() as OrdenStatusType,
      paymentMethod:
        o.details?.paymentMethod === "TRANSFER" ? "direct-transfer" : "cash",
      restaurantBranch: {
        id: v.id,
        branchName: v.branchName,
        branchCategory: v.branchCategory?.restaurantCategoryId || "",
        fullAddress: v.fullAddress,
        phoneNumber: v.contactInfo?.phoneNumber || "",
        email: v.contactInfo?.email || "",
        displayName: v.contactInfo?.displayName || "",
        businessName: v.contactInfo?.businessName || "",
      },
      supplier: {
        id: o.supplier!.supplierBusinessAccount.supplierBusinessId,
        supplierName: o.supplier!.supplierBusiness.name,
        displayName: o.supplier!.supplierBusinessAccount.legalRepName,
        email: o.supplier!.supplierBusinessAccount.email,
        phoneNumber: o.supplier!.supplierBusinessAccount.phoneNumber,
      },
      cart: {
        id: o.details!.ordenId, // using this ID only for reference in frontend
        cartProducts: cr.map((p) => ({
          id: p.suppProd.id, // using this ID only for reference in frontend
          supplierProduct: {
            id: p.suppProd.id,
            productDescription: p.suppProd.description,
            sellUnit: p.suppProd.sellUnit,
            sku: p.suppProd.sku,
            minimumQuantity: p.suppProd.minQuantity,
            unitMultiple: p.suppProd.unitMultiple,
            estimatedWeight: p.suppProd.estimatedWeight,
            taxAmount: 0, // hard coded for now
          },
          quantity: p.quantity,
          price: {
            uuid: p.supplierProductPriceId,
            amount: p.unitPrice,
            unit: "MXN", // hard coded for now
            validUntil: o.details!.deliveryDate, // placed for reference only
          },
          total: p.subtotal,
        })), // not used in active ordenes listing
      },
      deliveryDate: o.details!.deliveryDate,
      deliveryTime: `${o.details!.deliveryTime.start} - ${
        o.details!.deliveryTime.end
      }`,
      lastUpdated: o.details!.createdAt, // same as created at given data model
      createdBy: {
        id: o.details!.createdBy,
        firstName: "", // not used
        lastName: "", // not used
        email: "", // not used
      },
    };
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Issues getting orden details");
    return undefined;
  }
}

/**
 * Fetching Orden and Invoice Details
 * @param apiURL
 * @param ordenId
 * @param secretKey
 * @param token
 * @returns
 */
export async function getOrdenDetails(
  apiURL: string,
  ordenId: string,
  secretKey: string,
  token?: string
): Promise<{
  pedido: OrdenType | undefined;
  factura: InvoiceType | undefined;
}> {
  try {
    if (!ordenId) {
      return { pedido: undefined, factura: undefined };
    }
    const headrs = token ? buildAuthHeaders(secretKey, token) : {};
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: { data: B2BEcommerceOrdenInfo; error: GQLError } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: getEcommOrdenDetailsQry,
      queryName: "getEcommerceOrdenDetails",
      variables: {
        ordenId,
        secretKey,
      },
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_ORDEN_ERROR]
      );
    }
    // order formatting
    const o = data.orden;
    const v = o.branch!;
    const cr = o.cart!;

    let pMethod = "cash";
    if (o.details?.paymentMethod === "TRANSFER") {
      pMethod = "direct-transfer";
    } else if (o.details?.paymentMethod === "MONEY_ORDER") {
      pMethod = "money_order";
    }
    
    const pedido = {
      id: o.id,
      ordenNumber: o.ordenNumber,
      subtotalWithoutTax: o.details!.subtotalWithoutTax,
      tax: o.details!.tax,
      subtotal: o.details!.subtotal,
      shippingCost: o.details!.shippingCost,
      total: o.details!.total,
      version: o.details!.version.toString(),
      comments: o.details!.comments,
      ordenType: o.ordenType,
      status: o.status.status.toLowerCase() as OrdenStatusType,
      payStatus: o.paystatus.status.toLowerCase() as PayStatusType,
      paymentMethod: pMethod,
      restaurantBranch: {
        id: v.id,
        branchName: v.branchName,
        branchCategory: v.branchCategory?.restaurantCategoryId || "",
        fullAddress: v.fullAddress,
        phoneNumber: v.contactInfo?.phoneNumber || "",
        email: v.contactInfo?.email || "",
        displayName: v.contactInfo?.displayName || "",
        businessName: v.contactInfo?.businessName || "",
      },
      supplier: {
        id: o.supplier!.supplierBusinessAccount.supplierBusinessId,
        supplierName: o.supplier!.supplierBusiness.name,
        displayName: o.supplier!.supplierBusinessAccount.legalRepName,
        email: o.supplier!.supplierBusinessAccount.email,
        phoneNumber: o.supplier!.supplierBusinessAccount.phoneNumber,
      },
      cart: {
        id: o.details!.ordenId, // using this ID only for reference in frontend
        cartProducts: cr.map((p) => ({
          id: p.suppProd.id, // using this ID only for reference in frontend
          supplierProduct: {
            id: p.suppProd.id,
            productDescription: p.suppProd.description,
            sellUnit: p.suppProd.sellUnit,
            sku: p.suppProd.sku,
            minimumQuantity: p.suppProd.minQuantity,
            unitMultiple: p.suppProd.unitMultiple,
            estimatedWeight: p.suppProd.estimatedWeight,
            taxAmount: 0, // hard coded for now
          },
          quantity: p.quantity,
          price: {
            uuid: p.supplierProductPriceId,
            amount: p.unitPrice,
            unit: "MXN", // hard coded for now
            validUntil: o.details!.deliveryDate, // placed for reference only
          },
          total: p.subtotal,
        })), // not used in active ordenes listing
      },
      deliveryDate: o.details!.deliveryDate,
      deliveryTime: `${o.details!.deliveryTime.start} - ${
        o.details!.deliveryTime.end
      }`,
      lastUpdated: o.details!.createdAt, // same as created at given data model
      createdBy: {
        id: o.details!.createdBy,
        firstName: "", // not used
        lastName: "", // not used
        email: "", // not used
      },
    };
    // invoice formatting
    const iv = data.invoice;
    if (!iv) {
      return { pedido, factura: undefined };
    }
    const ipMethod = "cash";
    if (o.details?.paymentMethod === "TRANSFER") {
      pMethod = "direct-transfer";
    } else if (o.details?.paymentMethod === "MONEY_ORDER") {
      pMethod = "money_order";
    }
    const factura = {
      id: iv.id,
      uuid: iv.satInvoiceUuid,
      folio: iv.invoiceNumber,
      supplier: {
        id: iv.supplier.id || "",
        supplierName: iv.supplier.name || "",
        phoneNumber: "",
        email: "",
        displayName: iv.supplier.name || "",
      },
      status: iv.status,
      paymentMethod: ipMethod,
      total: iv.total,
      pdfFile: iv.pdfFile,
      xmlFile: iv.xmlFile,
    };
    return { pedido, factura };
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Issues getting orden details", error);
    return { pedido: undefined, factura: undefined };
  }
}

/**
 * Fetching Orden History
 * @param apiURL
 * @param secretKey
 * @param fromDate
 * @param toDate
 * @param token
 * @param page
 * @param pSize
 * @returns
 */
export async function getOrdenHistory(
  apiURL: string,
  secretKey: string,
  fromDate: Date,
  toDate: Date,
  token?: string,
  page?: number,
  pSize?: number
): Promise<{
  pedidos: { orden: OrdenType; invoice?: InvoiceType }[];
  totalResults: number;
}> {
  try {
    const headrs = token ? buildAuthHeaders(secretKey, token) : {};
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: { data: B2BEcommerceHistorialOrdenes; error: GQLError } =
      await graphQLFetch({
        graphQLEndpoint: apiURL,
        query: geEcommOrdenHistoryQry,
        queryName: "getEcommerceOrdenes",
        variables: {
          secretKey,
          fromDate: fISODate(fromDate),
          toDate: fISODate(toDate),
          page,
          pSize,
        },
        headers: headrs,
      });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_ORDEN_ERROR]
      );
    }
    // order formatting
    if (data.ordenes.length === 0) {
      return { pedidos: [], totalResults: 0 };
    }
    const formattedPedidos = data.ordenes.map((pdd) => {
      const o = pdd.orden;
      const v = o.branch;

      let _pMethod = "cash";
      if (o.details?.paymentMethod === "TRANSFER") {
        _pMethod = "direct-transfer";
      } else if (o.details?.paymentMethod === "MONEY_ORDER") {
        _pMethod = "money_order";
      }

      const pedido: OrdenType = {
        id: o.id,
        ordenNumber: o.ordenNumber,
        subtotalWithoutTax: o.details!.subtotalWithoutTax,
        tax: o.details!.tax,
        subtotal: o.details!.subtotal,
        shippingCost: o.details!.shippingCost,
        total: o.details!.total,
        version: o.details!.version.toString(),
        comments: o.details!.comments,
        ordenType: o.ordenType,
        status: o.status.status.toLowerCase() as OrdenStatusType,
        payStatus: o.paystatus.status.toLowerCase() as PayStatusType,
        paymentMethod: _pMethod,
        restaurantBranch: {
          id: v?.id || o.details?.restaurantBranchId || "",
          branchName: v?.branchName || "",
          branchCategory: v?.branchCategory?.restaurantCategoryId || "",
          fullAddress: v?.fullAddress || "",
          phoneNumber: v?.contactInfo?.phoneNumber || "",
          email: v?.contactInfo?.email || "",
          displayName: v?.contactInfo?.displayName || "",
          businessName: v?.contactInfo?.businessName || "",
        },
        supplier: {
          id: o.supplier?.supplierBusinessAccount.supplierBusinessId || "",
          supplierName: o.supplier?.supplierBusiness.name || "",
          displayName: o.supplier?.supplierBusinessAccount.legalRepName || "",
          email: o.supplier?.supplierBusinessAccount.email || "",
          phoneNumber: o.supplier?.supplierBusinessAccount.phoneNumber || "",
        },
        cart: {
          id: o.details!.ordenId, // using this ID only for reference in frontend
          cartProducts: [], // not used in active ordenes listing
        },
        deliveryDate: o.details!.deliveryDate,
        deliveryTime: `${o.details!.deliveryTime.start} - ${
          o.details!.deliveryTime.end
        }`,
        lastUpdated: o.details!.createdAt, // same as created at given data model
        createdBy: {
          id: o.details!.createdBy,
          firstName: "", // not used
          lastName: "", // not used
          email: "", // not used
        },
      };
      // invoice formatting
      const iv = pdd.invoice;
      if (!iv) {
        return { orden: pedido, invoice: undefined };
      }
      let _ipMethod = "cash";
      if (o.details?.paymentMethod === "TRANSFER") {
        _ipMethod = "direct-transfer";
      } else if (o.details?.paymentMethod === "MONEY_ORDER") {
        _ipMethod = "money_order";
      }
      const factura: InvoiceType = {
        id: iv.id,
        uuid: iv.satInvoiceUuid,
        folio: iv.invoiceNumber,
        supplier: {
          id: iv.supplier.id || "",
          supplierName: iv.supplier.name || "",
          phoneNumber: "",
          email: "",
          displayName: iv.supplier.name || "",
        },
        status: iv.status,
        paymentMethod: _ipMethod,
        total: iv.total,
        pdfFile: iv.pdfFile,
        xmlFile: iv.xmlFile,
      };
      return { orden: pedido, invoice: factura };
    });

    return { pedidos: formattedPedidos, totalResults: data.totalResults };
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Issues getting orden history", error);
    return { pedidos: [], totalResults: 0 };
  }
}
