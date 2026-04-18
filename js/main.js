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
import { applyListingFilters } from "./filters.js";

// DOM refs
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

async function init() {
  try {
    createMap("map");

    const listings = await loadListings("../data/listings.json");
    setListings(listings);

    render();

    bindEvents();

    console.log("MiniMLS V1 initialized successfully.");
  } catch (error) {
    console.error("Initialization error:", error);
    alert("Không thể khởi tạo webmap. Kiểm tra console để xem lỗi.");
  }
}

function bindEvents() {
  baseLayerSelect.addEventListener("change", onBaseLayerChange);
  reloadBtn.addEventListener("click", onReloadClick);
  locateBtn.addEventListener("click", onLocateClick);
  toggleFiltersBtn.addEventListener("click", onToggleFiltersClick);
  applyFiltersBtn.addEventListener("click", onApplyFiltersClick);
  clearFiltersBtn.addEventListener("click", onClearFiltersClick);
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
    const listings = await loadListings("../data/listings.json");
    setListings(listings);
    render();
  } catch (error) {
    console.error("Reload error:", error);
    alert("Không thể reload dữ liệu listings.");
  }
}

function onLocateClick() {
  locateUser();
}

function onToggleFiltersClick() {
  filterPanel.classList.toggle("hidden");
}

function onApplyFiltersClick() {
  setFilters({
    timeMax: filterTimeMax.value,
    unitPriceMax: filterUnitPriceMax.value,
    roadWidthMin: filterRoadWidthMin.value,
    poiMin: filterPoiMin.value,
    areaMin: filterAreaMin.value
  });

  const filtered = applyListingFilters(state.listings, state.filters);
  setFilteredListings(filtered);

  render();
}

function onClearFiltersClick() {
  resetFilters();

  filterTimeMax.value = "";
  filterUnitPriceMax.value = "";
  filterRoadWidthMin.value = "";
  filterPoiMin.value = "";
  filterAreaMin.value = "";

  setFilteredListings(state.listings);
  render();
}

init();