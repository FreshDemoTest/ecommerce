import type { CSSProperties } from "react";

export interface LogoProps {
  src: string;
  width?: number;
  height?: number;
  paddingTop?: number;
  sx?: CSSProperties;
  other?: any;
}

export interface SupplierProductType {
  id: string;
  productUuid?: string;
  sku: string;
  upc?: string;
  productCategory?: string;
  productDescription: string;
  sellUnit: string;
  buyUnit?: string;
  conversionFactor?: number;
  minimumQuantity: number;
  unitMultiple: number;
  estimatedWeight?: number;
  longDescription?: string;
  stock?: { uuid: string; amount: number; unit: string; stock: number; active: boolean; keepSellingWithoutStock: boolean};
  price?: { uuid: string; amount: number; unit: string; validUntil: string };
  taxAmount: number; // IVA percentage of the total price
  iepsAmount?: number; // IEPS percentage of the total price
  taxId?: string; // SAT tax id
  taxUnit?: string; // SAT tax unit
  images?: string[];
  tags?: {
    id: string;
    supplierProductId: string;
    tagKey: string;
    tagValue: string;
    createdAt: Date;
  }[];
}

export const UOMTypes = {
  kg: "Kg",
  unit: "Pieza",
  // dome: 'Domo',
  liter: "Litro",
  pack: "Paquete",
  dozen: "Docena",
};

export type UOMType = keyof typeof UOMTypes;

export const IntegerUOMTypes = [
  "unit",
  // 'dome',
  "pack",
  "dozen",
];

export const ordenStatusTypes = {
  submitted: "Enviado",
  accepted: "Confirmado",
  picking: "En proceso",
  shipping: "En camino",
  delivered: "Entregado",
  canceled: "Cancelado",
};

export type OrdenStatusType = keyof typeof ordenStatusTypes;

export const payStatusTypes = {
  unpaid: "Sin Pagar",
  paid: "Pagado",
  unknown: "Por Definir",
};

export type PayStatusType = keyof typeof payStatusTypes;

export interface CartProductType {
  id?: string;
  supplierProduct: SupplierProductType;
  quantity: number;
  price?: { uuid: string; amount: number; unit: string; validUntil: string };
  total?: number;
  comments?: string;
}

export interface CartType {
  id?: string;
  cartProducts: CartProductType[];
}

export const deliveryTypes = {
  pickup: "Recoger en Almacén",
  delivery: "Entrega",
};

export type DeliveryType = keyof typeof deliveryTypes;

export interface OrdenType {
  id?: string;
  ordenNumber?: string;
  version?: string;
  ordenType: string;
  status: OrdenStatusType;
  payStatus?: PayStatusType;
  restaurantBranch: {
    id: string;
    branchName: string;
    branchCategory: string;
    fullAddress: string;
    phoneNumber: string;
    email: string;
    displayName: string;
    businessName: string;
  };
  supplier: {
    id: string;
    supplierName: string;
    phoneNumber: string;
    email: string;
    displayName: string;
  };
  cart: CartType;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryType?: DeliveryType;
  subtotalWithoutTax?: number;
  tax?: number;
  subtotal: number;
  discount?: { amount: number; code: string };
  cashback?: { uuid: string; amount: number; code: string };
  shippingCost?: number;
  packagingCost?: number;
  serviceFee?: number;
  total?: number;
  comments?: string;
  paymentMethod?: string;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt?: string;
  lastUpdated?: string;
}

export interface InvoiceType {
  id?: string;
  uuid?: string;
  folio?: string;
  supplier?: {
    id: string;
    supplierName: string;
    phoneNumber: string;
    email: string;
    displayName: string;
  };
  status?: string;
  paymentMethod?: string;
  total?: number;
  pdfFile?: string;
  xmlFile?: string;
}
