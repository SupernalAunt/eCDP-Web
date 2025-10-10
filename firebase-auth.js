// firebase-auth.js (FINAL VERSION for Login Stability and Domain Check)

// NOTE: This file now assumes 'firebase.auth()' and 'firebase.initializeApp()' 
// are available globally because of the -compat.js links in index.html.

const AUTHORIZED_MANAGER_EMAIL = 'management@mcd.com';
const ALLOWED_DOMAIN = '@mcd.com';

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.toLowerCase();
        const password = passwordInput.value;

        errorMessage.textContent = '';
        
        // --- 1. Domain Restriction Check ---
        if (!email.endsWith(ALLOWED_DOMAIN)) {
            errorMessage.textContent = `Access Denied: Only emails ending in ${ALLOWED_DOMAIN} are allowed.`;
            return;
        }

        try {
            // Use the global 'firebase.auth()' object provided by the compat SDKs
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log("SUCCESS: User logged in:", user.email);
            
            // --- 2. Role Determination ---
            let role = 'employee';
            if (user.email === AUTHORIZED_MANAGER_EMAIL) {
                role = 'manager';
            }

            // Save role and email to local storage
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userRole', role);
            
            // --- 3. Redirect (Should now be stable) ---
            window.location.href = "dashboard.html"; 

        } catch (error) {
            const errorCode = error.code;
            let friendlyMessage = "Login failed. Please check your credentials.";

            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                friendlyMessage = "Incorrect email or password.";
            } else if (errorCode === 'auth/invalid-email') {
                friendlyMessage = "The email address is not valid.";
            } else {
                console.error("Firebase Auth Error:", errorCode, error.message);
                friendlyMessage = "An unknown login error occurred. Check console for details.";
            }

            errorMessage.textContent = friendlyMessage;
        }
    });
}
