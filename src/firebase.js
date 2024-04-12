// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore, collection, getDocs } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAs_gVVNG07-zUZ2afbR1c2A5DIBscxgfs",
  authDomain: "sc2006-group1.firebaseapp.com",
  projectId: "sc2006-group1",
  storageBucket: "sc2006-group1.appspot.com",
  messagingSenderId: "961487739860",
  appId: "1:961487739860:web:dbca2bd4026edfa2211441",
  measurementId: "G-K3TZGWZ4CR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const imgDB = getStorage(app)
const txtDB = getFirestore(app)

export {imgDB,txtDB};
export const auth = getAuth(app);
export default app;