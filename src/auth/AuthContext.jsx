import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';
import { postSession, postConsent } from '../api/client.js';

const AuthContext = createContext(null);

// Session lifecycle:
//   loading      -> resolving the Firebase auth state on first load
//   signedOut    -> no Firebase user; show the Google sign-in screen
//   needsConsent -> signed in, but must accept Terms + Privacy before continuing
//   ready        -> signed in AND consented; full app available
export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const [requiredVersions, setRequiredVersions] = useState(null);
  const [error, setError] = useState(null);

  // Exchange the current Firebase ID token for a backend session.
  const establishSession = useCallback(async () => {
    const idToken = await auth.currentUser.getIdToken();
    try {
      const { user: appUser } = await postSession(idToken);
      setUser(appUser);
      setStatus('ready');
    } catch (err) {
      if (err.requiresConsent) {
        setUser(err.user || null);
        setRequiredVersions(err.requiredVersions);
        setStatus('needsConsent');
      } else {
        setError(err.message);
        setStatus('signedOut');
      }
    }
  }, []);

  // React to Firebase sign-in / sign-out.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setError(null);
      if (!firebaseUser) {
        setUser(null);
        setRequiredVersions(null);
        setStatus('signedOut');
        return;
      }
      setStatus('loading');
      await establishSession();
    });
    return unsubscribe;
  }, [establishSession]);

  const signIn = useCallback(async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged handles the rest.
    } catch (err) {
      // Ignore the user simply closing the popup.
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed.');
      }
    }
  }, []);

  const signOut = useCallback(() => firebaseSignOut(auth), []);

  // Submit the consent record, then re-establish the (now allowed) session.
  const acceptConsent = useCallback(async () => {
    const idToken = await auth.currentUser.getIdToken();
    const { user: appUser } = await postConsent(idToken, {
      termsVersion: requiredVersions.terms.version,
      privacyVersion: requiredVersions.privacy.version,
    });
    setUser(appUser);
    setStatus('ready');
  }, [requiredVersions]);

  const value = {
    status,
    user,
    requiredVersions,
    error,
    signIn,
    signOut,
    acceptConsent,
    // Used by API calls that need to attach the bearer token.
    getToken: () => auth.currentUser?.getIdToken(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
