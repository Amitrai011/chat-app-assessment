// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBs8PFELt-BGaXSrazXHxjn-fT-bCLo-0g",
  authDomain: "chat-app-67517.firebaseapp.com",
  projectId: "chat-app-67517",
  storageBucket: "chat-app-67517.appspot.com",
  messagingSenderId: "97977781984",
  appId: "1:97977781984:web:becb7cc6983d03c339ca85",
  measurementId: "G-X1BC36HDLN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
