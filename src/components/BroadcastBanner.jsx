import { useState } from 'react';

const DISMISSED_KEY = 'fb_dismissed_broadcasts';

function loadDismissed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'));
  } catch (_e) {
    return new Set();
  }
}

// Shows the most recent active safety alert as a banner over the map.
// Dismissals persist in localStorage, so a dismissed alert stays dismissed
// across refreshes.
export default function BroadcastBanner({ broadcasts }) {
  const [dismissed, setDismissed] = useState(loadDismissed);

  const active = (broadcasts || []).filter((b) => !dismissed.has(b.id));
  if (active.length === 0) return null;

  const b = active[0]; // newest

  const dismiss = () => {
    setDismissed((prev) => {
      const next = new Set(prev).add(b.id);
      try {
        localStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]));
      } catch (_e) {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className={`bcast${b.kind === 'auto' ? ' bcast--auto' : ''}`}>
      <span className="bcast__icon">📢</span>
      <div className="bcast__body">
        <strong>Safety alert{active.length > 1 ? ` (${active.length})` : ''}</strong>
        <p>{b.message}</p>
      </div>
      <button className="bcast__x" aria-label="Dismiss" onClick={dismiss}>×</button>
    </div>
  );
}
