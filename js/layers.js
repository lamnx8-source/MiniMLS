import { getMap, fitToBounds } from "./map.js";
import { createListingPopupHtml } from "./popup.js";

let listingsLayer = null;

const iconColors = {
  new: "blue",
  flag: "red",
  nego: "orange",
  bought: "green",
  drop: "grey",
};

export function renderListings(listings) {
  clearListings();

  const map = getMap();
  const bounds = L.latLngBounds([]);
  listingsLayer = L.layerGroup().addTo(map);

  for (const listing of listings) {
    const marker = L.marker([listing.lat, listing.lng], {
      icon: makeIcon(getIconColor(listing.status)),
    });

    marker.bindPopup(createListingPopupHtml(listing), {
      maxWidth: 320,
      closeButton: true,
    });

    marker.addTo(listingsLayer);
    bounds.extend([listing.lat, listing.lng]);
  }

  fitToBounds(bounds);
}

export function clearListings() {
  if (listingsLayer) {
    getMap().removeLayer(listingsLayer);
    listingsLayer = null;
  }
}

function getIconColor(status) {
  const key = String(status || "new").trim().toLowerCase();
  return iconColors[key] || "blue";
}

function makeIcon(color) {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}
