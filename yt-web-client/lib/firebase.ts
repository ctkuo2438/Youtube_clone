// Google sign in and sign out
import { initializeApp } from "firebase/app";
import { getAuth,
        signInWithPopup,
        GoogleAuthProvider,
        onAuthStateChanged,
        User} from  "firebase/auth";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(); // 初始化 Firebase Functions SDK

const auth = getAuth(app);

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signs out.
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user:User | null) => void) {
    // onAuthStateChanged(...) is a function，呼叫它會「註冊監聽器」，並「回傳一個解除監聽的函式」
    return onAuthStateChanged(auth, callback)
}
