export async function loadListings(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Cannot load listings file: ${url} (${response.status})`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("listings.json must be a JSON array.");
  }

  return data.map(normalizeListing).filter(isValidListing);
}

function normalizeListing(item) {
  const folderUrl = firstValue(
    item.FolderURL,
    item.FolderUrl,
    item.folderURL,
    item.folderUrl,
    item.folder_url
  );

  return {
    id: String(firstValue(item.id, item.ID)).trim(),
    notes: String(firstValue(item.Notes, item.notes)).trim(),
    status: String(firstValue(item.Status, item.status)).trim(),
    lat: toNumber(firstValue(item.lat, item.Lat, item.latitude, item.Latitude)),
    lng: toNumber(firstValue(item.lng, item.Lng, item.long, item.Long, item.longitude, item.Longitude)),
    folderUrl: cleanUrl(folderUrl),
  };
}

function firstValue(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return "";
}

function toNumber(value) {
  if (typeof value === "number") return value;
  return Number(String(value).trim().replace(",", "."));
}

function cleanUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return "";
  return url;
}

function isValidListing(item) {
  return Number.isFinite(item.lat) && Number.isFinite(item.lng);
}
