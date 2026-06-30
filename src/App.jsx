import { useAuth } from './auth/AuthContext.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import SightingForm from './components/SightingForm.jsx';
import SignIn from './components/SignIn.jsx';
import ConsentGate from './components/ConsentGate.jsx';
import Terms from './pages/Terms.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

function UserBadge() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <div className="userbadge">
      {user.photoUrl && <img src={user.photoUrl} alt="" className="userbadge__avatar" />}
      <span className="userbadge__name">{user.displayName || user.email}</span>
      <button className="userbadge__signout" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}

// Decide what to show in the main content area based on auth status.
function AuthGatedContent() {
  const { status } = useAuth();

  switch (status) {
    case 'loading':
      return <div className="card loading">Loading…</div>;
    case 'signedOut':
      return <SignIn />;
    case 'needsConsent':
      return <ConsentGate />;
    case 'ready':
      return <SightingForm />;
    default:
      return null;
  }
}

export default function App() {
  const route = useHashRoute();
  const { status } = useAuth();

  // Legal pages are always reachable, even when signed out.
  if (route === '/terms') return <Terms />;
  if (route === '/privacy') return <PrivacyPolicy />;

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__brand">
          Flood<span className="app__brand-accent">Buddy</span>
        </h1>
        <p className="app__tagline">See water rising? Snap it. Pin it. Send it.</p>
        {status === 'ready' && <UserBadge />}
      </header>

      <main className="app__main">
        <AuthGatedContent />
      </main>

      <footer className="app__footer">
        <a href="#/terms">Terms</a>
        <span> · </span>
        <a href="#/privacy">Privacy</a>
        <p>Community flood watch · stay safe, stay dry</p>
      </footer>
    </div>
  );
}
