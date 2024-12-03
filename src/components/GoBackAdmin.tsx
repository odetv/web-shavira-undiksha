import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function GoBackAdmin() {
  return (
    <Button color="primary" variant="solid">
      <Link href="/admin">Kembali ke Admin Panel</Link>
    </Button>
  );
}
