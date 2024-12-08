"use client";
import { useEffect, useState } from "react";
import { getGraphImage } from "@/services/apiVirtualAssistant";
import Image from "next/image";
import { Spinner } from "@nextui-org/react";
import GoBackHome from "@/components/GoBackHome";
import GoBackAdmin from "@/components/GoBackAdmin";
import { hashKey } from "@/components/HashKey";
import AccessNotAllowed from "@/components/AccessNotAllowed";
import AccessChecker from "@/components/AccessChecker";

export default function VisualizeGraph() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const imageBlob = await getGraphImage();
      if (imageBlob) {
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);
      }
    };

    fetchImage();
  }, []);

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
          Visualisasi Graph
        </h1>
      </div>
      <div className="pt-6">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Graph"
            width={200}
            height={100}
            className="drop-shadow-2xl"
          ></Image>
        ) : (
          <Spinner />
        )}
      </div>
      <div className="flex flex-wrap gap-2 pt-6 justify-center items-center">
        <GoBackHome />
        <GoBackAdmin />
      </div>
    </main>
  );
}
