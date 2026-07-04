import { useEffect, useRef, useState } from 'react';
import { getActiveBroadcasts } from '../api/client.js';

const NOTIFIED_KEY = 'fb_notified_broadcasts';

function loadNotified() {
  try {
    return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]'));
  } catch (_e) {
    return new Set();
  }
}
function saveNotified(set) {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
  } catch (_e) {
    /* ignore */
  }
}

// Show a system/tray notification. Prefers the service worker's
// showNotification (works on mobile); falls back to new Notification (desktop).
async function showAlert(title, options) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, options);
      return;
    }
  } catch (_e) {
    /* fall through */
  }
  try {
    new Notification(title, options);
  } catch (_e) {
    /* ignore */
  }
}

// Polls for active safety alerts (so "online" users get them) and fires a tray
// notification the FIRST time each new alert is seen — persisted, so a refresh
// doesn't re-notify for the same alert.
export function useBroadcasts({ pollMs = 45000 } = {}) {
  const [broadcasts, setBroadcasts] = useState([]);
  const notified = useRef(loadNotified());

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      try {
        const list = await getActiveBroadcasts();
        if (!alive || !Array.isArray(list)) return;
        setBroadcasts(list);

        const canNotify = 'Notification' in window && Notification.permission === 'granted';
        let changed = false;

        // newest-first from the API; notify oldest-first so order reads right
        [...list].reverse().forEach((b) => {
          if (notified.current.has(b.id)) return;
          notified.current.add(b.id);
          changed = true;
          if (canNotify) {
            showAlert('FloodBuddy safety alert', { body: b.message, tag: b.id });
          }
        });

        if (changed) saveNotified(notified.current);
      } catch (_e) {
        /* network hiccup — try again next tick */
      }
    };

    tick();
    const id = setInterval(tick, pollMs);
    return () => { alive = false; clearInterval(id); };
  }, [pollMs]);

  return broadcasts;
}
