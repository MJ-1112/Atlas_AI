// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5UKfTngwFK-gndrCoOHBJpS4kLGLxf7w",
  authDomain: "atlas-ai-eca71.firebaseapp.com",
  projectId: "atlas-ai-eca71",
  storageBucket: "atlas-ai-eca71.firebasestorage.app",
  messagingSenderId: "370065141583",
  appId: "1:370065141583:web:382eda8201565c54e01f3a",
  measurementId: "G-S4DW01TVTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
