import { useState, useEffect } from 'react';

// Minimal hash-based routing (no router dependency). Returns the current path,
// e.g. "#/privacy" -> "/privacy". Legal pages stay shareable/bookmarkable and
// reachable even when the user is signed out.
export function useHashRoute() {
  const read = () => window.location.hash.replace(/^#/, '') || '/';
  const [path, setPath] = useState(read());

  useEffect(() => {
    const onChange = () => setPath(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return path;
}

export const navigate = (path) => {
  window.location.hash = path;
};
