"use client";
import GoBackAdmin from "@/components/GoBackAdmin";
import GoBackHome from "@/components/GoBackHome";
import CRUDDatasets from "@/components/CRUDDatasets";
import AccessChecker from "@/components/AccessChecker";
import { useState } from "react";

export default function ManajemenDatasets() {
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const handleAccessChecked = (valid: boolean) => {
    setIsValidKey(valid);
  };
  if (!isValidKey) {
    return <AccessChecker onAccessChecked={handleAccessChecked} />;
  }

  return (
    <main className="flex flex-col items-center justify-center p-4 pt-6 mx-auto max-w-screen-lg 2xl:max-w-screen-2xl">
      <div id="info-bot" className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">
          Manajemen Dataset
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
