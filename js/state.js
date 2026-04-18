// js/state.js

export const state = {
  baseLayer: "osm",

  listings: [],
  filteredListings: [],

  userLocation: null,

  filters: {
    timeMax: "",
    unitPriceMax: "",
    roadWidthMin: "",
    poiMin: "",
    areaMin: ""
  }
};

export function setListings(listings) {
  state.listings = Array.isArray(listings) ? listings : [];
  state.filteredListings = [...state.listings];
}

export function setFilteredListings(listings) {
  state.filteredListings = Array.isArray(listings) ? listings : [];
}

export function setBaseLayer(layerName) {
  state.baseLayer = layerName;
}

export function setUserLocation(latlng) {
  state.userLocation = latlng;
}

export function setFilters(newFilters) {
  state.filters = {
    ...state.filters,
    ...newFilters
  };
}

export function resetFilters() {
  state.filters = {
    timeMax: "",
    unitPriceMax: "",
    roadWidthMin: "",
    poiMin: "",
    areaMin: ""
  };
}