// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration object
// Note: Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDpN4-55eHpwFEsdJ81JVfq8RqSzRBohN0",
  authDomain: "englishlms-6b79d.firebaseapp.com",
  projectId: "englishlms-6b79d",
  storageBucket: "englishlms-6b79d.firebasestorage.app",
  messagingSenderId: "41122169393",
  appId: "1:41122169393:web:8360fbdb22333774210b10",
  measurementId: "G-821JXQ9CNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
