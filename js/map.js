let map = null;
let currentBaseLayer = null;

const baseLayers = {
  osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: "&copy; OpenStreetMap contributors",
  }),
  esri: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 20,
    attribution: "Tiles &copy; Esri",
  }),
};

export function createMap(containerId) {
  map = L.map(containerId, {
    center: [10.823, 106.912],
    zoom: 10,
    zoomControl: true,
  });

  switchBaseLayer("osm");
  return map;
}

export function getMap() {
  if (!map) throw new Error("Map has not been created.");
  return map;
}

export function switchBaseLayer(name) {
  if (!map || !baseLayers[name]) return;
  if (currentBaseLayer) map.removeLayer(currentBaseLayer);
  currentBaseLayer = baseLayers[name];
  currentBaseLayer.addTo(map);
}

export function fitToBounds(bounds) {
  if (map && bounds && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [24, 24] });
  }
}
