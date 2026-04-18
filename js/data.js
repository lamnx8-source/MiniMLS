export async function loadListings(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load listings: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Listings JSON must be an array.");
  }

  return data;
}