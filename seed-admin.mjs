// seed-admin.mjs — Standalone script to create admin accounts
// Run with: node seed-admin.mjs

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUlC00m9xDoqqKhvePk2ffQ-GJA2xjJos",
  authDomain: "lostlink-35a35.firebaseapp.com",
  projectId: "lostlink-35a35",
  storageBucket: "lostlink-35a35.firebasestorage.app",
  messagingSenderId: "912217821587",
  appId: "1:912217821587:web:da7a5ef68b7038e5ffd866",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMINS = [
  {
    email: "nazira.lostlink@dev.ac.id",
    password: "SuperAdminLostLink2026!",
    nama: "Nazira Chairani Fauza",
    role: "super_admin",
  },
  {
    email: "damai.lostlink@dev.ac.id",
    password: "SuperAdminLostLink2026!",
    nama: "Damai Puti Afifah",
    role: "super_admin",
  },
];

async function seedAdmin(admin) {
  let uid;

  try {
    // Try to create a new account
    const cred = await createUserWithEmailAndPassword(auth, admin.email, admin.password);
    uid = cred.user.uid;
    console.log(`✅ Akun BARU dibuat: ${admin.email} (UID: ${uid})`);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      // Account exists, sign in to get UID
      const cred = await signInWithEmailAndPassword(auth, admin.email, admin.password);
      uid = cred.user.uid;
      console.log(`ℹ️  Akun sudah ada: ${admin.email} (UID: ${uid}), memperbarui Firestore...`);
    } else {
      console.error(`❌ Gagal untuk ${admin.email}:`, err.message);
      return;
    }
  }

  // Write/update Firestore user document
  await setDoc(doc(db, "users", uid), {
    uid,
    nama: admin.nama,
    displayName: admin.nama,
    email: admin.email,
    role: admin.role,
    createdAt: new Date().toISOString(),
    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.nama)}&background=f9a8d4&color=be185d&bold=true&size=128`,
  });

  console.log(`   📝 Firestore document written for ${admin.nama} with role: ${admin.role}`);
}

async function main() {
  console.log("\n🚀 LostLink Admin Seeder\n");

  for (const admin of ADMINS) {
    await seedAdmin(admin);
    console.log("");
  }

  console.log("🎉 Selesai! Kedua admin siap digunakan.\n");
  process.exit(0);
}

main();
