import { useAuth } from '../auth/AuthContext.jsx';

// Inline Google "G" mark so we don't pull in an icon dependency.
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5c-2 1.5-4.7 2.5-7.6 2.5-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5C41.4 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export default function SignIn() {
  const { signIn, error } = useAuth();

  return (
    <div className="card auth">
      <div className="auth__mark">🌊</div>
      <h2 className="auth__title">Welcome to FloodBuddy</h2>
      <p className="auth__sub">
        Sign in to report flooding in your community. We use your Google account
        only to identify your reports.
      </p>

      <button type="button" className="btn-google" onClick={signIn}>
        <GoogleMark />
        Continue with Google
      </button>

      {error && <p className="banner banner--err">{error}</p>}

      <p className="auth__legal">
        By continuing you will be asked to review and accept our{' '}
        <a href="#/terms">Terms of Service</a> and{' '}
        <a href="#/privacy">Privacy Policy</a>.
      </p>
    </div>
  );
}
