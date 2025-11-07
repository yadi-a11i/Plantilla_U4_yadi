import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de Firebase usando las credenciales existentes
const firebaseConfig = {
  apiKey: "AIzaSyC15GBSaaf8WFXbj7cl_VH0WoqQgMNYdBg",
  authDomain: "plantillau4.firebaseapp.com",
  projectId: "plantillau4",
  storageBucket: "plantillau4.firebasestorage.app",
  messagingSenderId: "812189625903",
  appId: "1:812189625903:web:6afd70d3eb3fe2840ee0da"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
