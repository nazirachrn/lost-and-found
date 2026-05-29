const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Evaluate if config variables are filled with real credentials
const isDemoMode = !firebaseConfig.apiKey || 
                   firebaseConfig.apiKey === "" || 
                   firebaseConfig.apiKey.startsWith("YOUR_");

if (isDemoMode) {
  console.log(
    "%c[LostLink Engine] Initializing in high-fidelity Stateful Demo Mode.\nAll systems (Auth, Firestore, Storage, Chat, Matching) are fully active using reactive LocalStorage simulation.",
    "color: #0ea5e9; font-weight: bold; background: #f0f9ff; padding: 6px 12px; border-radius: 4px; border: 1px solid #bae6fd;"
  );
} else {
  console.log(
    "%c[LostLink Engine] Connecting to Cloud Firebase backend.",
    "color: #10b981; font-weight: bold; background: #f0fdf4; padding: 6px 12px; border-radius: 4px; border: 1px solid #bbf7d0;"
  );
}

export { firebaseConfig, isDemoMode };
export default firebaseConfig;
