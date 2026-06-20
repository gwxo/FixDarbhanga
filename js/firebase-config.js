import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSSUn42qoB7ZcrPeJ9sZIImsx0d-Z6TXc",
  authDomain: "fixdarbhanga.firebaseapp.com",
  projectId: "fixdarbhanga",
  storageBucket: "fixdarbhanga.firebasestorage.app",
  messagingSenderId: "104519114133",
  appId: "1:104519114133:web:d03d69d6fdadb3613faa9c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
