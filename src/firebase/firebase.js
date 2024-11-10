import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Firebase configuration from your Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyAlZDCGbWskZ2fGw4RPYiADWOXiWL0FlIU",
  authDomain: "super-tic-tac-toe-60277.firebaseapp.com",
  databaseURL:
    "https://super-tic-tac-toe-60277-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "super-tic-tac-toe-60277",
  storageBucket: "super-tic-tac-toe-60277.firebasestorage.app",
  messagingSenderId: "620349376209",
  appId: "1:620349376209:web:b8a0528e9cfd24397527f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
