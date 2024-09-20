/* eslint-disable @typescript-eslint/no-empty-function -- has signature */
"use client";

import { createContext, useReducer } from "react";
import type { SupplierProductType } from "ui/domain";
import { fCurrency } from "ui/utils";
import {
  CHECKOUT_STEPS,
  type CommercePaymentMethod,
  type CartActions as CartActionsInterface,
  type CartDetails,
  type CartState,
} from "../domain";
import {
  deleteCartProduct,
  getCart,
  initSellerCart,
  reloadCart,
  setCart,
  setCartProductQuantity,
  updateCartProductQuantity,
  upsertCartProduct,
} from "../data/api";
import { logErrorMap } from "../error/log";
import type { ErrorTypesInterface } from "../error/types";
import { genericErrorResponseMap, languageErrorMap } from "../error/language";
import type { DeliveryType } from "../domain/seller";
import type { BranchStateType } from "../domain/user";

const initialState: CartState = {
  assignedUnitId: undefined,
  token: undefined,
  totalPrice: 0,
  subtotalPriceWOTax: 0,
  taxPrice: 0,
  formattedTotalPrice: "",
  cartCount: 0,
  cartDetails: {},
  shouldDisplayCart: false,
  currency: "MXN",
  language: "es_MX",
  loading: false,
  error: undefined,
  // checkout
  serviceAvailable: true,
  currentCheckoutStep: 1,
  totalCheckoutSteps: CHECKOUT_STEPS.length,
  deliveryType: "delivery",
  comments: "",
  deliveryDate: undefined,
  deliveryTime: undefined,
  deliveryAddress: undefined,
  paymentMethod: undefined,
};

interface PayloadInterface {
  token?: string;
  assignedUnitId?: string;
  cartDetails?: CartDetails;
  error?: string;
  language?: string;
  currency?: string;
  checkoutStep?: number;
  deliveryType?: DeliveryType;
  comments?: string;
  deliveryDate?: Date;
  deliveryTime?: string;
  deliveryAddress?: BranchStateType;
  serviceAvailable?: boolean;
  paymentMethod?: CommercePaymentMethod;
}

const reducer = (
  state: CartState,
  action: { type: string; payload: PayloadInterface }
): CartState => {
  const {
    assignedUnitId,
    token,
    cartDetails,
    error,
    language,
    currency,
    checkoutStep,
    paymentMethod,
  } = action.payload;
  if (action.type === "ASSIGN_UNIT") {
    return {
      ...state,
      loading: false,
      assignedUnitId,
      token,
    };
  } else if (action.type === "LOAD_CART") {
    const cartDets = { ...cartDetails };
    const cartDetailsArray = Object.values(cartDets);
    // total calculation
    const totalPrice = cartDetailsArray.reduce((acc, item) => {
      return acc + (item.total || 0);
    }, 0);
    // tax calculation
    const cartTaxs = cartDetailsArray.map(
      (item) =>
        (item.supplierProduct.taxAmount || 0) *
          (item.supplierProduct.price?.amount || 0) *
          item.quantity *
          (item.supplierProduct.unitMultiple || 1) +
        (item.supplierProduct.iepsAmount || 0) *
          (item.supplierProduct.price?.amount || 0) *
          item.quantity *
          (item.supplierProduct.unitMultiple || 1)
    );
    const _tax = cartTaxs.reduce((acc, tax) => acc + tax, 0);
    // subtotal calculation
    const _subtotal = totalPrice - _tax;
    const formattedTotalPrice = `${fCurrency(totalPrice)} ${state.currency}`;
    const cartCount = cartDetailsArray.length;
    return {
      ...state,
      loading: false,
      cartDetails: cartDets,
      subtotalPriceWOTax: _subtotal,
      taxPrice: _tax,
      totalPrice,
      formattedTotalPrice,
      cartCount,
    };
  } else if (action.type === "CHANGE_LANGUAGE") {
    return {
      ...state,
      loading: false,
      language: language || "es_MX",
    };
  } else if (action.type === "CHANGE_CURRENCY") {
    return {
      ...state,
      loading: false,
      currency: currency || "MXN",
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
  } else if (action.type === "HANDLE_CART_CLICK") {
    return {
      ...state,
      loading: false,
      shouldDisplayCart: !state.shouldDisplayCart,
    };
  } else if (action.type === "CHECKOUT_STEP_CHANGE") {
    return {
      ...state,
      loading: false,
      currentCheckoutStep: checkoutStep!,
    };
  } else if (action.type === "CHECKOUT_DELIVERY_TYPE_CHANGE") {
    return {
      ...state,
      loading: false,
      deliveryType: action.payload.deliveryType!,
    };
  } else if (action.type === "CHECKOUT_COMMENTS_CHANGE") {
    return {
      ...state,
      loading: false,
      comments: action.payload.comments!,
    };
  } else if (action.type === "CHECKOUT_DELIVERY_DATE_CHANGE") {
    return {
      ...state,
      loading: false,
      deliveryDate: action.payload.deliveryDate,
    };
  } else if (action.type === "CHECKOUT_DELIVERY_TIME_CHANGE") {
    return {
      ...state,
      loading: false,
      deliveryTime: action.payload.deliveryTime,
    };
  } else if (action.type === "CHECKOUT_DELIVERY_ADDRESS_CHANGE") {
    return {
      ...state,
      loading: false,
      deliveryAddress: action.payload.deliveryAddress,
    };
  } else if (action.type === "CHECKOUT_SERVICE_AVAILABLE_CHANGE") {
    return {
      ...state,
      loading: false,
      serviceAvailable: action.payload.serviceAvailable || false,
    };
  } else if (action.type === "CHECKOUT_PAYMENT_CHANGE") {
    return {
      ...state,
      loading: false,
      paymentMethod,
    };
  } else if (action.type === "CLEAR_CHECKOUT") {
    return {
      ...state,
      loading: false,
      currentCheckoutStep: 1,
      deliveryType: "delivery",
      comments: "",
      deliveryDate: undefined,
      deliveryTime: undefined,
      deliveryAddress: undefined,
      serviceAvailable: true,
      paymentMethod: undefined,
    };
  }
  return state;
};

/* eslint-disable @typescript-eslint/no-unused-vars -- safe */
const cartActions: CartActionsInterface = {
  assignUnit: (unitId: string, token: string) => {},
  addItem: (
    product: SupplierProductType,
    options?: { count: number; comments?: string }
  ) => {},
  removeItem: (id: string) => {},
  decrementItem: (
    id: string,
    options?: { count: number; comments?: string }
  ) => {},
  incrementItem: (
    id: string,
    options?: { count: number; comments?: string }
  ) => {},
  setItemQuantity: (id: string, quantity: number, comments?: string) => {},
  clearCart: () => {},
  loadCart: () => {},
  refreshCart: (apiURL: string, sellerId: string) => {},
  handleCartHover: () => {},
  handleCartClick: () => {},
  handleCartClose: () => {},
  changeLanguage: (language: string) => {},
  changeCurrency: (currency: string) => {},
  changeCheckoutStep: (checkoutStep: number) => {},
  changeDeliveryType: (deliveryType: DeliveryType) => {},
  changeComments: (comments: string) => {},
  changeDeliveryDate: (deliveryDate: Date) => {},
  changeDeliveryTime: (deliveryTime: string) => {},
  changeDeliveryAddress: (deliveryAddress: BranchStateType | undefined) => {},
  changeServiceAvailable: (serviceAvailable: boolean) => {},
  changePaymentMethod: (paymentMethod: CommercePaymentMethod) => {},
};
/* eslint-enable @typescript-eslint/no-unused-vars -- safe */

const CartContext = createContext({
  ...initialState,
  ...cartActions,
});

interface CartProviderProps {
  children: React.ReactNode;
}

function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  const _verifyAssignedUnit = (): boolean => {
    if (!state.assignedUnitId) {
      dispatch({
        type: "ERROR",
        payload: {
          error: "CART_NO_ASSIGNED_UNIT",
        },
      });
      return false;
    }
    return true;
  };

  const _getCart = (): void => {
    dispatch({ type: "LOADING", payload: {} });
    if (!_verifyAssignedUnit()) return;
    // Get cart from local storage
    const _cart = getCart(state.assignedUnitId!, state.token!);
    dispatch({
      type: "LOAD_CART",
      payload: {
        cartDetails: _cart,
      },
    });
  };

  // Implement the rest of the methods of CartActions
  const assignUnit = (unitId: string, token: string): void => {
    dispatch({ type: "LOADING", payload: {} });
    // Assign unit
    initSellerCart(unitId, token);
    dispatch({
      type: "ASSIGN_UNIT",
      payload: {
        assignedUnitId: unitId,
        token,
      },
    });
  };

  const loadCart = (): void => {
    _getCart();
  };

  const refreshCart = (apiURL: string, sellerId: string): void => {
    if (!_verifyAssignedUnit()) return;
    // Refresh cart
    const _refreshAsyncCart = async (): Promise<void> => {
      await reloadCart(apiURL, sellerId, state.assignedUnitId!, state.token!);
      _getCart();
    };
    void _refreshAsyncCart();
  };

  const clearCart = (): void => {
    dispatch({ type: "LOADING", payload: {} });
    // Clear cart
    if (!state.assignedUnitId) return;
    setCart(state.assignedUnitId, state.token!, {});
    dispatch({
      type: "LOAD_CART",
      payload: {
        cartDetails: {},
      },
    });
    // clear delivery time and delivery date
    dispatch({
      type: "CLEAR_CHECKOUT",
      payload: {},
    });
  };

  const addItem = (
    product: SupplierProductType,
    options?: { count: number; comments?: string }
  ): void => {
    dispatch({ type: "LOADING", payload: {} });
    // Add item to cart
    if (!_verifyAssignedUnit()) return;
    const minQty = product.minimumQuantity / product.unitMultiple;
    const cartDetails = upsertCartProduct(state.assignedUnitId!, state.token!, {
      supplierProduct: product,
      quantity: options ? options.count : minQty,
      comments: options?.comments || "",
    });
    dispatch({
      type: "LOAD_CART",
      payload: {
        cartDetails,
      },
    });
  };

  const removeItem = (id: string): void => {
    dispatch({ type: "LOADING", payload: {} });
    // remove item to cart
    if (!_verifyAssignedUnit()) return;
    const cartDetails = deleteCartProduct(
      state.assignedUnitId!,
      state.token!,
      id
    );
    dispatch({
      type: "LOAD_CART",
      payload: {
        cartDetails,
      },
    });
  };

  const decrementItem = (
    id: string,
    options?: { count: number; comments?: string }
  ): void => {
    dispatch({ type: "LOADING", payload: {} });
    // decrease amount item to cart
    if (!_verifyAssignedUnit()) return;
    const cartDetails = updateCartProductQuantity(
      state.assignedUnitId!,
      state.token!,
      id,
      options?.count || -1
    );
    dispatch({
      type: "LOAD_CART",
      payload: {
        cartDetails,
      },
    });
  };

  const incrementItem = (
    id: string,
    options?: { count: number; comments?: string }
  ): void => {
    dispatch({ type: "LOADING", payload: {} });
    // increase amount item to cart
    if (!_verifyAssignedUnit()) return;
    const cartDetails = updateCartProductQuantity(
      state.assignedUnitId!,
      state.token!,
      id,
      options?.count || 1
    );
    dispatch({
      type: "LOAD_CART",
      payload: {
        cartDetails,
      },
    });
  };

  const setItemQuantity = (
    id: string,
    quantity: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- safe
    comments?: string
  ): void => {
    dispatch({ type: "LOADING", payload: {} });
    // increase amount item to cart
    if (!_verifyAssignedUnit()) return;
    const cartDetails = setCartProductQuantity(
      state.assignedUnitId!,
      state.token!,
      id,
      quantity
    );
    dispatch({
      type: "LOAD_CART",
      payload: {
        cartDetails,
      },
    });
  };

  const handleCartClick = (): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "HANDLE_CART_CLICK",
      payload: {},
    });
  };

  const changeLanguage = (language: string): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHANGE_LANGUAGE",
      payload: {
        language,
      },
    });
  };

  const changeCurrency = (currency: string): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHANGE_CURRENCY",
      payload: {
        currency,
      },
    });
  };

  const changeCheckoutStep = (checkoutStep: number): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHECKOUT_STEP_CHANGE",
      payload: {
        checkoutStep,
      },
    });
  };

  const changeDeliveryType = (deliveryType: DeliveryType): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHECKOUT_DELIVERY_TYPE_CHANGE",
      payload: {
        deliveryType,
      },
    });
    // if deliveryType == pickup, change serviceAvailable to true
    if (deliveryType === "pickup") {
      dispatch({
        type: "CHECKOUT_SERVICE_AVAILABLE_CHANGE",
        payload: {
          serviceAvailable: true,
        },
      });
    }
  };

  const changeComments = (comments: string): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHECKOUT_COMMENTS_CHANGE",
      payload: {
        comments,
      },
    });
  };

  const changeDeliveryDate = (deliveryDate: Date): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHECKOUT_DELIVERY_DATE_CHANGE",
      payload: {
        deliveryDate,
      },
    });
  };

  const changeDeliveryTime = (deliveryTime: string): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHECKOUT_DELIVERY_TIME_CHANGE",
      payload: {
        deliveryTime,
      },
    });
  };

  const changeDeliveryAddress = (
    deliveryAddress: BranchStateType | undefined
  ): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHECKOUT_DELIVERY_ADDRESS_CHANGE",
      payload: {
        deliveryAddress,
      },
    });
  };

  const changeServiceAvailable = (serviceAvailable: boolean): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHECKOUT_SERVICE_AVAILABLE_CHANGE",
      payload: {
        serviceAvailable,
      },
    });
  };

  const changePaymentMethod = (paymentMethod: CommercePaymentMethod): void => {
    dispatch({ type: "LOADING", payload: {} });
    dispatch({
      type: "CHECKOUT_PAYMENT_CHANGE",
      payload: {
        paymentMethod,
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        ...cartActions,
        assignUnit,
        loadCart,
        refreshCart,
        clearCart,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        setItemQuantity,
        handleCartClick,
        changeLanguage,
        changeCurrency,
        changeCheckoutStep,
        changeDeliveryType,
        changeComments,
        changeDeliveryDate,
        changeDeliveryTime,
        changeDeliveryAddress,
        changeServiceAvailable,
        changePaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProvider };
