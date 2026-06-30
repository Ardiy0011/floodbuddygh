import { useState, useCallback } from 'react';
import { useAuth } from './auth/AuthContext.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import SightingForm from './components/SightingForm.jsx';
import SignIn from './components/SignIn.jsx';
import ConsentGate from './components/ConsentGate.jsx';
import SplashIntro from './components/SplashIntro.jsx';
import Terms from './pages/Terms.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

function UserBadge() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <div className="userbadge">
      {user.photoUrl && <img src={user.photoUrl} alt="" className="userbadge__avatar" />}
      <button className="userbadge__signout" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}

export default function App() {
  const route = useHashRoute();
  const { status } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const dismissSplash = useCallback(() => setShowSplash(false), []);

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

  // Signed-in: a flat, spacious, white shell. No cards, no panels, no shadows.
  return (
    <div className="app">
      <header className="app__bar">
        <div className="brand">
          Flood<span className="brand__accent">Buddy</span>
        </div>
        {status === 'ready' && <UserBadge />}
      </header>

      <main className="app__main">
        {status === 'needsConsent' ? <ConsentGate /> : <SightingForm />}
      </main>

      <footer className="app__footer">
        <a href="#/terms">Terms</a>
        <span>·</span>
        <a href="#/privacy">Privacy</a>
      </footer>
    </div>
  );
}
