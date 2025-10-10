// firebase-auth.js (CORRECTED for Reliable Redirect)

// NOTE: We MUST use the full Firebase v9 imports to ensure the module dependencies are handled correctly
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// We must re-initialize the app context if we cannot reliably import the 'auth' object
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// --- 1. Re-define Config (for reliability, though this should be in firebase-config.js) ---
// For the browser to reliably load this script as a module AND execute the login logic, 
// we will temporarily include the config details here. If you prefer to keep them separate,
// ensure firebase-config.js is correctly exporting its 'auth' object.
const firebaseConfig = {
    apiKey: "AIzaSyAOwtZ9hlq2tjh-wHyBtEF5gFpMMZQl0so",
    authDomain: "ecdp-web.firebaseapp.com",
    projectId: "ecdp-web",
    storageBucket: "ecdp-web.firebasestorage.app",
    messagingSenderId: "52884539513",
    appId: "1:52884539513:web:90fb6a60e1699196152ca8",
    measurementId: "G-6GP618SEYW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// --- 2. Element References ---
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');


// --- 3. Login Logic with Role Handling ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        errorMessage.textContent = ''; // Clear previous error
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log("SUCCESS: User logged in:", user.email);
            
            // Determine User Role
            let role = 'employee';
            if (user.email === 'management@ecdp-web.firebaseapp.com') {
                role = 'manager';
            }

            // Save role and email to local storage
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userRole', role);
            
            // CRITICAL: Force the redirect. This line should now execute reliably.
            window.location.href = "dashboard.html"; 

        } catch (error) {
            const errorCode = error.code;
            let friendlyMessage = "Login failed. Please check your credentials.";

            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                friendlyMessage = "Incorrect email or password.";
            } else if (errorCode === 'auth/invalid-email') {
                friendlyMessage = "The email address is not valid.";
            } else {
                friendlyMessage = "An unknown login error occurred. Check console.";
            }

            errorMessage.textContent = friendlyMessage;
            console.error("Firebase Auth Error:", errorCode, error.message);
        }
    });
}
