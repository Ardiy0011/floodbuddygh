import { useState, useCallback } from 'react';

/**
 * Thin wrapper around the browser Geolocation API.
 * Returns { coords, status, error, locate } — call locate() (e.g. on mount or
 * button press) to request the user's current position.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null); // { latitude, longitude, accuracy }
  const [status, setStatus] = useState('idle'); // idle | locating | ready | error
  const [error, setError] = useState(null);

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setError('Geolocation is not supported on this device.');
      return;
    }

    setStatus('locating');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setStatus('ready');
      },
      (err) => {
        setStatus('error');
        setError(err.message || 'Unable to get your location.');
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
    );
  }, []);

  return { coords, status, error, locate };
}
