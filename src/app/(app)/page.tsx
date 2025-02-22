"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Textarea,
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";
import BotLogo from "@/assets/logo/bot.png";
import UserLogo from "@/assets/logo/user.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SendIcon from "@mui/icons-material/Send";
import {
  apiShaviraStatus,
  chatConversation,
} from "@/services/apiVirtualAssistant";
import encodeComplexData from "@/services/encodeData";
import decodeComplexData from "@/services/decodeData";
import PreProcessMarkdown from "@/components/PreProcessMarkdown";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import PopUpAI from "@/components/PopUpAI";
import Cookies from "js-cookie";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

export default function Home() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatBotReady, setChatBotReady] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { user: string; bot: string; timestamp: string }[]
  >([]);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isOpenDeniedAccessAI, setOpenDeniedAccessAI] = useState(false);
  const [
    isOpenDeniedAccessAIUserNotLogged,
    setOpenDeniedAccessAIUserNotLogged,
  ] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const [streamedBotMessage, setStreamedBotMessage] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Memastikan dropdownRef ada dan event tidak terjadi di dalamnya
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Menambahkan event listener untuk mouse dan touch
    document.addEventListener("mousedown", handleClickOutside); // Untuk perangkat mouse
    document.addEventListener("touchstart", handleClickOutside); // Untuk perangkat touchscreen

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const isDisabledChat =
    loading || !user || (role ? role !== "member" && role !== "admin" : false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (
            userData &&
            (userData.role === "member" || userData.role === "admin")
          ) {
            setUser(currentUser);
            setRole(userData.role); // Set role after fetching it from Firestore
          } else {
            setOpenDeniedAccessAI(true);
            setUser(currentUser);
            setRole(userData.role);
          }
        } else {
          setUser(null);
          setRole(null); // Reset role if user data doesn't exist
        }
      } else {
        // setOpenDeniedAccessAIUserNotLogged(true);
        setUser(null);
        setRole(null); // Reset role if no user is logged in
      }
    });
    return () => unsubscribe();
  }, []);

  const closeUserDeniedAccessAI = () => setOpenDeniedAccessAI(false);
  const closeUserDeniedAccessAIUserNotLogged = () =>
    setOpenDeniedAccessAIUserNotLogged(false);

  useEffect(() => {
    const fetchApiStatus = async () => {
      const isReady = await apiShaviraStatus();
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

  // const handleSend = async () => {
  //   if (!question.trim()) return;

  //   if (!user || (role ? role !== "member" && role !== "admin" : false)) {
  //     alert("Please login member account.");
  //     return;
  //   }

  //   const newUserMessage = { user: question, bot: "", timestamp: "" };
  //   setMessages((prev) => [...prev, newUserMessage]);
  //   setLoading(true);
  //   setWelcomeVisible(false);
  //   setQuestion("");

  //   const response = await chatResponse(question);
  //   if (response && response.success && response.data.length > 0) {
  //     const { timestamp, question: q, answer } = response.data[0];
  //     const newBotMessage = { user: q, bot: answer, timestamp };
  //     const updatedMessages = [...messages, newBotMessage];
  //     setMessages(updatedMessages);
  //     Cookies.set("botUser", encodeComplexData(updatedMessages), {
  //       expires: 7,
  //     });
  //   }

  //   setLoading(false);
  // };

  const handleSend = async () => {
    if (!question.trim()) return;

    if (!user || (role ? role !== "member" && role !== "admin" : false)) {
      alert("Please login member account.");
      return;
    }

    const newUserMessage = { user: question, bot: "", timestamp: "" };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setWelcomeVisible(false);
    setQuestion("");

    const response = await chatConversation(question);
    if (response && response.success && response.data.length > 0) {
      const { timestamp, question: q, answer } = response.data[0];

      let currentText = "";
      const botMessageIndex = messages.length;
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[botMessageIndex] = { user: q, bot: "", timestamp };
        return updatedMessages;
      });

      answer.split(" ").forEach((word: any, index: any) => {
        setTimeout(() => {
          currentText += (index === 0 ? "" : " ") + word;
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[botMessageIndex] = {
              ...updatedMessages[botMessageIndex],
              bot: currentText,
            };
            return updatedMessages;
          });
        }, index * 25); // ms
      });

      setTimeout(() => {
        Cookies.set("botUser", encodeComplexData([...messages]), {
          expires: 7,
        });
      }, answer.split(" ").length * 0);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLTextAreaElement;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      setWelcomeVisible(false);
    }
  };

  const handleReset = () => {
    setIsDropdownOpen(false);
    setMessages([]);
    Cookies.remove("botUser");
    setWelcomeVisible(true);
  };

  const exampleQuestions = [
    "Apa saja fasilitas kampus undiksha?",
    "Berita undiksha terbaru hari ini",
    "Saya lupa password SSO Undiksha",
    "Saya ingin cek kelulusan pendaftaran",
    "Cara akses melihat KTM",
  ];

  // const handleSendDirect = async (questionText: string) => {
  //   if (!user || (role ? role !== "member" && role !== "admin" : false)) {
  //     alert("Please login member account.");
  //     return;
  //   }

  //   setWelcomeVisible(false);
  //   if (!questionText.trim()) return;

  //   const newUserMessage = { user: questionText, bot: "", timestamp: "" };
  //   setMessages((prev) => [...prev, newUserMessage]);
  //   setLoading(true);

  //   const response = await chatConversation(questionText);
  //   if (response && response.success && response.data.length > 0) {
  //     const { timestamp, question: q, answer } = response.data[0];
  //     const newBotMessage = { user: q, bot: answer, timestamp };
  //     const updatedMessages = [...messages, newBotMessage];
  //     setMessages(updatedMessages);
  //     Cookies.set("botUser", encodeComplexData(updatedMessages), {
  //       expires: 7,
  //     });
  //   }

  //   setLoading(false);
  // };

  const handleSendDirect = async (questionText: string) => {
    if (!user || (role ? role !== "member" && role !== "admin" : false)) {
      alert("Please login member account.");
      return;
    }

    setWelcomeVisible(false);
    if (!questionText.trim()) return;

    const newUserMessage = { user: questionText, bot: "", timestamp: "" };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    const response = await chatConversation(questionText);
    if (response && response.success && response.data.length > 0) {
      const { timestamp, question: q, answer } = response.data[0];

      let currentText = "";
      const botMessageIndex = messages.length;

      // Inisialisasi pesan bot
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[botMessageIndex] = { user: q, bot: "", timestamp };
        return updatedMessages;
      });

      answer.split(" ").forEach((word: any, index: any) => {
        setTimeout(() => {
          currentText += (index === 0 ? "" : " ") + word;
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[botMessageIndex] = {
              ...updatedMessages[botMessageIndex],
              bot: currentText,
            };
            return updatedMessages;
          });
        }, index * 25);
      });

      // Simpan ke cookies setelah teks selesai
      setTimeout(() => {
        Cookies.set("botUser", encodeComplexData([...messages]), {
          expires: 7,
        });
      }, answer.split(" ").length * 0);
    }

    setLoading(false);
  };

  return (
    <main
      className={`flex flex-col items-center p-4 smooth-gradient min-h-screen pt-8 
        ${welcomeVisible ? "justify-center" : ""}`}
    >
      <PopUpAI />

      <div
        id="info-bot"
        className={`text-center text-white tracking-wide text-3xl sm:text-5xl 
          ${welcomeVisible ? "sm:-mt-20 -mt-32" : ""}`}
      >
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">Shavira</h1>
        <p className="text-sm sm:text-xl">Undiksha Virtual Assistant</p>
        <div className="mt-4 flex flex-row gap-2 items-center justify-center">
          <Chip color="warning" className="uppercase" variant="solid">
            <p className="font-bold text-xs sm:text-sm text-slate-800">
              Eksperimen
            </p>
          </Chip>
          <Chip
            color={chatBotReady ? "success" : "danger"}
            className="uppercase"
            variant="dot"
          >
            <p className="font-bold text-white text-xs sm:text-sm">
              {chatBotReady ? "Online" : "Offline"}
            </p>
          </Chip>
        </div>
      </div>

      <div
        id="workspace-chat"
        className={`mt-8 container max-w-screen-lg 2xl:max-w-screen-2xl
        ${welcomeVisible ? "" : "mb-20"}`}
      >
        <div className="bg-white p-4 sm:p-8 rounded-2xl">
          <div
            id="conversation"
            ref={chatContainerRef}
            className="flex flex-col gap-4 min-h-[186px] max-h-[528px] overflow-y-auto no-scrollbar scroll-smooth"
          >
            <div className="flex flex-col gap-2 sm:gap-4">
              <div className="relative">
                <div className="snap-x flex flex-row gap-2 sm:justify-center items-center overflow-x-auto no-scrollbar relative group">
                  {exampleQuestions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (!loading) handleSendDirect(item);
                      }}
                      className="snap-center bg-emerald-500 text-white rounded-lg p-4 text-sm sm:text-base hover:bg-emerald-600 cursor-pointer transition-all ease-in-out"
                    >
                      <p className="sm:whitespace-normal whitespace-nowrap">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="absolute top-0 right-0 h-full w-12 pointer-events-none bg-gradient-to-l from-black/30 sm:hidden"></div>
              </div>

              <Divider className="my-2" />
              {welcomeVisible && (
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
                    <div className="bg-slate-200 rounded-xl p-3 text-sm sm:text-base">
                      {PreProcessMarkdown("**Salam Harmoni🙏**")}
                      Aku Shavira, ada yang bisa dibantu?
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                  <div className="justify-end ml-10 sm:ml-auto sm:mr-10 mr-2 sm:max-w-[65%] max-w-[85%]">
                    <div className="bg-slate-200 rounded-xl p-4 text-sm sm:text-base break-words max-w-full">
                      {PreProcessMarkdown(msg.user)}
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
                  <div className="flex justify-start ml-2 sm:ml-10 mr-10 sm:mr-auto text-left sm:max-w-[65%] max-w-[85%]">
                    {loading && index === messages.length - 1 ? (
                      <div className="pt-2 pb-2 ml-8 sm:ml-0">
                        <span className="relative flex h-5 w-5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500"></span>
                        </span>
                      </div>
                    ) : (
                      <div className="bg-blue-200 rounded-xl p-4 text-sm sm:text-base break-words max-w-full">
                        {PreProcessMarkdown(msg.bot)}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div
        id="input"
        className={`bg-white p-4 rounded-2xl mt-4 max-w-screen-lg 2xl:max-w-screen-2xl
          ${
            welcomeVisible
              ? "container"
              : "fixed bottom-4 left-0 right-0 mx-4 sm:mx-auto shadow-black shadow-2xl drop-shadow-2xl"
          }`}
      >
        <div className="flex flex-row justify-between items-center gap-2">
          {/* Tombol Tiga Titik Dropdown */}

          <div className="relative inline-block text-left " ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              disabled={loading}
              className="cursor-pointer hover:text-blue-400"
            >
              <MoreVertIcon color="primary" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="absolute bottom-10 left-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-2xl z-10 transform transition-all duration-300 ease-out opacity-0 scale-70"
                  style={{
                    transform: isDropdownOpen ? "scale(1)" : "scale(0.95)",
                    opacity: isDropdownOpen ? 1 : 0,
                  }}
                >
                  <div className="p-2 flex flex-col gap-1">
                    <a
                      href="https://missu.undiksha.ac.id/"
                      className="block"
                      onClick={() => toggleDropdown()}
                    >
                      <div className="flex justify-center rounded-lg items-center gap-2 py-2 text-blue-500 font-semibold hover:bg-blue-50 bg-blue-100 transition-all ease-in-out">
                        <ConfirmationNumberIcon />
                        Buat Tiket
                      </div>
                    </a>
                    <button
                      onClick={handleReset}
                      className="w-full flex justify-center items-center"
                    >
                      <div className="w-full flex justify-center rounded-lg items-center gap-2 py-2 px-4 text-blue-500 font-semibold hover:bg-blue-50 bg-blue-100 transition-all ease-in-out">
                        <RestartAltIcon />
                        Reset Chat
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Textarea
            minRows={1}
            placeholder="Kirim pesan ke Shavira"
            type="text"
            variant="faded"
            label=""
            color="default"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            isDisabled={isDisabledChat}
          />

          <button
            className={`text-white font-semibold p-2 rounded-xl text-sm flex justify-center items-center gap-1 cursor-pointer transition-all ease-in-out ${
              isDisabledChat ? "bg-gray-100" : "bg-gray-300"
            }`}
            onClick={handleSend}
            disabled={isDisabledChat}
          >
            <SendIcon
              className={isDisabledChat ? "text-blue-300" : "text-blue-500"}
            />
          </button>
        </div>
      </div>

      <Modal
        backdrop="blur"
        isOpen={isOpenDeniedAccessAI}
        placement="center"
        hideCloseButton
        size="sm"
        className="m-8"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex justify-center">
              Info Akses Shavira
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-center">
                Maaf, anda belum memiliki akses ke Shavira. Silahkan tunggu
                administrator untuk memberikan akses.
              </p>
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button onPress={closeUserDeniedAccessAI} color="primary">
                OK
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      <Modal
        backdrop="blur"
        isOpen={isOpenDeniedAccessAIUserNotLogged}
        placement="center"
        hideCloseButton
        size="sm"
        className="m-8"
      >
        <ModalContent>
          <>
            <ModalHeader className="flex justify-center">
              Info Akses Shavira
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-center">
                Maaf, anda belum memiliki akses ke Shavira. Silahkan masuk atau
                daftar akun terlebih dahulu.
              </p>
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button
                onPress={closeUserDeniedAccessAIUserNotLogged}
                color="primary"
              >
                OK
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </main>
  );
}
