import { auth, db } from "@/services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

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

export const signInGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const userData = {
        uid: user.uid,
        name: user.displayName || "Nama Tidak Tersedia",
        email: user.email,
        photo_url:
          user.photoURL ||
          "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        role: "registered",
        status: "active",
        type_user: "google",
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
      };
      await setDoc(userDocRef, userData);
    }
    return user;
  } catch (error: any) {
    console.error("Error signing in with Google: ", error);
    throw new Error(error.message);
  }
};

export const signUpGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const userData = {
        uid: user.uid,
        name: user.displayName || "Nama Tidak Tersedia",
        email: user.email,
        photo_url:
          user.photoURL ||
          "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        role: "registered",
        status: "active",
        type_user: "google",
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
      };
      await setDoc(userDocRef, userData);
    }
    return user;
  } catch (error: any) {
    console.error("Error signing up with Google: ", error);
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
