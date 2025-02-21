"use client";
import { useEffect, useState } from "react";
import { Input, Select, SelectItem, Image } from "@nextui-org/react";
import {
  setupConfig,
  setupQuickConfig,
  checkConfig,
  checkOpenAIModels,
  checkOllamaModels,
} from "@/services/apiVirtualAssistant";
import GoBackHome from "@/components/GoBackHome";
import GoBackAdmin from "@/components/GoBackAdmin";
import AccessChecker from "@/components/AccessChecker";
import LoadingIcon from "@/assets/gif/Rolling@1x-1.0s-200px-200px.gif";

export default function ConfigurationModels() {
  const [llm, setLLM] = useState("");
  const [modelLLM, setModelLLM] = useState("");
  const [llmQuick, setLLMQuick] = useState("");
  const [modelLLMQuick, setModelLLMQuick] = useState("");
  const [embedding, setEmbedding] = useState("");
  const [modelEmbedding, setModelEmbedding] = useState("");
  const [chunkSize, setChunkSize] = useState(0);
  const [chunkOverlap, setChunkOverlap] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [totalChunks, setTotalChunks] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [updatedAtQuick, setUpdatedAtQuick] = useState<string | null>(null);
  const [modelsLLM, setModelsLLM] = useState<any[]>([]);
  const [modelsLLMQuick, setModelsLLMQuick] = useState<any[]>([]);
  const [modelsEmbedding, setModelsEmbedding] = useState<any[]>([]);
  const [initialConfig, setInitialConfig] = useState({
    llm: "",
    modelLLM: "",
    embedding: "",
    modelEmbedding: "",
    chunkSize: 0,
    chunkOverlap: 0,
    totalChunks: null,
    updatedAt: null,
  });
  const [initialConfigQuick, setInitialConfigQuick] = useState({
    llmQuick: "",
    modelLLMQuick: "",
  });

  useEffect(() => {
    const fetchModels = async () => {
      if (!llm) {
        setModelLLM("");
        setModelsLLM([]);
        return;
      }
      if (llm === "openai") {
        const models = await checkOpenAIModels();
        setModelsLLM(models);
      } else if (llm === "ollama") {
        const models = await checkOllamaModels();
        setModelsLLM(models);
      }
    };
    fetchModels();
  }, [llm]);

  useEffect(() => {
    const fetchModels = async () => {
      if (!llmQuick) {
        setModelLLMQuick("");
        setModelsLLMQuick([]);
        return;
      }
      if (llmQuick === "openai") {
        const models = await checkOpenAIModels();
        setModelsLLMQuick(models);
      } else if (llmQuick === "ollama") {
        const models = await checkOllamaModels();
        setModelsLLMQuick(models);
      }
    };
    fetchModels();
  }, [llmQuick]);

  useEffect(() => {
    const fetchEmbeddings = async () => {
      if (!embedding) {
        setModelEmbedding("");
        setModelsEmbedding([]);
        return;
      }
      if (embedding === "openai") {
        const models = await checkOpenAIModels();
        setModelsEmbedding(models);
      } else if (embedding === "ollama") {
        const models = await checkOllamaModels();
        setModelsEmbedding(models);
      }
    };
    fetchEmbeddings();
  }, [embedding]);

  const handleSave = async () => {
    setIsLoading(true);

    const data = {
      llm,
      model_llm: modelLLM,
      embedding,
      model_embedding: modelEmbedding,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
    };
    const success = await setupConfig(data);

    if (success) {
      const updatedConfig = await checkConfig();
      setLLM(updatedConfig.llm_platform);
      setModelLLM(updatedConfig.llm_model);
      setEmbedding(updatedConfig.embedding_platform);
      setModelEmbedding(updatedConfig.embedding_model);
      setChunkSize(updatedConfig.chunk_size);
      setChunkOverlap(updatedConfig.chunk_overlap);
      setTotalChunks(updatedConfig.total_chunks);
      setUpdatedAt(updatedConfig.updated_at);
    }

    setIsLoading(false);
  };

  const handleQuickSave = async () => {
    setIsQuickLoading(true);

    const data = {
      llm: llmQuick,
      model_llm: modelLLMQuick,
    };
    const success = await setupQuickConfig(data);

    if (success) {
      const updatedConfig = await checkConfig();
      setLLMQuick(updatedConfig.llm_platform);
      setModelLLMQuick(updatedConfig.llm_model);
      setUpdatedAtQuick(updatedConfig.updated_at);
    }

    setIsQuickLoading(false);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const config = await checkConfig();
        const initialData = {
          llm: config.llm_platform || "",
          modelLLM: config.llm_model || "",
          embedding: config.embedding_platform || "",
          modelEmbedding: config.embedding_model || "",
          chunkSize: config.chunk_size || 0,
          chunkOverlap: config.chunk_overlap || 0,
          totalChunks: config.total_chunks || null,
          updatedAt: config.updated_at || null,
        };

        setLLM(initialData.llm);
        setModelLLM(initialData.modelLLM);
        setEmbedding(initialData.embedding);
        setModelEmbedding(initialData.modelEmbedding);
        setChunkSize(initialData.chunkSize);
        setChunkOverlap(initialData.chunkOverlap);
        setTotalChunks(initialData.totalChunks);
        setUpdatedAt(initialData.updatedAt);

        setInitialConfig(initialData);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
      setIsLoading(false);
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsQuickLoading(true);
      try {
        const config = await checkConfig();
        const initialData = {
          llmQuick: config.llm_platform || "",
          modelLLMQuick: config.llm_model || "",
          updatedAtQuick: config.updated_at || null,
        };

        setLLMQuick(initialData.llmQuick);
        setModelLLMQuick(initialData.modelLLMQuick);
        setUpdatedAtQuick(initialData.updatedAtQuick);

        setInitialConfigQuick(initialData);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
      setIsQuickLoading(false);
    };

    fetchConfig();
  }, []);

  const isSaveDisabled =
    (llm === initialConfig.llm &&
      modelLLM === initialConfig.modelLLM &&
      embedding === initialConfig.embedding &&
      modelEmbedding === initialConfig.modelEmbedding &&
      chunkSize === initialConfig.chunkSize &&
      chunkOverlap === initialConfig.chunkOverlap) ||
    !llm ||
    !modelLLM ||
    !embedding ||
    !modelEmbedding ||
    chunkSize <= 0 ||
    chunkOverlap <= 0;

  const isSaveQuickDisabled =
    (llmQuick === initialConfigQuick.llmQuick &&
      modelLLMQuick === initialConfigQuick.modelLLMQuick) ||
    !llmQuick ||
    !modelLLMQuick;

  const [isValidKey, setIsValidKey] = useState<boolean>(false);
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
          Konfigurasi Model
        </h1>
      </div>
      <div className="pt-6 w-full flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center pb-8">
            <div className="flex flex-col pt-1 pb-1">
              <p className="font-semibold text-base sm:text-lg">
                Konfigurasi Cepat
              </p>
              <p className="font-normal text-xs sm:text-sm pb-4">
                Mengubah konfigurasi ini hanya mengganti model LLM yang
                digunakan dan tidak akan membuat ulang vector database.
              </p>
            </div>
            <div className="flex w-full flex-wrap sm:grid sm:grid-cols-2 sm:grid-rows-1 gap-4 justify-center items-center">
              <Select
                id="quick-llm"
                isRequired
                label="LLM"
                placeholder="Pilih Platform LLM"
                value={llmQuick}
                selectedKeys={new Set([llmQuick])}
                onChange={(e) => setLLMQuick(e.target.value)}
              >
                <SelectItem key={"openai"} value={"openai"}>
                  OpenAI
                </SelectItem>
                <SelectItem key={"ollama"} value={"ollama"}>
                  Ollama
                </SelectItem>
              </Select>
              <Select
                id="quick-model-llm"
                isRequired
                label="Model LLM"
                placeholder="Pilih Model LLM"
                value={
                  modelsLLMQuick.includes(modelLLMQuick) ? modelLLMQuick : ""
                }
                selectedKeys={
                  modelsLLMQuick.includes(modelLLMQuick)
                    ? new Set([modelLLMQuick])
                    : new Set()
                }
                onChange={(e) => setModelLLMQuick(e.target.value)}
              >
                {modelsLLMQuick.map((model, index) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="pt-2">
            <button
              id="quick-save"
              onClick={handleQuickSave}
              disabled={isSaveQuickDisabled || isQuickLoading}
              className={`text-white font-semibold px-4 py-3 rounded-xl text-sm flex justify-center items-center gap-1 transition-all ease-in-out 
    ${
      isSaveQuickDisabled || isQuickLoading
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-400"
    }`}
            >
              {isQuickLoading ? (
                <Image
                  width={20}
                  height={20}
                  src={LoadingIcon.src}
                  alt={"Loading"}
                />
              ) : (
                ""
              )}
              {isQuickLoading ? "Memproses" : "Simpan"}
            </button>
            <p id="quick-updated" className="text-xs italic pt-2">
              Terakhir diubah: {updatedAtQuick + " WITA" || "-"}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center pb-8">
            <div className="flex flex-col pt-1 pb-1">
              <p className="font-semibold text-base sm:text-lg">
                Konfigurasi Lengkap
              </p>
              <p className="font-normal text-xs sm:text-sm pb-4">
                Mengubah konfigurasi ini untuk menyesuaikan semua parameter dan
                membuat ulang vector database setelah proses selesai disimpan.
              </p>
            </div>
            <div className="flex w-full flex-wrap sm:grid sm:grid-cols-3 sm:grid-rows-2 gap-4 justify-center items-center">
              <Select
                isRequired
                label="LLM"
                placeholder="Pilih Platform LLM"
                value={llm}
                selectedKeys={new Set([llm])}
                onChange={(e) => setLLM(e.target.value)}
              >
                <SelectItem key={"openai"} value={"openai"}>
                  OpenAI
                </SelectItem>
                <SelectItem key={"ollama"} value={"ollama"}>
                  Ollama
                </SelectItem>
              </Select>
              <Select
                isRequired
                label="Model LLM"
                placeholder="Pilih Model LLM"
                value={modelsLLM.includes(modelLLM) ? modelLLM : ""}
                selectedKeys={
                  modelsLLM.includes(modelLLM) ? new Set([modelLLM]) : new Set()
                }
                onChange={(e) => setModelLLM(e.target.value)}
              >
                {modelsLLM.map((model, index) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </Select>
              <Select
                isRequired
                label="Embedding"
                placeholder="Pilih Platform Embedding"
                value={embedding}
                selectedKeys={new Set([embedding])}
                onChange={(e) => setEmbedding(e.target.value)}
              >
                <SelectItem key={"openai"} value={"openai"}>
                  OpenAI
                </SelectItem>
                <SelectItem key={"ollama"} value={"ollama"}>
                  Ollama
                </SelectItem>
              </Select>
              <Select
                isRequired
                label="Model Embedding"
                placeholder="Pilih Model Embedding"
                value={
                  modelsEmbedding.includes(modelEmbedding) ? modelEmbedding : ""
                }
                selectedKeys={
                  modelsEmbedding.includes(modelEmbedding)
                    ? new Set([modelEmbedding])
                    : new Set()
                }
                onChange={(e) => setModelEmbedding(e.target.value)}
              >
                {modelsEmbedding.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </Select>
              <Input
                min={0}
                type="number"
                label="Chunk Size"
                placeholder="Cth: 1000"
                value={chunkSize ? String(chunkSize) : undefined}
                onChange={(e) => setChunkSize(Number(e.target.value))}
              />
              <Input
                min={0}
                type="number"
                label="Chunk Overlap"
                placeholder="Cth: 200"
                value={chunkOverlap ? String(chunkOverlap) : undefined}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
              />
            </div>
            <p className="text-xs italic pt-4">
              Total Chunk: {totalChunks !== null ? totalChunks : "-"}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={isSaveDisabled || isLoading}
              className={`text-white font-semibold px-4 py-3 rounded-xl text-sm flex justify-center items-center gap-1 transition-all ease-in-out 
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
              {isLoading ? "Memproses" : "Simpan"}
            </button>
            <p className="text-xs italic pt-2">
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
