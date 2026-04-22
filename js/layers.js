import { getMap, fitMapToBounds } from "./map.js";
import { createListingPopupHtml } from "./popup.js";

let listingsLayerGroup = null;

const shadowUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const iconBlue = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconRed = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconOrange = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconGreen = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconGrey = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function getMarkerIcon(status) {
  const s = (status || "").toString().trim().toLowerCase();

  switch (s) {
    case "new":
      return iconBlue;
    case "flag":
      return iconRed;
    case "nego":
      return iconOrange;
    case "bought":
      return iconGreen;
    case "drop":
      return iconGrey;
    default:
      return iconBlue;
  }
}

export function renderListingsLayer(listings) {
  const map = getMap();

  listingsLayerGroup = L.layerGroup();

  const bounds = L.latLngBounds([]);

  listings.forEach((item) => {
    if (!isValidListing(item)) return;

    const lat = Number(item.lat);
    const lng = Number(item.lng);

    const marker = L.marker([lat, lng], {
      icon: getMarkerIcon(item.status || item.Status),
    });

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