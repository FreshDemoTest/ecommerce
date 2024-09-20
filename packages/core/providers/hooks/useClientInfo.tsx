"use client";

import { useContext } from "react";
import { ClientInfoContext } from "../ClientInfoProvider";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hook declaration
const useClientInfo = () => useContext(ClientInfoContext);

export { useClientInfo };
