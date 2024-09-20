import type { SupplierProductType } from "ui/domain";
import type { DeliveryType } from "../../seller";
import type { BranchStateType } from "../../user";
import type { CommercePaymentMethod } from "../seller";

// --

export const CHECKOUT_STEPS = [
  {
    key: "products",
    label: "Escoge tus Productos",
  },
  { key: "delivery", label: "Selecciona detalles de entrega" },
  { key: "payment", label: "Define tu forma de Pago" },
];

// -- Context Variable definitions

export interface CartEntry {
  id?: string;
  supplierProduct: SupplierProductType;
  quantity: number;
  total?: number;
  comments?: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style -- This is a dictionary
export interface CartDetails {
  [id: string]: CartEntry;
}

export interface CartState {
  /**
   * User Id of the user who owns the cart
   */
  token?: string;
  /**
   * Seller Unit assigned to the cart
   */
  assignedUnitId?: string;
  /**
   * The total price of the items in the cart before tax
   */
  subtotalPriceWOTax: number;
  /**
   * Tax of the items in the cart
   */
  taxPrice: number;
  /**
   * The total price of the items in the cart
   */
  totalPrice: number;
  /**
   * Currency formatted version of `totalPrice`
   */
  formattedTotalPrice: string;
  /**
   * The number of items in the cart
   */
  cartCount: number;
  /**
   * Cart details is an object with IDs of the items in the cart as
   * keys and details of the items as the value.
   */
  cartDetails: CartDetails;
  /**
   * The redirect url for a successful sale.
   */
  successUrl?: string;
  /**
   * The redirect url for a cancelled sale.
   */
  cancelUrl?: string;
  shouldDisplayCart: boolean;
  currency: string;
  language: string;
  loading: boolean;
  error?: string;
  /**
   * CHECKOUT Vars
   */
  serviceAvailable: boolean;
  currentCheckoutStep: number;
  totalCheckoutSteps: number;
  deliveryType: DeliveryType;
  comments: string;
  deliveryDate?: Date;
  deliveryTime?: string;
  deliveryAddress?: BranchStateType;
  paymentMethod?: CommercePaymentMethod;
}

export interface CartActions {
  /**
   * Assign a seller unit to the cart
   */
  assignUnit: (unitId: string, token: string) => void;
  /**
   * Add `count` amount of a product to the cart
   * @param product The product to add to the cart
   * @param count The quantity of the product to add
   */
  addItem: (
    product: SupplierProductType,
    options?: {
      count: number;
      comments?: string;
    }
  ) => void;

  /**
   * Remove an item from the cart by its product ID
   * @param id The product ID of the item in the cart to remove
   */
  removeItem: (id: string) => void;

  /**
   * Reduce the quantity of an item in the cart by `count`
   * @param id The product ID of the item to reduce in quantity
   * @param options.count The quantity to decrease by, defaults to 1
   */
  decrementItem: (
    id: string,
    options?: { count: number; comments?: string }
  ) => void;

  /**
   * Increase the quantity of an item in the cart by `count`
   * @param id The product ID of the item to increase in quantity
   * @param options.count The quantity to increase by, defaults to 1
   */
  incrementItem: (
    id: string,
    options?: { count: number; comments?: string }
  ) => void;

  /**
   * Set the quantity of an item in the cart to a specific value
   * @param id The product ID of the item whose quantity you wish to change
   * @param quantity The quantity to set the item to
   */
  setItemQuantity: (id: string, quantity: number, comments?: string) => void;

  /**
   * Totally clears the cart of all items
   */
  clearCart: () => void;

  /**
   * @see CartDetails
   */
  loadCart: () => void;

  /**
   * @see CartDetails
   */
  refreshCart: (apiURL: string, sellerId: string) => void;

  /**
   * Sets `shouldDisplayCart` to `true`.
   */
  handleCartHover: () => void;

  /**
   * Toggles `shouldDisplayCart` between `true` and `false`.
   */
  handleCartClick: () => void;

  /**
   * Sets `shouldDisplayCart` to `false`.
   */
  handleCartClose: () => void;

  /**
   * Given an ISO language code (e.g. en-US), it sets `language` to that value.
   */
  changeLanguage: (language: string) => void;

  /**
   * Given an ISO currency code (e.g. USD), it sets `currency` to that value.
   */
  changeCurrency: (currency: string) => void;

  /**
   * Sets `currentCheckoutStep` to the given value.
   */
  changeCheckoutStep: (checkoutStep: number) => void;
  changeDeliveryType: (deliveryType: DeliveryType) => void;
  changeComments: (comments: string) => void;
  changeDeliveryDate: (deliveryDate: Date) => void;
  changeDeliveryTime: (deliveryTime: string) => void;
  changeDeliveryAddress: (deliveryAddress: BranchStateType | undefined) => void;
  changeServiceAvailable: (serviceAvailable: boolean) => void;
  changePaymentMethod: (paymentMethod: CommercePaymentMethod) => void;
}
