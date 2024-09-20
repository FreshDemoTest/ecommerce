"use client";

import { Box, BusinessInfo, ContactHero } from "ui";
import { useSellerInfo } from "../../../providers/hooks";
import { DoW, minOrdenUnits } from "../../../domain/seller";

// ----------------------------------------------------------------------

interface CommerceAboutSellerProps {
  sellerName: string;
  seoDescription: string;
}

export function CommerceAboutSeller(
  props: CommerceAboutSellerProps
): JSX.Element {
  const { seller, sellerUnits } = useSellerInfo();

  const units = sellerUnits.map((unit) => ({
    unitName: unit.unitName,
    fullAddress: unit.fullAddress!,
    deliveryZones: unit.deliveryZones,
    deliveryWindowSize: unit.deliveryWindowSize!,
    cutOffTime: unit.cutOffTime,
    warnDays: unit.warnDays,
    deliverySchedules: unit.deliverySchedules.map((schedule) => ({
      dow: DoW[schedule.dow],
      start: schedule.start,
      end: schedule.end,
    })),
  }));

  return (
    <Box>
      <ContactHero {...props} />
      {/* Cobertura */}
      <BusinessInfo
        seller={{
          businessName: seller?.businessName || "****",
          website: seller?.website,
          policyTerms: seller?.policyTerms || "************",
          minQuantity: seller?.minQuantity || 0,
          minQuantityUnit: (seller?.minQuantityUnit)
            ? minOrdenUnits[seller.minQuantityUnit]
            : "Pesos ($)",
        }}
        units={units}
      />
    </Box>
  );
}
