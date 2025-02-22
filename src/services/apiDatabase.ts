import {
  auth,
  db,
  doc,
  setDoc,
  Timestamp,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from "@/services/firebase";
import bcrypt from "bcryptjs";

const formatTimestamp = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  photoUrl: string,
  role: string,
  status: string
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
      role: role,
      status: status,
      type_user: "manual",
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
    });

    return user;
  } catch (error: any) {
    console.error("Error creating user: ", error);
    throw new Error(error.message);
  }
};

export const readUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const userList = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.created_at instanceof Timestamp
          ? formatTimestamp(data.created_at)
          : "";
      const updatedAt =
        data.updated_at instanceof Timestamp
          ? formatTimestamp(data.updated_at)
          : "";

      return {
        uid: data.uid,
        photo_url: data.photo_url || "",
        name: data.name || "",
        email: data.email || "",
        type_user: data.type_user || "",
        role: data.role || "",
        status: data.status || "",
        created_at: createdAt,
        updated_at: updatedAt,
      };
    });

    return userList;
  } catch (error) {
    console.error("Error reading users:", error);
    // throw new Error("Gagal mengambil data pengguna");
  }
};

export const quickUpdateUserRole = async (userId: string, newRole: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: newRole,
      updated_at: Timestamp.fromDate(new Date()),
    });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    throw new Error("Gagal memperbarui role pengguna");
  }
};

export const updateUser = async (
  userId: string,
  name: string,
  role: string,
  status: string
) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      name: name,
      role: role,
      status: status,
      updated_at: Timestamp.fromDate(new Date()),
    });
    return { message: "User updated successfully" };
  } catch (error: any) {
    console.error("Error updating user: ", error);
    throw new Error("Failed to update user");
  }
};

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

    const role =
      email.includes("undiksha.ac.id") ||
      email.includes("student.undiksha.ac.id")
        ? "member"
        : "registered";

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      photo_url: photoUrl,
      password: hashedPassword,
      role: role,
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
      const email = user.email || "";

      const role =
        email.includes("undiksha.ac.id") ||
        email.includes("student.undiksha.ac.id")
          ? "member"
          : "registered";

      const userData = {
        uid: user.uid,
        name: user.displayName || "Nama Tidak Tersedia",
        email: user.email,
        photo_url:
          user.photoURL ||
          "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        role: role,
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
      const email = user.email || "";

      const role =
        email.includes("undiksha.ac.id") ||
        email.includes("student.undiksha.ac.id")
          ? "member"
          : "registered";

      const userData = {
        uid: user.uid,
        name: user.displayName || "Nama Tidak Tersedia",
        email: user.email,
        photo_url:
          user.photoURL ||
          "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        role: role,
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

export const resetPassword = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Email tidak terdaftar di sistem.");
    }

    await sendPasswordResetEmail(auth, email);
    return "Email reset password telah dikirim! Silakan periksa inbox Anda.";
  } catch (error: any) {
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
