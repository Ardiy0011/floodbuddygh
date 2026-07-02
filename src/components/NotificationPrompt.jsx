import { useState } from 'react';

// Asks the user to allow notifications so we can push flood safety alerts.
// Shows only when notifications are supported, still 'default' (undecided), and
// not previously dismissed. Best practice: our own prompt first, then the
// native permission dialog on the user's click.
export default function NotificationPrompt() {
  const supported = typeof window !== 'undefined' && 'Notification' in window;
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('fb_notif_prompt') === 'done';
    } catch (_e) {
      return false;
    }
  });
  const [permission, setPermission] = useState(supported ? Notification.permission : 'unsupported');

  if (!supported || dismissed || permission !== 'default') return null;

  const finish = () => {
    setDismissed(true);
    try { localStorage.setItem('fb_notif_prompt', 'done'); } catch (_e) { /* ignore */ }
  };

  const enable = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
    } catch (_e) {
      /* ignore */
    }
    finish();
  };

  return (
    <div className="notif">
      <div className="notif__body">
        <strong>Get flood safety alerts</strong>
        <p>Allow notifications so we can warn you about flooding in your area.</p>
      </div>
      <div className="notif__actions">
        <button className="btn btn--ghost notif__btn" onClick={finish}>Not now</button>
        <button className="btn btn--primary notif__btn" onClick={enable}>Allow</button>
      </div>
    </div>
  );
}
