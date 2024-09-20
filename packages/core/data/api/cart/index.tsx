"use client";

import { fISODate } from "ui/utils";
import {
  type GQLError,
  buildAuthHeaders,
  graphQLFetch,
} from "../../../utils/graphql";
import { getCatalog } from "../catalog";
import { type CartDetails, type CartEntry } from "../../..";
import { ErrorCodes } from "../../../error";
import { getLocalDefaultAddress } from "../user";
import { type OrdenStatusGQL, newOrdenQry } from "./queries";

const MAX_CATALOG_SIZE = 30000;
const GENERIC_ORDEN_ERROR = "CART_ISSUES_CREATNG_ORDER";

function genKey(sellerUnitId: string, token: string): string {
  return `${sellerUnitId}-${token}-cart`;
}

export function getCart(sellerUnitId: string, token: string): CartDetails {
  // fetch from local storage
  const rawData = localStorage.getItem(genKey(sellerUnitId, token));
  if (!rawData) {
    return {};
  }
  return JSON.parse(rawData) as CartDetails;
}

export function setCart(
  sellerUnitId: string,
  token: string,
  cart: CartDetails
): void {
  // save to local storage
  localStorage.setItem(genKey(sellerUnitId, token), JSON.stringify(cart));
}

export function initSellerCart(sellerUnitId: string, token: string): void {
  // save to local storage
  const _cart = getCart(sellerUnitId, token);
  if (Object.keys(_cart).length === 0) {
    setCart(sellerUnitId, token, {});
  }
}

async function _reloadCatalog(
  apiURL: string,
  sellerId: string,
  sellerUnitId: string,
  token: string,
  cart: CartDetails
): Promise<void> {
  const addressId = getLocalDefaultAddress(token)?.id;
  const catalog = await getCatalog(
    apiURL,
    sellerId,
    "",
    sellerUnitId,
    token,
    addressId,
    1,
    MAX_CATALOG_SIZE
  );
  // TODO FER validate stock
  const newCart: CartDetails = {};
  Object.entries(cart).forEach(([id, cartEntry]) => {
    const catalogEntry = catalog.products.find(
      (p) => p.id === cartEntry.supplierProduct.id
    );
    if (catalogEntry !== undefined) {
      const uprice = catalogEntry.price?.amount || 0;
      const total = cartEntry.quantity * uprice * catalogEntry.unitMultiple;
      const stockEnabled = catalogEntry.stock
        ? catalogEntry.stock.active && !catalogEntry.stock.keepSellingWithoutStock
        : false;
      const stockAmount = catalogEntry.stock?.amount || 0;
      const hasStock = stockAmount > 0;
      if (!stockEnabled)
        newCart[id] = {
          ...cartEntry,
          id: catalogEntry.id,
          total,
          supplierProduct: catalogEntry,
        };
      else {  
        if (!hasStock) return;
        const amountInCart = (cartEntry.quantity || 0) * (catalogEntry.unitMultiple || 1);
        if (amountInCart <= stockAmount) {
          newCart[id] = {
            ...cartEntry,
            id: catalogEntry.id,
            total,
            supplierProduct: catalogEntry,
          };
        }
      }
    }
  });
  if (cart.length !== newCart.length)
  {
    // show message in ui
    
  }
  setCart(sellerUnitId, token, newCart);
}

export async function reloadCart(
  apiURL: string,
  sellerId: string,
  sellerUnitId: string,
  token: string
): Promise<void> {
  const _cart = getCart(sellerUnitId, token);
  // if cart is empty, do nothing
  if (Object.keys(_cart).length === 0) return;
  // if cart is not empty, fetch catalog and update prices
  await _reloadCatalog(apiURL, sellerId, sellerUnitId, token, _cart);
}

export function upsertCartProduct(
  sellerUnitId: string,
  token: string,
  cartProduct: CartEntry
): CartDetails {
  // fetch from local storage
  const cart = getCart(sellerUnitId, token);
  // verify if given product is already in cart
  const existingProduct = Object.entries(cart).find(
    ([_jid, p]) => p.id === cartProduct.supplierProduct.id
  );
  // if product is already in cart, update quantity
  if (existingProduct !== undefined) {
    const qty = cart[existingProduct[0]]!.quantity + cartProduct.quantity;
    const uprice = cartProduct.supplierProduct.price?.amount || 0;
    const total = qty * uprice * cartProduct.supplierProduct.unitMultiple;
    cart[existingProduct[0]] = {
      ...cart[existingProduct[0]]!,
      id: cartProduct.supplierProduct.id,
      quantity: qty,
      total,
    };
  } else {
    // if product is not in cart, add it
    const uprice = cartProduct.supplierProduct.price?.amount || 0;
    const total =
      cartProduct.quantity * uprice * cartProduct.supplierProduct.unitMultiple;
    cart[cartProduct.supplierProduct.id] = {
      ...cartProduct,
      id: cartProduct.supplierProduct.id,
      total,
    };
  }
  // save to local storage
  setCart(sellerUnitId, token, cart);
  return cart;
}

export function deleteCartProduct(
  sellerUnitId: string,
  token: string,
  id: string
): CartDetails {
  // fetch from local storage
  const cart = getCart(sellerUnitId, token);
  // create a copy without the given product
  const newCartEntries = Object.entries(cart).filter(([jid, _p]) => jid !== id);
  const newCart = newCartEntries.reduce<CartDetails>((acc, [jid, p]) => {
    acc[jid] = p;
    return acc;
  }, {});
  setCart(sellerUnitId, token, newCart);
  return newCart;
}

export function updateCartProductQuantity(
  sellerUnitId: string,
  token: string,
  id: string,
  quantity: number
): CartDetails {
  // fetch from local storage
  const cart = getCart(sellerUnitId, token);
  // verify if given product is already in cart
  const existingProduct = Object.entries(cart).find(([_jid, p]) => p.id === id);
  // if product is already in cart, update quantity if not don't do anything
  if (existingProduct !== undefined) {
    const cartProduct = { ...cart[existingProduct[0]]! };
    const qty = cartProduct.quantity + quantity;
    const uprice = cartProduct.supplierProduct.price?.amount || 0;
    const total = qty * uprice * cartProduct.supplierProduct.unitMultiple;
    cart[existingProduct[0]] = {
      ...cart[existingProduct[0]]!,
      id: cartProduct.supplierProduct.id,
      quantity: qty,
      total,
    };
  }
  // save to local storage
  setCart(sellerUnitId, token, cart);
  return cart;
}

export function setCartProductQuantity(
  sellerUnitId: string,
  token: string,
  id: string,
  quantity: number
): CartDetails {
  // fetch from local storage
  const cart = getCart(sellerUnitId, token);
  // verify if given product is already in cart
  const existingProduct = Object.entries(cart).find(([_jid, p]) => p.id === id);
  // if product is already in cart, update quantity if not don't do anything
  if (existingProduct !== undefined) {
    const cartProduct = { ...cart[existingProduct[0]]! };
    const qty = quantity;
    const uprice = cartProduct.supplierProduct.price?.amount || 0;
    const total = qty * uprice * cartProduct.supplierProduct.unitMultiple;
    cart[existingProduct[0]] = {
      ...cart[existingProduct[0]]!,
      id: cartProduct.supplierProduct.id,
      quantity: qty,
      total,
    };
  }
  // save to local storage
  setCart(sellerUnitId, token, cart);
  return cart;
}

export async function newEcommerceOrden(
  apiURL: string,
  sellerId: string,
  token: string,
  cart: CartDetails,
  addressId: string,
  supplierUnitId: string,
  deliveryDate: Date,
  deliveryTime: string,
  deliveryType: string,
  paymentMethod: string,
  comments: string,
  shippingCost?: number
): Promise<{ id: string | undefined }> {
  try {
    // create vars
    const _delivTime = deliveryTime.split(" - ");
    let pmMethod = "MONEY_ORDER";
    if (paymentMethod === "direct-transfer") {
      pmMethod = "TRANSFER";
    } else if (paymentMethod === "cash") {
      pmMethod = "CASH";
    }

    const orVars = {
      secretKey: sellerId,
      restaurantBranchId: addressId,
      cartProds: Object.values(cart).map((p) => ({
        supplierProductId: p.supplierProduct.id,
        supplierProductPriceId: p.supplierProduct.price?.uuid || null,
        quantity: p.quantity * (p.supplierProduct.unitMultiple || 1),
        unitPrice: p.supplierProduct.price?.amount || null,
        subtotal: p.total || null,
        sellUnit: p.supplierProduct.sellUnit.toUpperCase(),
      })),
      deliveryDate: fISODate(deliveryDate),
      deliveryTime: {
        start: parseInt(_delivTime[0] || "9"),
        end: parseInt(_delivTime[1] || "18"),
      },
      delivType: deliveryType === "delivery" ? "SCHEDULED_DELIVERY" : "PICKUP",
      supUnitId: supplierUnitId,
      paymethod: pmMethod,
      comms: comments,
      shipping: shippingCost || null,
    };
    // add authorization aut
    const headrs = buildAuthHeaders(sellerId, token);
    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
      error,
    }: {
      data: OrdenStatusGQL;
      error: GQLError;
    } = await graphQLFetch({
      graphQLEndpoint: apiURL,
      query: newOrdenQry,
      queryName: "newEcommerceOrden",
      variables: orVars,
      headers: headrs,
    });
    if (error.code) {
      throw new Error(
        error.code ? ErrorCodes[error.code] : ErrorCodes[GENERIC_ORDEN_ERROR]
      );
    }
    // return
    return {
      id: data.id,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return {
      id: undefined,
    };
  }
}
