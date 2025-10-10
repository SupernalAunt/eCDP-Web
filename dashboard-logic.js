// dashboard-logic.js (UPDATED with Firestore User Initialization)

// NOTE: This file assumes the global 'firebase' object is available from index.html scripts

const AUTHORIZED_MANAGER_EMAIL = 'management@mcd.com';
const welcomeMessage = document.getElementById('welcome-message');
const managerLink = document.getElementById('manager-link');
const logoutBtn = document.getElementById('logout-button');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const sidebar = document.getElementById('sidebar');

// --- 1. User Initialization and Data Check ---
async function initializeUserData(userEmail) {
    const db = firebase.firestore();
    const userRef = db.collection('employees').doc(userEmail);

    try {
        const doc = await userRef.get();

        if (!doc.exists) {
            // First time login - create initial data
            console.log("Creating new user profile in Firestore...");
            await userRef.set({
                email: userEmail,
                role: (userEmail === AUTHORIZED_MANAGER_EMAIL) ? 'manager' : 'employee',
                overallProgress: 0,
                completedCourses: 0,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                courses: {
                    "FoodSafety101": { status: "new", completion: 0 },
                    "DriveThruOps": { status: "in-progress", completion: 35 } // Example in-progress
                }
            });
            console.log("New user data created successfully.");
        } else {
            // Existing user - just update the last login time
            await userRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        console.error("Error initializing user data in Firestore: ", error);
        // Alert the user but don't block the dashboard view
    }
}


// --- 2. Authentication State Observer (Redirect check and data init) ---
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        const userEmail = user.email.toLowerCase();
        const userName = userEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

        // Update welcome message
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${userName}!`;
        }

        // Check and display Manager Link
        if (userEmail === AUTHORIZED_MANAGER_EMAIL) {
            localStorage.setItem('userRole', 'manager');
            if (managerLink) {
                managerLink.style.display = 'block';
            }
        } else {
            localStorage.setItem('userRole', 'employee');
        }

        // Initialize user data in Firestore
        initializeUserData(userEmail);

    } else {
        // User is signed out. Redirect them.
        window.location.href = "index.html";
    }
});


// --- 3. Logout Functionality ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            localStorage.clear(); // Clear all saved info
            // Redirect is handled by the onAuthStateChanged listener
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}

// --- 4. Mobile Menu Toggle ---
if (mobileMenuIcon && sidebar) {
    mobileMenuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}
