import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode, formatCoords } from '../lib/geocode.js';
import { useTheme } from '../theme/ThemeContext.jsx';

const DEFAULT_CENTER = [5.6037, -0.187]; // Accra
const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};

/**
 * Full-screen picker: a fixed crosshair pin sits at the map center; the user
 * pans the map to place it. The address under the pin resolves live (debounced).
 * "Use this location" returns { latitude, longitude, label }.
 */
export default function LocationPicker({ initial, onConfirm, onCancel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [label, setLabel] = useState('Move the map to set the location');
  const [resolving, setResolving] = useState(false);
  const centerRef = useRef(
    initial ? [initial.latitude, initial.longitude] : DEFAULT_CENTER
  );
  const { theme } = useTheme();

  useEffect(() => {
    const map = L.map(containerRef.current, { zoomControl: false })
      .setView(centerRef.current, initial ? 15 : 12);
    L.tileLayer(TILES[theme] || TILES.light, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    let timer = null;
    let aborter = null;
    const onMove = () => {
      const c = map.getCenter();
      centerRef.current = [c.lat, c.lng];
      setResolving(true);
      if (timer) clearTimeout(timer);
      if (aborter) aborter.abort();
      aborter = new AbortController();
      const signal = aborter.signal;
      timer = setTimeout(async () => {
        const name = await reverseGeocode(c.lat, c.lng, { signal });
        if (!signal.aborted) {
          setLabel(name || formatCoords(c.lat, c.lng));
          setResolving(false);
        }
      }, 650);
    };

    map.on('moveend', onMove);
    onMove(); // resolve the initial center

    return () => {
      if (timer) clearTimeout(timer);
      if (aborter) aborter.abort();
      map.remove();
      mapRef.current = null;
    };
  }, [initial]);

  const confirm = () => {
    const [lat, lng] = centerRef.current;
    onConfirm({
      latitude: lat,
      longitude: lng,
      label: resolving ? formatCoords(lat, lng) : label,
    });
  };

  return (
    <div className="picker-map">
      <div className="picker-map__canvas" ref={containerRef} />

      {/* fixed center crosshair pin */}
      <div className="picker-map__pin" aria-hidden="true">📍</div>

      <button className="picker-map__cancel" onClick={onCancel}>← Cancel</button>

      <div className="picker-map__bar">
        <p className="picker-map__label">
          {resolving ? 'Finding address…' : label}
        </p>
        <button className="btn btn--primary" onClick={confirm}>
          Use this location
        </button>
      </div>
    </div>
  );
}
