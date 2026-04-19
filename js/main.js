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

/**
 * Chuẩn hóa 1 record listing theo format JSON mới:
 * {
 *   id: "...",
 *   Notes: "...",
 *   lat: 10.44,
 *   lng: 107.27,
 *   Flag: "New"
 * }
 *
 * Hàm này giúp:
 * - ép lat/lng thành number
 * - giữ an toàn nếu thiếu field
 * - tạo object sạch trước khi render
 */
function normalizeListing(item) {
  const lat = Number(item?.lat);
  const lng = Number(item?.lng);

  return {
    id: item?.id ?? "",
    Notes: item?.Notes ?? "",
    Flag: item?.Flag ?? "",
    lat,
    lng
  };
}

/**
 * Kiểm tra listing có hợp lệ để vẽ marker không
 */
function isValidListing(item) {
  return Number.isFinite(item.lat) && Number.isFinite(item.lng);
}

/**
 * Filter logic tạm thời để map vẫn chạy với JSON mới.
 *
 * Lưu ý:
 * - JSON hiện tại chưa có Time / UnitPrice / RoadWidth / POI / Area
 * - nên các filter box hiện có sẽ chỉ hoạt động theo kiểu:
 *   + nếu để trống => bỏ qua
 *   + nếu nhập gì đó => tìm keyword trong id / Notes / Flag
 *
 * Nghĩa là:
 * - chưa phải filter số chuẩn
 * - nhưng không làm map lỗi
 * - vẫn tận dụng được các ô filter hiện tại
 */
function applySimpleFilters(listings, filters) {
  return listings.filter((item) => {
    // chỉ lấy record có tọa độ hợp lệ
    if (!isValidListing(item)) return false;

    const idText = String(item.id || "").toLowerCase();
    const notesText = String(item.Notes || "").toLowerCase();
    const flagText = String(item.Flag || "").toLowerCase();

    const searchTexts = [
      String(filters.timeMax || "").trim().toLowerCase(),
      String(filters.unitPriceMax || "").trim().toLowerCase(),
      String(filters.roadWidthMin || "").trim().toLowerCase(),
      String(filters.poiMin || "").trim().toLowerCase(),
      String(filters.areaMin || "").trim().toLowerCase()
    ].filter(Boolean);

    // Nếu tất cả ô filter đều rỗng => cho qua
    if (searchTexts.length === 0) return true;

    // Mỗi ô filter hiện coi như 1 keyword cần match
    // keyword được phép xuất hiện trong id / Notes / Flag
    return searchTexts.every((keyword) => {
      return (
        idText.includes(keyword) ||
        notesText.includes(keyword) ||
        flagText.includes(keyword)
      );
    });
  });
}

async function init() {
  try {
    createMap("map");

    const listingsRaw = await loadListings("../data/listings.json");
    const listings = Array.isArray(listingsRaw)
      ? listingsRaw.map(normalizeListing)
      : [];

    setListings(listings);
    setFilteredListings(listings);

    render();
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
    const listingsRaw = await loadListings("../data/listings.json");
    const listings = Array.isArray(listingsRaw)
      ? listingsRaw.map(normalizeListing)
      : [];

    setListings(listings);
    setFilteredListings(listings);

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