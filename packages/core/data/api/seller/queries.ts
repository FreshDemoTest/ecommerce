export interface EcommerceSellerUnitGQL {
  id: string;
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
  fullAddress?: string;
  allowedPaymentMethods: string[];
  accountNumber?: string;
  deliveryInfo: {
    sellingOption: string[];
    regions: string[];
    deliveryTimeWindow: number;
    cutoffTime: number;
    warningTime: number;
    serviceHours: {
      dow: number;
      end: number;
      start: number;
    }[];
  };
}

export interface EcommerceSellerGQL {
  id: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  website?: string;
  businessType: string;
  active?: boolean;
  minimumOrderValue: {
    amount: number;
    measure: string;
  };
  policyTerms?: string;
  allowedPaymentMethods: string[];
  accountNumber?: string;
  units: EcommerceSellerUnitGQL[];
  ecommerceParams: {
    supplierBusinessId: string;
    sellerName: string;
    secretKey: string;
    ecommerceUrl: string;
    projectName: string;
    bannerImg: string;
    bannerImgHref: string;
    categories: string;
    recProds: string;
    stylesJson: string;
    shippingEnabled: boolean;
    shippingRuleVerifiedBy: string;
    shippingThreshold: number;
    shippingCost: number;
    searchPlaceholder: string;
    footerMsg: string;
    footerCta: string;
    footerPhone: string;
    footerIsWa: boolean;
    footerEmail: string;
    seoDescription: string;
    seoKeywords: string;
    defaultSupplierUnitId: string;
    commerceDisplay: string;
    accountActive?: boolean;
    currency?: string;
  };
}

export const getSellerInfoQry = `query getSellerInfo($secretKey: String!) {
    getEcommerceSellerInfo(refSecretKey: $secretKey) {
      ... on EcommerceSellerGQL {
        id
        businessName: name
        email
        phoneNumber
        website
        businessType
        active
        minimumOrderValue {
          amount
          measure
        }
        policyTerms
        allowedPaymentMethods
        accountNumber
        units {
          id
          unitName
          street
          externalNum
          internalNum
          neighborhood
          city
          estate: state
          country
          zipCode
          fullAddress
          allowedPaymentMethods
          accountNumber
          deleted
          deliveryInfo {
            sellingOption
            regions
            deliveryTimeWindow
            cutoffTime
            warningTime
            serviceHours {
              dow
              end
              start
            }
          }
        }
        ecommerceParams {
          supplierBusinessId
          sellerName
          secretKey
          ecommerceUrl
          projectName
          bannerImg
          categories
          recProds
          stylesJson
          shippingEnabled
          shippingRuleVerifiedBy
          shippingThreshold
          shippingCost
          searchPlaceholder
          footerMsg
          footerCta
          footerPhone
          footerIsWa
          footerEmail
          seoDescription
          seoKeywords
          defaultSupplierUnitId
          commerceDisplay
          accountActive
          currency
        }
      }
    }
  }`;


export interface EcommerceAssignSellerUnitMsg {
  supplierUnitId?: string;
  status: boolean;
  msg: string;
}

export const getCorrespondentUnitQry = `query getCorrespondentUnit($secretKey: String!, $branchId: UUID!) {
  getCorrespondentEcommerceSellerUnit(
    refSecretKey: $secretKey
    restaurantBranchId: $branchId
  ) {
    ... on EcommerceAssignSellerUnitMsg {
      supplierUnitId
      status
      msg
    }
    ... on EcommerceSellerError {
      code
      msg
    }
  }
}`;
