"use client";
import { useEffect, useState } from "react";
import { hashKey } from "../../components/HashKey";
import Link from "next/link";

export default function Admin() {
  const targetKey = `${process.env.NEXT_PUBLIC_VA_ADMIN_KEY}`;
  const baseUrl = "/";
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
    return (
      <main className="min-h-screen flex justify-center items-center -mt-20">
        <div
          id="info-bot"
          className="text-center text-black tracking-wide flex flex-col items-center justify-center"
        >
          <h1 className="text-3xl sm:text-5xl font-bold pb-2">Akses Ditolak</h1>
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
        <p className="text-sm sm:text-xl">Selamat datang di halaman Admin</p>
      </div>
    </main>
  );
}
