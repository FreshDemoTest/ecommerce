import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { ErrorCodes } from "../../../error/types";
import type { SessionTokenResult, UserType } from "../../../domain/user";
import {
  type GQLError,
  graphQLFetch,
  buildAuthHeaders,
} from "../../../utils/graphql";
import {
  type GQLEcommerceSession,
  type GQLEcommerceUserMsg,
  type GQLEcommerceUser,
  type GQLEcommercePassword,
  getSessionTokenQry,
  getSessionTokenRefreshQry,
  loginUserQry,
  signupUserQry,
  logoutUserQry,
  sendRestoreCodeQry,
  resetPasswordQry,
  isUserLoggedInQry,
} from "./queries";

// ----------------------------------------

// constants and private functions

const GENERIC_AUTH_ERROR = 11000;

// ----------------------------------------

// local storage

export function getLocalSessionToken(sellerId: string): string | null {
  const _lsess = localStorage.getItem(`sessionToken-${sellerId}`);
  const cooksess = getCookie("token");
  if (_lsess && !cooksess) {
    setLocalSessionToken(sellerId, _lsess);
  }
  return _lsess;
}

export function setLocalSessionToken(
  sellerId: string,
  accessToken: string
): void {
  if (accessToken) {
    localStorage.setItem(`sessionToken-${sellerId}`, accessToken);
    setCookie("token", accessToken);
  } else {
    localStorage.removeItem(`sessionToken-${sellerId}`);
    deleteCookie("token");
  }
}

// ----------------------------------------

export async function fetchSessionTokenServer(
  apiURL: string,
  sellerId: string,
  refresh = false,
  token?: string
): Promise<string> {
  let _sessionToken = "";
  try {
    if (refresh && token) {
      // add authorization aut
      const headrs = buildAuthHeaders(sellerId, token);
      const {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
        error,
      }: {
        data: GQLEcommerceSession;
        error: GQLError;
      } = await graphQLFetch({
        graphQLEndpoint: apiURL,
        query: getSessionTokenRefreshQry,
        queryName: "getEcommerceSessionToken",
        variables: { secretKey: sellerId },
        headers: {
          ...headrs,
        },
      });
      if (error.code) {
        // eslint-disable-next-line no-console
        console.error("Session refresh error", error);
      }
      if (data.sessionToken) {
        return _sessionToken;
      }
    }
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: GQLEcommerceSession;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: getSessionTokenQry,
      queryName: "getEcommerceSessionToken",
      variables: { secretKey: sellerId },
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_AUTH_ERROR]
      );
    }
    if (!data.sessionToken) {
      throw new Error("AUTHOS_ERROR_CREATING_SESSION");
    }
    _sessionToken = data.sessionToken;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
  return _sessionToken;
}

export async function isLoggedServer(
  apiURL: string,
  sellerId: string,
  token: string
): Promise<boolean> {
  let _status = false;
  try {
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: GQLEcommerceUserMsg;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: isUserLoggedInQry,
      queryName: "isEcommerceUserLoggedIn",
      variables: { secretKey: sellerId },
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_AUTH_ERROR]
      );
    }
    _status = data.status || false;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
  return _status;
}

export async function loginServer(
  apiURL: string,
  sellerId: string,
  token: string,
  email: string,
  password: string
): Promise<UserType & { session?: SessionTokenResult }> {
  try {
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: GQLEcommerceUser;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: loginUserQry,
      queryName: "loginEcommerceUser",
      variables: { secretKey: sellerId, email, pwd: password },
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_AUTH_ERROR]
      );
    }
    if (!data.id) {
      // no user id
      throw new Error("AUTHOS_ERROR");
    }
    // format data and return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { disabled, createdAt, ...userData } = data;
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("AUTHOS_ERROR");
  }
}

export async function signupServer(
  apiURL: string,
  sellerId: string,
  token: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  urlForEmail: string
): Promise<UserType & { session?: SessionTokenResult }> {
  try {
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: GQLEcommerceUser;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: signupUserQry,
      queryName: "signupEcommerceUser",
      variables: {
        secretKey: sellerId,
        email,
        pwd: password,
        fName: firstName,
        lName: lastName,
        phoneNumber: phoneNumber.toString(),
        url: urlForEmail,
      },
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_AUTH_ERROR]
      );
    }
    if (!data.id) {
      // no user id
      throw new Error("AUTHOS_ERROR");
    }
    // format data and return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { disabled, createdAt, ...userData } = data;
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("AUTHOS_ERROR");
  }
}

export async function logoutServer(
  apiURL: string,
  sellerId: string,
  token: string
): Promise<boolean> {
  let _status = false;
  try {
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: GQLEcommerceUserMsg;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: logoutUserQry,
      queryName: "logoutEcommerceUser",
      variables: { secretKey: sellerId },
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_AUTH_ERROR]
      );
    }
    _status = data.status === false;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
  return _status;
}

export async function sendPasswordResetCodeServer(
  apiURL: string,
  sellerId: string,
  email: string,
  resetUrl: string
): Promise<boolean> {
  let _status = false;
  try {
    // add authorization aut
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: GQLEcommercePassword;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: sendRestoreCodeQry,
      queryName: "postEcommerceSendRestoreCode",
      variables: { secretKey: sellerId, email, url: resetUrl },
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_AUTH_ERROR]
      );
    }
    _status = data.status || false;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
  return _status;
}

export async function resetPasswordServer(
  apiURL: string,
  sellerId: string,
  newPassword: string,
  code: string
): Promise<boolean> {
  let _status = false;
  try {
    // add authorization aut
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: GQLEcommerceUserMsg;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: resetPasswordQry,
      queryName: "postEcommerceResetPassword",
      variables: { secretKey: sellerId, newPwd: newPassword, resToken: code },
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_AUTH_ERROR]
      );
    }
    _status = data.status || false;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
  return _status;
}
