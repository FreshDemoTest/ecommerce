"use client";

import { useContext } from "react";
import { SellerInfoContext } from "../BusinessInfoProvider";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook declaration
const useSellerInfo = () => useContext(SellerInfoContext);

export { useSellerInfo };
