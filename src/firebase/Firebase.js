// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxX60OzmiVVSRCcbX4-bVUIXmzAtyOL-I",
  authDomain: "profilelinkd.firebaseapp.com",
  projectId: "profilelinkd",
  storageBucket: "profilelinkd.firebasestorage.app",
  messagingSenderId: "399101766487",
  appId: "1:399101766487:web:cdd44927ed1cba304a2c12",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
 const auth = getAuth(app);

// Firestore Database
 const db = getFirestore(app);

export { auth, db };