"use client";
import React from "react";
import Image from "next/image";
import BotLogo from "../../assets/logo/bot.png";
import UserLogo from "../../assets/logo/user.png";
import {
  Textarea,
  Button,
  Chip,
  Spinner,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import SendIcon from "@mui/icons-material/Send";
import { useRef, useState, useEffect } from "react";
import { checkApiStatus, chatResponse } from "@/services/apiVirtualAssistant";
import encodeComplexData from "@/services/encodeData";
import decodeComplexData from "@/services/decodeData";
import Cookies from "js-cookie";

export default function Home() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatBotReady, setChatBotReady] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { user: string; bot: string; timestamp: string }[]
  >([]);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApiStatus = async () => {
      const isReady = await checkApiStatus();
      setChatBotReady(isReady);
    };
    fetchApiStatus();
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const encodedBotUser = Cookies.get("botUser");
    setWelcomeVisible(false);

    if (encodedBotUser) {
      try {
        const decodedBotUser = decodeComplexData(encodedBotUser);
        if (decodedBotUser) {
          setMessages(
            decodedBotUser as { user: string; bot: string; timestamp: string }[]
          );
        }
      } catch (error) {
        console.error("Failed to parse cookie data:", error);
      }
    } else {
      setWelcomeVisible(true);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!question.trim()) return;

    const newUserMessage = { user: question, bot: "", timestamp: "" };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setQuestion("");

    const response = await chatResponse(question);
    if (response && response.success && response.data.length > 0) {
      const { timestamp, question: q, answer } = response.data[0];
      const newBotMessage = { user: q, bot: answer, timestamp };
      const updatedMessages = [...messages, newBotMessage];
      setMessages(updatedMessages);
      Cookies.set("botUser", encodeComplexData(updatedMessages), {
        expires: 7,
      });
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLTextAreaElement;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    Cookies.remove("botUser");
    setWelcomeVisible(true);
  };

  return (
    <main className="pt-10 pb-20 flex flex-col items-center justify-center p-4 smooth-gradient">
      <div id="info-bot" className="text-center text-white tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">Shavira</h1>
        <p className="text-sm sm:text-xl">
          Layanan Helpdesk Undiksha Virtual Assistant
        </p>
      </div>
      <div className="mt-4 flex flex-row gap-2 items-center justify-center">
        <Chip color="warning" className="uppercase" variant="solid">
          <p className="font-bold text-xs sm:text-sm">Eksperimen</p>
        </Chip>
        <Chip
          color={chatBotReady ? "success" : "danger"}
          className="uppercase"
          variant="dot"
        >
          <p className="font-bold text-white text-xs sm:text-sm">
            {chatBotReady ? "Ready" : "Not Ready"}
          </p>
        </Chip>
      </div>
      <div
        id="workspace-chat"
        className="mt-8 bg-white p-4 sm:p-8 rounded-xl container max-w-screen-lg"
      >
        <div
          id="conversation"
          ref={chatContainerRef}
          className="flex flex-col gap-6 max-h-[400px] overflow-y-auto"
        >
          {welcomeVisible && (
            <div id="shavira" className="flex flex-col gap-2 mb-4">
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
          )}
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <div id="user" className="flex flex-col gap-2">
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
                    {msg.user}
                  </p>
                </div>
              </div>
              <div id="shavira" className="flex flex-col gap-2 mb-4">
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
                  {loading && index === messages.length - 1 ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <p className="text-sm sm:text-base">
                        Shavira sedang berpikir...
                      </p>
                    </div>
                  ) : (
                    <p className="bg-slate-200 rounded-xl p-3 text-sm sm:text-base">
                      {msg.bot}
                    </p>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
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
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              isDisabled={loading}
            />
            <Button
              isIconOnly
              disableRipple
              disableAnimation
              variant="solid"
              onClick={handleSend}
              isDisabled={loading}
            >
              <SendIcon color="primary" />
            </Button>
          </div>
        </div>
      </div>
      <div id="opsi-input" className="mt-8">
        <div className="flex flex-col sm:flex-row justify-center w-full gap-2">
          <div className="grid grid-cols-2 gap-2 justify-between items-center">
            <Button
              onClick={handleReset}
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
