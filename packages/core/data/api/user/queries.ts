import type { UserType } from "../../../domain/user";

export interface AddressInfo {
  id: string;
  branchName: string;
  street: string;
  externalNum: string;
  internalNum: string;
  neighborhood: string;
  city: string;
  estate: string;
  country: string;
  fullAddress: string;
  zipCode: string;
  branchCategory: {
    restaurantCategoryId: string;
  };
  deleted: boolean;
  contactInfo: {
    businessName: string;
    email: string;
    phoneNumber: string;
  };
  taxInfo?: {
    taxId?: string;
    fiscalRegime?: string;
    taxName?: string;
    taxAddress?: string;
    cfdiUse?: string;
    taxZipCode?: string;
    invoiceEmail?: string;
  };
  tags?: {
    id: string;
    tagKey: string;
    tagValue: string;
  }[]
}

export interface B2BCommerceUserInfo {
  user: UserType;
  client: {
    id: string;
    name: string;
    country: string;
    active: boolean;
  };
  addresses: AddressInfo[];
}

export const getClientInfoQry = `query getClientInfo($secretKey: String!) {
    getEcommerceClientInfo(refSecretKey: $secretKey) {
      ... on B2BEcommerceUserInfo {
        user {
          id
          firstName
          lastName
          email
          phoneNumber
        }
        client {
          id
          name
          country
          active
        }
        addresses {
          id
          branchName
          street
          externalNum
          internalNum
          neighborhood
          city
          estate: state
          country
          fullAddress
          zipCode
          branchCategory {
            restaurantCategoryId
          }
          deleted
          contactInfo {
            businessName
            email
            phoneNumber
          }
          taxInfo {
            taxId: mxSatId
            fiscalRegime: satRegime
            taxName: legalName
            taxAddress: fullAddress
            cfdiUse
            taxZipCode: zipCode
            invoiceEmail: email
          }
          tags {
            id
            tagKey
            tagValue
          }
        }
      }
      ... on B2BEcommerceUserError {
        msg
        code
      }
    }
  }`;

export const addAddressQry = `mutation addAddress($secretKey: String!, $name: String!, $street: String!, $extN: String!, $intN: String!, $neigh: String!, $city: String!, $estate: String!, $country: String!, $zipCode: String!, $categoryId: UUID, $fAddress: String!, $cfdi: CFDIUse, $taxEmail: String, $taxAddress: String, $lName: String, $RFC: String, $satReg: RegimenSat, $taxZip: String) {
    addEcommerceClientAddress(
      refSecretKey: $secretKey
      branchName: $name
      street: $street
      externalNum: $extN
      internalNum: $intN
      neighborhood: $neigh
      city: $city
      state: $estate
      country: $country
      zipCode: $zipCode
      categoryId: $categoryId
      fullAddress: $fAddress
      cfdiUse: $cfdi
      taxEmail: $taxEmail
      taxFullAddress: $taxAddress
      legalName: $lName
      mxSatId: $RFC
      satRegime: $satReg
      taxZipCode: $taxZip
    ) {
      ... on B2BEcommerceUserInfo {
        addresses {
          id
          branchName
          street
          externalNum
          internalNum
          neighborhood
          city
          estate: state
          country
          fullAddress
          zipCode
          branchCategory {
            restaurantCategoryId
          }
          deleted
          contactInfo {
            businessName
            email
            phoneNumber
          }
          taxInfo {
            taxId: mxSatId
            fiscalRegime: satRegime
            taxName: legalName
            taxAddress: fullAddress
            cfdiUse
            taxZipCode: zipCode
            invoiceEmail: email
          }
        }
      }
      ... on B2BEcommerceUserError {
        msg
        code
      }
    }
  }`;

export const editAddressQry = `mutation editAddress($secretKey: String!, $branchId: UUID! $name: String, $street: String, $extN: String, $intN: String, $neigh: String, $city: String, $estate: String, $country: String, $zipCode: String, $categoryId: UUID, $fAddress: String, $cfdi: CFDIUse, $taxEmail: String, $taxAddress: String, $lName: String, $RFC: String, $satReg: RegimenSat, $taxZip: String) {
  updateEcommerceClientAddress(
     refSecretKey: $secretKey
     restaurantBranchId: $branchId
     branchName: $name
     street: $street
     externalNum: $extN
     internalNum: $intN
     neighborhood: $neigh
     city: $city
     state: $estate
     country: $country
     zipCode: $zipCode
     categoryId: $categoryId
     fullAddress: $fAddress
     cfdiUse: $cfdi
     taxEmail: $taxEmail
     taxFullAddress: $taxAddress
     legalName: $lName
     mxSatId: $RFC
     satRegime: $satReg
     taxZipCode: $taxZip
   ) {
     ... on B2BEcommerceUserInfo {
       addresses {
         id
         branchName
         street
         externalNum
         internalNum
         neighborhood
         city
         estate: state
         country
         fullAddress
         zipCode
         branchCategory {
           restaurantCategoryId
         }
         deleted
         contactInfo {
           businessName
           email
           phoneNumber
         }
         taxInfo {
           taxId: mxSatId
           fiscalRegime: satRegime
           taxName: legalName
           taxAddress: fullAddress
           cfdiUse
           taxZipCode: zipCode
           invoiceEmail: email
         }
       }
     }
     ... on B2BEcommerceUserError {
       msg
       code
     }
   }
 }`;
