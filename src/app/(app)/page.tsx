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
  Divider,
} from "@nextui-org/react";
import SendIcon from "@mui/icons-material/Send";
import { useRef, useState, useEffect } from "react";
import { checkApiStatus, chatResponse } from "@/services/apiVirtualAssistant";
import encodeComplexData from "@/services/encodeData";
import decodeComplexData from "@/services/decodeData";
import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import PopUpAI from "@/components/PopUpAI";

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

  const exampleQuestions = [
    "Apa saja fasilitas kampus undiksha?",
    "Dimana lokasi kampus Undiksha?",
    "Saya lupa password SSO Undiksha.",
    "Saya ingin cek kelulusan pendaftaran.",
    "Cara akses melihat KTM.",
  ];

  const handleSendDirect = async (questionText: string) => {
    if (!questionText.trim()) return;

    const newUserMessage = { user: questionText, bot: "", timestamp: "" };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    const response = await chatResponse(questionText);
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
        className="mt-8 bg-white p-4 sm:p-8 rounded-xl container max-w-screen-lg 2xl:max-w-screen-xl"
      >
        <div
          id="conversation"
          ref={chatContainerRef}
          className="flex flex-col gap-6 max-h-[428px] overflow-y-auto"
        >
          {welcomeVisible && (
            <>
              <div className="flex flex-row gap-2 sm:justify-center items-center overflow-x-auto">
                {exampleQuestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (!loading) handleSendDirect(item);
                    }}
                    className="bg-emerald-500 text-white rounded-lg p-4 text-sm sm:text-base hover:bg-emerald-600 cursor-pointer transition-all ease-in-out"
                  >
                    <p className="sm:whitespace-normal whitespace-nowrap">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              <Divider className="my-2" />
              <div id="shavira" className="flex flex-col gap-2 mb-2">
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
            </>
          )}
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <div
                id="user"
                className="flex flex-col gap-2 justify-end items-end"
              >
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
                <div className="justify-end ml-10 sm:ml-auto sm:mr-10 mr-2 max-w-fit sm:max-w-[700px]">
                  <div className="bg-slate-200 rounded-xl p-3 text-sm sm:text-base">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.user.replace(/\\n/g, "\n")}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
              <div
                id="shavira"
                className="flex flex-col gap-2 justify-start items-start"
              >
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
                <div className="flex justify-start ml-2 sm:ml-10 mr-10 sm:mr-auto text-left sm:max-w-[700px]">
                  {loading && index === messages.length - 1 ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <p className="text-sm sm:text-base">
                        Shavira sedang berpikir...
                      </p>
                    </div>
                  ) : (
                    <div className="bg-blue-200 rounded-xl p-3 text-sm sm:text-base break-words max-w-full">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          a: ({ href, children }) => {
                            if (
                              href &&
                              href.startsWith(
                                "https://aka.undiksha.ac.id/api/ktm/generate"
                              )
                            ) {
                              return (
                                <>
                                  {/* Link teks */}
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {children}
                                  </a>

                                  {/* Container gambar */}
                                  <div className="relative inline-block mt-2">
                                    {/* Gambar */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={href}
                                      alt="Preview KTM"
                                      className="rounded-lg border border-gray-300"
                                    />

                                    {/* Tombol download */}
                                    {/* <a
                                      href={href}
                                      download="KTM_Generate.png"
                                      className="absolute bottom-1 left-1 bg-slate-400 text-white text-xs px-2 py-1 rounded-md hover:bg-slate-500"
                                    >
                                      Unduh
                                    </a> */}
                                  </div>
                                </>
                              );
                            }

                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline inline"
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {msg.bot.replace(/\\n/g, "\n")}
                      </ReactMarkdown>
                    </div>
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

      <PopUpAI />

      <div id="opsi-input" className="mt-8">
        <div className="flex flex-col sm:flex-row justify-center w-full gap-2">
          <Button
            isDisabled={loading}
            onClick={handleReset}
            radius="md"
            className="bg-gradient-to-tr from-[#d79127] to-[#2aa9e0] text-white shadow-lg py-6 sm:py-8"
          >
            Mulai Ulang Percakapan
          </Button>
          <Button
            isDisabled={loading}
            radius="md"
            className="bg-gradient-to-tr from-[#2aa9e0] to-[#d79127] text-white shadow-lg py-8"
          >
            <a href="https://missu.undiksha.ac.id/" className="flex flex-col">
              <p>Saya tidak mendapat jawaban sesuai (Buat Ticket)</p>
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
