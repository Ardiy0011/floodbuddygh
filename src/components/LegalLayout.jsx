import { navigate } from '../hooks/useHashRoute.js';

// Shared chrome for the Terms / Privacy pages.
export default function LegalLayout({ title, version, effectiveDate, children }) {
  return (
    <div className="legal">
      <header className="legal__header">
        <button className="legal__back" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 className="legal__title">{title}</h1>
        <p className="legal__meta">
          Version {version} · Effective {effectiveDate}
        </p>
      </header>

      <article className="legal__body">{children}</article>

      <footer className="legal__footer">
        <a href="#/terms">Terms of Service</a>
        <span>·</span>
        <a href="#/privacy">Privacy Policy</a>
      </footer>
    </div>
  );
}
