import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function GoBackHome() {
  return (
    <Button color="primary" variant="bordered">
      <Link href="/">Kembali ke Beranda</Link>
    </Button>
  );
}
