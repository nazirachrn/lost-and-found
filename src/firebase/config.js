import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAUlC00m9xDoqqKhvePk2ffQ-GJA2xjJos",
  authDomain: "lostlink-35a35.firebaseapp.com",
  projectId: "lostlink-35a35",
  storageBucket: "lostlink-35a35.firebasestorage.app",
  messagingSenderId: "912217821587",
  appId: "1:912217821587:web:da7a5ef68b7038e5ffd866",
  measurementId: "G-S96SEJXRCK"
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
