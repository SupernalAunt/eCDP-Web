// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

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

export { auth };
