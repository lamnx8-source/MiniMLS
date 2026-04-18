import { getMap, fitMapToBounds } from "./map.js";
import { createListingPopupHtml } from "./popup.js";

let listingsLayerGroup = null;

export function renderListingsLayer(listings) {
  const map = getMap();

  listingsLayerGroup = L.layerGroup();

  const bounds = L.latLngBounds([]);

  listings.forEach((item) => {
    if (!isValidListing(item)) return;

    const lat = Number(item.lat);
    const lng = Number(item.lng);

    const marker = L.marker([lat, lng]);

    marker.bindPopup(createListingPopupHtml(item), {
      maxWidth: 280,
    });

    marker.addTo(listingsLayerGroup);
    bounds.extend([lat, lng]);
  });

  listingsLayerGroup.addTo(map);

  if (bounds.isValid()) {
    fitMapToBounds(bounds);
  }
}

export function clearListingsLayer() {
  const map = getMap();

  if (listingsLayerGroup) {
    map.removeLayer(listingsLayerGroup);
    listingsLayerGroup = null;
  }
}

function isValidListing(item) {
  return (
    item &&
    item.lat !== undefined &&
    item.lng !== undefined &&
    !Number.isNaN(Number(item.lat)) &&
    !Number.isNaN(Number(item.lng))
  );
}