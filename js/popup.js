export function createListingPopupHtml(listing) {
  const id = escapeHtml(listing.id);
  const status = escapeHtml(listing.status || "New");
  const notes = escapeHtml(listing.notes).replace(/\n/g, "<br>");
  const mapsUrl = `https://www.google.com/maps?q=${listing.lat},${listing.lng}`;
  const folderButton = listing.folderUrl
    ? `<a class="popup-btn" href="${escapeAttribute(listing.folderUrl)}" target="_blank" rel="noopener noreferrer">📁 Open Folder</a>`
    : `<span class="popup-muted">No FolderURL</span>`;

  return `
    <div class="popup-card">
      <div class="popup-title">${id}</div>
      <div class="popup-status">Status: ${status}</div>
      <div class="popup-notes">${notes}</div>
      <div class="popup-actions">
        <a class="popup-btn" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">📍 Google Maps</a>
        ${folderButton}
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
