import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- UI Toggle Logic ---
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');

showLogin.addEventListener('click', () => {
    showLogin.classList.add('active');
    showRegister.classList.remove('active');
    loginSection.classList.remove('hidden');
    registerSection.classList.add('hidden');
});

showRegister.addEventListener('click', () => {
    showRegister.classList.add('active');
    showLogin.classList.remove('active');
    registerSection.classList.remove('hidden');
    loginSection.classList.add('hidden');
});

// --- Helper Function: Sync User to Firestore ---
async function createUserProfile(user, name) {
    try {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name || user.displayName,
            email: user.email,
            photoURL: user.photoURL || "",
            role: 'user',
            createdAt: new Date()
        }, { merge: true });
    } catch (err) {
        console.error("Firestore Error:", err);
    }
}

// --- Registration Logic ---
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;

    if(pass.length < 6) return alert("Password too short!");

    try {
        // 1. Create the user
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        // 2. Set display name in Auth
        await updateProfile(result.user, { displayName: name });
        // 3. Save to Firestore
        await createUserProfile(result.user, name);
        
        alert("Registration Successful!");
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert("Register Error: " + error.message);
    }
});

// --- Login Logic ---
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert("Login Error: " + error.message);
    }
});

// --- Google Sign In Logic ---
document.getElementById('googleBtn').addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await createUserProfile(result.user);
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert("Google Login Error: " + error.message);
    }
});
