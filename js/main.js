import { createMap, switchBaseLayer } from "./map.js";
import { loadListings } from "./data.js";
import { renderListings } from "./layers.js";
import { locateUser } from "./locate.js";

const LISTINGS_URL = "./data/listings.json";

let allListings = [];

const baseLayerSelect = document.getElementById("baseLayerSelect");
const searchInput = document.getElementById("searchInput");
const locateBtn = document.getElementById("locateBtn");
const reloadBtn = document.getElementById("reloadBtn");

init();

async function init() {
  try {
    createMap("map");
    bindEvents();
    await reloadListings();
  } catch (error) {
    console.error(error);
    alert("Cannot initialize MiniMLS WebMap. Open Console to see the error.");
  }
}

function bindEvents() {
  baseLayerSelect?.addEventListener("change", () => switchBaseLayer(baseLayerSelect.value));
  searchInput?.addEventListener("input", applySearch);
  locateBtn?.addEventListener("click", locateUser);
  reloadBtn?.addEventListener("click", reloadListings);
}

async function reloadListings() {
  allListings = await loadListings(LISTINGS_URL);
  console.log(`Loaded ${allListings.length} valid listings.`);
  console.table(allListings.slice(0, 5).map(x => ({ id: x.id, folderUrl: x.folderUrl })));
  applySearch();
}

function applySearch() {
  const keyword = String(searchInput?.value || "").trim().toLowerCase();

  const filtered = keyword
    ? allListings.filter((item) =>
        [item.id, item.status, item.notes, item.folderUrl]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
    : allListings;

  renderListings(filtered);
}
