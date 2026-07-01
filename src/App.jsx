import { useState, useCallback } from 'react';
import { useAuth } from './auth/AuthContext.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import Home from './components/Home.jsx';
import SignIn from './components/SignIn.jsx';
import ConsentGate from './components/ConsentGate.jsx';
import SplashIntro from './components/SplashIntro.jsx';
import Terms from './pages/Terms.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

export default function App() {
  const route = useHashRoute();
  const { status } = useAuth();

  // Show the intro splash only on a genuine fresh open — NOT when:
  //   • this tab opened straight onto a legal page (e.g. a #/terms link), or
  //   • the splash already played this session (reloads / back-navigation).
  // sessionStorage clears when the tab is closed, so reopening the app still
  // replays the splash.
  const [showSplash, setShowSplash] = useState(() => {
    try {
      if (sessionStorage.getItem('fb_splash_seen')) return false;
    } catch (_e) {
      /* sessionStorage unavailable — fall through */
    }
    const initial = window.location.hash.replace(/^#/, '') || '/';
    return initial !== '/terms' && initial !== '/privacy';
  });

  const dismissSplash = useCallback(() => {
    try {
      sessionStorage.setItem('fb_splash_seen', '1');
    } catch (_e) {
      /* ignore */
    }
    setShowSplash(false);
  }, []);

  // Legal pages are always reachable, even when signed out.
  if (route === '/terms') return <Terms />;
  if (route === '/privacy') return <PrivacyPolicy />;

  // Fast intro on every open, so first-timers know what the app is for.
  if (showSplash) return <SplashIntro onDone={dismissSplash} />;

  // Full-gradient screens (no app chrome).
  if (status === 'loading') {
    return (
      <div className="fullbg">
        <div className="brand brand--light brand--lg">
          Flood<span className="brand__accent">Buddy</span>
        </div>
      </div>
    );
  }
  if (status === 'signedOut') return <SignIn />;

  // Signed-in and consented: the full-screen map experience.
  if (status === 'ready') return <Home />;

  // needsConsent: a flat, spacious, white shell with the mandatory consent gate.
  return (
    <div className="app">
      <header className="app__bar">
        <div className="brand">
          Flood<span className="brand__accent">Buddy</span>
        </div>
      </header>

      <main className="app__main">
        <ConsentGate />
      </main>

      <footer className="app__footer">
        <a href="#/terms">Terms</a>
        <span>·</span>
        <a href="#/privacy">Privacy</a>
      </footer>
    </div>
  );
}
