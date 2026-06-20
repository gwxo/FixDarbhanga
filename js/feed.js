import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth } from './firebase-config.js';

const issueList = document.getElementById('issueList');
const map = L.map('map').setView([26.1542, 85.8918], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    issueList.innerHTML = '';
    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const id = docSnap.id;
        
        // Add Marker
        L.marker([data.lat, data.lng]).addTo(map).bindPopup(`<b>${data.title}</b>`);

        // Add Card
        issueList.innerHTML += `
            <div class="card">
                <img src="${data.imageUrls[0]}" class="card-img">
                <div class="card-body">
                    <span class="badge ${data.status.toLowerCase()}">${data.status}</span>
                    <h3>${data.title}</h3>
                    <p>${data.category}</p>
                    <div style="display:flex; gap:10px; margin-top:10px">
                        <button onclick="confirmIssue('${id}')" class="btn btn-outline btn-sm">
                           👍 Confirm (${data.confirmations || 0})
                        </button>
                        <a href="details.html?id=${id}" class="btn btn-primary btn-sm">Details</a>
                    </div>
                </div>
            </div>
        `;
    });
});

window.confirmIssue = async (id) => {
    const user = auth.currentUser;
    if(!user) return alert("Login to confirm issues");
    
    const issueRef = doc(db, "issues", id);
    await updateDoc(issueRef, {
        confirmations: increment(1),
        confirmedBy: arrayUnion(user.uid)
    });
};
