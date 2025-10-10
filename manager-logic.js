// manager-logic.js (FINAL VERSION with LIVE FIRESTORE QUERY and DELETION)

const AUTHORIZED_MANAGER_EMAIL = 'management@mcd.com';
const ALLOWED_DOMAIN = '@mcd.com';

// --- Element References ---
const searchForm = document.getElementById('employee-search-form');
const searchEmailInput = document.getElementById('search-email');
const searchResultsDiv = document.getElementById('search-results');
const deleteDataBtn = document.getElementById('delete-data-btn');
const searchMessage = document.getElementById('search-message');
const logoutBtn = document.getElementById('logout-button');
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const sidebar = document.getElementById('sidebar');

// --- 1. Security Check (Redirects if not the authorized manager) ---
function checkManagerAuthorization() {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    // Redirect if not logged in OR not the authorized manager
    if (!userEmail || userRole !== 'manager' || userEmail !== AUTHORIZED_MANAGER_EMAIL) {
        if (window.location.pathname.includes('manager.html')) {
            alert("Access Denied. Redirecting to dashboard.");
            window.location.href = "dashboard.html"; 
        }
    }
}
window.onload = checkManagerAuthorization;


// --- 2. Logout Functionality ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            // Use the global 'firebase.auth()' object provided by the compat SDKs
            await firebase.auth().signOut();
            localStorage.clear();
            window.location.href = "index.html";
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}


// --- 3. Employee Search Logic (LIVE FIRESTORE READ) ---
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    searchResultsDiv.style.display = 'none';
    searchMessage.textContent = '';
    
    const emailToSearch = searchEmailInput.value.toLowerCase();
    
    if (!emailToSearch.endsWith(ALLOWED_DOMAIN)) {
        searchMessage.textContent = `Error: Employee email must end in ${ALLOWED_DOMAIN}.`;
        return;
    }

    searchMessage.textContent = 'Searching Firestore...';
    
    try {
        const db = firebase.firestore();
        const docRef = db.collection('employees').doc(emailToSearch);
        const doc = await docRef.get();

        if (doc.exists) {
            const data = doc.data();
            
            document.getElementById('result-email').textContent = emailToSearch;
            // Display data from Firestore
            document.getElementById('result-progress').textContent = `${data.overallProgress || 0}%`;
            document.getElementById('result-completed').textContent = `${data.completedCourses || 0}`;
            
            searchResultsDiv.style.display = 'block';
            searchMessage.textContent = '';
        } else {
            searchMessage.textContent = `Error: Employee with email '${emailToSearch}' not found in the database.`;
        }
    } catch (error) {
        searchMessage.textContent = `A database error occurred: ${error.message}`;
        console.error("Firestore Search Error:", error);
    }
});


// --- 4. Data Deletion Logic (NEW IMPLEMENTATION) ---
deleteDataBtn.addEventListener('click', async () => {
    const emailToDelete = document.getElementById('result-email').textContent;
    if (!emailToDelete) return;

    if (confirm(`⚠️ WARNING: Are you absolutely sure you want to DELETE ALL PROGRESS DATA for ${emailToDelete}? This action cannot be undone and will NOT delete the Firebase Authentication user account.`)) {
        
        searchMessage.textContent = `Deleting data for ${emailToDelete}...`;
        deleteDataBtn.disabled = true;

        try {
            const db = firebase.firestore();
            // Perform the deletion
            await db.collection('employees').doc(emailToDelete).delete();

            // Success feedback
            searchResultsDiv.style.display = 'none';
            searchMessage.textContent = `✅ Successfully deleted all progress data for ${emailToDelete}.`;
            searchEmailInput.value = ''; // Clear search field
            
        } catch (error) {
            searchMessage.textContent = `Failed to delete data. Error: ${error.message}`;
            console.error("Firestore Deletion Error:", error);
        } finally {
            deleteDataBtn.disabled = false;
        }
    }
});


// --- 5. Mobile Menu Toggle ---
if (mobileMenuIcon && sidebar) {
    mobileMenuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}
