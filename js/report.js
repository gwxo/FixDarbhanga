import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Map Setup (Default: Darbhanga Tower)
const map = L.map('map').setView([26.1542, 85.8918], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add a draggable marker
let marker = L.marker([26.1542, 85.8918], { draggable: true }).addTo(map);

// Update hidden inputs when marker is dragged
marker.on('dragend', function() {
    const pos = marker.getLatLng();
    document.getElementById('lat').value = pos.lat;
    document.getElementById('lng').value = pos.lng;
});

// Detect User Location automatically
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
        marker.setLatLng([latitude, longitude]);
        document.getElementById('lat').value = latitude;
        document.getElementById('lng').value = longitude;
    });
}

// 2. Auth Check (Redirect if not logged in)
onAuthStateChanged(auth, (user) => {
    if (!user) {
        alert("You must be logged in to report an issue.");
        window.location.href = "auth.html";
    }
});

// 3. Handle Form Submission
const reportForm = document.getElementById('reportForm');
const submitBtn = document.getElementById('submitBtn');

reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button to prevent double clicks
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const user = auth.currentUser;
    
    // Collect Form Data
    const issueData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        lat: parseFloat(document.getElementById('lat').value),
        lng: parseFloat(document.getElementById('lng').value),
        anonymous: document.getElementById('anonymous').checked,
        userId: user.uid,
        userName: user.displayName || "Anonymous User",
        status: "Reported",
        confirmations: 0,
        createdAt: serverTimestamp(),
        imageUrls: [] // Empty for now as requested
    };

    try {
        // Save to Firestore
        await addDoc(collection(db, "issues"), issueData);
        
        alert("Issue reported successfully!");
        window.location.href = "feed.html"; // Redirect to public feed
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error submitting report: " + error.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Report";
    }
});
