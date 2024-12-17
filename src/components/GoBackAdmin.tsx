import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function GoBackAdmin() {
  return (
    <Link href="/admin" className="text-sm bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 cursor-pointer transition-all ease-in-out">Kembali ke Admin Panel</Link>
  );
}
