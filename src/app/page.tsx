"use client";
import Image from "next/image";
import BotLogo from "../assets/logo/bot.png";
import UserLogo from "../assets/logo/user.png";
import { Textarea, Button, Chip, ScrollShadow } from "@nextui-org/react";
import SendIcon from "@mui/icons-material/Send";
import { sendChatBot, checkChatBotStatus } from "../services/apiChatBot";
import { useEffect, useRef, useState } from "react";
import React from "react";

interface ChatMessage {
  role: "user" | "bot";
  message: string;
}

export default function Home() {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatBotReady, setChatBotReady] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const timestamp = await checkChatBotStatus();
        if (timestamp) {
          setChatBotReady(true);
        }
      } catch (error) {
        setChatBotReady(false);
      }
    };

    checkStatus();

    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!userMessage) return;

    const newChatHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user", message: userMessage },
    ];
    setChatHistory(newChatHistory);
    setUserMessage("");

    setLoading(true);
    try {
      const response = await sendChatBot(userMessage);
      setChatHistory([...newChatHistory, { role: "bot", message: response }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChatHistory([
        ...newChatHistory,
        {
          role: "bot",
          message: (error as Error).message || "Maaf, terjadi kesalahan.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  };

  const parseMessage = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const newLineRegex = /\n/g;

    const parts = message.split(newLineRegex).map((line, index) =>
      line.split(urlRegex).map((part, partIndex) => {
        if (urlRegex.test(part)) {
          return (
            <a
              key={`${index}-${partIndex}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {part}
            </a>
          );
        } else {
          const boldedText = part.split(boldRegex).map((segment, i) => {
            if (i % 2 === 1) {
              return (
                <strong key={`${index}-${partIndex}-${i}`}>{segment}</strong>
              );
            }
            return <span key={`${index}-${partIndex}-${i}`}>{segment}</span>;
          });
          return <span key={`${index}-${partIndex}`}>{boldedText}</span>;
        }
      })
    );

    return parts.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <main className="pt-10 pb-20 flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#03097d] to-[#2aa9e0] sm:bg-gradient-to-r sm:from-[#03097d] sm:from-10% sm:via-[#023781] sm:via-30% sm:to-[#2aa9e0] sm:to-90%">
      <div id="info-bot" className="text-center text-white tracking-wide">
        <h1 className="text-5xl sm:text-7xl font-bold pb-2">Shavira</h1>
        <p className="text-sm sm:text-3xl">
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
            {chatHistory.map((chat, index) => (
              <div key={index} className="flex flex-col gap-2 mt-4">
                <div className="grid grid-cols-1 justify-between items-center text-xs gap-10">
                  {chat.role === "bot" ? (
                    <div className="flex flex-row justify-start items-center gap-2 ml-2">
                      <Image
                        className="rounded-full"
                        width={24}
                        height={24}
                        src={BotLogo}
                        alt="Bot"
                      />
                      <p className="font-extrabold">Shavira</p>
                    </div>
                  ) : (
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
                  )}
                </div>
                <div
                  className={`flex ${
                    chat.role === "user"
                      ? "justify-end ml-10 sm:ml-auto sm:mr-10 mr-2 sm:w-[700px]"
                      : "justify-start ml-2 sm:ml-10 mr-10 sm:mr-auto text-left sm:w-[700px]"
                  }`}
                >
                  <p className="bg-slate-200 rounded-xl p-3 text-sm sm:text-base">
                    {parseMessage(chat.message)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div id="input" className="pt-10">
            <div className="flex flex-row justify-between items-center gap-2">
              <Textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                minRows={1}
                placeholder="Ajukan Pertanyaan..."
                type="text"
                variant="faded"
                label=""
                color="default"
              />
              <Button
                onPress={handleSend}
                isLoading={loading}
                isIconOnly
                disableRipple
                disableAnimation
                variant="solid"
              >
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
              onPress={handleReset}
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
              <p>Saya tidak mendapat jawaban sesuai</p>
              <p>Alihkan ke CS UPA TIK</p>
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
