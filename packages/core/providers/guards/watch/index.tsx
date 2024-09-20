/* eslint-disable @typescript-eslint/no-floating-promises -- required */
"use client";

import { useEffect, useRef } from "react";
import { type CommerceConfigType } from "../../..";
import { getCorrespondentUnit } from "../../../data/api";
import { useSellerInfo } from "../../hooks/useSellerInfo";
import { useCart } from "../../hooks/useCart";
import { useClientInfo } from "../../hooks/useClientInfo";

export interface SessionWatchProps {
  config: CommerceConfigType;
  children: React.ReactNode;
}

function SessionWatch({ config, children }: SessionWatchProps): JSX.Element {
  const initRef = useRef(false);
  const authosSessionRevalRef = useRef(false);
  const { seller, sellerUnits, assignedUnit, fetchSellerInfo, setSellerUnit } =
    useSellerInfo();
  const { assignUnit, refreshCart, error: cartError } = useCart();
  const { initialize, token, apiURL, sellerId, defaultAddress, getSessionToken, error: clientError } =
    useClientInfo();

  // hook - initialize
  useEffect(() => {
    if (initRef.current) return;
    void initialize();
    initRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hook - client error
  useEffect(() => {
    if (clientError === undefined) return;
    if (clientError === "AUTHOS_ERROR_INVALID_SESSION" && !authosSessionRevalRef.current) {
      getSessionToken(true);
      authosSessionRevalRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientError]);

  // async defs
  const _fetchSellerInfo = async (): Promise<void> => {
    await fetchSellerInfo(config.sellerId);
  };

  const _assignUnit = async (unitId: string): Promise<void> => {
    await setSellerUnit(unitId);
    assignUnit(unitId, token || "");
  };

  // hook - fetch business info
  useEffect(() => {
    // if seller info is already fetched, do not fetch again
    if (seller !== undefined) return;
    _fetchSellerInfo();
    // set a timer that refreshes the seller info every 30 minutes
    const interval = setInterval(
      () => {
        _fetchSellerInfo();
      },
      1000 * 60 * 30
    );

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- safe
  }, [config, seller]);

  // hook - assign unit
  useEffect(() => {
    if (sellerUnits.length === 0) return;
    if (assignedUnit !== undefined) return;
    if (token === undefined) return;
    // if user info not available - assign first in list
    const asgU = sellerUnits[0]!;
    _assignUnit(asgU.id!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerUnits, token]);

  // hook - update assigned unit when default address changes
  useEffect(() => {
    if (defaultAddress === undefined) return;
    if (sellerUnits.length === 0) return;
    if (token === undefined) return;
    const _getCorrespondentUnit = async (): Promise<void> => {
      const unitId = await getCorrespondentUnit(
        apiURL,
        token,
        sellerId!,
        defaultAddress.id!
      );
      const _unit = sellerUnits.find((u) => u.id === unitId);
      if (_unit) {
        // if unit is found, set it
        await _assignUnit(_unit.id!);
      }
    };
    void _getCorrespondentUnit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress, sellerUnits, token]);

  // hook - load cart when unit is assigned
  useEffect(() => {
    if (assignedUnit === undefined) return;
    refreshCart(apiURL, sellerId || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedUnit]);

  // hook - cart error
  useEffect(() => {
    if (cartError === undefined) return;
    if (cartError === "CART_NO_ASSIGNED_UNIT") {
      // if cart not found, assign first unit in list
      const asgU = sellerUnits[0]!;
      _assignUnit(asgU.id!);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartError]);

  return <>{children}</>;
}

export { SessionWatch };
