"use client";
import { useEffect, useState } from "react";
import { Chip } from "@nextui-org/react";
import { apiShaviraStatus } from "@/services/apiVirtualAssistant";
import Link from "next/link";
import LogsActivity from "@/components/LogsActivity";
import AccessChecker from "@/components/AccessChecker";

export default function Admin() {
  const [chatBotReady, setChatBotReady] = useState(false);

  useEffect(() => {
    const fetchApiStatus = async () => {
      const isReady = await apiShaviraStatus();
      setChatBotReady(isReady);
    };
    fetchApiStatus();
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
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">Admin</h1>
        <p className="text-sm sm:text-xl">Selamat datang di Admin Panel</p>
      </div>
      <div className="flex flex-col gap-4 w-full pt-4 justify-center items-center">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Link
            className="bg-cyan-500 hover:bg-cyan-400 transition-all ease-in-out text-white text-sm sm:text-base font-medium px-3 py-2 rounded-lg"
            href="/admin/general"
          >
            Umum
          </Link>

          <Link
            className="bg-emerald-500 hover:bg-emerald-400 transition-all ease-in-out text-white text-sm sm:text-base font-medium px-3 py-2 rounded-lg"
            href="/admin/connections"
          >
            Konfigurasi Koneksi
          </Link>

          <Link
            className="bg-orange-500 hover:bg-orange-400 transition-all ease-in-out text-white text-sm sm:text-base font-medium px-3 py-2 rounded-lg"
            href="/admin/models"
          >
            Konfigurasi Model
          </Link>

          <Link
            className="bg-rose-500 hover:bg-rose-400 transition-all ease-in-out text-white text-sm sm:text-base font-medium px-3 py-2 rounded-lg"
            href="/admin/users"
          >
            Manajemen Pengguna
          </Link>

          <Link
            className="bg-zinc-500 hover:bg-zinc-400 transition-all ease-in-out text-white text-sm sm:text-base font-medium px-3 py-2 rounded-lg"
            href="/admin/datasets"
          >
            Manajemen Dataset
          </Link>
        </div>
        <div className="w-full">
          <div className="flex flex-row justify-center items-center pt-8 pb-4">
            <Chip
              color={chatBotReady ? "success" : "danger"}
              className="uppercase"
              variant="dot"
            >
              <p className="font-bold text-slate-800 text-xs sm:text-sm">
                {chatBotReady ? "Online" : "Offline"}
              </p>
            </Chip>
            <p className="pl-2 pr-2 text-slate-400">|</p>
            <p className="text-center font-semibold sm:text-base">
              Riwayat Aktivitas
            </p>
          </div>
          <LogsActivity />
        </div>
      </div>
    </main>
  );
}
