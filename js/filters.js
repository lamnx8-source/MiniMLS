// js/filters.js

export function applyListingFilters(listings, filters) {
  if (!Array.isArray(listings)) return [];

  return listings.filter((item) => {
    const timeMax = toNumber(filters.timeMax);
    const unitPriceMax = toNumber(filters.unitPriceMax);
    const roadWidthMin = toNumber(filters.roadWidthMin);
    const poiMin = toNumber(filters.poiMin);
    const areaMin = toNumber(filters.areaMin);

    const itemTime = toNumber(item.timeDays);
    const itemUnitPrice = toNumber(item.unitPrice);
    const itemRoadWidth = toNumber(item.roadWidth);
    const itemPoi = toNumber(item.poi);
    const itemArea = toNumber(item.area);

    // Time <= max
    if (timeMax !== null) {
      if (itemTime === null || itemTime > timeMax) return false;
    }

    // UnitPrice <= max
    if (unitPriceMax !== null) {
      if (itemUnitPrice === null || itemUnitPrice > unitPriceMax) return false;
    }

    // RoadWidth >= min
    if (roadWidthMin !== null) {
      if (itemRoadWidth === null || itemRoadWidth < roadWidthMin) return false;
    }

    // POI >= min
    if (poiMin !== null) {
      if (itemPoi === null || itemPoi < poiMin) return false;
    }

    // Area >= min
    if (areaMin !== null) {
      if (itemArea === null || itemArea < areaMin) return false;
    }

    return true;
  });
}

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;

  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}