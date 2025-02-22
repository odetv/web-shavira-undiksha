import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function GoBackAdmin() {
  return (
    <Link
      href="/admin"
      className="text-sm text-center font-semibold bg-blue-500 hover:bg-blue-400 text-white px-4 py-2.5 rounded-lg cursor-pointer transition-all ease-in-out"
    >
      Kembali ke Admin Panel
    </Link>
  );
}
