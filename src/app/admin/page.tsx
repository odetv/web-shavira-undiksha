"use client";
import { useEffect, useState } from "react";
import { hashKey } from "../../components/HashKey";
import Link from "next/link";
import { Button, Chip, Divider } from "@nextui-org/react";
import LogsActivity from "@/components/LogsActivity";
import { checkApiStatus } from "@/services/apiVirtualAssistant";

export default function Admin() {
  const targetKey = `${process.env.NEXT_PUBLIC_VA_ADMIN_KEY}`;
  const baseUrl = "/";
  const [isValidKey, setIsValidKey] = useState<boolean>(false);

  const [chatBotReady, setChatBotReady] = useState(false);

  useEffect(() => {
    const fetchApiStatus = async () => {
      const isReady = await checkApiStatus();
      setChatBotReady(isReady);
    };
    fetchApiStatus();
  }, []);

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
    return (
      <main className="min-h-screen flex justify-center items-center -mt-20">
        <div
          id="info-bot"
          className="text-center text-black tracking-wide flex flex-col items-center justify-center"
        >
          <h1 className="text-3xl sm:text-5xl font-bold pb-2">
            Akses ditolak!
          </h1>
          <Link
            href={baseUrl}
            className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer transition-all ease-in-out"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center p-4 pt-6 mx-auto max-w-screen-lg 2xl:max-w-screen-2xl">
      <div id="info-bot" className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">Admin</h1>
        <p className="text-sm sm:text-xl">Selamat datang di Admin Panel</p>
      </div>
      <div className="flex flex-col gap-4 w-full pt-4 justify-center items-center">
        <div className="grid sm:grid-cols-4 sm:grid-rows-1 gap-2 grid-rows-2 grid-cols-2">
          <Button
            variant="solid"
            radius="sm"
            className="bg-blue-500 text-white text-sm sm:text-base font-medium"
          >
            <Link href="/admin/manajemen-datasets">Manajemen Datasets</Link>
          </Button>
          <Button
            variant="solid"
            radius="sm"
            className="bg-emerald-500 text-white text-sm sm:text-base font-medium"
          >
            <Link href="/admin/setup-model">Setup Model</Link>
          </Button>
          <Button
            variant="solid"
            radius="sm"
            className="bg-orange-500 text-white text-sm sm:text-base font-medium"
          >
            <Link href="/admin/check-model">Check Model</Link>
          </Button>
          <Button
            variant="solid"
            radius="sm"
            className="bg-zinc-500 text-white text-sm sm:text-base font-medium"
          >
            <Link href="/admin/visualize-graph">Visualize Graph</Link>
          </Button>
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
              Log Aktivitas Pengguna
            </p>
          </div>
          <LogsActivity />
        </div>
      </div>
    </main>
  );
}
