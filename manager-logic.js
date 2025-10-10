// manager-logic.js (FINAL VERSION for Security Stability)

// NOTE: This file now relies on the global 'firebase' object from the compat SDKs.

const AUTHORIZED_MANAGER_EMAIL = 'management@mcd.com';

// Element references (assuming you update dashboard.html to link this)
const logoutBtn = document.getElementById('logout-button');
const managerModeLink = document.getElementById('manager-link');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const sidebar = document.getElementById('sidebar');

// --- 1. SECURITY CHECK (Redirects if not the authorized manager) ---
function checkManagerAuthorization() {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    // Redirect if not logged in OR not the authorized manager
    if (!userEmail || userRole !== 'manager' || userEmail !== AUTHORIZED_MANAGER_EMAIL) {
        // Use window.stop() to prevent content from loading before redirect
        if (window.location.pathname.includes('manager.html')) {
            alert("Access Denied. Only the authorized manager email can view this page. Redirecting to dashboard.");
            window.location.href = "dashboard.html"; 
            window.stop();
        }
    }
    
    // If on dashboard, just show the link for the manager
    if (managerModeLink && userEmail === AUTHORIZED_MANAGER_EMAIL) {
        managerModeLink.style.display = 'block';
    }
}

// Ensure the check runs when dashboard-logic or manager-logic loads
window.onload = checkManagerAuthorization;


// --- 2. LOGOUT FUNCTIONALITY (Using global firebase object) ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            // Use the global 'firebase.auth()' object provided by the compat SDKs
            await firebase.auth().signOut();
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            window.location.href = "index.html";
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}


// --- 3. MOBILE MENU TOGGLE (Copying to both logic files for simplicity) ---
if (mobileMenuIcon && sidebar) {
    mobileMenuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// ----------------------------------------------------
// NOTE: For manager-logic.js, you'll also need to copy 
// the search and delete logic from the previous step here.
// ----------------------------------------------------
