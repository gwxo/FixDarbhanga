import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const authSection = document.getElementById('authSection');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        
        authSection.innerHTML = `
            <a href="dashboard.html" class="nav-user">
                <img src="${user.photoURL || 'https://via.placeholder.com/40'}" style="width:35px; border-radius:50%; vertical-align:middle;">
                Dashboard
            </a>
            <button id="logoutBtn" class="btn btn-outline" style="margin-left:10px">Logout</button>
        `;

        document.getElementById('logoutBtn')?.addEventListener('click', () => signOut(auth));
    } else {
        authSection.innerHTML = `<a href="auth.html" class="btn btn-outline">Login</a>`;
    }
});

export const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: 'user',
            createdAt: new Date()
        }, { merge: true });
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error(error);
    }
};
