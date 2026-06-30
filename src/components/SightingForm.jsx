import { useState } from 'react';
import FilePicker from './FilePicker.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { createSighting, API_URL } from '../api/client.js';

export default function SightingForm() {
  const [file, setFile] = useState(null);
  const [severity, setSeverity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // saved sighting
  const [error, setError] = useState(null);

  const { getToken } = useAuth();
  const { coords, status: geoStatus, error: geoError, locate } = useGeolocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Please add a photo of the flooding.');
      return;
    }
    if (!coords) {
      setError('Please share your location first.');
      return;
    }
    if (!severity.trim()) {
      setError('Please describe how severe the flooding is.');
      return;
    }

    try {
      setSubmitting(true);
      const idToken = await getToken();
      const saved = await createSighting({
        image: file,
        latitude: coords.latitude,
        longitude: coords.longitude,
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

  const reset = () => {
    setFile(null);
    setSeverity('');
    setResult(null);
    setError(null);
  };

  // --- Success screen --------------------------------------------------------
  if (result) {
    return (
      <div className="success">
        <h2 className="success__title">Report received 🌊</h2>
        <p className="success__sub">Thank you for keeping your community safe.</p>
        <img
          className="success__img"
          src={API_URL + result.image}
          alt="Submitted flood sighting"
        />
        <dl className="meta">
          <div><dt>Severity</dt><dd>{result.severity}</dd></div>
          <div><dt>Location</dt><dd>{result.latitude.toFixed(5)}, {result.longitude.toFixed(5)}</dd></div>
          <div><dt>Reference</dt><dd className="mono">{result.id}</dd></div>
        </dl>
        <button className="btn btn--ghost" onClick={reset}>Report another</button>
      </div>
    );
  }

  // --- Form ------------------------------------------------------------------
  return (
    <form className="form" onSubmit={handleSubmit}>
      <FilePicker file={file} onSelect={setFile} />

      <section className="field">
        <label className="field__label">Location</label>
        {coords ? (
          <p className="field__hint ok">
            📍 {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            <span className="accuracy"> (±{Math.round(coords.accuracy)} m)</span>
          </p>
        ) : (
          <button
            type="button"
            className="btn btn--outline"
            onClick={locate}
            disabled={geoStatus === 'locating'}
          >
            {geoStatus === 'locating' ? 'Locating…' : 'Use my current location'}
          </button>
        )}
        {geoError && <p className="field__hint err">{geoError}</p>}
      </section>

      <section className="field">
        <label className="field__label" htmlFor="severity">
          How severe is it?
        </label>
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
  );
}
