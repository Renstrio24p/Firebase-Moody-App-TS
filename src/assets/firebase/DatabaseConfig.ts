import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { FirebaseTypes } from "./FirebaseTypes";

const firebaseConfig: FirebaseTypes = {
  apiKey: "AIzaSyBMBJcoGlV6Df4ySDHTaxcMwDacVl48RKA",
  authDomain: "moddy-d06db.firebaseapp.com",
  projectId: "moddy-d06db",
  storageBucket: "moddy-d06db.appspot.com",
  messagingSenderId: "957833856518",
  appId: "1:957833856518:web:27c48fb939bd1dc2562587"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider()