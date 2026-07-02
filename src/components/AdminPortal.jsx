import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { postBroadcast } from '../api/client.js';

const SEVERITY_OPTIONS = [
  { label: 'Info', value: '', color: '#2563eb' },
  { label: 'Minor', value: 'Minor', color: '#2a9d8f' },
  { label: 'Moderate', value: 'Moderate', color: '#f4a261' },
  { label: 'Severe', value: 'Severe', color: '#e5383b' },
];

// Admin-only screen to send a public-safety broadcast to all online users.
export default function AdminPortal({ onClose }) {
  const { getToken } = useAuth();
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const send = async (e) => {
    e.preventDefault();
    setError(null);
    setSent(false);
    if (!message.trim()) return setError('Enter a message to broadcast.');
    try {
      setSending(true);
      const token = await getToken();
      await postBroadcast(token, { message: message.trim(), severity });
      setSent(true);
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="sheet">
      <header className="sheet__head">
        <button className="sheet__back" onClick={onClose}>← Map</button>
        <span className="sheet__title">Admin · Safety broadcast</span>
      </header>

      <form className="sheet__body form" onSubmit={send}>
        <p className="field__hint">
          Send a public-safety message to everyone currently using FloodBuddy.
          It shows as a banner and (for users who allowed notifications) a
          push notification.
        </p>

        <section className="field">
          <label className="field__label">Level</label>
          <div className="sevpick">
            {SEVERITY_OPTIONS.map((o) => (
              <button
                key={o.label}
                type="button"
                className={`sevpick__btn${severity === o.value ? ' is-selected' : ''}`}
                style={{ '--sev': o.color }}
                onClick={() => setSeverity(o.value)}
              >
                <span className="sevpick__dot" />
                {o.label}
              </button>
            ))}
          </div>
        </section>

        <section className="field">
          <label className="field__label" htmlFor="bcast-msg">Message</label>
          <textarea
            id="bcast-msg"
            className="field__input"
            rows={4}
            placeholder="e.g. Heavy rain expected across Accra this evening — avoid low-lying areas and drive carefully."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </section>

        {error && <p className="banner banner--err">{error}</p>}
        {sent && <p className="banner banner--ok">✅ Alert sent to all online users.</p>}

        <button className="btn btn--primary" type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Send safety alert'}
        </button>
      </form>
    </div>
  );
}
