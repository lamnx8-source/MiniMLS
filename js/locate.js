import { getMap } from "./map.js";

let locationMarker = null;
let accuracyCircle = null;

export function locateUser() {
  if (!navigator.geolocation) {
    alert("This browser does not support geolocation.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const map = getMap();
      const latlng = [position.coords.latitude, position.coords.longitude];

      if (locationMarker) map.removeLayer(locationMarker);
      if (accuracyCircle) map.removeLayer(accuracyCircle);

      locationMarker = L.circleMarker(latlng, {
        radius: 8,
        color: "#ffffff",
        weight: 2,
        fillColor: "#1e90ff",
        fillOpacity: 1,
      }).addTo(map).bindPopup("Current location");

      accuracyCircle = L.circle(latlng, {
        radius: position.coords.accuracy || 0,
        color: "#1e90ff",
        weight: 1,
        fillColor: "#1e90ff",
        fillOpacity: 0.12,
      }).addTo(map);

      map.setView(latlng, Math.max(map.getZoom(), 16));
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("Cannot get current location. Please check location permission.");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}
