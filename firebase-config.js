// firebase-config.js (UPDATED with Firestore)

// ⚠️ We are using the COMPAT SDK links for stability
const firebaseConfig = {
    // ⚠️ ENSURE YOUR API KEY IS CORRECT HERE
    apiKey: "AIzaSyAOwtZ9hlq2tjh-wHyBtEF5gFpMMZQl0so", 
    authDomain: "ecdp-web.firebaseapp.com",
    projectId: "ecdp-web",
    storageBucket: "ecdp-web.firebasestorage.app",
    messagingSenderId: "52884539513",
    appId: "1:52884539513:web:90fb6a60e1699196152ca8",
    measurementId: "G-6GP618SEYW"
};

// Initialize Firebase App
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore using the global compat namespace
const auth = firebase.auth();

// ⚠️ NEW: Initialize Firestore
const db = firebase.firestore(); 

// Export the necessary objects
// NOTE: Since this file uses the compat SDKs and is loaded globally, 
// other files will access auth/db via the global 'firebase.auth()' and 'firebase.firestore()' 
// or by just using the exported 'auth' and 'db' variables if they are set up as modules.
// For now, let's ensure they are available globally via the compat approach.
