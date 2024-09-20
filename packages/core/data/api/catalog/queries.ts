
export interface ProductGQL {
    id: string;
    productUuid?: string;
    sku: string;
    upc: string;
    productDescription: string;
    sellUnit: string;
    minimumQuantity: number;
    unitMultiple: number;
    longDescription?: string;
    price: {
        uuid: string;
        amount: number;
        unit: string;
        validUntil: string;
    };
    taxAmount: number;
    iepsAmount?: number;
    images: string[];
    tags?: {
      id: string;
      supplierProductId: string;
      tagKey: string;
      tagValue: string;
      createdAt: Date;
    }[];
    stock: {
      uuid: string;
      stock: number;
      unit: string;
      active: boolean;
      amount: number;
      keepSellingWithoutStock: boolean;
    }
}

export interface EcommerceSellerCatalog {
    restaurantBranchId?: string;
    supplierUnitId: string;
    catalogType: string;
    products: ProductGQL[];
    categories: string[];
    totalResults: number;
}

export const getCatalogQry = `query getCatalog($secretKey: String!, $unitId: UUID!, $search: String, $page: Int, $pageSize: Int, $branchId: UUID) {
  getEcommerceSellerCatalog(
    refSecretKey: $secretKey
    supplierUnitId: $unitId
    search: $search
    page: $page
    pageSize: $pageSize
    restaurantBranchId: $branchId
  ) {
    ... on EcommerceSellerCatalog {
      restaurantBranchId
      supplierUnitId
      catalogType
      products {
        id
        productUuid: productId
        sku
        upc
        productDescription: description
        sellUnit
        minimumQuantity: minQuantity
        unitMultiple
        price: lastPrice {
          uuid: id
          amount: price
          unit: currency
          validUntil: validUpto
        }
        taxAmount: tax
        iepsAmount: mxIeps
        images
        tags {
          id
          supplierProductId
          tagKey
          tagValue
          createdAt
        }
        stock {
          uuid: id
          stock
          unit: stockUnit
          active
          amount: availability
          keepSellingWithoutStock
        }
      }
      categories
      totalResults
    }
    ... on EcommerceSellerError {
      code
      msg
    }
  }
}`;

export const getProductDetailsQry = `query getProductDetails($secretKey: String!, $unitId: UUID!, $prodId: UUID!, $branchId: UUID) {
  getEcommerceSellerProductDetails(
    refSecretKey: $secretKey
    supplierUnitId: $unitId
    supplierProductId: $prodId
    restaurantBranchId: $branchId
  ) {
    ... on EcommerceSellerCatalog {
      restaurantBranchId
      supplierUnitId
      catalogType
      products {
        id
        productUuid: productId
        sku
        upc
        productDescription: description
        sellUnit
        minimumQuantity: minQuantity
        unitMultiple
        longDescription
        price: lastPrice {
          uuid: id
          amount: price
          unit: currency
          validUntil: validUpto
        }
        taxAmount: tax
        iepsAmount: mxIeps
        images
        stock {
          uuid: id
          stock
          unit: stockUnit
          active
          amount: availability
          keepSellingWithoutStock
        }
      }
      categories
      totalResults
    }
    ... on EcommerceSellerError {
      code
      msg
    }
  }
}`;