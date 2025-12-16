import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD33hYpeaAi1P6Tw_gm3OwZ59iwco8UNYk",
  authDomain: "vintage-clothes.firebaseapp.com",
  databaseURL: "https://vintage-clothes-default-rtdb.firebaseio.com",
  projectId: "vintage-clothes",
  storageBucket: "vintage-clothes.firebasestorage.app",
  messagingSenderId: "794953170246",
  appId: "1:794953170246:web:fb9ad2aa6f93345419f947"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);