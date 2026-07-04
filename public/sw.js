/* Minimal service worker for FloodBuddy.
 * Its only job is to enable tray/system notifications via
 * registration.showNotification() — which is required on mobile browsers
 * (the plain `new Notification()` constructor doesn't work there) — and to
 * focus the app when a notification is tapped. No offline caching. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow('/');
        return undefined;
      })
  );
});
