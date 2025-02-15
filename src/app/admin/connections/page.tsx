"use client";
import { useState } from "react";
import { Input, Image } from "@nextui-org/react";
import GoBackHome from "@/components/GoBackHome";
import GoBackAdmin from "@/components/GoBackAdmin";
import AccessChecker from "@/components/AccessChecker";
import LoadingIcon from "@/assets/gif/Rolling@1x-1.0s-200px-200px.gif";

export default function ConfigurationConnections() {
  const [isLoading, setIsLoading] = useState(false);
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
          Konfigurasi Koneksi
        </h1>
      </div>
      <div className="pt-6 w-full flex flex-col gap-6">
        <div className="flex flex-wrap items-center bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <p className="font-semibold sm:text-base pb-4">OpenAI API</p>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center items-center">
            <Input type="text" label="API Base URL" />
            <Input type="text" label="API Key" />
          </div>
          <div className="pt-4">
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-4 py-3 rounded-xl text-sm flex justify-center items-center gap-1 cursor-pointer transition-all ease-in-out">
              {isLoading ? (
                <Image
                  width={20}
                  height={20}
                  src={LoadingIcon.src}
                  alt={"Loading"}
                />
              ) : (
                ""
              )}
              Simpan
            </button>
            <p className="text-xs italic pb-2 pt-2">Terakhir diubah: -</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <p className="font-semibold sm:text-base pb-4">Ollama API</p>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center items-center">
            <Input type="text" label="API Base URL" />
            <Input type="text" label="API Key" />
          </div>
          <div className="pt-4">
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-4 py-3 rounded-xl text-sm flex justify-center items-center gap-1 cursor-pointer transition-all ease-in-out">
              {isLoading ? (
                <Image
                  width={20}
                  height={20}
                  src={LoadingIcon.src}
                  alt={"Loading"}
                />
              ) : (
                ""
              )}
              Simpan
            </button>
            <p className="text-xs italic pb-2 pt-2">Terakhir diubah: -</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-6 justify-center items-center">
        <GoBackAdmin />
        <GoBackHome />
      </div>
    </main>
  );
}
