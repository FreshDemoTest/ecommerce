export interface OrdenStatusGQL {
  id: string;
  cart?: {
    unitPrice: number;
    subtotal: number;
    sellUnit: number;
    quantity: number;
    supplierProductPriceId: string;
    suppProd: {
      id: string;
      sellUnit: string;
      sku: string;
      description: string;
      minQuantity: number;
      unitMultiple: number;
      estimatedWeight: number;
    };
  }[];
  details?: {
    cartId: string;
    approvedBy: string;
    ordenId: string;
    version: number;
    total: number;
    tax: number;
    subtotalWithoutTax: number;
    subtotal: number;
    shippingCost: number;
    serviceFee: number;
    paymentMethod: string;
    packagingCost: number;
    discount: number;
    deliveryDate: string;
    createdAt: string;
    deliveryTime: {
      end: string;
      start: string;
    };
    comments: string;
    createdBy: string;
    restaurantBranchId: string;
  };
  status: {
    status: string;
    createdAt?: string;
  };
  ordenType: string;
  paystatus: {
    status: string;
    createdAt?: string;
  };
  supplier?: {
    supplierBusinessAccount: {
      supplierBusinessId: string;
      legalRepName: string;
      email: string;
      phoneNumber: string;
    };
    supplierBusiness: {
      name: string;
    };
  };
  branch?: {
    branchName: string;
    id: string;
    fullAddress: string;
    branchCategory: {
      restaurantCategoryId: string;
    };
    contactInfo: {
      businessName: string;
      displayName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

export const newOrdenQry = `mutation newOrden($secretKey: String!, $supUnitId: UUID!, $paymethod: PayMethodType!, $cartProds: [CartProductInput!]!, $deliveryDate: DateTime!, $deliveryTime: DeliveryTimeWindowInput!, $restaurantBranchId: UUID!, $comms: String, $delivType: SellingOption!, $shipping: Float) {
    newEcommerceOrden(
      refSecretKey: $secretKey
      cartProducts: $cartProds
      restaurantBranchId: $restaurantBranchId
      supplierUnitId: $supUnitId
      deliveryDate: $deliveryDate
      deliveryTime: $deliveryTime
      deliveryType: $delivType
      paystatus: UNPAID
      status: SUBMITTED
      paymentMethod: $paymethod
      comments: $comms
      shippingCost: $shipping
    ) {
      ... on OrdenGQL {
        id
        status {
          status
        }
        details {
          version
        }
      }
      ... on OrdenError {
        code
        msg
      }
    }
  }`;
