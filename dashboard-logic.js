// dashboard-logic.js (FINAL CLEAN VERSION)

const AUTHORIZED_MANAGER_EMAIL = 'management@mcd.com';

const welcomeMessage = document.getElementById('welcome-message');
const managerLink = document.getElementById('manager-link');
const logoutBtn = document.getElementById('logout-button');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const sidebar = document.getElementById('sidebar');

// Element for the completion button
const completeButton = document.getElementById('complete-FoodSafety101');


// --- 1. User Initialization and Data Check (CLEANED UP DEFAULT COURSES) ---
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
                    // Use only courses that are relevant now, initialized to 'new'
                    "FoodSafety101": { status: "new", completion: 0 },
                    "KitchenPrep": { status: "new", completion: 0 },
                    "ClosingProcedures": { status: "new", completion: 0 } 
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


// --- 2. Course Completion Logic ---
// ... (The rest of this logic remains the same as before) ...
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
        
        if (data.courses && data.courses[courseId] && data.courses[courseId].status === 'completed') {
            alert(`${courseId} is already marked as complete!`);
            return;
        }
        
        await userRef.update({
            [`courses.${courseId}.status`]: 'completed',
            [`courses.${courseId}.completion`]: 100,
            completedCourses: firebase.firestore.FieldValue.increment(1),
            overallProgress: firebase.firestore.FieldValue.increment(10)
        });

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


// --- 3. Update UI on Load ---
async function updateDashboardUI(userEmail) {
    const db = firebase.firestore();
    const userRef = db.collection('employees').doc(userEmail);
    
    try {
        const doc = await userRef.get();
        if (doc.exists) {
            const data = doc.data();
            const courseId = 'FoodSafety101'; 

            if (data.courses && data.courses[courseId] && data.courses[courseId].status === 'completed') {
                const statusElement = document.getElementById(`status-${courseId}`);
                
                statusElement.textContent = 'Completed';
                statusElement.classList.remove('new', 'in-progress');
                statusElement.classList.add('complete');
                
                if (completeButton) {
                    completeButton.disabled = true;
                    completeButton.textContent = 'Completed!';
                    completeButton.style.backgroundColor = '#28a745';
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
        const userName = userEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${userName}!`;
        }

        if (userEmail === AUTHORIZED_MANAGER_EMAIL) {
            localStorage.setItem('userRole', 'manager');
            if (managerLink) {
                managerLink.style.display = 'block';
            }
        } else {
            localStorage.setItem('userRole', 'employee');
        }

        initializeUserData(userEmail); 
        updateDashboardUI(userEmail); 

    } else {
        // User is signed out. Redirect them.
        window.location.href = "index.html";
    }
});


// --- 5. Logout Functionality & Mobile Menu Toggle ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            localStorage.clear();
            
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}

if (mobileMenuIcon && sidebar) {
    mobileMenuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}
