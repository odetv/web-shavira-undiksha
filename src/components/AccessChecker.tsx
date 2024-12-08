"use client";
import { useEffect, useState } from "react";
import { hashKey } from "@/components/HashKey";
import AccessNotAllowed from "@/components/AccessNotAllowed";

interface AccessCheckerProps {
  onAccessChecked: (isValidKey: boolean) => void;
}

export default function AccessChecker({ onAccessChecked }: AccessCheckerProps) {
  const targetKey = `${process.env.NEXT_PUBLIC_VA_ADMIN_KEY}`;
  const [isValidKey, setIsValidKey] = useState<boolean>(false);

  useEffect(() => {
    const checkStoredKey = async () => {
      const storedHash = sessionStorage.getItem("adminKey");
      const hashedTargetKey = hashKey(targetKey);
      const isValid = storedHash === hashedTargetKey;
      setIsValidKey(isValid);
      onAccessChecked(isValid);
    };

    checkStoredKey();
  }, [targetKey, onAccessChecked]);

  if (!isValidKey) {
    return <AccessNotAllowed />;
  }

  return null;
}
