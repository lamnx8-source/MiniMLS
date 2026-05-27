export function createListingPopupHtml(listing) {
  const id = escapeHtml(listing?.id || listing?.ID || "");
  const status = escapeHtml(listing?.Status || listing?.status || "New");
  const rawNotes = listing?.Notes || listing?.notes || "";
  const notes = escapeHtml(rawNotes).replace(/\n/g, "<br>");

  const lat = Number(listing?.lat || listing?.Lat);
  const lng = Number(listing?.lng || listing?.Lng);

  const folderUrl = String(
    listing?.FolderURL ||
    listing?.FolderUrl ||
    listing?.folderURL ||
    listing?.folderUrl ||
    listing?.folder_url ||
    ""
  ).trim();

  const mapsUrl =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : "";

  const folderButton = folderUrl
    ? `<a class="popup-btn" href="${escapeAttribute(folderUrl)}" target="_blank" rel="noopener noreferrer">📁 Open Folder</a>`
    : `<span class="popup-muted">No FolderURL</span>`;

  return `
    <div class="popup-card">
      <div class="popup-title">${id}</div>
      <div class="popup-status">Status: ${status}</div>
      <div class="popup-notes">${notes}</div>
      <div class="popup-actions">
        ${
          mapsUrl
            ? `<a class="popup-btn" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">📍 Google Maps</a>`
            : ""
        }
        ${folderButton}
      </div>
    </div>
  `;
}


function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}