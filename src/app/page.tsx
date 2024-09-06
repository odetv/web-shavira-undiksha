"use client";
import Image from "next/image";
import BotLogo from "../assets/logo/bot.png";
import UserLogo from "../assets/logo/user.png";
import { Textarea, Button, Chip } from "@nextui-org/react";
import SendIcon from "@mui/icons-material/Send";
import { sendQuestion } from "../services/apiChatbot";
import { useState } from "react";

export default function Home() {
  const [userMessage, setUserMessage] = useState(""); // Untuk menyimpan pesan user
  const [botResponse, setBotResponse] = useState(""); // Untuk menyimpan respons bot
  const [loading, setLoading] = useState(false); // Untuk loading state

  // Fungsi untuk mengirimkan pertanyaan ke API chatbot
  const handleSend = async () => {
    if (!userMessage) return;

    setLoading(true);
    try {
      const response = await sendQuestion(userMessage); // Panggil API
      setBotResponse(response); // Simpan respons dari API
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setBotResponse("Maaf, terjadi kesalahan."); // Tampilkan pesan error
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-10 pb-20 flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#03097d] to-[#2aa9e0] sm:bg-gradient-to-r sm:from-[#03097d] sm:from-10% sm:via-[#023781] sm:via-30% sm:to-[#2aa9e0] sm:to-90%">
      <div id="info-bot" className="text-center text-white tracking-wide">
        <h1 className="text-5xl sm:text-7xl font-bold pb-2">Shavira</h1>
        <p className="text-sm sm:text-3xl">
          Layanan Helpdesk Undiksha Virtual Assistant
        </p>
      </div>
      <div className="mt-4">
        <Chip color="warning" className="uppercase">
          Eksperimen
        </Chip>
      </div>
      <div className="mt-8 bg-white p-4 rounded-xl container max-w-screen-lg">
        <div id="block-chat" className="flex flex-col gap-6">
          <div id="bot" className="flex flex-col gap-1">
            <div className="grid grid-cols-1 justify-between items-center text-xs gap-10">
              <div className="flex flex-row justify-start items-center gap-2">
                <Image
                  className="rounded-full"
                  width={24}
                  height={24}
                  src={BotLogo}
                  alt={"Bot"}
                />
                <p>Shavira</p>
              </div>
            </div>
            <div>
              <p>
                {botResponse || "Hai kak, aku Shavira. Ada yang bisa dibantu?"}
              </p>
            </div>
          </div>
          <div id="user" className="flex flex-col gap-1">
            <div className="grid grid-cols-1 justify-between items-center text-xs gap-10">
              <div className="flex flex-row justify-end items-center gap-2">
                <p>User</p>
                <Image
                  className="rounded-full"
                  width={24}
                  height={24}
                  src={UserLogo}
                  alt={"User"}
                />
              </div>
            </div>
            <div className="text-end">
              <p>{userMessage || "..."}</p>
            </div>
          </div>
        </div>
        <div id="input" className="pt-10">
          <div className="flex flex-row justify-between items-center gap-2">
            <Textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              minRows={1}
              placeholder="Pertanyaan"
              type="text"
              variant="flat"
              label=""
              color="default"
            />
            <Button
              onPress={handleSend}
              isLoading={loading}
              isIconOnly
              disableRipple
              disableAnimation
              variant="light"
            >
              <SendIcon color="primary" />
            </Button>
          </div>
        </div>
        <div id="opsi-input" className="pt-4">
          <div className="flex flex-wrap sm:flex-row justify-center w-full gap-2">
            <Button
              radius="md"
              className="bg-gradient-to-tr from-[#2aa9e0] to-[#d79127] text-white shadow-lg py-8"
            >
              Tanya Lagi
            </Button>
            <Button
              radius="md"
              className="bg-gradient-to-tr from-[#d79127] to-[#2aa9e0] text-white shadow-lg py-8"
            >
              <div className="flex flex-col">
                <p>Saya tidak mendapat jawaban sesuai</p>
                <p>Alihkan ke CS UPA TIK</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
