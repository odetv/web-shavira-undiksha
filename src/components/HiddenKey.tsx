import { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";
import { hashKey } from "@/components/HashKey";
import Link from "next/link";

const ShaviraButton = () => {
  const targetKey = `${process.env.NEXT_PUBLIC_VA_ADMIN_KEY}`;
  const urlAdmin = "/admin";
  const clickCountMouse = 3;
  const clickThreshold = 500;
  const countDownModal = 10;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef<number>(0);
  const lastClickTime = useRef<number>(0);

  const validateAndRedirect = async () => {
    const hashedInputKey = await hashKey(inputKey);
    if (hashedInputKey === (await hashKey(targetKey))) {
      sessionStorage.setItem("adminKey", hashedInputKey);
      window.location.href = urlAdmin;
    } else {
      setErrorMessage("Key yang dimasukkan salah!");
    }
  };

  const handleMouseClick = useCallback(async () => {
    const now = Date.now();
    if (now - lastClickTime.current > clickThreshold) {
      clickCount.current = 1;
    } else {
      clickCount.current += 1;
    }
    lastClickTime.current = now;
    if (clickCount.current === clickCountMouse) {
      const storedHash = sessionStorage.getItem("adminKey");
      if (storedHash) {
        const targetKeyHash = await hashKey(targetKey);
        if (storedHash === targetKeyHash) {
          setShowCountdown(true);
          setCountdown(countDownModal);
        }
      }
      setShowModal(true);
      clickCount.current = 0;
    }
  }, [targetKey]);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseClick);
    return () => {
      window.removeEventListener("mousedown", handleMouseClick);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [handleMouseClick]);

  useEffect(() => {
    if (!showCountdown || !showModal) return;
    intervalRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalRef.current!);
          window.location.href = urlAdmin;
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [showCountdown, showModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputKey(e.target.value);
    setErrorMessage("");
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const hashedInputKey = await hashKey(inputKey);
      if (hashedInputKey === (await hashKey(targetKey))) {
        sessionStorage.setItem("adminKey", hashedInputKey);
        setErrorMessage("");
        window.location.href = urlAdmin;
      } else {
        setErrorMessage("Key yang dimasukkan salah!");
      }
    }
  };

  const handleLoginAgain = () => {
    sessionStorage.removeItem("adminKey");
    setShowModal(true);
    setShowCountdown(false);
    setCountdown(countDownModal);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div>
      <Modal
        backdrop="opaque"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setShowCountdown(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }}
        placement="center"
        size="xl"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/50 backdrop-opacity-20",
        }}
      >
        <ModalContent className="m-4 p-1">
          <div className="flex flex-col justify-center items-center p-1 pt-3">
            <ModalBody>
              {showCountdown ? (
                <div className="text-center">
                  <p className="text-sm sm:text-base pb-2">
                    Anda sudah login sebelumnya, akan diarahkan otomatis ke
                    admin panel dalam {countdown} detik.
                  </p>
                  <div className="flex flex-row gap-2 justify-center items-center -mb-5">
                    <button
                      className="font-semibold bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 cursor-pointer transition-all ease-in-out"
                      onClick={handleLoginAgain}
                    >
                      Reset Session
                    </button>
                    <button className="font-semibold bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 cursor-pointer transition-all ease-in-out">
                      <Link href={urlAdmin}>Admin Panel</Link>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm sm:text-base text-center pb-2">
                    Silahkan masukkan key untuk dapat masuk ke admin panel!
                  </p>
                  <Input
                    type="password"
                    variant="bordered"
                    label="Key"
                    value={inputKey}
                    onChange={handleInputChange}
                    // onKeyDown={handleKeyPress}
                    isInvalid={!!errorMessage}
                    errorMessage={errorMessage}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {!showCountdown && (
                <button
                  className={`text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer transition-all ease-in-out font-semibold ${
                    errorMessage || !inputKey
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                  onClick={validateAndRedirect}
                >
                  Submit
                </button>
              )}
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ShaviraButton;
