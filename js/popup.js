export function createListingPopupHtml(listing) {
  listing = listing || {};

  var id = escapeHtml(listing.id || listing.ID || listing.Id || "");
  var status = escapeHtml(listing.Status || listing.status || "New");
  var rawNotes = listing.Notes || listing.notes || "";
  var notes = escapeHtml(rawNotes).replace(/\n/g, "<br>");

  var lat = Number(listing.lat || listing.Lat || listing.latitude || listing.Latitude);
  var lng = Number(listing.lng || listing.Lng || listing.long || listing.Long || listing.longitude || listing.Longitude);

  var folderUrl = String(
    listing.FolderURL ||
      listing.FolderUrl ||
      listing.folderURL ||
      listing.folderUrl ||
      listing.folder_url ||
      ""
  ).trim();

  var mapsUrl = isFinite(lat) && isFinite(lng)
    ? "https://www.google.com/maps?q=" + encodeURIComponent(lat + "," + lng)
    : "";

  var folderButton = folderUrl
    ? '<a class="popup-btn" href="' + escapeAttribute(folderUrl) + '" target="_blank" rel="noopener noreferrer">Open Folder</a>'
    : '<span class="popup-muted">No FolderURL</span>';

  return (
    '<div class="popup-card">' +
    '<div class="popup-title">' + id + "</div>" +
    '<div class="popup-status">Status: ' + status + "</div>" +
    '<div class="popup-notes">' + notes + "</div>" +
    '<div class="popup-actions">' +
    (mapsUrl ? '<a class="popup-btn" href="' + mapsUrl + '" target="_blank" rel="noopener noreferrer">Google Maps</a>' : "") +
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
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
