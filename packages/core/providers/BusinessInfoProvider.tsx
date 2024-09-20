"use client";

import { createContext, useReducer } from "react";
import { setCookie } from "cookies-next";
import type {
  SellerInfoActions as SellerInfoActionsInterface,
  SellerInfoState,
  SellerType,
  SellerUnitInfoType,
} from "../domain/seller";
import { logErrorMap } from "../error/log";
import type { ErrorTypesInterface } from "../error/types";
import { genericErrorResponseMap, languageErrorMap } from "../error/language";
import { getSellerInfo } from "../data/api/seller";

const initialState: SellerInfoState = {
  seller: undefined,
  sellerUnits: [],
  assignedUnit: undefined,
  language: "es_MX",
  loading: false,
  error: undefined,
};

interface PayloadInterface {
  seller?: SellerType;
  units?: SellerUnitInfoType[];
  assignedUnit?: SellerUnitInfoType;
  error?: string;
  language?: string;
}

const reducer = (
  state: SellerInfoState,
  action: { type: string; payload: PayloadInterface }
): SellerInfoState => {
  const { seller, units, assignedUnit, error, language } = action.payload;
  if (action.type === "UPDATE_SELLER_INFO") {
    return {
      ...state,
      loading: false,
      seller,
      sellerUnits: units || [],
    };
  } else if (action.type === "ASSIGN_UNIT") {
    return {
      ...state,
      loading: false,
      assignedUnit,
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
    return {
      ...state,
      loading: false,
      error:
        languageErrorMap[state.language]?.[
          error as keyof ErrorTypesInterface
        ] || genericErrorResponseMap[state.language],
    };
  }
  return state;
};

/* eslint-disable @typescript-eslint/no-unused-vars -- safe */
const sellerInfoActions: SellerInfoActionsInterface = {
  fetchSellerInfo: (sellerId: string) => Promise.resolve(),
  setSellerUnit: (unitId: string) => Promise.resolve(),
  changeLanguage: (language: string) => Promise.resolve(),
};
/* eslint-enable @typescript-eslint/no-unused-vars -- safe */

const SellerInfoContext = createContext({
  ...initialState,
  ...sellerInfoActions,
});

interface SellerInfoProviderProps {
  apiURL: string;
  children: React.ReactNode;
};

function SellerInfoProvider({ apiURL, children }: SellerInfoProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize business info
  const fetchSellerInfo = async (sellerId: string): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      const seller = await getSellerInfo(apiURL, sellerId);
      dispatch({ type: "UPDATE_SELLER_INFO", payload: seller });
    } catch (error) {
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  // eslint-disable-next-line @typescript-eslint/require-await -- safe
  const setSellerUnit = async (unitId: string): Promise<void> => {
    dispatch({ type: "LOADING", payload: {} });
    try {
      if (state.sellerUnits.length === 0) {
        throw new Error("SELLER_INFO_NOT_AVAILABLE");
      }
      const unit = state.sellerUnits.find(
        (u: SellerUnitInfoType) => u.id === unitId
      );
      if (!unit) {
        throw new Error("SELLER_UNIT_NOT_FOUND");
      }
      // set cookie
      setCookie("supplierUnitId", unit.id);
      dispatch({ type: "ASSIGN_UNIT", payload: { assignedUnit: unit } });
    } catch (error) {
      dispatch({ type: "ERROR", payload: { error: error as string } });
    }
  };

  // eslint-disable-next-line @typescript-eslint/require-await -- safe
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
    <SellerInfoContext.Provider
      value={{
        ...state,
        ...sellerInfoActions,
        fetchSellerInfo,
        setSellerUnit,
        changeLanguage,
      }}
    >
      {children}
    </SellerInfoContext.Provider>
  );
};

export { SellerInfoContext, SellerInfoProvider };
