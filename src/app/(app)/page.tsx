"use client";
import React from "react";
import Image from "next/image";
import BotLogo from "../../assets/logo/bot.png";
import UserLogo from "../../assets/logo/user.png";
import {
  Textarea,
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import SendIcon from "@mui/icons-material/Send";
import { useRef, useState, useEffect } from "react";
import { checkApiStatus, chatResponse } from "@/services/apiVirtualAssistant";
import encodeComplexData from "@/services/encodeData";
import decodeComplexData from "@/services/decodeData";
import Cookies from "js-cookie";
import PreProcessMarkdown from "@/components/PreProcessMarkdown";
import PopUpAI from "@/components/PopUpAI";
import ShaviraButton from "@/components/HiddenKey";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function Home() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatBotReady, setChatBotReady] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { user: string; bot: string; timestamp: string }[]
  >([]);
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);

  const maxQuestions = 2;

  // Menyimpan kondisi isDisabled dalam variabel
  const isDisabled =
    loading ||
    (questionCount >= maxQuestions && !user) ||
    (role ? role !== "member" && role !== "admin" : false);

  // Debug log untuk memeriksa nilai isDisabled
  console.log("isDisabled:", isDisabled, "role:", role, "user:", user);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const db = getFirestore();
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
            alert("You must be a member to access this service.");
            setUser(currentUser);
            setRole(userData.role);
          }
        } else {
          alert("User data not found.");
          setUser(null);
          setRole(null); // Reset role if user data doesn't exist
        }
      } else {
        setUser(null);
        setRole(null); // Reset role if no user is logged in
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setQuestionCount(0);
    } else {
      const savedCount = localStorage.getItem("questionCount");
      if (savedCount) {
        setQuestionCount(Number(savedCount));
      }
    }
  }, [user]);

  useEffect(() => {
    if (questionCount > 0) {
      localStorage.setItem("questionCount", String(questionCount));
    }
  }, [questionCount]);

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

    if (questionCount >= maxQuestions && !user) {
      alert("You have reached the maximum number of questions.");
      return;
    }

    const newUserMessage = { user: question, bot: "", timestamp: "" };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setWelcomeVisible(false);
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
    setQuestionCount((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem("questionCount", String(newCount));
      return newCount;
    });
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

  const handleSendDirect = async (questionText: string) => {
    if (
      (questionCount >= maxQuestions && !user) ||
      (role ? role !== "member" && role !== "admin" : false)
    ) {
      alert("You have reached the maximum number of questions.");
      return;
    }

    setWelcomeVisible(false);
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
    setQuestionCount((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem("questionCount", String(newCount));
      return newCount;
    });
  };

  return (
    <main
      className={`flex flex-col items-center p-4 smooth-gradient min-h-screen pt-8
        ${welcomeVisible ? "justify-center" : ""}`}
    >
      <PopUpAI />
      <ShaviraButton />

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
          <Dropdown backdrop="opaque" isDisabled={loading} placement="top">
            <DropdownTrigger>
              <button>
                <MoreVertIcon
                  color="primary"
                  className="cursor-pointer hover:text-blue-400"
                />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="opsi-input">
              <DropdownItem
                key="ticket"
                className="bg-slate-200 mb-1"
                textValue="ticket"
              >
                <Button
                  color="secondary"
                  startContent={<ConfirmationNumberIcon />}
                  variant="light"
                  fullWidth
                  className="font-semibold"
                >
                  <a
                    href="https://missu.undiksha.ac.id/"
                    className="flex flex-col text-wrap text-center"
                  >
                    Buat Ticket
                  </a>
                </Button>
              </DropdownItem>
              <DropdownItem
                key="reset"
                className="bg-slate-200"
                textValue="reset"
              >
                <Button
                  color="secondary"
                  startContent={<RestartAltIcon />}
                  onClick={handleReset}
                  variant="light"
                  fullWidth
                  className="font-semibold"
                >
                  Reset Chat
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
            isDisabled={isDisabled}
          />

          <Button
            isIconOnly
            disableRipple
            disableAnimation
            variant="solid"
            onClick={handleSend}
            isDisabled={isDisabled}
          >
            <SendIcon color="primary" />
          </Button>
        </div>
      </div>
    </main>
  );
}
