import { createMap, switchBaseLayer } from "./map.js";
import { loadListings } from "./data.js";
import { renderListingsLayer, clearListingsLayer } from "./layers.js";
import {
  state,
  setListings,
  setFilteredListings,
  setBaseLayer,
  setFilters,
  resetFilters
} from "./state.js";
import { locateUser } from "./locate.js";

const LISTINGS_URL = "./data/listings.json";

const baseLayerSelect = document.getElementById("baseLayerSelect");
const reloadBtn = document.getElementById("reloadBtn");
const locateBtn = document.getElementById("locateBtn");
const toggleFiltersBtn = document.getElementById("toggleFiltersBtn");

const filterPanel = document.getElementById("filterPanel");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const filterTimeMax = document.getElementById("filterTimeMax");
const filterUnitPriceMax = document.getElementById("filterUnitPriceMax");
const filterRoadWidthMin = document.getElementById("filterRoadWidthMin");
const filterPoiMin = document.getElementById("filterPoiMin");
const filterAreaMin = document.getElementById("filterAreaMin");

function normalizeListing(item) {
  const lat = Number(item?.lat ?? item?.Lat);
  const lng = Number(item?.lng ?? item?.Lng);

  const folderUrl =
    item?.FolderURL ??
    item?.FolderUrl ??
    item?.folderURL ??
    item?.folderUrl ??
    item?.folder_url ??
    "";

  return {
    id: item?.id ?? item?.ID ?? "",
    Notes: item?.Notes ?? item?.notes ?? "",
    Status: item?.Status ?? item?.status ?? "",
    FolderURL: String(folderUrl).trim(),
    lat,
    lng
  };
}

function isValidListing(item) {
  return Number.isFinite(item.lat) && Number.isFinite(item.lng);
}

function applySimpleFilters(listings, filters) {
  return listings.filter((item) => {
    if (!isValidListing(item)) return false;

    const idText = String(item.id || "").toLowerCase();
    const notesText = String(item.Notes || "").toLowerCase();
    const statusText = String(item.Status || "").toLowerCase();

    const searchTexts = [
      String(filters.timeMax || "").trim().toLowerCase(),
      String(filters.unitPriceMax || "").trim().toLowerCase(),
      String(filters.roadWidthMin || "").trim().toLowerCase(),
      String(filters.poiMin || "").trim().toLowerCase(),
      String(filters.areaMin || "").trim().toLowerCase()
    ].filter(Boolean);

    if (searchTexts.length === 0) return true;

    return searchTexts.every((keyword) => {
      return (
        idText.includes(keyword) ||
        notesText.includes(keyword) ||
        statusText.includes(keyword)
      );
    });
  });
}

async function loadAndRenderListings() {
  const listingsRaw = await loadListings(LISTINGS_URL);
  const listings = Array.isArray(listingsRaw)
    ? listingsRaw.map(normalizeListing)
    : [];

  console.log("Loaded listings:", listings);
  console.log("Sample FolderURL:", listings.slice(0, 5).map(x => ({
    id: x.id,
    FolderURL: x.FolderURL
  })));

  setListings(listings);
  setFilteredListings(listings);
  render();
}

async function init() {
  try {
    createMap("map");
    await loadAndRenderListings();
    bindEvents();

    console.log("MiniMLS V1 initialized successfully.");
  } catch (error) {
    console.error("Initialization error:", error);
    alert("Không thể khởi tạo webmap. Kiểm tra console để xem lỗi.");
  }
}

function bindEvents() {
  if (baseLayerSelect) {
    baseLayerSelect.addEventListener("change", onBaseLayerChange);
  }

  if (reloadBtn) {
    reloadBtn.addEventListener("click", onReloadClick);
  }

  if (locateBtn) {
    locateBtn.addEventListener("click", onLocateClick);
  }

  if (toggleFiltersBtn) {
    toggleFiltersBtn.addEventListener("click", onToggleFiltersClick);
  }

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", onApplyFiltersClick);
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", onClearFiltersClick);
  }
}

function render() {
  clearListingsLayer();
  renderListingsLayer(state.filteredListings);
}

function onBaseLayerChange(event) {
  const layerName = event.target.value;
  setBaseLayer(layerName);
  switchBaseLayer(state.baseLayer);
}

async function onReloadClick() {
  try {
    await loadAndRenderListings();
  } catch (error) {
    console.error("Reload error:", error);
    alert("Không thể reload dữ liệu listings.");
  }
}

function onLocateClick() {
  locateUser();
}

function onToggleFiltersClick() {
  if (filterPanel) {
    filterPanel.classList.toggle("hidden");
  }
}

function onApplyFiltersClick() {
  const nextFilters = {
    timeMax: filterTimeMax ? filterTimeMax.value : "",
    unitPriceMax: filterUnitPriceMax ? filterUnitPriceMax.value : "",
    roadWidthMin: filterRoadWidthMin ? filterRoadWidthMin.value : "",
    poiMin: filterPoiMin ? filterPoiMin.value : "",
    areaMin: filterAreaMin ? filterAreaMin.value : ""
  };

  setFilters(nextFilters);

  const filtered = applySimpleFilters(state.listings, state.filters);
  setFilteredListings(filtered);

  render();
}

function onClearFiltersClick() {
  resetFilters();

  if (filterTimeMax) filterTimeMax.value = "";
  if (filterUnitPriceMax) filterUnitPriceMax.value = "";
  if (filterRoadWidthMin) filterRoadWidthMin.value = "";
  if (filterPoiMin) filterPoiMin.value = "";
  if (filterAreaMin) filterAreaMin.value = "";

  setFilteredListings(state.listings);
  render();
}

init();