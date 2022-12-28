import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyASoHOvRmuRk1hEFngmIPa-go8mc_IuyJI",
    authDomain: "tic-tac-toe-async-ac19c.firebaseapp.com",
    projectId: "tic-tac-toe-async-ac19c",
    storageBucket: "tic-tac-toe-async-ac19c.appspot.com",
    messagingSenderId: "554279702871",
    appId: "1:554279702871:web:8bd074924dc791ff1fee12"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();