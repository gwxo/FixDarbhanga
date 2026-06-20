import { db, storage, auth } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Map Initialization
const map = L.map('map').setView([26.1542, 85.8918], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker = L.marker([26.1542, 85.8918], { draggable: true }).addTo(map);

navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 15);
    marker.setLatLng([latitude, longitude]);
    document.getElementById('lat').value = latitude;
    document.getElementById('lng').value = longitude;
    document.getElementById('locStatus').innerText = "Location Detected";
});

marker.on('dragend', () => {
    const pos = marker.getLatLng();
    document.getElementById('lat').value = pos.lat;
    document.getElementById('lng').value = pos.lng;
});

// Submit Logic
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "Uploading...";

    const user = auth.currentUser;
    if(!user) return alert("Please login first");

    const files = document.getElementById('imageInput').files;
    const imageUrls = [];

    try {
        for (let file of files) {
            const fileRef = ref(storage, `issues/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            imageUrls.push(url);
        }

        await addDoc(collection(db, "issues"), {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            lat: parseFloat(document.getElementById('lat').value),
            lng: parseFloat(document.getElementById('lng').value),
            imageUrls,
            userId: user.uid,
            userName: user.displayName,
            anonymous: document.getElementById('anonymous').checked,
            status: 'Reported',
            confirmations: 0,
            confirmedBy: [],
            createdAt: serverTimestamp()
        });

        alert("Successfully Reported!");
        window.location.href = "feed.html";
    } catch (err) {
        console.error(err);
        alert("Upload failed.");
        btn.disabled = false;
    }
});
