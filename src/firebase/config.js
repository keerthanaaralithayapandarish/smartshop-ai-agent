import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Helper to retrieve Firebase configuration from environment or localStorage override
export function getFirebaseConfig() {
  const localOverride = localStorage.getItem('MEDIFINDER_FIREBASE_CONFIG');
  if (localOverride) {
    try {
      const parsed = JSON.parse(localOverride);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch {
      // Invalid JSON in localStorage, fall back to env
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };
}

const firebaseConfig = getFirebaseConfig();

// Check if credentials are properly configured (non-empty and not dummy placeholder)
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YOUR_') &&
  firebaseConfig.apiKey.length > 10
);

let app = null;
let auth = null;
let db = null;

try {
  if (isFirebaseConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    // Initialize a dummy placeholder instance so Firebase SDK methods can be imported safely
    const dummyConfig = {
      apiKey: "AIzaSyDummyKeyForPlaceholderInitialization123",
      authDomain: "medifinder-demo.firebaseapp.com",
      projectId: "medifinder-demo",
      storageBucket: "medifinder-demo.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:dummy123456"
    };
    app = getApps().length === 0 ? initializeApp(dummyConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (err) {
  console.warn('[Firebase] Initialization warning:', err.message);
}

export { app, auth, db };

/**
 * Save Firebase config to localStorage and reload window to apply
 */
export function saveFirebaseConfigOverride(config) {
  localStorage.setItem('MEDIFINDER_FIREBASE_CONFIG', JSON.stringify(config));
  window.location.reload();
}

/**
 * Clear stored Firebase config override
 */
export function clearFirebaseConfigOverride() {
  localStorage.removeItem('MEDIFINDER_FIREBASE_CONFIG');
  window.location.reload();
}
