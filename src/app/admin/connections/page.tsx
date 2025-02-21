"use client";
import { useState, useEffect, useCallback } from "react";
import { Input, Image } from "@nextui-org/react";
import GoBackHome from "@/components/GoBackHome";
import GoBackAdmin from "@/components/GoBackAdmin";
import AccessChecker from "@/components/AccessChecker";
import LoadingIcon from "@/assets/gif/Rolling@1x-1.0s-200px-200px.gif";
import { db, doc, getDoc, setDoc, serverTimestamp } from "@/services/firebase";

export default function ConfigurationConnections() {
  const [apiBaseUrlOpenai, setApiBaseUrlOpenai] = useState("");
  const [apiKeyOpenai, setApiKeyOpenai] = useState("");
  const [updatedAtOpenai, setUpdatedAtOpenai] = useState<string | null>(null);
  const [initialApiBaseUrlOpenai, setInitialApiBaseUrlOpenai] = useState("");
  const [initialApiKeyOpenai, setInitialApiKeyOpenai] = useState("");

  const [apiBaseUrlOllama, setApiBaseUrlOllama] = useState("");
  const [apiKeyOllama, setApiKeyOllama] = useState("");
  const [updatedAtOllama, setUpdatedAtOllama] = useState<string | null>(null);
  const [initialApiBaseUrlOllama, setInitialApiBaseUrlOllama] = useState("");
  const [initialApiKeyOllama, setInitialApiKeyOllama] = useState("");

  const [isLoadingOpenai, setIsLoadingOpenai] = useState(false);
  const [isLoadingOllama, setIsLoadingOllama] = useState(false);
  const [isValidKey, setIsValidKey] = useState<boolean>(false);

  // Fungsi untuk format tanggal
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Fungsi untuk mengambil data openai dari Firestore
  const fetchConnOpenai = useCallback(async () => {
    setIsLoadingOpenai(true);
    try {
      const docRef = doc(db, "settings", "connection_openai");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setApiBaseUrlOpenai(data.api_baseurl || "");
        setApiKeyOpenai(data.api_key || "");
        setInitialApiBaseUrlOpenai(data.api_baseurl || "");
        setInitialApiKeyOpenai(data.api_key || "");
        setUpdatedAtOpenai(
          data.updated_at?.toDate ? formatDate(data.updated_at.toDate()) : "-"
        );
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      alert("Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoadingOpenai(false);
    }
  }, []);

  // Fungsi untuk mengambil data ollama dari Firestore
  const fetchConnOllama = useCallback(async () => {
    setIsLoadingOllama(true);
    try {
      const docRef = doc(db, "settings", "connection_ollama");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setApiBaseUrlOllama(data.api_baseurl || "");
        setApiKeyOllama(data.api_key || "");
        setInitialApiBaseUrlOllama(data.api_baseurl || "");
        setInitialApiKeyOllama(data.api_key || "");
        setUpdatedAtOllama(
          data.updated_at?.toDate ? formatDate(data.updated_at.toDate()) : "-"
        );
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      alert("Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoadingOllama(false);
    }
  }, []);

  useEffect(() => {
    fetchConnOpenai();
    fetchConnOllama();
  }, [fetchConnOpenai, fetchConnOllama]);

  // Fungsi untuk menyimpan data openai ke Firestore
  const handleSaveOpenai = async () => {
    setIsLoadingOpenai(true);
    try {
      await setDoc(doc(db, "settings", "connection_openai"), {
        api_baseurl: apiBaseUrlOpenai,
        api_key: apiKeyOpenai,
        updated_at: serverTimestamp(),
      });
      setUpdatedAtOpenai(formatDate(new Date()));
      alert("Konfigurasi API OpenAI berhasil disimpan!");
      fetchConnOpenai();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoadingOpenai(false);
    }
  };

  // Fungsi untuk menyimpan data openai ke Firestore
  const handleSaveOllama = async () => {
    setIsLoadingOllama(true);
    try {
      await setDoc(doc(db, "settings", "connection_ollama"), {
        api_baseurl: apiBaseUrlOllama,
        api_key: apiKeyOllama,
        updated_at: serverTimestamp(),
      });
      setUpdatedAtOllama(formatDate(new Date()));
      alert("Konfigurasi API Ollama berhasil disimpan!");
      fetchConnOllama();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoadingOllama(false);
    }
  };

  const isSaveOpenaiDisabled =
    apiBaseUrlOpenai === initialApiBaseUrlOpenai &&
    apiKeyOpenai === initialApiKeyOpenai;

  const isSaveOllamaDisabled =
    apiBaseUrlOllama === initialApiBaseUrlOllama &&
    apiKeyOllama === initialApiKeyOllama;

  const handleAccessChecked = (valid: boolean) => {
    setIsValidKey(valid);
  };
  if (!isValidKey) {
    return <AccessChecker onAccessChecked={handleAccessChecked} />;
  }

  return (
    <main className="flex flex-col items-center justify-center p-4 pt-6 mx-auto max-w-screen-lg 2xl:max-w-screen-2xl">
      <div id="info-bot" className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">
          Konfigurasi Koneksi
        </h1>
      </div>
      <div className="pt-6 w-full flex flex-col gap-6">
        <div className="flex flex-wrap items-center bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col pt-1 pb-1">
            <p className="font-semibold text-base sm:text-lg">OpenAI API</p>
            <p className="font-normal text-xs sm:text-sm pb-4">
              Menyetel koneksi API berikut diperlukan untuk dapat memuat dan
              menggunakan model dari platform OpenAI.
            </p>
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center items-center">
            <Input
              type="text"
              label="API Base URL"
              value={apiBaseUrlOpenai || ""}
              onChange={(e) => setApiBaseUrlOpenai(e.target.value)}
            />
            <Input
              type="text"
              label="API Key"
              value={apiKeyOpenai || ""}
              onChange={(e) => setApiKeyOpenai(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <button
              onClick={handleSaveOpenai}
              disabled={isSaveOpenaiDisabled || isLoadingOpenai}
              className={`text-white font-semibold px-4 py-3 rounded-xl text-sm flex justify-center items-center gap-1 transition-all ease-in-out 
    ${
      isSaveOpenaiDisabled || isLoadingOpenai
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-400"
    }`}
            >
              {isLoadingOpenai ? (
                <Image
                  width={20}
                  height={20}
                  src={LoadingIcon.src}
                  alt={"Loading"}
                />
              ) : (
                ""
              )}
              {isLoadingOpenai ? "Memproses" : "Simpan"}
            </button>
            <p className="text-xs italic pb-2 pt-2">
              Terakhir diubah: {updatedAtOpenai + " WITA" || "-"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col pt-1 pb-1">
            <p className="font-semibold text-base sm:text-lg">Ollama API</p>
            <p className="font-normal text-xs sm:text-sm pb-4">
              Menyetel koneksi API berikut diperlukan untuk dapat memuat dan
              menggunakan model dari platform Ollama.
            </p>
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center items-center">
            <Input
              type="text"
              label="API Base URL"
              value={apiBaseUrlOllama || ""}
              onChange={(e) => setApiBaseUrlOllama(e.target.value)}
            />
            <Input
              type="text"
              label="API Key"
              placeholder="Default Empty"
              value={apiKeyOllama || ""}
              onChange={(e) => setApiKeyOllama(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <button
              onClick={handleSaveOllama}
              disabled={isSaveOllamaDisabled || isLoadingOllama}
              className={`text-white font-semibold px-4 py-3 rounded-xl text-sm flex justify-center items-center gap-1 transition-all ease-in-out 
    ${
      isSaveOllamaDisabled || isLoadingOllama
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-400"
    }`}
            >
              {isLoadingOllama ? (
                <Image
                  width={20}
                  height={20}
                  src={LoadingIcon.src}
                  alt={"Loading"}
                />
              ) : (
                ""
              )}
              {isLoadingOllama ? "Memproses" : "Simpan"}
            </button>
            <p className="text-xs italic pb-2 pt-2">
              Terakhir diubah: {updatedAtOllama + " WITA" || "-"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-6 justify-center items-center">
        <GoBackAdmin />
        <GoBackHome />
      </div>
    </main>
  );
}
