export function createListingPopupHtml(listing) {
  console.log("POPUP listing =", listing);
  console.log("POPUP status =", listing?.Status);

  const id = listing?.id || "";
  const notes = listing?.Notes || "";
  const status = listing?.Status || "";
  const folderUrl = listing?.FolderURL || "";
  const lat = Number(listing?.lat);
  const lng = Number(listing?.lng);

  const googleMapsUrl =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : "";

  return `
    <div class="popup-card" onclick="event.stopPropagation();">
      <div><strong>${id}</strong></div>
      <div>Status: ${status}</div>
      <hr>
      <div>${String(notes).replace(/\n/g, "<br>")}</div>

      ${
        googleMapsUrl
          ? `<br><a class="popup-btn" href="${googleMapsUrl}" target="_blank" onclick="event.stopPropagation();">📍 Open Google Maps</a>`
          : ""
      }

      ${
        folderUrl
          ? `<a class="popup-btn" href="${folderUrl}" target="_blank" onclick="event.stopPropagation();">📁 Open Folder</a>`
          : ""
      }
    </div>
  `;
}
