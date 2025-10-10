// course-list-logic.js

const AUTHORIZED_MANAGER_EMAIL = 'management@mcd.com';

const managerLink = document.getElementById('manager-link');
const logoutBtn = document.getElementById('logout-button');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const sidebar = document.getElementById('sidebar');
const welcomeMessageSidebar = document.getElementById('welcome-message-sidebar');
const courseListContainer = document.getElementById('course-list-container');
const mainCategoryHeading = document.getElementById('main-category-heading');

// --- 1. Authentication Check & UI Setup ---
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        const userEmail = user.email.toLowerCase();
        const userName = userEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

        if (welcomeMessageSidebar) {
            welcomeMessageSidebar.textContent = `Welcome, ${userName}!`;
        }

        if (userEmail === AUTHORIZED_MANAGER_EMAIL) {
            if (managerLink) {
                managerLink.style.display = 'block';
            }
        }
        
        // Load the courses for the category
        loadCategoryCourses(userEmail);

    } else {
        // User is signed out. Redirect them.
        window.location.href = "index.html";
    }
});


// --- 2. Function to Get URL Parameter (for category) ---
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// --- 3. Load Courses based on Category (Placeholder Data) ---
async function loadCategoryCourses(userEmail) {
    const category = getUrlParameter('category') || 'Operations'; 
    mainCategoryHeading.textContent = `Course Category: ${category}`;

    // Placeholder data (will be replaced by Firestore query later)
    const courses = [
        { id: "FoodSafety101", title: "Food Safety 101", description: "Mandatory training on health codes and HACCP.", icon: "fa-burger", status: "completed" },
        { id: "KitchenPrep", title: "Advanced Kitchen Prep", description: "Mastering grill and prep station efficiency.", icon: "fa-fire", status: "new" },
        { id: "ClosingProcedures", title: "Closing Procedures", description: "Checklists for nightly shutdown and cleaning.", icon: "fa-broom", status: "in-progress" }
    ];

    courseListContainer.innerHTML = ''; // Clear the "Loading..." placeholder

    courses.forEach(course => {
        // Simple mapping for status classes and completion text (for the placeholder)
        const statusClass = course.status === 'completed' ? 'complete' : course.status === 'in-progress' ? 'in-progress' : 'new';
        const statusText = course.status === 'completed' ? 'Completed' : course.status === 'in-progress' ? 'In Progress' : 'New Module';
        const buttonText = course.status === 'completed' ? 'View Certificate' : 'Start Course';
        const buttonColor = course.status === 'completed' ? '#28a745' : 'var(--deep-blue)';
        
        const cardHTML = `
            <div class="dashboard-card" onclick="alert('Navigating to course: ${course.title}');">
                <i class="fas ${course.icon} fa-3x" style="color: ${buttonColor}; margin-bottom: 15px;"></i>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <span class="status-indicator ${statusClass}" id="status-${course.id}">${statusText}</span>
                <button class="action-button" style="background-color: ${buttonColor}; margin-top: 15px;">
                    ${buttonText}
                </button>
            </div>
        `;
        courseListContainer.innerHTML += cardHTML;
    });

    // NOTE: Real course data should be loaded from Firestore based on user progress and category ID
}


// --- 4. Logout Functionality ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await firebase.auth().signOut();
            localStorage.clear(); 
            window.location.href = "index.html"; // Redirect to login
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}

// --- 5. Mobile Menu Toggle ---
if (mobileMenuIcon && sidebar) {
    mobileMenuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}
