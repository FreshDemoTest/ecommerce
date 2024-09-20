"use client";

import { createContext, useEffect, useReducer } from "react";
import { deleteCookie, hasCookie } from "cookies-next";
import { logErrorMap } from "../error/log";
import type { ErrorTypesInterface } from "../error/types";
import { genericErrorResponseMap, languageErrorMap } from "../error/language";
import type {
  BranchStateType,
  ClientInfoActions,
  ClientInfoState,
  ClientType,
  UserType,
} from "../domain/user";
import {
  addAddressInfo,
  editAddressInfo,
  getLocalDefaultAddress,
  getUserInfo,
  resetLocalDefaultAddress,
  setLocalDefaultAddress,
} from "../data/api/user";
import {
  fetchSessionTokenServer,
  getLocalSessionToken,
  isLoggedServer,
  loginServer,
  logoutServer,
  resetPasswordServer,
  sendPasswordResetCodeServer,
  setLocalSessionToken,
  signupServer,
} from "../data/api/auth";
import { isValidToken } from "../utils";

const initialState: ClientInfoState = {
  apiURL: "",
  isInitialized: false,
  isAuthenticated: false,
  sellerId: undefined,
  token: undefined,
  user: undefined,
  client: undefined,
  addresses: [],
  defaultAddress: undefined,
  language: "es_MX",
  loading: false,
  error: undefined,
};

interface PayloadInterface {
  apiURL?: string;
  sellerId?: string;
  token?: string;
  user?: UserType;
  client?: { user: UserType; client: ClientType; addresses: BranchStateType[] };
  addresses?: BranchStateType[];
  defaultAddress?: BranchStateType;
  error?: string;
  language?: string;
}

const reducer = (
  state: ClientInfoState,
  action: { type: string; payload: PayloadInterface }
): ClientInfoState => {
  const {
    apiURL,
    sellerId,
    token,
    user,
    client,
    addresses,
    defaultAddress,
    error,
    language,
  } = action.payload;
  if (action.type === "SET_SELLER_ID") {
    return {
      ...state,
      sellerId,
      apiURL: apiURL || "",
    };
  } else if (action.type === "SET_AUTHED_USER") {
    return {
      ...state,
      loading: false,
      isAuthenticated: true,
      user,
      error: undefined,
    };
  } else if (action.type === "LOGOUT_AUTHED_USER") {
    return {
      ...state,
      loading: false,
      isAuthenticated: false,
      user: undefined,
      error: undefined,
    };
  } else if (action.type === "CHANGE_LANGUAGE") {
    return {
      ...state,
      loading: false,
      language: language || "es_MX",
    };
  } else if (action.type === "LOADING") {
    return {
      ...state,
      loading: true,
    };
  } else if (action.type === "ERROR") {
    // eslint-disable-next-line no-console -- error logging
    console.warn(logErrorMap[error as keyof ErrorTypesInterface]);
    const errorMsg =
      languageErrorMap[state.language]?.[error as keyof ErrorTypesInterface] ||
      genericErrorResponseMap[state.language];
    return {
      ...state,
      loading: false,
      error: errorMsg,
    };
  } else if (action.type === "UPDATE_USER_INFO") {
    return {
      ...state,
      loading: false,
      isAuthenticated: true,
      user: client?.user,
      client: client?.client,
      addresses: client?.addresses || [],
      error: undefined,
    };
  } else if (action.type === "UPSERT_ADDRESS") {
    return {
      ...state,
      loading: false,
      addresses: addresses || [],
    };
  } else if (action.type === "SET_TOKEN") {
    return {
      ...state,
      loading: false,
      isInitialized: true,
      token,
    };
  } else if (action.type === "SET_DEFAULT_ADDRESS") {
    return {
      ...state,
      loading: false,
      defaultAddress,
    };
  }
  return state;
};

/* eslint-disable @typescript-eslint/no-unused-vars -- safe */
const clientInfoActions: ClientInfoActions = {
  initialize: () => Promise.resolve(),
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    projectUrl: string,
    phoneNumber?: string
  ) => Promise.resolve(),
  login: (email: string, password: string) => Promise.resolve(),
  logout: () => Promise.resolve(),
  getSessionToken: (refresh?: boolean) => Promise.resolve(),
  sendResetPasswordCode: (email: string, resetUrl: string) =>
    Promise.resolve(false),
  resetPasswordWithCode: (newPassword: string, resetCode: string) =>
    Promise.resolve(false),
  fetchUserInfo: () => Promise.resolve(),
  addAddress: (address: BranchStateType) => Promise.resolve(),
  editAddress: (address: BranchStateType) => Promise.resolve(),
  setDefaultAddress: (addressId: string) => void {},
  changeLanguage: (language: string) => Promise.resolve(),
};
/* eslint-enable @typescript-eslint/no-unused-vars -- safe */

const ClientInfoContext = createContext({
  ...initialState,
  ...clientInfoActions,
});

interface ClientInfoProviderProps {
  apiURL: string;
  sellerId: string;
  children: React.ReactNode;
}

function ClientInfoProvider({
  sellerId,
  apiURL,
  children,
}: ClientInfoProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  // initalizer
  useEffect(() => {
    // set sellerId
    dispatch({ type: "SET_SELLER_ID", payload: { sellerId, apiURL } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // initialize session
  const initialize = async (): Promise<void> => {
    let token = getLocalSessionToken(sellerId);
    if (!token || !isValidToken(token)) {
      try {
        const newToken = await fetchSessionTokenServer(
          apiURL,
          sellerId,
          Boolean(token),
          token || undefined
        );
        setLocalSessionToken(sellerId, newToken);
        token = newToken;
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: "ERROR", payload: { error: error.message } });
          return;
        }
        dispatch({ type: "ERROR", payload: { error: error as string } });
      }
    }
    // verify is logged in
    if (token) {
      try {
        const isLogged = await isLoggedServer(apiURL, sellerId, token);
        if (isLogged) {
          // if logged in fetch user info
          const userData = await getUserInfo(apiURL, token, sellerId);
          if (!userData.user || !userData.client) {
            throw new Error("AUTHOS_ERROR");
          }
          dispatch({
            type: "UPDATE_USER_INFO",
            payload: {
              client: {
                user: userData.user,
                client: userData.client,
                addresses: userData.addresses,
              },
            },
          });
          if (userData.addresses.length > 0) {
            let defAddress = getLocalDefaultAddress(token);
            if (!defAddress) {
              setLocalDefaultAddress(token, userData.addresses[0]!);
              defAddress = getLocalDefaultAddress(token);
            }
            dispatch({
              type: "SET_DEFAULT_ADDRESS",
              payload: { defaultAddress: defAddress },
            });
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: "ERROR", payload: { error: error.message } });
          return;
        }
        dispatch({ type: "ERROR", payload: { error: error as string } });
      }
    }
    dispatch({ type: "SET_TOKEN", payload: { token: token || undefined } });
  };

  const getSessionToken = async (refresh = false): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      // fetch token
      let localtoken = getLocalSessionToken(state.sellerId!);
      if (!localtoken || isValidToken(localtoken)) {
        const token = await fetchSessionTokenServer(
          state.apiURL,
          state.sellerId!,
          refresh,
          refresh ? state.token : undefined
        );
        setLocalSessionToken(state.sellerId!, token);
        localtoken = token;
      }
      dispatch({ type: "SET_TOKEN", payload: { token: localtoken } });
      // verify is logged in
      if (localtoken) {
        const isLogged = await isLoggedServer(
          state.apiURL,
          state.sellerId!,
          localtoken
        );
        if (isLogged) {
          // if logged in fetch user info
          const userData = await getUserInfo(
            state.apiURL,
            localtoken,
            state.sellerId!
          );
          if (!userData.user || !userData.client) {
            throw new Error("AUTHOS_ERROR");
          }
          dispatch({
            type: "UPDATE_USER_INFO",
            payload: {
              client: {
                user: userData.user,
                client: userData.client,
                addresses: userData.addresses,
              },
            },
          });
          if (userData.addresses.length > 0) {
            const defAddress = getLocalDefaultAddress(localtoken);
            dispatch({
              type: "SET_DEFAULT_ADDRESS",
              payload: { defaultAddress: defAddress },
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    projectUrl: string,
    phoneNumber?: string
  ): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    if (!state.token) {
      // retry to get token
      try {
        await getSessionToken(true);
        if (!state.token) {
          dispatch({
            type: "ERROR",
            payload: { error: "AUTHOS_ERROR_INVALID_SESSION" },
          });
          return;
        }
      } catch (error) {
        dispatch({
          type: "ERROR",
          payload: { error: "AUTHOS_ERROR_INVALID_SESSION" },
        });
        return;
      }
    }
    try {
      const userData = await signupServer(
        state.apiURL,
        state.sellerId!,
        state.token,
        email,
        password,
        firstName,
        lastName,
        phoneNumber || "",
        projectUrl
      );
      dispatch({
        type: "SET_AUTHED_USER",
        payload: {
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
          },
        },
      });
      if (userData.session?.sessionToken) {
        setLocalSessionToken(state.sellerId!, userData.session.sessionToken);
        dispatch({
          type: "SET_TOKEN",
          payload: { token: userData.session.sessionToken },
        });
      }
      // fetch user info after login
      await fetchUserInfo();
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    if (!state.token) {
      // retry to get token
      try {
        await getSessionToken(true);
        if (!state.token) {
          dispatch({
            type: "ERROR",
            payload: { error: "AUTHOS_ERROR_INVALID_SESSION" },
          });
          return;
        }
      } catch (error) {
        dispatch({
          type: "ERROR",
          payload: { error: "AUTHOS_ERROR_INVALID_SESSION" },
        });
        return;
      }
    }
    try {
      const userData = await loginServer(
        state.apiURL,
        state.sellerId!,
        state.token,
        email,
        password
      );
      dispatch({
        type: "SET_AUTHED_USER",
        payload: {
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
          },
        },
      });
      if (userData.session?.sessionToken) {
        setLocalSessionToken(state.sellerId!, userData.session.sessionToken);
        dispatch({
          type: "SET_TOKEN",
          payload: { token: userData.session.sessionToken },
        });
      }
      // fetch user info after login
      await fetchUserInfo();
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    if (!state.token) {
      dispatch({
        type: "ERROR",
        payload: { error: "AUTHOS_ERROR_INVALID_SESSION" },
      });
      return;
    }
    try {
      const check = await logoutServer(
        state.apiURL,
        state.sellerId!,
        state.token
      );
      if (!check) {
        throw new Error("AUTHOS_ERROR");
      }
      // delete both supplierUnitID cookies
      ["supplierUnitId"].forEach((cookieKey) => {
        if (hasCookie(cookieKey)) {
          deleteCookie(cookieKey);
        }
      });
      resetLocalDefaultAddress(state.token);
      dispatch({ type: "LOGOUT_AUTHED_USER", payload: {} });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  const sendResetPasswordCode = async (
    email: string,
    resetUrl: string
  ): Promise<boolean> => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      const check = await sendPasswordResetCodeServer(
        state.apiURL,
        state.sellerId!,
        email,
        resetUrl
      );
      return check;
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return false;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
      return false;
    }
  };

  const resetPasswordWithCode = async (
    newPassword: string,
    resetCode: string
  ): Promise<boolean> => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      const check = await resetPasswordServer(
        state.apiURL,
        state.sellerId!,
        newPassword,
        resetCode
      );
      return check;
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return false;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
      return false;
    }
  };

  // Initialize business info
  const fetchUserInfo = async (): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      const client = await getUserInfo(
        state.apiURL,
        state.token!,
        state.sellerId!
      );
      if (!client.user || !client.client) {
        throw new Error("USER_INFO_NOT_AVAILABLE");
      }
      dispatch({
        type: "UPDATE_USER_INFO",
        payload: {
          client: {
            user: client.user,
            client: client.client,
            addresses: client.addresses,
          },
        },
      });
      let defAddress = getLocalDefaultAddress(state.token!);
      if (!defAddress && client.addresses.length > 0) {
        setLocalDefaultAddress(state.token!, client.addresses[0]!);
        defAddress = getLocalDefaultAddress(state.token!);
      }
      dispatch({
        type: "SET_DEFAULT_ADDRESS",
        payload: { defaultAddress: defAddress },
      });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  const addAddress = async (address: BranchStateType): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      const branches = await addAddressInfo(
        state.apiURL,
        state.token!,
        state.sellerId!,
        address
      );
      dispatch({ type: "UPSERT_ADDRESS", payload: branches });
      if (branches.addresses.length === 1) {
        const defAddres = branches.addresses[0];
        if (defAddres) {
          setLocalDefaultAddress(state.token!, defAddres);
        }
        dispatch({
          type: "SET_DEFAULT_ADDRESS",
          payload: { defaultAddress: defAddres },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  const editAddress = async (address: BranchStateType): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      const branches = await editAddressInfo(
        state.apiURL,
        state.token!,
        state.sellerId!,
        address
      );
      dispatch({ type: "UPSERT_ADDRESS", payload: branches });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  const setDefaultAddress = (addressId: string): void => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      const _addresses = [...state.addresses];
      const index = _addresses.findIndex((a) => a.id === addressId);
      if (index < 0) {
        throw new Error("USER_ISSUES_SETTING_DEFAULT_ADDRESS");
      }
      const defAddres = _addresses[index];
      if (defAddres) {
        setLocalDefaultAddress(state.token!, defAddres);
      }
      dispatch({
        type: "SET_DEFAULT_ADDRESS",
        payload: { defaultAddress: defAddres },
      });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "ERROR", payload: { error: error.message } });
        return;
      }
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const changeLanguage = async (language: string): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHANGE_LANGUAGE",
      payload: {
        language,
      },
    });
  };

  return (
    <ClientInfoContext.Provider
      value={{
        ...state,
        ...clientInfoActions,
        initialize,
        getSessionToken,
        register,
        login,
        logout,
        sendResetPasswordCode,
        resetPasswordWithCode,
        fetchUserInfo,
        addAddress,
        editAddress,
        setDefaultAddress,
        changeLanguage,
      }}
    >
      {children}
    </ClientInfoContext.Provider>
  );
}

export { ClientInfoContext, ClientInfoProvider };
