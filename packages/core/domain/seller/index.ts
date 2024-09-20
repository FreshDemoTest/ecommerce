import type { CommercePaymentMethod } from "../commerce/index";

export const minOrdenUnits = {
  kg: "Kgs",
  pesos: "Pesos ($)",
  products: "Productos",
};

export interface SellerType {
  id?: string;
  businessName: string;
  businessType: string;
  email: string;
  phoneNumber: string;
  website?: string;
  active?: boolean;
  minQuantity: number;
  minQuantityUnit: keyof typeof minOrdenUnits;
  paymentMethods: CommercePaymentMethod[];
  accountNumber?: string;
  policyTerms?: string;
}

export interface SellerConfigParams{
    id?: string;
    supplier_business_id?: string;
    seller_name?: string;
    secret_key?: string;
    ecommerce_url?: string;
    project_name?: string;
    seller_logo?: string;
    banner_img?: string;
    categories?: string;
    rec_prods?: string;
    styles_json?: string;
    shipping_enabled?: boolean;
    shipping_rule_verified_by?: string;
    shipping_threshold?: number;
    shipping_cost?: number;
    search_placeholder?: string;
    footer_msg?: string;
    footer_cta?: string;
    footer_phone?: string;
    footer_is_wa?: boolean;
    footer_email?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    seo_image?: string;
    default_supplier_unit_id?: string;
    commerce_display?: string;
    account_active?: boolean;
    currency?: string;
}

export interface SellerUnitType {
  id?: string;
  unitName: string;
  unitCategory?: string;
  street?: string;
  externalNum?: string;
  internalNum?: string;
  neighborhood?: string;
  city?: string;
  estate?: string;
  country?: string;
  zipCode?: string;
  deleted?: boolean;
  accountNumber?: string;
  paymentMethods?: CommercePaymentMethod[];
  fullAddress?: string;
}

export const DoW = {
  sunday: "Domingo",
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
};

export const DoWIdx = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export const reverseDoWIdx = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export interface ServiceDayType {
  dow: keyof typeof DoW;
  start: number; // 0-22 hrs
  end: number; // 1-23 hrs
}

export interface DeliveryZoneType {
  zoneName: string;
  estate?: string;
  city?: string;
  neighborhood?: string;
  zipCode?: string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires -- static data
const _deliveryZones = require("../../data/deliveryZones.json") as {
  zoneName: string;
  estate?: string;
  city?: string[];
  neighborhood?: string[];
  zipCode?: string[];
}[];

export const DeliveryZones: DeliveryZoneType[] = _deliveryZones.map((dz) => {
  return {
    zoneName: dz.zoneName,
    estate: dz.estate,
    city: dz.city?.join(", "),
    neighborhood: dz.neighborhood?.join(", "),
    zipCode: dz.zipCode?.join(", "),
  };
});

export const DeliveryTypes = {
  pickup: "Recoger en Almacén",
  delivery: "Entrega",
};

export type DeliveryType = keyof typeof DeliveryTypes;

export const decodeDeliveryTypes = (value: string): string | undefined => {
  const _dec = Object.entries(DeliveryTypes)
    .map(([key, val]) => [val, key])
    .find(([_k, val]) => val === value);
  return _dec ? _dec[0] : undefined;
};

export interface SellerUnitDeliveryInfoType {
  deliveryTypes: DeliveryType[];
  deliverySchedules: ServiceDayType[];
  deliveryZones: string[];
  deliveryWindowSize?: number; // in hours
  cutOffTime: number; // 0-23 hrs
  warnDays: number; // days before delivery date
}

export type SellerUnitInfoType = SellerUnitType & SellerUnitDeliveryInfoType;

// -- Context Variable Definitions

// Business Info State
export interface SellerInfoState {
  seller?: SellerType;
  sellerUnits: SellerUnitInfoType[];
  assignedUnit?: SellerUnitInfoType;
  language: string;
  loading: boolean;
  error?: string;
}

export interface SellerInfoActions {
  fetchSellerInfo: (sellerId: string) => Promise<void>;
  setSellerUnit: (unitId: string) => Promise<void>;
  changeLanguage: (language: string) => Promise<void>;
}
