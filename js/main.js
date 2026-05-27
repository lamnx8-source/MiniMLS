(function () {
  "use strict";

  var LISTINGS_URL = "data/listings.json";
  var DEFAULT_CENTER = [10.55, 107.25];
  var DEFAULT_ZOOM = 10;

  var map = null;
  var markerLayer = null;
  var baseLayers = {};
  var currentBaseLayer = null;
  var allListings = [];

  var baseLayerSelect = document.getElementById("baseLayerSelect");
  var searchInput = document.getElementById("searchInput");
  var locateBtn = document.getElementById("locateBtn");
  var reloadBtn = document.getElementById("reloadBtn");
  var errorPanel = document.getElementById("errorPanel");

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    try {
      if (typeof L === "undefined") {
        showError("Leaflet did not load. Please check internet connection or CDN access on iPhone.");
        return;
      }

      createMap();
      bindEvents();
      reloadListings();

      setTimeout(function () {
        if (map) map.invalidateSize();
      }, 300);
    } catch (error) {
      showError("Cannot initialize MiniMLS WebMap: " + getErrorMessage(error));
      console.error(error);
    }
  }

  function createMap() {
    map = L.map("map", {
      zoomControl: true,
      preferCanvas: true
    }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    baseLayers.osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    });

    baseLayers.esri = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri"
      }
    );

    currentBaseLayer = baseLayers.osm;
    currentBaseLayer.addTo(map);

    markerLayer = L.layerGroup().addTo(map);
  }

  function bindEvents() {
    if (baseLayerSelect) {
      baseLayerSelect.addEventListener("change", function () {
        switchBaseLayer(baseLayerSelect.value);
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", applySearch);
    }

    if (locateBtn) {
      locateBtn.addEventListener("click", locateUser);
    }

    if (reloadBtn) {
      reloadBtn.addEventListener("click", reloadListings);
    }

    window.addEventListener("resize", function () {
      if (map) map.invalidateSize();
    });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        if (map) map.invalidateSize();
      }, 500);
    });
  }

  function switchBaseLayer(name) {
    var nextLayer = baseLayers[name] || baseLayers.osm;
    if (!map || !nextLayer || currentBaseLayer === nextLayer) return;

    if (currentBaseLayer) {
      map.removeLayer(currentBaseLayer);
    }

    currentBaseLayer = nextLayer;
    currentBaseLayer.addTo(map);
  }

  function reloadListings() {
    hideError();

    fetch(LISTINGS_URL + "?v=" + Date.now(), { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Cannot load " + LISTINGS_URL + " (HTTP " + response.status + ")");
        }
        return response.json();
      })
      .then(function (data) {
        allListings = normalizeListings(data);
        console.log("Loaded " + allListings.length + " valid listings.");
        applySearch();
      })
      .catch(function (error) {
        console.error(error);
        showError(
          "Cannot load listings. Please check that the file exists at /data/listings.json and is valid JSON. Detail: " +
            getErrorMessage(error)
        );
      });
  }

  function normalizeListings(data) {
    var source = Array.isArray(data) ? data : [];
    var result = [];

    for (var i = 0; i < source.length; i += 1) {
      var item = source[i] || {};
      var lat = toNumber(firstValue(item, ["lat", "Lat", "LAT", "latitude", "Latitude"]));
      var lng = toNumber(firstValue(item, ["lng", "Lng", "LNG", "long", "Long", "longitude", "Longitude"]));

      if (!isFinite(lat) || !isFinite(lng)) {
        continue;
      }

      result.push({
        id: stringValue(firstValue(item, ["id", "ID", "Id"])),
        status: stringValue(firstValue(item, ["status", "Status", "STATUS"])) || "New",
        notes: stringValue(firstValue(item, ["notes", "Notes", "NOTES"])),
        folderUrl: stringValue(firstValue(item, ["folderUrl", "FolderURL", "FolderUrl", "folderURL", "folder_url"])),
        lat: lat,
        lng: lng,
        raw: item
      });
    }

    return result;
  }

  function firstValue(item, keys) {
    for (var i = 0; i < keys.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(item, keys[i])) {
        return item[keys[i]];
      }
    }
    return "";
  }

  function stringValue(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  }

  function toNumber(value) {
    if (value === null || value === undefined || value === "") return NaN;
    return Number(String(value).replace(",", "."));
  }

  function applySearch() {
    var keyword = searchInput ? String(searchInput.value || "").trim().toLowerCase() : "";
    var filtered = [];

    if (keyword) {
      for (var i = 0; i < allListings.length; i += 1) {
        var item = allListings[i];
        var haystack = [item.id, item.status, item.notes, item.folderUrl].join(" ").toLowerCase();
        if (haystack.indexOf(keyword) !== -1) {
          filtered.push(item);
        }
      }
    } else {
      filtered = allListings.slice();
    }

    renderListings(filtered);
  }

  function renderListings(listings) {
    if (!markerLayer) return;

    markerLayer.clearLayers();

    var bounds = [];
    for (var i = 0; i < listings.length; i += 1) {
      var listing = listings[i];
      var marker = L.circleMarker([listing.lat, listing.lng], {
        radius: 7,
        weight: 2,
        color: getStatusColor(listing.status),
        fillColor: getStatusColor(listing.status),
        fillOpacity: 0.85
      });

      marker.bindPopup(createListingPopupHtml(listing), {
        maxWidth: 320,
        closeButton: true,
        autoPan: true
      });

      marker.addTo(markerLayer);
      bounds.push([listing.lat, listing.lng]);
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
    }

    setTimeout(function () {
      if (map) map.invalidateSize();
    }, 100);
  }

  function getStatusColor(status) {
    var value = String(status || "").toLowerCase();
    if (value.indexOf("flag") !== -1) return "#d93025";
    if (value.indexOf("nego") !== -1) return "#f29900";
    if (value.indexOf("bought") !== -1) return "#188038";
    if (value.indexOf("drop") !== -1) return "#777777";
    return "#1a73e8";
  }

  function locateUser() {
    if (!map || !navigator.geolocation) {
      showError("This browser does not support location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        L.circleMarker([lat, lng], {
          radius: 9,
          weight: 3,
          color: "#000000",
          fillColor: "#4285f4",
          fillOpacity: 0.9
        })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
        map.setView([lat, lng], 16);
      },
      function (error) {
        showError("Cannot get your location: " + getErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  }

  function createListingPopupHtml(listing) {
    var id = escapeHtml(listing.id || "");
    var status = escapeHtml(listing.status || "New");
    var notes = escapeHtml(listing.notes || "").replace(/\n/g, "<br>");
    var mapsUrl = "https://www.google.com/maps?q=" + encodeURIComponent(listing.lat + "," + listing.lng);

    var folderButton = listing.folderUrl
      ? '<a class="popup-btn" href="' + escapeAttribute(listing.folderUrl) + '" target="_blank" rel="noopener noreferrer">Open Folder</a>'
      : '<span class="popup-muted">No FolderURL</span>';

    return (
      '<div class="popup-card">' +
      '<div class="popup-title">' + id + "</div>" +
      '<div class="popup-status">Status: ' + status + "</div>" +
      '<div class="popup-notes">' + notes + "</div>" +
      '<div class="popup-actions">' +
      '<a class="popup-btn" href="' + mapsUrl + '" target="_blank" rel="noopener noreferrer">Google Maps</a>' +
      folderButton +
      "</div>" +
      "</div>"
    );
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function showError(message) {
    if (errorPanel) {
      errorPanel.hidden = false;
      errorPanel.textContent = message;
    } else {
      alert(message);
    }
  }

  function hideError() {
    if (errorPanel) {
      errorPanel.hidden = true;
      errorPanel.textContent = "";
    }
  }

  function getErrorMessage(error) {
    if (!error) return "Unknown error";
    if (error.message) return error.message;
    if (error.code) return "Error code " + error.code;
    return String(error);
  }
})();
