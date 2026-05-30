import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Force demo mode to false since we are using real credentials
const isDemoMode = false;

console.log(
  "%c[LostLink Engine] Connecting to Cloud Firebase backend.",
  "color: #10b981; font-weight: bold; background: #f0fdf4; padding: 6px 12px; border-radius: 4px; border: 1px solid #bbf7d0;"
);

// Initialize Firebase App globally
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Analytics (only if supported by browser environment)
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { firebaseConfig, isDemoMode, app, analytics };
export default firebaseConfig;
