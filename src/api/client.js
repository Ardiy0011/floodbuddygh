// Centralized API helper.
// - Production (Vercel): VITE_API_URL is empty, so API_URL is "" and requests go
//   to same-origin paths like /api/sightings and /uploads/... which Vercel
//   rewrites to the droplet backend (see vercel.json). No CORS, no mixed content.
// - Local dev: frontend/.env sets VITE_API_URL=http://localhost:4000.
export const API_URL = import.meta.env.VITE_API_URL ?? '';

// Parse a response into JSON and, on failure, throw an Error enriched with the
// fields the auth flow cares about (status, requiresConsent, requiredVersions).
async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.requiresConsent = data.requiresConsent === true;
    err.requiredVersions = data.requiredVersions;
    err.user = data.user;
    throw err;
  }
  return data;
}

// --- Auth --------------------------------------------------------------------

/** Establish/refresh the session. Throws with requiresConsent=true (403) when
 *  the user still needs to accept the Terms + Privacy Policy. */
export async function postSession(idToken) {
  const res = await fetch(`${API_URL}/api/auth/session`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
  return parse(res);
}

/** Record the user's agreement to the Terms + Privacy Policy. */
export async function postConsent(idToken, { termsVersion, privacyVersion }) {
  const res = await fetch(`${API_URL}/api/auth/consent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      acceptedTerms: true,
      acceptedPrivacy: true,
      termsVersion,
      privacyVersion,
    }),
  });
  return parse(res);
}

// --- Sightings ---------------------------------------------------------------

/**
 * Submit a flood sighting (authenticated).
 *
 * Sends a multipart/form-data POST so the image file rides alongside the text
 * fields, plus the Firebase ID token as a Bearer credential. We never set
 * Content-Type by hand — the browser sets multipart/form-data with the correct
 * boundary when the body is FormData.
 */
export async function createSighting({ image, latitude, longitude, severity, idToken }) {
  const formData = new FormData();
  formData.append('image', image); // field name must match upload.single('image')
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);
  formData.append('severity', severity);

  const res = await fetch(`${API_URL}/api/sightings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
    body: formData,
  });
  return parse(res);
}

/** Fetch a single sighting and attach a ready-to-use absolute image URL. */
export async function getSighting(id) {
  const res = await fetch(`${API_URL}/api/sightings/${id}`);
  const sighting = await parse(res);
  return { ...sighting, imageUrl: API_URL + sighting.image };
}

// --- Broadcasts (public-safety alerts) --------------------------------------

/** Active safety alerts — online clients poll this. */
export async function getActiveBroadcasts() {
  const res = await fetch(`${API_URL}/api/broadcasts/active`);
  return parse(res);
}

/** Admin only — send a public-safety message to all online users. */
export async function postBroadcast(idToken, { message, severity }) {
  const res = await fetch(`${API_URL}/api/broadcasts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ message, severity: severity || null }),
  });
  return parse(res);
}
