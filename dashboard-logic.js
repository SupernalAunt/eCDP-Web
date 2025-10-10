// dashboard-logic.js (FINAL VERSION with Firestore Integration and Course Completion)

// NOTE: This file assumes the global 'firebase' object is available from dashboard.html scripts

const AUTHORIZED_MANAGER_EMAIL = 'management@mcd.com';

const welcomeMessage = document.getElementById('welcome-message');
const managerLink = document.getElementById('manager-link');
const logoutBtn = document.getElementById('logout-button');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const sidebar = document.getElementById('sidebar');

// Element for the completion button
const completeButton = document.getElementById('complete-FoodSafety101');


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
    }
}


// --- 2. Course Completion Logic (NEW FUNCTION) ---
async function markCourseComplete(courseId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You must be logged in to update progress.");
        return;
    }
    
    const db = firebase.firestore();
    const userEmail = user.email.toLowerCase();
    const userRef = db.collection('employees').doc(userEmail);
    
    try {
        const doc = await userRef.get();
        if (!doc.exists) {
            alert("Error: User data not found. Please log out and back in.");
            return;
        }
        
        const data = doc.data();
        
        // Check if the course is already completed to prevent double-counting
        if (data.courses && data.courses[courseId] && data.courses[courseId].status === 'completed') {
            alert(`${courseId} is already marked as complete!`);
            return;
        }
        
        // 2. Perform the atomic update
        await userRef.update({
            // Update the specific course status and completion
            [`courses.${courseId}.status`]: 'completed',
            [`courses.${courseId}.completion`]: 100,
            
            // Increment the completed course count
            completedCourses: firebase.firestore.FieldValue.increment(1),
            
            // Simple calculation for overall progress (e.g., assuming 10 courses total = 10% each)
            overallProgress: firebase.firestore.FieldValue.increment(10)
        });

        // 3. Update the UI
        document.getElementById(`status-${courseId}`).textContent = 'Completed';
        document.getElementById(`status-${courseId}`).classList.remove('new', 'in-progress');
        document.getElementById(`status-${courseId}`).classList.add('complete');
        
        if (completeButton) {
            completeButton.disabled = true;
            completeButton.textContent = 'Completed!';
            completeButton.style.backgroundColor = '#28a745';
        }
        
        alert(`${courseId} has been marked as complete!`);
        
    } catch (error) {
        console.error("Error updating course completion:", error);
        alert("Failed to update course progress. Check the console for details.");
    }
}

// Attach the event listener to the button
if (completeButton) {
    completeButton.addEventListener('click', () => {
        const courseId = completeButton.getAttribute('data-course-id');
        markCourseComplete(courseId);
    });
}


// --- 3. Update UI on Load (NEW FUNCTION) ---
async function updateDashboardUI(userEmail) {
    const db = firebase.firestore();
    const userRef = db.collection('employees').doc(userEmail);
    
    try {
        const doc = await userRef.get();
        if (doc.exists) {
            const data = doc.data();
            const courseId = 'FoodSafety101'; 

            // Check and update the FoodSafety101 card based on stored data
            if (data.courses && data.courses[courseId] && data.courses[courseId].status === 'completed') {
                const statusElement = document.getElementById(`status-${courseId}`);
                
                statusElement.textContent = 'Completed';
                statusElement.classList.remove('new', 'in-progress');
                statusElement.classList.add('complete');
                
                if (completeButton) {
                    completeButton.disabled = true;
                    completeButton.textContent = 'Completed!';
                    completeButton.style.backgroundColor = '#28a745'; // Green color for complete
                }
            }
        }
    } catch (error) {
        console.error("Error updating dashboard UI from Firestore:", error);
    }
}


// --- 4. Authentication State Observer (Core Loader) ---
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        const userEmail = user.email.toLowerCase();
        // Capitalize the first part of the email for the welcome message
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

        // Initialize user data (create if first login)
        initializeUserData(userEmail); 
        
        // Update the visible UI based on the data
        updateDashboardUI(userEmail); 

    } else {
        // User is signed out. Redirect them.
        window.location.href = "index.html";
    }
});


// --- 5. Logout Functionality ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            localStorage.clear();
            // Redirect is handled by the onAuthStateChanged listener
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}

// --- 6. Mobile Menu Toggle ---
if (mobileMenuIcon && sidebar) {
    mobileMenuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}
