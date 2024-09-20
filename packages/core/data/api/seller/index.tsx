import { type Metadata } from "next";
import { generateCloudinaryVersion } from "ui/utils";
import {
  type CommerceCTACopiesType,
  type CommerceConfigType,
  type CommercePaymentMethod,
  type CommerceProductDisplay,
  type ShippingRuleVerifiedBy,
} from "../../..";
import {
  reverseDoWIdx,
  type SellerType,
  type SellerUnitInfoType,
  type minOrdenUnits,
  type DoW,
  DeliveryZones,
} from "../../../domain/seller";
import { ErrorCodes } from "../../../error";
import {
  type GQLError,
  graphQLFetch,
  buildAuthHeaders,
} from "../../../utils/graphql";
import {
  type EcommerceSellerGQL,
  type EcommerceAssignSellerUnitMsg,
  getSellerInfoQry,
  getCorrespondentUnitQry,
} from "./queries";

const GENERIC_SELLER_ERROR = "SELLER_INFO_NOT_AVAILABLE";
const ALL_IMAGE_CDN = "https://res.cloudinary.com/neutro-mx/image/upload/v1/";
const cloudinaryIconPath = "supplier/profile/";

export async function getSellerInfo(
  apiURL: string,
  sellerId: string
): Promise<{
  seller: SellerType;
  units: SellerUnitInfoType[];
  commerceConfig: CommerceConfigType;
  commerceCTACopies: CommerceCTACopiesType;
  commerceMetadata: Metadata;
}> {
  try {
    // add authorization aut
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: EcommerceSellerGQL;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: getSellerInfoQry,
      queryName: "getEcommerceSellerInfo",
      variables: { secretKey: sellerId },
      cache: "no-store",
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_SELLER_ERROR]
      );
    }
    if (!data.id) {
      // no seller id
      throw new Error(GENERIC_SELLER_ERROR);
    }
    if (data.units.length === 0) {
      // no client id
      throw new Error("SELLER_UNIT_NOT_FOUND");
    }
    // build obj
    const {
      units,
      minimumOrderValue,
      ecommerceParams,
      allowedPaymentMethods,
      ...rawSeller
    } = data;
    const seller: SellerType = {
      ...rawSeller,
      minQuantity: minimumOrderValue.amount,
      minQuantityUnit:
        minimumOrderValue.measure.toLowerCase() as keyof typeof minOrdenUnits,
      paymentMethods: allowedPaymentMethods.map((m) => {
        if (m.toLowerCase() === "transfer") {
          return "direct-transfer";
        } else if (m.toLowerCase() === "money_order") {
          return "money_order";
        }
        // cash
        return "cash";
      }),
    };
    const sellUnits = units.map((u) => {
      return {
        id: u.id,
        unitName: u.unitName,
        fullAddress: u.fullAddress,
        deleted: u.deleted,
        // delivery info
        deliveryTypes: u.deliveryInfo.sellingOption.map((s) => {
          return s === "PICKUP" ? "pickup" : "delivery";
        }),
        deliverySchedules: u.deliveryInfo.serviceHours.map((d) => {
          return {
            dow: reverseDoWIdx[
              d.dow as keyof typeof reverseDoWIdx
            ] as keyof typeof DoW,
            start: d.start,
            end: d.end,
          };
        }),
        accountNumber: u.accountNumber,
        paymentMethods: u.allowedPaymentMethods.map((m) => {
          if (m.toLowerCase() === "transfer") {
            return "direct-transfer";
          } else if (m.toLowerCase() === "cash") {
            return "cash";
          } else if (m.toLowerCase() === "money_order") {
            return "money_order";
          }
          // to be determined
          return "to_be_determined";
        }),
        deliveryZones: DeliveryZones.filter((z) => {
          return u.deliveryInfo.regions.includes(
            (z.zoneName.split(",")[0] || "")
              .toUpperCase()
              .replaceAll(" ", "_")
              .replaceAll("/", "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
        }).map((z) => z.zoneName),
        deliveryWindowSize: u.deliveryInfo.deliveryTimeWindow,
        cutOffTime: u.deliveryInfo.cutoffTime - 12, // 14-23 hrs
        warnDays: u.deliveryInfo.warningTime, // days before delivery date
      };
    });

    const cloudinaryVersion = generateCloudinaryVersion(); //[TODO] add method to all images from cloudinary

    const projectUrl: string =
      ecommerceParams.ecommerceUrl || "http://localhost:3000";

    const cloudinaryEnvPath: string =
      process.env.NEXT_PUBLIC_GQLAPI_ENV === "production"
        ? "alima-marketplace-PROD/"
        : "alima-marketplace-STG/";

    const linkBannerPath = ecommerceParams.bannerImg
      ? `${ALL_IMAGE_CDN.replace("/v1/", cloudinaryVersion)}${ecommerceParams.bannerImg
      }`
      : "/assets/banner.png";

    const logoPath: string = ecommerceParams.supplierBusinessId
      ? `${ALL_IMAGE_CDN.replace(
        "/v1/",
        cloudinaryVersion
      )}${cloudinaryEnvPath}${cloudinaryIconPath}${ecommerceParams.supplierBusinessId
      }_logo.png`
      : "/logo.png";

    const iconPath: string = logoPath.replace("_logo.png", "_icon.png");

    const commerceConfig: CommerceConfigType = {
      baseUrl: projectUrl,
      apiUrl: apiURL,
      sellerId: ecommerceParams.secretKey || "sellerId",
      defaultSupplierUnitId:
        ecommerceParams.defaultSupplierUnitId || "supplierUnitId",
      sellerName: ecommerceParams.sellerName || "Seller Name",
      stylesJSON: ecommerceParams.stylesJson || "{}",
      currency: ecommerceParams.currency || "MXN",
      commerceDisplay:
        ecommerceParams.commerceDisplay as CommerceProductDisplay,
      paymentMethods: ["cash", "direct-transfer"] as CommercePaymentMethod[],
      activeAccount:
        ecommerceParams.accountActive === undefined
          ? false
          : ecommerceParams.accountActive, // when false: account deactivated -> redirect to Generic URL
      logoPath, // || "/logo.png",
      iconPath,
      bannerPath: {
        path: linkBannerPath || "/assets/banner.png",
        href: ecommerceParams.bannerImgHref || `/catalog/list`,
        alt: `Ecommerce - ${ecommerceParams.sellerName}`,
      },
      homeHighlights: {
        categories: (ecommerceParams.categories || "").split(","),
        products: (ecommerceParams.recProds || "").split(","),
        recommendations: true,
      },
      shipping: {
        enabled: String(ecommerceParams.shippingEnabled) === "true",
        rule: {
          verifiedBy:
            ecommerceParams.shippingRuleVerifiedBy as ShippingRuleVerifiedBy,
          threshold: Number(ecommerceParams.shippingThreshold) || 0,
          cost: Number(ecommerceParams.shippingCost) || 0,
        },
      },
    };

    const commerceCTACopies: CommerceCTACopiesType = {
      searchPlaceholder:
        ecommerceParams.searchPlaceholder || "¿Qué estás buscando?",
      footer: {
        msg: ecommerceParams.footerMsg || "¿Listo para comprar?",
        ctaMsg: ecommerceParams.footerCta || "¡Crea tu cuenta!",
        supportContact: {
          phone: ecommerceParams.footerPhone || "123456789",
          isPhoneWA: ecommerceParams.footerIsWa || false,
          email: ecommerceParams.footerEmail || "hola@email.com",
        },
      },
    };

    const commerceMetadata: Metadata = {
      title: ecommerceParams.sellerName || "Commerce Template",
      description:
        ecommerceParams.seoDescription ||
        "Commerce Template generated by Alima",
      keywords:
        ecommerceParams.seoKeywords || "ecommerce,b2b,comida,distribuidor",
      openGraph: {
        type: "website",
        locale: "es_ES",
        siteName: ecommerceParams.sellerName || "Commerce Template",
        images: [
          {
            url: iconPath,
            width: 800,
            height: 600,
            alt: ecommerceParams.sellerName || "Commerce Template",
          },
        ],
      },
      twitter: {
        title: ecommerceParams.sellerName || "Commerce Template",
        site: ecommerceParams.ecommerceUrl || "http://localhost:3000",
      },
      metadataBase: new URL(ecommerceParams.ecommerceUrl),
    };
    return {
      seller,
      units: sellUnits,
      commerceConfig,
      commerceCTACopies,
      commerceMetadata,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("SELLER_INFO_NOT_AVAILABLE");
  }
}

export async function getCorrespondentUnit(
  apiURL: string,
  token: string,
  sellerId: string,
  addressId: string
): Promise<string | null> {
  try {
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: EcommerceAssignSellerUnitMsg;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: getCorrespondentUnitQry,
      queryName: "getCorrespondentEcommerceSellerUnit",
      variables: {
        secretKey: sellerId,
        branchId: addressId,
      },
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_SELLER_ERROR]
      );
    }
    // if status is null -> no service available
    if (!data.status || !data.supplierUnitId) {
      return null;
    }
    return data.supplierUnitId;
  } catch (error) {
    return null;
  }
}
