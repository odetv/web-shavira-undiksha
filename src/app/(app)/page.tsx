"use client";
import Image from "next/image";
import BotLogo from "../../assets/logo/bot.png";
import UserLogo from "../../assets/logo/user.png";
import { Textarea, Button, Chip } from "@nextui-org/react";
import SendIcon from "@mui/icons-material/Send";
import { useRef, useState } from "react";
import React from "react";

export default function Home() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatBotReady, setChatBotReady] = useState(false);

  return (
    <main className="pb-20 flex flex-col items-center justify-center p-4 smooth-gradient h-screen">
      <div id="info-bot" className="text-center text-white tracking-wide">
        <h1 className="text-5xl sm:text-7xl font-bold pb-2">Shavira</h1>
        <p className="text-sm sm:text-2xl">
          Layanan Helpdesk Undiksha Virtual Assistant
        </p>
      </div>
      <div className="mt-4 flex flex-row gap-2 items-center justify-center">
        <Chip color="warning" className="uppercase" variant="solid">
          <p className="font-bold">Eksperimen</p>
        </Chip>
        <Chip
          color={chatBotReady ? "success" : "danger"}
          className="uppercase"
          variant="dot"
        >
          <p className="font-bold text-white">
            {chatBotReady ? "Ready" : "Not Ready"}
          </p>
        </Chip>
      </div>
      <div className="mt-8 bg-white p-4 rounded-xl container max-w-screen-lg">
        <div className="mt-2 bg-white p-4 rounded-xl container max-w-screen-lg">
          <div
            id="block-chat"
            ref={chatContainerRef}
            className="flex flex-col gap-6 max-h-[400px] overflow-y-auto"
          >
            <div className="flex flex-col gap-2 mb-4">
              <div className="grid grid-cols-1 justify-between items-center text-xs gap-10">
                <div className="flex flex-row justify-start items-center gap-2 ml-2">
                  <Image
                    className="rounded-full"
                    width={24}
                    height={24}
                    src={BotLogo}
                    alt={"Bot"}
                  />
                  <p className="font-extrabold">Shavira</p>
                </div>
              </div>
              <div className="flex justify-start ml-2 sm:ml-10 mr-10 sm:mr-auto text-left sm:w-[700px]">
                <p className="bg-slate-200 rounded-xl p-3 text-sm sm:text-base">
                  Hai kak, aku Shavira. Ada yang bisa dibantu?
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="grid grid-cols-1 justify-between items-center text-xs gap-10">
                <div className="flex flex-row justify-end items-center gap-2 mr-2">
                  <p className="font-extrabold">User</p>
                  <Image
                    className="rounded-full"
                    width={24}
                    height={24}
                    src={UserLogo}
                    alt="User"
                  />
                </div>
              </div>
              <div className="justify-end ml-10 sm:ml-auto sm:mr-10 mr-2 sm:w-[700px]">
                <p className="bg-slate-200 rounded-xl p-3 text-sm sm:text-base">
                  Siapa rektor undiksha saat ini yang menjabat?
                </p>
              </div>
            </div>
          </div>

          <div id="input" className="pt-10">
            <div className="flex flex-row justify-between items-center gap-2">
              <Textarea
                minRows={1}
                placeholder="Ajukan Pertanyaan..."
                type="text"
                variant="faded"
                label=""
                color="default"
              />
              <Button isIconOnly disableRipple disableAnimation variant="solid">
                <SendIcon color="primary" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div id="opsi-input" className="mt-8">
        <div className="flex flex-col sm:flex-row justify-center w-full gap-2">
          <div className="grid grid-cols-2 gap-2 justify-between items-center">
            <Button
              radius="md"
              className="bg-gradient-to-tr from-[#d79127] to-[#2aa9e0] text-white shadow-lg py-6 sm:py-8"
            >
              Reset Chat
            </Button>
            <Button
              radius="md"
              className="bg-gradient-to-tr from-[#2aa9e0] to-[#d79127] text-white shadow-lg py-6 sm:py-8"
            >
              Tanya Lagi
            </Button>
          </div>
          <Button
            radius="md"
            className="bg-gradient-to-tr from-[#d79127] to-[#2aa9e0] text-white shadow-lg py-8"
          >
            <a
              href="https://upttik.undiksha.ac.id/kontak-kami/"
              className="flex flex-col"
            >
              <p>Saya tidak mendapat jawaban sesuai - Buat Ticket</p>
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
