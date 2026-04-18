// js/locate.js

import { getMap } from "./map.js";
import { setUserLocation } from "./state.js";

let userLocationMarker = null;
let userAccuracyCircle = null;

export function locateUser() {
  const map = getMap();

  if (!navigator.geolocation) {
    alert("Trình duyệt không hỗ trợ định vị.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      const latlng = [lat, lng];
      setUserLocation(latlng);

      drawUserLocation(latlng, accuracy);

      map.setView(latlng, Math.max(map.getZoom(), 16));
    },
    (error) => {
      console.error("Geolocation error:", error);
      alert("Không lấy được vị trí hiện tại. Hãy kiểm tra quyền truy cập vị trí.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function drawUserLocation(latlng, accuracy) {
  const map = getMap();

  // Xóa marker cũ nếu có
  if (userLocationMarker) {
    map.removeLayer(userLocationMarker);
    userLocationMarker = null;
  }

  if (userAccuracyCircle) {
    map.removeLayer(userAccuracyCircle);
    userAccuracyCircle = null;
  }

  // Chấm xanh vị trí hiện tại
  userLocationMarker = L.circleMarker(latlng, {
    radius: 8,
    color: "#ffffff",
    weight: 2,
    fillColor: "#1e90ff",
    fillOpacity: 1
  }).addTo(map);

  userLocationMarker.bindPopup("Vị trí hiện tại");

  // Vòng accuracy
  userAccuracyCircle = L.circle(latlng, {
    radius: accuracy || 0,
    color: "#1e90ff",
    weight: 1,
    fillColor: "#1e90ff",
    fillOpacity: 0.12
  }).addTo(map);
}