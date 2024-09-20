import {
  isSunday,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
} from "date-fns";
import * as jose from "jose";
import { fCurrency } from "ui/utils";
import type { CartEntry, ShippingRule } from "..";
import type { ServiceDayType } from "../domain/seller";

/**
 * Verirfy if the minimum quantity is reached
 * @param cart
 * @param minQty
 * @param minQtyUnit
 * @returns {
 *   flag: boolean;  // true if minQty is reached
 *   amountStr: string;  // string to show in the alert in case is false
 * }
 */
export function isMinimumQtyReached(
  cart: CartEntry[],
  minQty: number,
  minQtyUnit: string
): { flag: boolean; amountStr: string } {
  const cartSubts = cart.map(
    (item) =>
      (item.supplierProduct.price?.amount || 0) *
      item.quantity *
      (item.supplierProduct.unitMultiple || 1)
  );
  const weightSubts = cart.map(
    (item) =>
      (item.supplierProduct.estimatedWeight || 1) *
      item.quantity *
      (item.supplierProduct.unitMultiple || 1)
  );
  const _subWOTax = cartSubts.reduce((acc, sub) => acc + sub, 0);
  const sumWeight = weightSubts.reduce((acc, sub) => acc + sub, 0);
  if (minQtyUnit === "kg") {
    // review by weight
    return {
      flag: sumWeight >= minQty,
      amountStr: `${sumWeight} / ${minQty} Kgs`,
    };
  } else if (minQtyUnit === "pesos") {
    // review by money
    return {
      flag: _subWOTax >= minQty,
      amountStr: ` ${fCurrency(_subWOTax)} / ${fCurrency(minQty)}`,
    };
  }
  // review by num prods
  return {
    flag: cart.length >= minQty,
    amountStr: `${cart.length} / ${minQty} Productos`,
  };
}

export function cleanProductWithStock(cart: CartEntry[]): CartEntry[] {
  const cartProductsFiltered = cart.map((cp) => {
    const stockEnabled = cp.supplierProduct.stock
      ? cp.supplierProduct.stock.active &&
        !cp.supplierProduct.stock.keepSellingWithoutStock
      : false;
    const stockAmount = cp.supplierProduct.stock?.amount || 0;
    const hasStock = stockAmount > 0;
    if (!stockEnabled) return cp;
    if (!hasStock) return;

    const amountInCart =
      (cp.quantity || 0) * (cp.supplierProduct.unitMultiple || 1);
    if (amountInCart > stockAmount) {
      return cp;
    }
    return undefined;
  });
  // filter undefined products
  const products: CartEntry[] = cartProductsFiltered.filter(
    (p): p is CartEntry => p !== undefined
  );
  // if (cartProducts.length !== products.length) {
  //   setFeedbackMsg(
  //     `Los productos sin inventario han sido eliminados de tu carrito.`
  //   );
  // }
  return products;
}

/**
 * Calculate the shipping cost
 * @param cart
 * @param enabled
 * @param rule
 * @param minQty
 * @param minQtyUnit
 *
 * @returns {
 *  flag: boolean;  // true if shipping is ok
 *  amountStr: string;  // string to show in the alert in case is false
 *  cost?: number;  // shipping cost
 * }
 */
export function calculateShipping(
  cart: CartEntry[],
  enabled: boolean,
  rule: ShippingRule,
  minQty: number,
  minQtyUnit: string
): { flag: boolean; amountStr: string; cost: number } {
  // if not enabled, return true
  if (!enabled) return { flag: true, amountStr: "", cost: 0 };
  const { verifiedBy, threshold, cost } = rule;
  // if enabled and minReached
  if (verifiedBy === "minReached") {
    const { flag, amountStr } = isMinimumQtyReached(cart, minQty, minQtyUnit);
    return { flag: true, amountStr, cost: flag ? 0 : cost };
  } else if (verifiedBy === "minThreshold") {
    // if enabled and minThreshold
    const { flag, amountStr } = isMinimumQtyReached(
      cart,
      threshold || 0,
      minQtyUnit
    );
    return { flag: true, amountStr, cost: flag ? 0 : cost };
  }
  return { flag: false, amountStr: "", cost: 0 };
}

export function getDow(day: Date): string {
  if (isSunday(day)) return "sunday";
  if (isMonday(day)) return "monday";
  if (isTuesday(day)) return "tuesday";
  if (isWednesday(day)) return "wednesday";
  if (isThursday(day)) return "thursday";
  if (isFriday(day)) return "friday";
  if (isSaturday(day)) return "saturday";
  return "";
}

export const tomorrow = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

export const inXTime = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export function isDisabledDay(
  day: Date,
  delivSched: ServiceDayType[]
): boolean {
  const whichDow = getDow(day);
  const inSched = delivSched.find((d) => d.dow === whichDow);
  return !inSched;
}

export function generateSupplierTimeOptions(
  delivSched: ServiceDayType[],
  deliveryWindowSize: number,
  day?: Date
): { label: string; value: string }[] {
  if (!day) return [];
  const whichDow = getDow(new Date(day));
  const _schedule = delivSched.find((d) => d.dow === whichDow);
  if (!_schedule) return [];
  // build from schedule
  const { start, end } = _schedule;
  //  allocation strategy
  const timeOptions = [];
  let i = start;
  while (i < end) {
    timeOptions.push(i);
    i += deliveryWindowSize;
  }
  return timeOptions.map((time) => {
    return {
      label: `Entre (${time} - ${time + deliveryWindowSize}hrs)`,
      value: `${time} - ${time + deliveryWindowSize}`,
    };
  });
}

export function isValidToken(accessToken: string | undefined): boolean {
  if (!accessToken) {
    return false;
  }
  const decoded = jose.decodeJwt(accessToken);
  const currentTime = Date.now() / 1000;
  if (!decoded.exp) {
    return false;
  }
  // valid if exp is greater than current time
  return decoded.exp > currentTime;
}
