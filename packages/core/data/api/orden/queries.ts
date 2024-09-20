export interface OrdenGQL {
  id: string;
  ordenNumber: string;
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
    branchCategory?: {
      restaurantCategoryId?: string;
    };
    contactInfo?: {
      businessName: string;
      displayName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

export interface InvoiceGQL {
  id: string;
  ordenId: string;
  invoiceNumber: string;
  satInvoiceUuid: string;
  status: string;
  total: number;
  supplier: {
    id: string;
    name: string;
    active: boolean;
  };
  orden: {
    ordenDetailsId: string;
  };
  restaurantBranch: {
    id: string;
    branchName: string;
    fullAddress: string;
  };
  pdfFile?: string;
  xmlFile?: string;
}

export const getExternalOrdenDetailsQry = `query getExtOrdenDetails($ordenId: UUID!) {
    getExternalOrden(ordenId: $ordenId) {
      ... on OrdenGQL {
        id
        cart {
          unitPrice
          subtotal
          sellUnit
          quantity
          supplierProductPriceId
          suppProd {
            id
            sellUnit
            sku
            description
            minQuantity
            unitMultiple
            estimatedWeight
          }
        }
        details {
          cartId
          approvedBy
          ordenId
          version
          total
          tax
          subtotalWithoutTax
          subtotal
          shippingCost
          serviceFee
          paymentMethod
          packagingCost
          discount
          deliveryDate
          createdAt
          deliveryTime {
            end
            start
          }
          comments
          createdBy
          restaurantBranchId
        }
        status {
          status
          createdAt
        }
        ordenType
        paystatus {
          status
          createdAt
        }
        supplier {
          supplierBusinessAccount {
            supplierBusinessId
            legalRepName
            email
            phoneNumber
          }
          supplierBusiness {
            name
          }
        }
        branch {
          branchName
          id
          fullAddress
          branchCategory {
            restaurantCategoryId
          }
          contactInfo {
            businessName
            displayName
            email
            phoneNumber
          }
        }
        cart {
          cartId
          supplierProductPriceId
          unitPrice
          subtotal
          comments
          createdBy
          createdAt
          lastUpdated
        }
      }
      ... on OrdenError {
        code
        msg
      }
    }
  }`;

export interface B2BEcommerceOrdenInfo {
  orden: OrdenGQL;
  invoice?: InvoiceGQL;
}

export const getEcommOrdenDetailsQry = `query getEcommOrdenDetails($ordenId: UUID!, $secretKey: String!) {
  getEcommerceOrdenDetails(ordenId: $ordenId, refSecretKey: $secretKey) {
    ... on B2BEcommerceOrdenInfo {
      orden {
        id
        ordenNumber
        cart {
          unitPrice
          subtotal
          sellUnit
          quantity
          supplierProductPriceId
          suppProd {
            id
            sellUnit
            sku
            description
            minQuantity
            unitMultiple
            estimatedWeight
          }
        }
        details {
          cartId
          approvedBy
          ordenId
          version
          total
          tax
          subtotalWithoutTax
          subtotal
          shippingCost
          serviceFee
          paymentMethod
          packagingCost
          discount
          deliveryDate
          createdAt
          deliveryTime {
            end
            start
          }
          comments
          createdBy
          restaurantBranchId
        }
        status {
          status
          createdAt
        }
        ordenType
        paystatus {
          status
          createdAt
        }
        supplier {
          supplierBusinessAccount {
            supplierBusinessId
            legalRepName
            email
            phoneNumber
          }
          supplierBusiness {
            name
          }
        }
        branch {
          branchName
          id
          fullAddress
          branchCategory {
            restaurantCategoryId
          }
          contactInfo {
            businessName
            displayName
            email
            phoneNumber
          }
        }
        cart {
          cartId
          supplierProductPriceId
          unitPrice
          subtotal
          comments
          createdBy
          createdAt
          lastUpdated
        }
      }
      invoice {
        id
        ordenId
        invoiceNumber
        satInvoiceUuid
        status
        total
        supplier {
          id
          name
          active
        }
        orden {
          ordenDetailsId
        }
        restaurantBranch {
          id
          branchName
          fullAddress
        }
        pdfFile
        xmlFile
      }
    }
    ... on B2BEcommerceUserError {
      code
      msg
    }
  }
}`;

export interface B2BEcommerceHistorialOrdenes {
  ordenes: {
    orden: OrdenGQL;
    invoice?: InvoiceGQL;
  }[];
  totalResults: number;
}

export const geEcommOrdenHistoryQry = `query getEcommOrdenHistory($secretKey: String!, $fromDate: Date!, $toDate: Date!, $page: Int, $pSize: Int) {
  getEcommerceOrdenes(
    refSecretKey: $secretKey
    fromDate: $fromDate
    toDate: $toDate
    page: $page
    pageSize: $pSize
  ) {
    ... on B2BEcommerceHistorialOrdenes {
      totalResults
      ordenes {
        orden {
          id
          ordenNumber
          cart {
            subtotal
            quantity
          }
          details {
            approvedBy
            ordenId
            version
            subtotal
            total
            paymentMethod
            deliveryDate
            createdAt
            deliveryTime {
              end
              start
            }
            deliveryType
            createdBy
            restaurantBranchId
          }
          status {
            status
            createdAt
          }
          ordenType
          paystatus {
            status
            createdAt
          }
          supplier {
            supplierBusinessAccount {
              supplierBusinessId
              legalRepName
              email
              phoneNumber
            }
            supplierBusiness {
              name
            }
          }
        }
        invoice {
          id
          ordenId
          invoiceNumber
          satInvoiceUuid
          status
          total
          supplier {
            id
            name
            active
            notificationPreference
          }
          orden {
            ordenDetailsId
          }
          restaurantBranch {
            id
            branchName
            fullAddress
          }
        }
      }
    }
    ... on B2BEcommerceUserError {
      code
      msg
    }
  }
}`;
