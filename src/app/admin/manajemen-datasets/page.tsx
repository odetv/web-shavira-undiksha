"use client";
import GoBackAdmin from "@/components/GoBackAdmin";
import GoBackHome from "@/components/GoBackHome";
import CRUDDatasets from "@/components/CRUDDatasets";
import AccessChecker from "@/components/AccessChecker";
import { useEffect, useState } from "react";
import { hashKey } from "@/components/HashKey";
import AccessNotAllowed from "@/components/AccessNotAllowed";

export default function ManajemenDatasets() {
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

  return (
    <main className="flex flex-col items-center justify-center p-4 pt-6 mx-auto max-w-screen-lg 2xl:max-w-screen-2xl">
      <div id="info-bot" className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">
          Manajemen Datasets
        </h1>
      </div>
      <div className="pt-6">
        <CRUDDatasets />
      </div>
      <div className="flex flex-wrap gap-2 pt-6 justify-center items-center">
        <GoBackHome />
        <GoBackAdmin />
      </div>
    </main>
  );
}
