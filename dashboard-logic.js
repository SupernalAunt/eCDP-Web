// dashboard-logic.js

import { signOut } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { auth } from "./firebase-config.js"; 

const managerModeLink = document.getElementById('managerModeLink');
const logoutBtn = document.getElementById('logoutBtn');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const dashboardLayout = document.querySelector('.dashboard-layout');

// --- 1. AUTHENTICATION CHECK AND REDIRECT (Security) ---
const userEmail = localStorage.getItem('userEmail');
const userRole = localStorage.getItem('userRole');

// If no user email is found, redirect to login page
if (!userEmail) {
    window.location.href = "index.html"; 
}

// Update the greeting text
document.getElementById('user-greeting').innerHTML = `Welcome back, ${userEmail.split('@')[0]}!`;


// --- 2. MANAGER MODE VISIBILITY ---
if (userRole === 'manager') {
    managerModeLink.style.display = 'block';
}


// --- 3. LOGOUT FUNCTIONALITY ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // Clear local storage data on successful logout
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            console.log("User logged out.");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}


// --- 4. MOBILE MENU TOGGLE ---
if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        dashboardLayout.classList.toggle('menu-open');
    });
    
    // Optional: Close sidebar if a nav item is clicked on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                sidebar.classList.remove('active');
                dashboardLayout.classList.remove('menu-open');
            }
        });
    });
}
