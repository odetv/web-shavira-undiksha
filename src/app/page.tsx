import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-r from-[#03097d] to-[#2aa9e0] sm:bg-gradient-to-r sm:from-[#03097d] sm:from-10% sm:via-[#023781] sm:via-30% sm:to-[#2aa9e0] sm:to-90%">
      <div className="text-center text-white tracking-wide">
        <h1 className="text-5xl sm:text-7xl font-bold pb-2">Shavira</h1>
        <p className="text-sm sm:text-2xl">
          Layanan Helpdesk Undiksha Virtual Assistant
        </p>
      </div>
    </main>
  );
}
