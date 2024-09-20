import type { FooterProps } from "ui";

export type CommerceProductDisplay = "open" | "closed" | "closed-with-catalog";

export type CommercePaymentMethod = "cash" | "direct-transfer" | "to_be_determined" | "money_order"; // [TODO: next release] |  'stripe-card' | 'stripe-transfer';

export const paymentMethodLabels: Record<CommercePaymentMethod, string> = {
  cash: "Efectivo",
  money_order: "Cheque",
  "direct-transfer": "Transferencia",
  to_be_determined: "Por definir",
};

export interface BannerType {
  path: string;
  href?: string;
  alt?: string;
}

export type ShippingRuleVerifiedBy = "minReached" | "minThreshold" | "distance";

/**
 * Shipping Cost Rule
 * @description
 * - minReached: free shipping when min Qty from business is reached
 * - minThreshold: free shipping when min Qty from business is greater than threshold
 */
export interface ShippingRule {
  verifiedBy: ShippingRuleVerifiedBy; // [TODO] distance is not implemented yet
  threshold?: number;
  cost: number;
}

export interface EnvCommerceConfigType {
  apiUrl: string;
  sellerId: string;
  defaultSupplierUnitId: string;
  sellerName: string;
  googleTagManagerKey?: string;
}

export interface CommerceConfigType {
  baseUrl: string;
  apiUrl: string;
  sellerId: string;
  defaultSupplierUnitId: string;
  sellerName: string;
  currency: string;
  stylesJSON: string;
  commerceDisplay: CommerceProductDisplay;
  paymentMethods: CommercePaymentMethod[];
  activeAccount: boolean;
  logoPath: string;
  iconPath: string;
  bannerPath?: BannerType | BannerType[];
  homeHighlights: {
    categories?: string[];
    products?: string[];
    recommendations?: boolean;
  };
  shipping: {
    enabled: boolean;
    rule: ShippingRule;
  };
  additionalVars?: any;
}

export interface CommerceCTACopiesType {
  searchPlaceholder: string;
  footer: Omit<FooterProps, "logoSrc" | "sellerName">;
}