import Link from "next/link";

export default function AccessNotAllowed() {
  return (
    <main className="min-h-screen flex justify-center items-center -mt-20">
      <div
        id="info-bot"
        className="text-center text-black tracking-wide flex flex-col items-center justify-center"
      >
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">403 Forbidden</h1>
        <Link
          href="/"
          className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer transition-all ease-in-out"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
