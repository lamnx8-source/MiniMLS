import { createMap, switchBaseLayer } from "./map.js";
import { loadListings } from "./data.js";
import { renderListingsLayer, clearListingsLayer } from "./layers.js";

// App state V1
const state = {
  baseLayer: "osm",
  listings: [],
};

// DOM refs
const baseLayerSelect = document.getElementById("baseLayerSelect");
const reloadBtn = document.getElementById("reloadBtn");

async function init() {
  try {
    createMap("map");

    // Load data
    state.listings = await loadListings("../data/listings.json");

    // Render listings
    render();

    // Events
    baseLayerSelect.addEventListener("change", onBaseLayerChange);
    reloadBtn.addEventListener("click", onReloadClick);

    console.log("MiniMLS V1 initialized successfully.");
  } catch (error) {
    console.error("Initialization error:", error);
    alert("Không thể khởi tạo webmap. Kiểm tra console để xem lỗi.");
  }
}

function render() {
  clearListingsLayer();
  renderListingsLayer(state.listings);
}

function onBaseLayerChange(event) {
  state.baseLayer = event.target.value;
  switchBaseLayer(state.baseLayer);
}

async function onReloadClick() {
  try {
    state.listings = await loadListings("../data/listings.json");
    render();
  } catch (error) {
    console.error("Reload error:", error);
    alert("Không thể reload dữ liệu listings.");
  }
}

init();