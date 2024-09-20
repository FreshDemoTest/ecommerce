/* eslint-disable @typescript-eslint/no-unused-vars -- safe for unwrapped */
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { ErrorCodes } from "../../../error";
import type {
  UserType,
  ClientType,
  BranchStateType,
} from "../../../domain/user";
import {
  type GQLError,
  buildAuthHeaders,
  graphQLFetch,
} from "../../../utils/graphql";
import {
  getClientInfoQry,
  type B2BCommerceUserInfo,
  addAddressQry,
  type AddressInfo,
  editAddressQry,
} from "./queries";

// consts
const GENERIC_USER_ERROR = "USER_INFO_NOT_AVAILABLE";

export async function getUserInfo(
  apiURL: string,
  token: string,
  sellerId: string
): Promise<{
  user?: UserType;
  client?: ClientType;
  addresses: BranchStateType[];
}> {
  try {
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: B2BCommerceUserInfo;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: getClientInfoQry,
      queryName: "getEcommerceClientInfo",
      variables: { secretKey: sellerId },
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_USER_ERROR]
      );
    }
    if (!data.user.id) {
      // no user id
      throw new Error(GENERIC_USER_ERROR);
    }
    if (!data.client.id) {
      // no client id
      throw new Error(GENERIC_USER_ERROR);
    }
    // build obj
    // user
    const user = data.user;
    // client
    const client: ClientType = {
      id: data.client.id,
      businessName: data.client.name,
      businessType: "restaurant",
      email: user.email,
      phoneNumber: user.phoneNumber,
      active: data.client.active,
    };
    // addresses
    const addresses: BranchStateType[] = data.addresses.map((a) => {
      const { contactInfo, branchCategory, taxInfo, ...address } = a;
      const _fiscalRegime = taxInfo?.fiscalRegime
        ? taxInfo.fiscalRegime.split("_")[1]
        : undefined;
      return {
        ...address,
        ...taxInfo,
        fiscalRegime: _fiscalRegime,
        branchCategory: branchCategory.restaurantCategoryId,
      };
    });
    // return
    return {
      user,
      client,
      addresses,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("USER_INFO_NOT_AVAILABLE");
  }
}

export async function addAddressInfo(
  apiURL: string,
  token: string,
  sellerId: string,
  address: BranchStateType
): Promise<{ addresses: BranchStateType[] }> {
  try {
    // create vars
    let brVars = {
      secretKey: sellerId,
      name: address.branchName,
      street: address.street,
      extN: address.externalNum,
      intN: address.internalNum || "",
      neigh: address.neighborhood,
      city: address.city,
      estate: address.estate,
      country: address.country,
      zipCode: address.zipCode,
      categoryId: address.branchCategory,
      fAddress: `${address.street} ${address.externalNum}${
        address.internalNum ? ` ${address.internalNum}` : ""
      }, ${address.neighborhood}, ${address.city}, ${address.estate}, ${
        address.country
      }, C.P. ${address.zipCode}`,
    };
    let taxVars = {};
    // verify all tax info
    if (
      address.taxId &&
      address.taxName &&
      address.taxAddress &&
      address.taxZipCode &&
      address.invoiceEmail &&
      address.cfdiUse &&
      address.fiscalRegime
    ) {
      taxVars = {
        RFC: address.taxId,
        lName: address.taxName.trim(),
        taxAddress: address.taxAddress,
        taxZip: address.taxZipCode,
        taxEmail: address.invoiceEmail,
        cfdi: address.cfdiUse,
        satReg: `REG_${address.fiscalRegime.toString()}`,
      };
    }
    brVars = { ...brVars, ...taxVars };
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: { addresses: AddressInfo[] };
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: addAddressQry,
      queryName: "addEcommerceClientAddress",
      variables: brVars,
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_USER_ERROR]
      );
    }
    // build obj
    if (data.addresses.length === 0) {
      throw new Error("USER_ISSUES_CREATING_ADDRESS");
    }
    // addresses
    const addresses: BranchStateType[] = data.addresses.map((a) => {
      const { contactInfo, branchCategory, taxInfo, ...newAddress } = a;
      const _fiscalRegime = taxInfo?.fiscalRegime
        ? taxInfo.fiscalRegime.split("_")[1]
        : undefined;
      return {
        ...newAddress,
        ...taxInfo,
        fiscalRegime: _fiscalRegime,
        branchCategory: branchCategory.restaurantCategoryId,
      };
    });
    // return
    return {
      addresses,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("USER_ISSUES_CREATING_ADDRESS");
  }
}

export async function editAddressInfo(
  apiURL: string,
  token: string,
  sellerId: string,
  address: BranchStateType
): Promise<{ addresses: BranchStateType[] }> {
  try {
    // create vars
    let brVars = {
      secretKey: sellerId,
      branchId: address.id,
      name: address.branchName,
      street: address.street,
      extN: address.externalNum,
      intN: address.internalNum || "",
      neigh: address.neighborhood,
      city: address.city,
      estate: address.estate,
      country: address.country,
      zipCode: address.zipCode,
      categoryId: address.branchCategory,
      fAddress: `${address.street} ${address.externalNum}${
        address.internalNum ? ` ${address.internalNum}` : ""
      }, ${address.neighborhood}, ${address.city}, ${address.estate}, ${
        address.country
      }, C.P. ${address.zipCode}`,
    };
    let taxVars = {};
    // verify all tax info
    if (
      address.taxId &&
      address.taxName &&
      address.taxAddress &&
      address.taxZipCode &&
      address.invoiceEmail &&
      address.cfdiUse &&
      address.fiscalRegime
    ) {
      taxVars = {
        RFC: address.taxId,
        lName: address.taxName.trim(),
        taxAddress: address.taxAddress,
        taxZip: address.taxZipCode,
        taxEmail: address.invoiceEmail,
        cfdi: address.cfdiUse,
        satReg: `REG_${address.fiscalRegime.toString()}`,
      };
    }
    brVars = { ...brVars, ...taxVars };
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: { addresses: AddressInfo[] };
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: editAddressQry,
      queryName: "updateEcommerceClientAddress",
      variables: brVars,
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_USER_ERROR]
      );
    }
    // build obj
    if (data.addresses.length === 0) {
      throw new Error("USER_ISSUES_CREATING_ADDRESS");
    }
    // addresses
    const addresses: BranchStateType[] = data.addresses.map((a) => {
      const { contactInfo, branchCategory, taxInfo, ...newAddress } = a;
      const _fiscalRegime = taxInfo?.fiscalRegime
        ? taxInfo.fiscalRegime.split("_")[1]
        : undefined;
      return {
        ...newAddress,
        ...taxInfo,
        fiscalRegime: _fiscalRegime,
        branchCategory: branchCategory.restaurantCategoryId,
      };
    });
    // return
    return {
      addresses,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("USER_ISSUES_CREATING_ADDRESS");
  }
}

export function setLocalDefaultAddress(
  token: string,
  address: BranchStateType
): void {
  localStorage.setItem(`${token}-defaultAddress`, JSON.stringify(address));
  setCookie("defaultAddressId", address.id);
}

export function resetLocalDefaultAddress(token: string): void {
  localStorage.removeItem(`${token}-defaultAddress`);
  deleteCookie("defaultAddressId");
}

export function getLocalDefaultAddress(
  token: string
): BranchStateType | undefined {
  const address = localStorage.getItem(`${token}-defaultAddress`);
  const cookieAddress = getCookie("defaultAddressId");
  if (address) {
    const parsedAddr = JSON.parse(address) as BranchStateType;
    if (!cookieAddress) {
      setLocalDefaultAddress(token, parsedAddr);
    }
    return parsedAddr;
  }
  return undefined;
}
