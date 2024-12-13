import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";
import bcrypt from "bcryptjs";

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

export const signUpManual = async (
  name: string,
  email: string,
  password: string,
  photoUrl: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const hashedPassword = await bcrypt.hash(password, 10);

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      photo_url: photoUrl,
      password: hashedPassword,
      role: "registered",
      status: "active",
      type_user: "manual",
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
    });

    await updateProfile(user, {
      displayName: name,
    });
    return user;
  } catch (error: any) {
    console.error("Error signing up: ", error);
    throw new Error(error.message);
  }
};

export const signInManual = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in: ", error);
    throw new Error(error.message);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out: ", error);
    throw new Error(error.message);
  }
};
