import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECTID}`,
      privateKey: `${process.env.NEXT_PUBLIC_FIREBASE_PRIVATEKEY}`,
      clientEmail: `${process.env.NEXT_PUBLIC_FIREBASE_CLIENTEMAIL}`,
    }),
  });
} else {
  admin.app();
}

export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

export const auth = admin.auth();
export const db = admin.firestore();
