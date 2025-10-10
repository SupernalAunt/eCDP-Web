// manager-logic.js

import { signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { auth } from "./firebase-config.js"; 

const AUTHORIZED_MANAGER_EMAIL = 'management@ecdp-web.firebaseapp.com';

// Elements for the manager page
const searchForm = document.getElementById('employee-search-form');
const searchEmailInput = document.getElementById('search-email');
const searchResultsDiv = document.getElementById('search-results');
const deleteDataBtn = document.getElementById('delete-data-btn');
const searchMessage = document.getElementById('search-message');
const logoutBtn = document.getElementById('logout-button');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const sidebar = document.getElementById('sidebar');


// --- 1. SECURITY CHECK ---
function checkManagerAuthorization() {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    // Redirect if not logged in or not the authorized manager
    if (!userEmail || userRole !== 'manager' || userEmail !== AUTHORIZED_MANAGER_EMAIL) {
        alert("Access Denied. Redirecting to login.");
        window.location.href = "index.html"; 
    }
}

// Run the check immediately on page load
checkManagerAuthorization();


// --- 2. LOGOUT FUNCTIONALITY (Copied from dashboard) ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            window.location.href = "index.html";
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed.");
        }
    });
}


// --- 3. EMPLOYEE SEARCH LOGIC (Simulated Data) ---
// NOTE: This currently uses simulated, hardcoded data. 
// For a real application, you would replace the "simulateFetchProgress"
// function with a call to Firebase Firestore/Realtime Database 
// to fetch the real data based on the email.

const mockEmployeeData = {
    "test@mcd.com": { progress: "70%", completed: "7/10" },
    "jane.doe@mcd.com": { progress: "22%", completed: "2/10" },
    // Add more mock data as needed for testing
};

function simulateFetchProgress(email) {
    return new Promise((resolve) => {
        setTimeout(() => { // Simulate network delay
            if (mockEmployeeData[email]) {
                resolve(mockEmployeeData[email]);
            } else {
                resolve(null); // User not found
            }
        }, 800);
    });
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    searchResultsDiv.style.display = 'none';
    searchMessage.textContent = 'Searching...';

    const emailToSearch = searchEmailInput.value.toLowerCase();

    const data = await simulateFetchProgress(emailToSearch);

    if (data) {
        document.getElementById('result-email').textContent = emailToSearch;
        document.getElementById('result-progress').textContent = data.progress;
        document.getElementById('result-completed').textContent = data.completed;
        searchResultsDiv.style.display = 'block';
        searchMessage.textContent = '';
    } else {
        searchMessage.textContent = `Error: Employee with email '${emailToSearch}' not found.`;
    }
});


// --- 4. DATA DELETION LOGIC (Placeholder) ---
deleteDataBtn.addEventListener('click', () => {
    const emailToDelete = document.getElementById('result-email').textContent;
    if (!emailToDelete) return;

    if (confirm(`Are you absolutely sure you want to DELETE ALL DATA for ${emailToDelete}? This action cannot be undone.`)) {
        
        // NOTE: In a real app, you would execute the Firebase database
        // deletion query here, followed by deleting the user from Firebase Auth.
        
        // --- START REAL CODE PLACEHOLDER ---
        console.log(`[ACTION] Deleting data for: ${emailToDelete}`);
        // Example: deleteUserData(emailToDelete); 
        // Example: deleteUserFromAuth(emailToDelete); 
        // --- END REAL CODE PLACEHOLDER ---

        alert(`Data for ${emailToDelete} has been successfully deleted (Simulated).`);
        searchResultsDiv.style.display = 'none';
        searchMessage.textContent = `Data for ${emailToDelete} successfully removed.`;
        searchEmailInput.value = ''; // Clear search field
    }
});


// --- 5. MOBILE MENU TOGGLE (Copied from dashboard) ---
if (mobileMenuIcon && sidebar) {
    mobileMenuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}
