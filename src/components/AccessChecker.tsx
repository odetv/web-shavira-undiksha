"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

interface AccessCheckerProps {
  onAccessChecked: (isValidKey: boolean) => void;
}

export default function AccessChecker({ onAccessChecked }: AccessCheckerProps) {
  const [isOpenDeniedAccessAI, setOpenDeniedAccessAI] = useState(false);
  const [
    isOpenDeniedAccessAIUserNotLogged,
    setOpenDeniedAccessAIUserNotLogged,
  ] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData && userData.role === "admin") {
            onAccessChecked(true);
          } else {
            setOpenDeniedAccessAI(true);
            onAccessChecked(false);
          }
        } else {
          onAccessChecked(false);
        }
      } else {
        setOpenDeniedAccessAIUserNotLogged(true);
        onAccessChecked(false);
      }
    });
    return () => unsubscribe();
  }, [onAccessChecked]);

  if (isOpenDeniedAccessAI || isOpenDeniedAccessAIUserNotLogged) {
    window.location.href = "/unauthorized";
  }

  return null;
}
