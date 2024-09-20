import { DeliveryZones } from "../domain/seller";
import type { SellerUnitInfoType } from "../domain/seller";

export function generateDeliveryInfoStrip(units: SellerUnitInfoType[]): string {
  // filter delivery zones
  const dZs = DeliveryZones.filter((dz) => {
    return units.some((u) => u.deliveryZones.includes(dz.zoneName));
  });
  // group by estate - accumulating all zip codes
  const estates = dZs.reduce<Record<string, Set<string>>>((acc, dz) => {
    if (!dz.estate || !dz.city) return acc;
    if (!acc[dz.estate]) {
      acc[dz.estate] = new Set();
    }
    const accSet = acc[dz.estate]!;
    dz.city &&
      dz.city.split(",").forEach((c: string) => {
        accSet.add(c.trim());
      });

    return acc;
  }, {});
  // sort them by the amount of zip codes
  const estatesSorted = Object.entries(estates).sort(([_a, a], [_b, b]) => {
    return b.size - a.size;
  });
  // get the top 3 estates
  const topEstates = estatesSorted.slice(0, 3);
  // create copy string
  let areasCopy = "";
  if (Object.keys(estates).includes("Ciudad de México")) {
    const _cdmx = [...estates["Ciudad de México"]!];
    const _cdmxSorted = _cdmx.sort();
    areasCopy += `CDMX (`;
    if (_cdmxSorted.length > 2) {
      areasCopy += `${_cdmxSorted[0]} y ${_cdmxSorted.length - 1} alcaldías más`;
    } else {
      areasCopy += _cdmxSorted.join(" y ");
    }
    areasCopy += ")";
    if (topEstates.length > 1) {
      areasCopy += ", ";
    }
  }
  areasCopy += topEstates
    .filter(([estate, _z]) => estate !== "Ciudad de México")
    .map(([estate, _zipCodes]) => estate)
    .join(", ");
  if (estatesSorted.length > 3) {
    areasCopy += ` y ${estatesSorted.length - 3} estados más`;
  }
  return `Entregas a ${areasCopy}.`;
}
