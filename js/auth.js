import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Tab Switching Logic ---
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginTab?.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

registerTab?.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// --- Helper: Save User to Firestore ---
async function saveUserToFirestore(user, name = null) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        uid: user.uid,
        name: name || user.displayName || "Anonymous User",
        email: user.email,
        photoURL: user.photoURL || "",
        role: 'user',
        createdAt: new Date()
    }, { merge: true });
}

// --- Email/Password Login ---
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert("Login failed: " + error.message);
    }
});

// --- Email/Password Register ---
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;

    try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        await saveUserToFirestore(result.user, name);
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert("Registration failed: " + error.message);
    }
});

// --- Google Login ---
document.getElementById('googleBtn')?.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await saveUserToFirestore(result.user);
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert("Google Sign-in failed: " + error.message);
    }
});

// --- Auth State Listener for Navigation ---
onAuthStateChanged(auth, (user) => {
    const authSection = document.getElementById('authSection');
    if (authSection) {
        if (user) {
            authSection.innerHTML = `<a href="dashboard.html" class="btn btn-outline">Dashboard</a>`;
        } else {
            authSection.innerHTML = `<a href="auth.html" class="btn btn-outline">Login</a>`;
        }
    }
});
