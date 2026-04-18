let mapInstance = null;
let baseLayers = {};
let currentBaseLayer = null;

export function createMap(containerId) {
  // Default center: bạn chỉnh lại vùng của mình
  const defaultCenter = [10.823, 106.912];
  const defaultZoom = 13;

  mapInstance = L.map(containerId, {
    center: defaultCenter,
    zoom: defaultZoom,
    zoomControl: true,
  });

  // OSM
  baseLayers.osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors",
    }
  );

  // Esri World Imagery
  baseLayers.esri = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 20,
      attribution: "Tiles &copy; Esri",
    }
  );

  currentBaseLayer = baseLayers.osm;
  currentBaseLayer.addTo(mapInstance);

  return mapInstance;
}

export function getMap() {
  if (!mapInstance) {
    throw new Error("Map has not been created yet.");
  }
  return mapInstance;
}

export function switchBaseLayer(layerName) {
  if (!mapInstance) return;

  const nextLayer = baseLayers[layerName];
  if (!nextLayer) return;

  if (currentBaseLayer) {
    mapInstance.removeLayer(currentBaseLayer);
  }

  currentBaseLayer = nextLayer;
  currentBaseLayer.addTo(mapInstance);
}

export function fitMapToBounds(bounds) {
  if (!mapInstance || !bounds || !bounds.isValid()) return;
  mapInstance.fitBounds(bounds, { padding: [20, 20] });
}