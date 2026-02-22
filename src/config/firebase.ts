import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBEy2tAOHgJOH8BgQ-MatWyd0rCUlYsbHQ",
    authDomain: "m109-5d6ff.firebaseapp.com",
    projectId: "m109-5d6ff",
    storageBucket: "m109-5d6ff.firebasestorage.app",
    messagingSenderId: "402256029735",
    appId: "1:402256029735:web:b0f2f1c9b8f096b5f24602",
    measurementId: "G-M167S42G7X"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
