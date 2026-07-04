import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_URL } from '../api/client.js';
import { useTheme } from '../theme/ThemeContext.jsx';
import { useBroadcasts } from '../hooks/useBroadcasts.js';
import Menu from './Menu.jsx';
import BroadcastBanner from './BroadcastBanner.jsx';
import NotificationPrompt from './NotificationPrompt.jsx';
import AdminPortal from './AdminPortal.jsx';

// The app is confined to Accra. These bounds box the metro area; the map
// resists panning past them and we flash a red edge glow when you push against
// the wall (GTA "leaving the area" style).
const ACCRA_BOUNDS = L.latLngBounds([
  [5.50, -0.33], // south-west
  [5.73, 0.02],  // north-east
]);

const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};
const TILE_OPTS = { attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: 'abcd', maxZoom: 20 };

// Inverse mask: a big outer rectangle with an Accra-shaped hole. Filled with the
// page background, it hides everything outside Accra so only Accra is visible.
const MASK_OUTER = [[3.5, -3.5], [3.5, 2.5], [8.0, 2.5], [8.0, -3.5]];
const ACCRA_RING = [[5.50, -0.33], [5.50, 0.02], [5.73, 0.02], [5.73, -0.33]];
const maskColor = (theme) => (theme === 'dark' ? '#140d11' : '#ffffff');

function severityColor(text = '') {
  const t = text.toLowerCase();
  if (/(sever|critical|danger|deep|waist|chest|swept|emergency)/.test(t)) return '#e5383b';
  if (/(moder|rising|knee|road|blocked|strong)/.test(t)) return '#f4a261';
  return '#2a9d8f';
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Live flood markers only show for 16 hours after a report. (The "Renting"
// flood-prone overlay ignores this and shows all reports historically.)
const LIVE_WINDOW_MS = 16 * 60 * 60 * 1000;

// On mount / re-locate, the map drones into the user with this radius framed.
const FIVE_MILES_M = 5 * 1609.344;
// How close the "drone-in" lands — tight enough that the radius edge and the
// Accra boundary sit off-screen (no visible demarcation lines).
const HONE_ZOOM = 15;

function timeAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// Which edges of the current view are pressed against the Accra bounds.
function edgesAtLimit(map) {
  const b = map.getBounds();
  const eps = 0.0006;
  return {
    top: b.getNorth() >= ACCRA_BOUNDS.getNorth() - eps,
    bottom: b.getSouth() <= ACCRA_BOUNDS.getSouth() + eps,
    right: b.getEast() >= ACCRA_BOUNDS.getEast() - eps,
    left: b.getWest() <= ACCRA_BOUNDS.getWest() + eps,
  };
}

const NO_GLOW = { top: false, right: false, bottom: false, left: false };

export default function MapView({ userCoords, geoStatus, onLocate, onReport, refreshKey }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const maskRef = useRef(null);
  const markersRef = useRef(null);
  const zonesRef = useRef(null);
  const userMarkerRef = useRef(null);
  const radiusRef = useRef(null);
  const clearGlowTimer = useRef(null);
  const [sightings, setSightings] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [glow, setGlow] = useState(NO_GLOW);
  const { theme } = useTheme();
  const broadcasts = useBroadcasts();

  // Initialise the map once (locked to Accra).
  useEffect(() => {
    const map = L.map(containerRef.current, {
      zoomControl: false,
      maxBounds: ACCRA_BOUNDS,
      maxBoundsViscosity: 1.0, // solid wall — can't drag outside Accra
      maxZoom: 18,
    });
    // Fit Accra to the screen, then forbid zooming out past that. Combined with
    // maxBounds this means the view can NEVER leave Accra, on any screen size.
    map.fitBounds(ACCRA_BOUNDS);
    map.setMinZoom(map.getZoom());
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Mask everything outside Accra (no visible outline — just hide the outside).
    maskRef.current = L.polygon([MASK_OUTER, ACCRA_RING], {
      stroke: false, fillColor: maskColor(theme), fillOpacity: 1, interactive: false,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Edge glow while dragging against the boundary.
    const onDrag = () => {
      if (clearGlowTimer.current) { clearTimeout(clearGlowTimer.current); clearGlowTimer.current = null; }
      setGlow(edgesAtLimit(map));
    };
    const onDragEnd = () => {
      clearGlowTimer.current = setTimeout(() => setGlow(NO_GLOW), 350);
    };
    map.on('drag', onDrag);
    map.on('dragend', onDragEnd);
    map.on('zoomstart', () => setGlow(NO_GLOW));

    return () => {
      if (clearGlowTimer.current) clearTimeout(clearGlowTimer.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add / swap the tile layer + mask colour whenever the theme changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileRef.current) tileRef.current.remove();
    tileRef.current = L.tileLayer(TILES[theme] || TILES.light, TILE_OPTS).addTo(map);
    if (maskRef.current) maskRef.current.setStyle({ fillColor: maskColor(theme) });
  }, [theme]);

  // On mount / re-locate: drop the "you are here" marker, draw a 5-mile ring,
  // and drone the map into the user framing that radius (clamped to Accra).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userCoords) return;
    const latlng = [userCoords.latitude, userCoords.longitude];

    if (userMarkerRef.current) userMarkerRef.current.remove();
    userMarkerRef.current = L.marker(latlng, {
      icon: L.divIcon({ className: 'me-marker', html: '<span></span>', iconSize: [18, 18] }),
      interactive: false,
    }).addTo(map);

    if (radiusRef.current) radiusRef.current.remove();
    radiusRef.current = L.circle(latlng, {
      radius: FIVE_MILES_M,
      stroke: false, // no hard ring — just a soft area highlight
      fillColor: '#2563eb', fillOpacity: 0.06, interactive: false,
    }).addTo(map);

    // Smooth "drone-in": fly right into the user's position at a close zoom, so
    // the radius edge and Accra boundary stay off-screen (no demarcation visible).
    map.flyTo(latlng, HONE_ZOOM, { duration: 1.6 });
  }, [userCoords]);

  // Load flood sightings (public route) and re-load after a new report.
  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/api/sightings`)
      .then((r) => r.json())
      .then((data) => { if (alive) setSightings(Array.isArray(data) ? data : []); })
      .catch(() => {});
    return () => { alive = false; };
  }, [refreshKey]);

  // Plot the LIVE flood markers — only reports from the last 16 hours.
  useEffect(() => {
    const layer = markersRef.current;
    if (!layer) return;
    layer.clearLayers();
    const cutoff = Date.now() - LIVE_WINDOW_MS;
    const live = sightings.filter((s) => new Date(s.created_at).getTime() >= cutoff);
    live.forEach((s) => {
      const color = severityColor(s.severity);
      const marker = L.marker([s.latitude, s.longitude], {
        icon: L.divIcon({
          className: 'flood-marker',
          html: `<span style="--c:${color}"></span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      });
      const img = `${API_URL}${s.image}`;
      marker.bindPopup(
        `<div class="leaflet-popup-card">
           <img src="${img}" alt="" />
           <p class="popup__sev">${escapeHtml(s.severity)}</p>
           <p class="popup__time">🕒 Reported ${timeAgo(s.created_at)}</p>
           <p class="popup__warn">⚠ Conditions may have changed since this report — stay cautious.</p>
         </div>`
      );
      marker.addTo(layer);
    });
  }, [sightings]);

  // Flood-prone-area highlight (the "Renting" module). Translucent red zones
  // around reported floods; overlapping ones read as larger risky areas.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (zonesRef.current) { zonesRef.current.remove(); zonesRef.current = null; }
    if (!showZones) return;
    const layer = L.layerGroup();
    sightings.forEach((s) => {
      L.circle([s.latitude, s.longitude], {
        radius: 300,
        color: '#e5383b', weight: 1, opacity: 0.5,
        fillColor: '#e5383b', fillOpacity: 0.18,
      }).addTo(layer);
    });
    layer.addTo(map);
    zonesRef.current = layer;
  }, [showZones, sightings]);

  return (
    <div className="map">
      <div className="map__canvas" ref={containerRef} />

      {/* GTA-style boundary glow */}
      <div className={`edge-glow edge-glow--top${glow.top ? ' on' : ''}`} />
      <div className={`edge-glow edge-glow--bottom${glow.bottom ? ' on' : ''}`} />
      <div className={`edge-glow edge-glow--left${glow.left ? ' on' : ''}`} />
      <div className={`edge-glow edge-glow--right${glow.right ? ' on' : ''}`} />

      <div className="map__top">
        <div className="brand">Flood<span className="brand__accent">Buddy</span></div>
        <button className="map__menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
      </div>

      <div className="map__alerts">
        <BroadcastBanner broadcasts={broadcasts} />
        <NotificationPrompt />
      </div>

      {showZones && <div className="map__zones-flag">🏠 Flood-prone areas</div>}

      <div className="map__legend">
        <span><i style={{ background: '#e5383b' }} /> Severe</span>
        <span><i style={{ background: '#f4a261' }} /> Moderate</span>
        <span><i style={{ background: '#2a9d8f' }} /> Minor</span>
      </div>

      <button
        className="map__locate"
        onClick={onLocate}
        title="Center on my location"
        disabled={geoStatus === 'locating'}
      >
        {geoStatus === 'locating' ? '…' : '◎'}
      </button>

      <button className="map__report" onClick={onReport}>
        <span className="map__report-inner">
          <span className="map__report-plus">＋</span> Report flooding
        </span>
      </button>

      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        zonesOn={showZones}
        onToggleZones={() => setShowZones((v) => !v)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {adminOpen && <AdminPortal onClose={() => setAdminOpen(false)} />}
    </div>
  );
}
