import { getMap, fitMapToBounds } from "./map.js";
import { createListingPopupHtml } from "./popup.js";

let listingsLayerGroup = null;

const shadowUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

function createIcon(color) {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

const iconMap = {
  new: createIcon("blue"),
  flag: createIcon("red"),
  nego: createIcon("orange"),
  bought: createIcon("green"),
  drop: createIcon("grey"),
};

function getMarkerIcon(status) {
  const s = (status || "").toString().trim().toLowerCase();
  return iconMap[s] || iconMap["new"];
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
      icon: getMarkerIcon(item.Status),
    });

    // 👉 bind popup
    marker.bindPopup(createListingPopupHtml(item), {
      maxWidth: 280,
    });

    // 👉 xử lý click Open Folder đúng cách
    marker.on("popupopen", function (e) {
      const popupEl = e.popup.getElement();
      if (!popupEl) return;

      // chặn click lan xuống map
      L.DomEvent.disableClickPropagation(popupEl);

      const folderBtn = popupEl.querySelector(".popup-folder-btn");

      if (folderBtn) {
        folderBtn.addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const url = folderBtn.getAttribute("data-url");

          console.log("OPEN FOLDER:", url);

          if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
          }
        });
      }
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