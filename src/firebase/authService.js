import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { firebaseConfig, isDemoMode } from "./config";

// Initialize Firebase if not in demo mode
let app;
let auth;
let db;

if (!isDemoMode) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth();
  db = getFirestore();
}

// Stateful Local storage simulation for Demo Mode
const getLocalUsers = () => {
  const users = localStorage.getItem("ll_users");
  return users ? JSON.parse(users) : [];
};

const saveLocalUsers = (users) => {
  localStorage.setItem("ll_users", JSON.stringify(users));
};

const getActiveSession = () => {
  const session = localStorage.getItem("ll_active_session");
  return session ? JSON.parse(session) : null;
};

const saveActiveSession = (user) => {
  if (user) {
    localStorage.setItem("ll_active_session", JSON.stringify(user));
  } else {
    localStorage.removeItem("ll_active_session");
  }
};

// Unified Auth Service API
export const authService = {
  // Listen for auth state changes
  onAuthStateChanged(callback) {
    if (isDemoMode) {
      // Return active session if it exists, or null
      const activeUser = getActiveSession();
      callback(activeUser);
      // Mock unsubscriber
      return () => {};
    } else {
      // Local backdoor check for Admin bypassing Firebase Auth
      const activeUser = getActiveSession();
      if (activeUser && activeUser.role === "admin") {
        callback(activeUser);
        return () => {};
      }

      return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch additional profile fields from firestore
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            callback({ ...firebaseUser, ...docSnap.data() });
          } else {
            callback(firebaseUser);
          }
        } else {
          callback(null);
        }
      });
    }
  },

  // Register user
  async register(email, password, name) {
    if (isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate networking
      const users = getLocalUsers();
      
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email ini sudah terdaftar!");
      }

      const newUser = {
        uid: "demo-user-" + Math.random().toString(36).substr(2, 9),
        email: email,
        nama: name,
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        role: "user",
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveLocalUsers(users);
      saveActiveSession(newUser);
      return newUser;
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save metadata in Firestore
      const userProfile = {
        uid: user.uid,
        nama: name,
        nama_pengguna: name.toLowerCase().replace(/\s+/g, ''),
        displayName: name,
        email: email,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        role: "user",
        createdAt: new Date().toISOString(),
        dibuat_pada: serverTimestamp()
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      return { ...user, ...userProfile };
    }
  },

  // Login User
  async login(email, password) {
    if (isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const users = getLocalUsers();
      
      // Admin backdoor check
      if (email.toLowerCase() === "admin@lostlink.com" && password === "admin123") {
        const adminUser = users.find(u => u.email === "admin@lostlink.com") || {
          uid: "demo-admin-id",
          email: "admin@lostlink.com",
          nama: "Administrator",
          displayName: "Administrator",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin",
          role: "admin",
          createdAt: new Date().toISOString()
        };
        
        // Ensure admin is in stored list
        if (!users.find(u => u.email === "admin@lostlink.com")) {
          users.push(adminUser);
          saveLocalUsers(users);
        }
        
        saveActiveSession(adminUser);
        return adminUser;
      }
      
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        throw new Error("Email tidak ditemukan!");
      }
      
      // In demo mode we don't validate password stringency, but we simulate it
      if (password.length < 6) {
        throw new Error("Password salah!");
      }

      saveActiveSession(foundUser);
      return foundUser;
    } else {
      // Hardcoded local backdoor for Admins
      if (email === "nazira.lostlink@upi-yptk.ac.id" && password === "SuperAdminLostLink2026!") {
        const adminUser = {
          uid: "demo-admin-nazira",
          email: "nazira.lostlink@upi-yptk.ac.id",
          nama: "Nazira Chairani Fauza (Admin)",
          displayName: "Nazira Chairani Fauza (Admin)",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nazira",
          role: "admin",
          createdAt: new Date().toISOString()
        };
        saveActiveSession(adminUser);
        return adminUser;
      }

      if (email === "damai.lostlink@upi-yptk.ac.id" && password === "SuperAdminLostLink2026!") {
        const adminUser = {
          uid: "demo-admin-damai",
          email: "damai.lostlink@upi-yptk.ac.id",
          nama: "Damai Puti Afifah (Admin)",
          displayName: "Damai Puti Afifah (Admin)",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Damai",
          role: "admin",
          createdAt: new Date().toISOString()
        };
        saveActiveSession(adminUser);
        return adminUser;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { ...user, ...docSnap.data() };
      }
      return user;
    }
  },

  // Google Login
  async loginWithGoogle() {
    if (isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const users = getLocalUsers();
      
      const name = "Google User " + Math.floor(Math.random() * 100);
      const email = `google.user.${Math.floor(Math.random() * 1000)}@gmail.com`;
      
      const newUser = {
        uid: "demo-google-" + Math.random().toString(36).substr(2, 9),
        email: email,
        nama: name,
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        role: "user",
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveLocalUsers(users);
      saveActiveSession(newUser);
      return newUser;
    } else {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document already exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const userProfile = {
          uid: user.uid,
          nama: user.displayName || "Google User",
          displayName: user.displayName || "Google User",
          email: user.email,
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.displayName || "G")}`,
          role: "user",
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", user.uid), userProfile);
        return { ...user, ...userProfile };
      }
      
      return { ...user, ...docSnap.data() };
    }
  },

  // Forgot password
  async forgotPassword(email) {
    if (isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const users = getLocalUsers();
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (email.toLowerCase() === "admin@lostlink.com" || userExists) {
        return "Instruksi reset password simulasi telah dikirim ke email Anda.";
      } else {
        throw new Error("Email tidak terdaftar!");
      }
    } else {
      await sendPasswordResetEmail(auth, email);
      return "Email instruksi reset password telah dikirim.";
    }
  },

  // Logout
  async logout() {
    if (isDemoMode) {
      saveActiveSession(null);
      return true;
    } else {
      saveActiveSession(null);
      await signOut(auth);
      return true;
    }
  }
};
