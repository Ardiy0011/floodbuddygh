import { useState } from 'react';

// Shows the most recent active safety alert as a dismissible banner over the map.
export default function BroadcastBanner({ broadcasts }) {
  const [dismissed, setDismissed] = useState(() => new Set());

  const active = (broadcasts || []).filter((b) => !dismissed.has(b.id));
  if (active.length === 0) return null;

  const b = active[0]; // newest
  return (
    <div className={`bcast${b.kind === 'auto' ? ' bcast--auto' : ''}`}>
      <span className="bcast__icon">📢</span>
      <div className="bcast__body">
        <strong>Safety alert{active.length > 1 ? ` (${active.length})` : ''}</strong>
        <p>{b.message}</p>
      </div>
      <button
        className="bcast__x"
        aria-label="Dismiss"
        onClick={() => setDismissed((prev) => new Set(prev).add(b.id))}
      >
        ×
      </button>
    </div>
  );
}
