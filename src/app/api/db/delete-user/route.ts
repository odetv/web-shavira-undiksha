import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/services/firebaseAdmin";

export async function DELETE(req: NextRequest) {
  const { uid } = await req.json(); // Mengambil UID dari request body

  if (!uid) {
    return NextResponse.json(
      { message: "UID tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    // Hapus pengguna dari Firebase Authentication
    await auth.deleteUser(uid);

    // Hapus data pengguna dari Firestore
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { message: "User not found in Firestore" },
        { status: 404 }
      );
    }

    await userRef.delete();

    return NextResponse.json(
      { message: "User successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
