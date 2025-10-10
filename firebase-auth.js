// firebase-auth.js

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { auth } from "./firebase-config.js"; // Import the initialized auth object

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        // Clear previous error message
        errorMessage.textContent = '';
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // --- SUCCESS: Handle successful login ---
            console.log("User logged in successfully:", user.uid);
            
            // IMPORTANT: Redirect to the main dashboard page
            window.location.href = "dashboard.html"; // We will create this file next!

        } catch (error) {
            // --- ERROR: Handle errors (e.g., wrong password, user not found) ---
            const errorCode = error.code;
            let friendlyMessage = "Login failed. Please check your credentials.";

            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                friendlyMessage = "Incorrect email or password.";
            } else if (errorCode === 'auth/invalid-email') {
                friendlyMessage = "The email address is not valid.";
            } else {
                console.error("Firebase Auth Error:", errorCode, error.message);
            }

            errorMessage.textContent = friendlyMessage;
        }
    });
}
