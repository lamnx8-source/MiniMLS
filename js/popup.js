export function createListingPopupHtml(item) {
  const id = safe(item.id);
  const name = safe(item.name || item.id || "No name");
  const unitPrice = safeValue(item.unitPrice);
  const roadWidth = safeValue(item.roadWidth);
  const poi = safeValue(item.poi);
  const area = safeValue(item.area);

  const mapsUrl =
    item.mapsUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(item.lat)},${encodeURIComponent(item.lng)}`;

  const folderUrl = item.folderUrl || "#";

  return `
    <div class="popup-content">
      <div class="popup-title">${name}</div>

      <div class="popup-grid">
        <div class="popup-label">ID</div>
        <div>${id}</div>

        <div class="popup-label">UnitPrice</div>
        <div>${unitPrice}</div>

        <div class="popup-label">RoadWidth</div>
        <div>${roadWidth}</div>

        <div class="popup-label">POI</div>
        <div>${poi}</div>

        <div class="popup-label">Area</div>
        <div>${area}</div>
      </div>

      <div class="popup-actions">
        <a class="popup-btn" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">
          Google Maps
        </a>

        <a class="popup-btn" href="${folderUrl}" target="_blank" rel="noopener noreferrer">
          Open Folder
        </a>
      </div>
    </div>
  `;
}

function safe(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return escapeHtml(String(value));
}

function safeValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return escapeHtml(String(value));
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}