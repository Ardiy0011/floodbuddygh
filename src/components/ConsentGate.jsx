import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { LEGAL_META } from '../legal/meta.js';

/**
 * Mandatory consent screen. A signed-in user CANNOT proceed to register/login
 * until they affirmatively accept BOTH the Terms of Service and the Privacy
 * Policy. On accept we POST a timestamped consent record to the backend.
 */
export default function ConsentGate() {
  const { user, requiredVersions, acceptConsent, signOut } = useAuth();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = agreedTerms && agreedPrivacy && !submitting;

  const handleAccept = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await acceptConsent();
    } catch (err) {
      setError(err.message || 'Could not record your agreement. Please try again.');
      setSubmitting(false);
    }
  };

  const termsV = requiredVersions?.terms;
  const privacyV = requiredVersions?.privacy;

  return (
    <div className="consent">
      <h2 className="consent__title">Before you continue</h2>
      <p className="consent__sub">
        {user?.displayName ? `Hi ${user.displayName.split(' ')[0]}, ` : ''}
        to register and use FloodBuddy you must read and agree to the documents
        below. Your agreement is recorded with a timestamp.
      </p>

      <label className="consent__check">
        <input
          type="checkbox"
          checked={agreedTerms}
          onChange={(e) => setAgreedTerms(e.target.checked)}
        />
        <span>
          I have read and agree to the{' '}
          <a href="#/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
          {termsV ? ` (v${termsV.version})` : ''}.
        </span>
      </label>

      <label className="consent__check">
        <input
          type="checkbox"
          checked={agreedPrivacy}
          onChange={(e) => setAgreedPrivacy(e.target.checked)}
        />
        <span>
          I have read and agree to the{' '}
          <a href="#/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          {privacyV ? ` (v${privacyV.version})` : ''}, and I consent to the
          processing of my personal data (including my photos and location) as
          described therein, in accordance with the Data Protection Act, 2012
          (Act 843).
        </span>
      </label>

      {error && <p className="banner banner--err">{error}</p>}

      <button className="btn btn--primary" disabled={!canSubmit} onClick={handleAccept}>
        {submitting ? 'Recording your agreement…' : 'I agree — continue'}
      </button>

      <button className="btn btn--ghost" onClick={signOut} disabled={submitting}>
        Cancel and sign out
      </button>

      <p className="consent__foot">
        Operated by {LEGAL_META.operator.name}. Questions:{' '}
        <a href={`mailto:${LEGAL_META.operator.email}`}>{LEGAL_META.operator.email}</a>
      </p>
    </div>
  );
}
