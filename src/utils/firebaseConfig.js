// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBs4bOFGTe53IAmQ1FrE8M0HVsSZEJQVM4",
  authDomain: "custofy-crm.firebaseapp.com",
  projectId: "custofy-crm",
  storageBucket: "custofy-crm.firebasestorage.app",
  messagingSenderId: "200439303660",
  appId: "1:200439303660:web:fa63c856fa4839c798c4c9",
  measurementId: "G-TWG099Q5GB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const  auth = getAuth(app);
export const db = getFirestore(app);