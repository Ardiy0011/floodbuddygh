import { useState, useEffect } from 'react';
import FilePicker from './FilePicker.jsx';
import LocationPicker from './LocationPicker.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { createSighting, API_URL } from '../api/client.js';
import { reverseGeocode, formatCoords } from '../lib/geocode.js';

export default function SightingForm({ initialCoords, onClose }) {
  const [file, setFile] = useState(null);
  const [severity, setSeverity] = useState('');
  const [location, setLocation] = useState(null); // { latitude, longitude, label }
  const [resolving, setResolving] = useState(false);
  const [manual, setManual] = useState(false); // user picked a spot on the map
  const [pickerOpen, setPickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const { getToken } = useAuth();

  // Get a FRESH location fix when the form opens — the user may have moved since
  // they first opened the app, and the report should reflect where they are now.
  const { coords: liveCoords, status: geoStatus, locate } = useGeolocation();
  useEffect(() => { locate(); }, [locate]);

  // Seed from the last-known location immediately, then update to the fresh fix
  // when it arrives — unless the user has set the spot manually on the map.
  useEffect(() => {
    if (manual) return;
    const c = liveCoords || initialCoords;
    if (!c) return;
    setLocation({ latitude: c.latitude, longitude: c.longitude, label: formatCoords(c.latitude, c.longitude) });
    setResolving(true);
    let alive = true;
    reverseGeocode(c.latitude, c.longitude).then((name) => {
      if (!alive) return;
      if (name) setLocation((cur) => (cur ? { ...cur, label: name } : cur));
      setResolving(false);
    });
    return () => { alive = false; };
  }, [liveCoords, initialCoords, manual]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) return setError('Please add a photo of the flooding.');
    if (!location) return setError('Please set the location of the flooding.');
    if (!severity.trim()) return setError('Please describe how severe the flooding is.');

    try {
      setSubmitting(true);
      const idToken = await getToken();
      const saved = await createSighting({
        image: file,
        latitude: location.latitude,
        longitude: location.longitude,
        severity: severity.trim(),
        idToken,
      });
      setResult(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Success --------------------------------------------------------------
  if (result) {
    return (
      <div className="sheet">
        <div className="sheet__body success">
          <h2 className="success__title">Report received 🌊</h2>
          <p className="success__sub">Thank you for keeping your community safe.</p>
          <img className="success__img" src={API_URL + result.image} alt="Submitted flood sighting" />
          <dl className="meta">
            <div>
              <dt>Severity</dt>
              <dd>{result.severity}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{location?.label || formatCoords(result.latitude, result.longitude)}</dd>
            </div>
          </dl>
          <button className="btn btn--primary" onClick={onClose}>Back to map</button>
        </div>
      </div>
    );
  }

  const updating = resolving || geoStatus === 'locating';

  return (
    <div className="sheet">
      <header className="sheet__head">
        <button className="sheet__back" onClick={onClose}>← Map</button>
        <span className="sheet__title">Report flooding</span>
      </header>

      <form className="sheet__body form" onSubmit={handleSubmit}>
        <FilePicker file={file} onSelect={setFile} />

        <section className="field">
          <label className="field__label">Location</label>
          <button type="button" className="locrow" onClick={() => setPickerOpen(true)}>
            <span className="locrow__pin">📍</span>
            <span className="locrow__text">
              <strong>{location ? location.label : 'Set the flood location'}</strong>
              {location && <small>{formatCoords(location.latitude, location.longitude)}</small>}
            </span>
            <span className="locrow__change">{location ? 'Change' : 'Set'}</span>
          </button>
          {updating && <p className="field__hint">Updating to your current location…</p>}
          {!location && !updating && (
            <p className="field__hint">Location wasn’t shared — tap above to set it on the map.</p>
          )}
        </section>

        <section className="field">
          <label className="field__label" htmlFor="severity">How severe is it?</label>
          <textarea
            id="severity"
            className="field__input"
            rows={3}
            placeholder="e.g. Knee-deep water across Main St, rising fast, two cars stalled."
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          />
        </section>

        {error && <p className="banner banner--err">{error}</p>}

        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Submit flood report'}
        </button>
      </form>

      {pickerOpen && (
        <LocationPicker
          initial={location}
          onCancel={() => setPickerOpen(false)}
          onConfirm={(loc) => { setManual(true); setLocation(loc); setResolving(false); setPickerOpen(false); }}
        />
      )}
    </div>
  );
}
