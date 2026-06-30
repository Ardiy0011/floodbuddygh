# FloodBuddy — Frontend

Mobile-first React + Vite client for reporting flood sightings. Capture a
photo, drop a pin with the device's GPS, describe the severity, and submit it
to the API as `multipart/form-data`.

Design: stark white base with deep **wine → dark-pink** gradients, rounded
cards, and an eclectic blob accent in the header.

## Stack

- React 18 + Vite 5
- Firebase Web SDK — Google sign-in
- Native `fetch` + `FormData` (no extra HTTP client)
- Browser Geolocation API

## Auth & legal flow

1. **Sign in** with Google ([SignIn.jsx](src/components/SignIn.jsx)) →
   [AuthContext](src/auth/AuthContext.jsx) exchanges the Firebase ID token for a
   backend session.
2. If the user hasn't accepted the current Terms + Privacy versions, the backend
   returns `403 requiresConsent` and the app shows the mandatory
   [ConsentGate](src/components/ConsentGate.jsx). Accepting writes a timestamped
   consent record before the user can continue.
3. Once consented, the reporting form is shown. Each request carries the Firebase
   ID token as a Bearer credential.

The **Terms** and **Privacy Policy** pages ([src/pages/](src/pages/)) are
reachable at `#/terms` and `#/privacy` even when signed out. Fill in real
operator details in [src/legal/meta.js](src/legal/meta.js).

> Firebase **web config** vars (`VITE_FIREBASE_*`) are required — see the
> **Firebase setup** walkthrough in the [root README](../README.md).

## Key files

```
frontend/
├── index.html
├── vite.config.js
└── src/
    ├── App.jsx                     # shell + header/footer
    ├── index.css                   # the wine/pink design system
    ├── api/client.js               # createSighting() / getSighting()
    ├── hooks/useGeolocation.js     # GPS lat/lng
    └── components/
        ├── FilePicker.jsx          # camera-capable photo picker + preview
        └── SightingForm.jsx        # ties it together, builds FormData
```

## How the upload works

`FilePicker` uses `<input type="file" accept="image/*" capture="environment">`
so phones open the rear camera directly. On submit, `SightingForm` builds a
`FormData` body and POSTs it:

```js
const formData = new FormData();
formData.append('image', file);        // the photo File
formData.append('latitude', lat);
formData.append('longitude', lng);
formData.append('severity', severity);

fetch(`${API_URL}/api/sightings`, { method: 'POST', body: formData });
```

> We never set the `Content-Type` header by hand — the browser sets
> `multipart/form-data` with the correct boundary automatically.

The API returns the saved sighting with a relative `image` path; the client
displays it via `API_URL + sighting.image`.

## Local development

```bash
cp .env.example .env       # set VITE_API_URL (defaults to http://localhost:4000)
npm install
npm run dev                # http://localhost:5173 (also on your LAN for phone testing)
```

## Build & deploy

```bash
npm run build              # outputs static files to dist/
```

Serve `dist/` as static files. On a Digital Ocean droplet the simplest path is
to copy `dist/` into Nginx's web root (e.g. `/var/www/floodbuddy`) and proxy
`/api` + `/uploads` to the backend on `localhost:4000`. Set `VITE_API_URL` to
the API's public URL **before** building (Vite inlines env vars at build time).
# floodbuddygh
