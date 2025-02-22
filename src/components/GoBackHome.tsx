import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function GoBackHome() {
  return (
    <Link
      href="/"
      className="text-sm text-center font-semibold border-2 border-blue-500 hover:border-blue-400  text-blue-500 px-4 py-2 rounded-lg cursor-pointer transition-all ease-in-out"
    >
      Kembali ke Beranda
    </Link>
  );
}
