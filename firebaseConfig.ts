import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBzATYoPbh2ZDajIJEi7qupUHZVREsp-Aw",
    authDomain: "estoque-507ac.firebaseapp.com",
    databaseURL: "https://estoque-507ac-default-rtdb.firebaseio.com/",
    projectId: "estoque-507ac",
    storageBucket: "estoque-507ac.appspot.com",
    messagingSenderId: "1022296018574",
    appId: "1:1022296018574:web:90c5350eeb5a72a45f43df"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
