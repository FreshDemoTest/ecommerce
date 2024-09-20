"use client";

import { useContext } from "react";
import { CartContext } from "../CartProvider";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook declaration
const useCart = () => useContext(CartContext);

export { useCart };
