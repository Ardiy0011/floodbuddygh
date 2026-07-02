import { useAuth } from '../auth/AuthContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';

// Slide-out drawer: account, appearance (dark mode), settings, and sign out.
// Always mounted; the `open` prop drives the slide/backdrop transitions.
export default function Menu({ open, onClose, zonesOn, onToggleZones, onOpenAdmin }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`drawer-wrap${open ? ' drawer-wrap--open' : ''}`}>
      <div className="drawer__backdrop" onClick={onClose} />

      <aside className="drawer" role="dialog" aria-label="Menu" aria-hidden={!open}>
        <div className="drawer__head">
          <span className="drawer__title">Menu</span>
          <button className="drawer__close" onClick={onClose} aria-label="Close menu">×</button>
        </div>

        {user && (
          <div className="drawer__user">
            {user.photoUrl && <img src={user.photoUrl} alt="" />}
            <div style={{ minWidth: 0 }}>
              <strong>{user.displayName || 'Signed in'}</strong>
              <small>{user.email}</small>
            </div>
          </div>
        )}

        <section className="drawer__section">
          <span className="drawer__label">Appearance</span>
          <div className="drawer__row">
            <span>Dark mode</span>
            <button
              type="button"
              className={`toggle${isDark ? ' on' : ''}`}
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
            >
              <span className="toggle__knob" />
            </button>
          </div>
        </section>

        {user?.isAdmin && (
          <section className="drawer__section">
            <span className="drawer__label">Admin</span>
            <button
              type="button"
              className="drawer__link drawer__admin"
              onClick={() => { onOpenAdmin(); onClose(); }}
            >
              🛡️ Send safety broadcast
            </button>
          </section>
        )}

        <section className="drawer__section">
          <span className="drawer__label">Renting</span>
          <div className="drawer__row">
            <span className="drawer__rowtext">
              <span>Flood-prone areas</span>
              <small>Highlight risky zones before you rent</small>
            </span>
            <button
              type="button"
              className={`toggle${zonesOn ? ' on' : ''}`}
              role="switch"
              aria-checked={zonesOn}
              aria-label="Highlight flood-prone areas"
              onClick={() => { onToggleZones(); onClose(); }}
            >
              <span className="toggle__knob" />
            </button>
          </div>
        </section>

        <section className="drawer__section">
          <span className="drawer__label">Legal</span>
          <a className="drawer__link" href="#/terms" onClick={onClose}>Terms of Service</a>
          <a className="drawer__link" href="#/privacy" onClick={onClose}>Privacy Policy</a>
        </section>

        <div className="drawer__foot">
          <button className="btn btn--ghost" onClick={signOut}>Sign out</button>
          <p className="drawer__version">FloodBuddy · v1.0</p>
        </div>
      </aside>
    </div>
  );
}
