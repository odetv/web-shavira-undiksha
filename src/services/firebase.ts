import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: `${process.env.NEXT_PUBLIC_FIREBASE_APIKEY}`,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN}`,
  projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID}`,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID}`,
  appId: `${process.env.NEXT_PUBLIC_FIREBASE_APPID}`,
  measurementId: `${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID}`,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  collection,
  getFirestore,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
};
