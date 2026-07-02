import { useEffect, useRef, useState } from 'react';
import { getActiveBroadcasts } from '../api/client.js';

// Polls for active safety alerts (so "online" users get them) and fires a
// browser notification the first time each new alert is seen.
export function useBroadcasts({ pollMs = 45000 } = {}) {
  const [broadcasts, setBroadcasts] = useState([]);
  const notified = useRef(new Set());

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      try {
        const list = await getActiveBroadcasts();
        if (!alive || !Array.isArray(list)) return;
        setBroadcasts(list);

        const canNotify = 'Notification' in window && Notification.permission === 'granted';
        if (canNotify) {
          // newest first from the API; notify oldest-first so order feels right
          [...list].reverse().forEach((b) => {
            if (!notified.current.has(b.id)) {
              notified.current.add(b.id);
              try {
                new Notification('FloodBuddy safety alert', {
                  body: b.message,
                  tag: b.id, // dedupe if the OS already shows it
                });
              } catch (_e) {
                /* ignore */
              }
            }
          });
        } else {
          // still track ids so we don't spam once permission is later granted
          list.forEach((b) => notified.current.add(b.id));
        }
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
