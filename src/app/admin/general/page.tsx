"use client";
import { useState, useEffect, useCallback } from "react";
import { Input, Image } from "@nextui-org/react";
import GoBackHome from "@/components/GoBackHome";
import GoBackAdmin from "@/components/GoBackAdmin";
import AccessChecker from "@/components/AccessChecker";
import LoadingIcon from "@/assets/gif/Rolling@1x-1.0s-200px-200px.gif";
import { db, doc, getDoc, setDoc, serverTimestamp } from "@/services/firebase";

export default function ConfigurationGeneral() {
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [initialApiBaseUrl, setInitialApiBaseUrl] = useState("");
  const [initialApiKey, setInitialApiKey] = useState("");

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

  // Fungsi untuk mengambil data dari Firestore
  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setApiBaseUrl(data.api_baseurl || "");
        setApiKey(data.api_key || "");
        setInitialApiBaseUrl(data.api_baseurl || "");
        setInitialApiKey(data.api_key || "");
        setUpdatedAt(
          data.updated_at?.toDate ? formatDate(data.updated_at.toDate()) : "-"
        );
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      alert("Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Fungsi untuk menyimpan data ke Firestore
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await setDoc(doc(db, "settings", "general"), {
        api_baseurl: apiBaseUrl,
        api_key: apiKey,
        updated_at: serverTimestamp(),
      });
      setUpdatedAt(formatDate(new Date()));
      alert("Konfigurasi API Shavira berhasil disimpan!");
      fetchConfig();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const isSaveDisabled =
    apiBaseUrl === initialApiBaseUrl && apiKey === initialApiKey;

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
          Konfigurasi Umum
        </h1>
      </div>
      <div className="pt-6 w-full flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center pb-4">
            <p className="font-semibold sm:text-base pb-4">API Shavira</p>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center items-center">
              <Input
                type="text"
                label="API Base URL"
                value={apiBaseUrl || ""}
                onChange={(e) => setApiBaseUrl(e.target.value)}
              />
              <Input
                type="text"
                label="API Key"
                value={apiKey || ""}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={isSaveDisabled || isLoading}
              className={` text-white font-semibold px-4 py-3 rounded-xl text-sm flex justify-center items-center gap-1 transition-all ease-in-out 
    ${
      isSaveDisabled || isLoading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-400"
    }`}
            >
              {isLoading ? (
                <Image
                  width={20}
                  height={20}
                  src={LoadingIcon.src}
                  alt={"Loading"}
                />
              ) : (
                ""
              )}
              Simpan
            </button>
            <p className="text-xs italic pb-2 pt-2">
              Terakhir diubah: {updatedAt + " WITA" || "-"}
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
