"use client";
import { useEffect, useState } from "react";
import { hashKey } from "@/components/HashKey";
import AccessNotAllowed from "@/components/AccessNotAllowed";

export default function AccessChecker() {
  const targetKey = `${process.env.NEXT_PUBLIC_VA_ADMIN_KEY}`;
  const [isValidKey, setIsValidKey] = useState<boolean>(false);

  useEffect(() => {
    const checkStoredKey = async () => {
      const storedHash = sessionStorage.getItem("adminKey");
      const hashedTargetKey = hashKey(targetKey);
      if (storedHash === hashedTargetKey) {
        setIsValidKey(true);
      } else {
        setIsValidKey(false);
      }
    };

    checkStoredKey();
  }, [targetKey]);

  if (!isValidKey) {
    return <AccessNotAllowed />;
  }
}
