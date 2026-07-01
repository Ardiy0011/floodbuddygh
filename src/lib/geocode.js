// Reverse geocoding via OpenStreetMap's Nominatim (free, no API key).
//
// NOTE: Nominatim's usage policy allows light use (≈1 request/second) and asks
// for attribution. That's fine for development and an MVP. For production scale
// you should self-host Nominatim or use a paid geocoder (e.g. Mapbox, Google) —
// swap the URL here when you do.
const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

// Turn a Nominatim response into a short, human-readable label like
// "Osu, Accra" rather than a 9-part display string.
function toLabel(data) {
  if (!data) return null;
  const a = data.address || {};
  const local =
    a.suburb || a.neighbourhood || a.quarter || a.village || a.hamlet || a.road;
  const area = a.city || a.town || a.municipality || a.county || a.state;
  const parts = [local, area].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return data.display_name || null;
}

/**
 * Reverse-geocode a coordinate to a human-readable place name.
 * Returns a string, or null if it couldn't be resolved.
 */
export async function reverseGeocode(lat, lng, { signal } = {}) {
  const url =
    `${ENDPOINT}?format=jsonv2&lat=${lat}&lon=${lng}` +
    `&zoom=16&addressdetails=1`;
  try {
    const res = await fetch(url, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return toLabel(data);
  } catch (_err) {
    return null; // network/abort — caller falls back to coordinates
  }
}

// Compact coordinate string used as a fallback label.
export function formatCoords(lat, lng) {
  return `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;
}
