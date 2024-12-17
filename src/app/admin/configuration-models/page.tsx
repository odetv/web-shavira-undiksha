"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Button,
  Image
} from "@nextui-org/react";
import { setupConfig, checkConfig } from "@/services/apiVirtualAssistant";
import GoBackHome from "@/components/GoBackHome";
import GoBackAdmin from "@/components/GoBackAdmin";
import AccessChecker from "@/components/AccessChecker";
import LoadingIcon from "@/assets/gif/Rolling@1x-1.0s-200px-200px (1).gif"

export default function ConfigurationModels() {
  const [lastConfig, setLastConfig] = useState<any>(null);
  const [llm, setLLM] = useState("");
  const [modelLLM, setModelLLM] = useState("");
  const [embedder, setEmbedder] = useState("");
  const [modelEmbedder, setModelEmbedder] = useState("");
  const [chunkSize, setChunkSize] = useState(0);
  const [chunkOverlap, setChunkOverlap] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCheckConfig = async () => {
      const config = await checkConfig();
      if (config) {
        setLastConfig(config);
      }
    };
    fetchCheckConfig();
  }, []);

  const handleSetupConfig = async () => {
    setIsLoading(true);
    const configData = {
      llm: llm,
      model_llm: modelLLM,
      embedder: embedder,
      model_embedder: modelEmbedder,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
    };

    const success = await setupConfig(configData);
    setIsLoading(false);

    if (success) {
      console.log("Configuration updated successfully!");
      const updatedConfig = await checkConfig();
      setLastConfig(updatedConfig);
    } else {
      console.error("Failed to update configuration.");
    }
  };

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
        <div
          id="update-config"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap justify-center items-center"
        >
          <p className="text-center font-semibold sm:text-base pb-4">
            Perbarui Konfigurasi
          </p>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center items-center">
            <Select
              isRequired
              label="LLM"
              placeholder="Pilih platform LLM"
              value={llm}
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
              value={modelLLM}
              onChange={(e) => setModelLLM(e.target.value)}
            >
              {(llm === "openai"
                ? ["gpt-4o-mini", "gpt-4o"]
                : llm === "ollama"
                ? ["gemma2", "llama3.1"]
                : []
              ).map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </Select>
            <Select
              isRequired
              label="Embedder"
              placeholder="Pilih Platform Embedder"
              value={embedder}
              onChange={(e) => setEmbedder(e.target.value)}
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
              label="Model Embedder"
              placeholder="Pilih Model Embedder"
              value={modelEmbedder}
              onChange={(e) => setModelEmbedder(e.target.value)}
            >
              {(embedder === "openai"
                ? ["text-embedding-3-large", "text-embedding-3-small"]
                : embedder === "ollama"
                ? ["mxbai-embed-large", "bge-m3"]
                : []
              ).map((model) => (
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
          <div className="pt-4">
            <button className={`text-white font-semibold px-5 py-3 rounded-xl text-base flex justify-center items-center gap-1 cursor-pointer transition-all ease-in-out 
            ${ llm === "" ||
              modelLLM === "" ||
              embedder === "" ||
              modelEmbedder === "" ||
              chunkSize === 0 ||
              chunkOverlap === 0 ||
              isLoading
             ? "bg-blue-300" : "bg-blue-500"}`} 
              onClick={handleSetupConfig}
              disabled={
                llm === "" ||
                modelLLM === "" ||
                embedder === "" ||
                modelEmbedder === "" ||
                chunkSize === 0 ||
                chunkOverlap === 0 ||
                isLoading
              }
            >
              {isLoading ? (
                <Image width={20} height={20} src={LoadingIcon.src} alt={"Loading"} />
                ) : (
                  ""
                )}
              Perbarui
            </button>
          </div>
        </div>

        <div id="last-config">
          <Table
            aria-label="Configuration Model"
            topContent={
              <div className="text-center font-semibold sm:text-base w-full ">
                Konfigurasi model yang sedang digunakan pada Virtual Assistant
              </div>
            }
          >
            <TableHeader>
              <TableColumn>LAST UPDATE</TableColumn>
              <TableColumn>LLM</TableColumn>
              <TableColumn>MODEL LLM</TableColumn>
              <TableColumn>EMBEDDER</TableColumn>
              <TableColumn>MODEL EMBEDDER</TableColumn>
              <TableColumn>CHUNK SIZE</TableColumn>
              <TableColumn>CHUNK OVERLAP</TableColumn>
              <TableColumn>TOTAL CHUNK</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Konfigurasi tidak ditemukan."}>
              {lastConfig && (
                <TableRow key="x">
                  <TableCell>{lastConfig.last_update || "N/A"}</TableCell>
                  <TableCell>{lastConfig.llm || "N/A"}</TableCell>
                  <TableCell>{lastConfig.model_llm || "N/A"}</TableCell>
                  <TableCell>{lastConfig.embedder || "N/A"}</TableCell>
                  <TableCell>{lastConfig.model_embedder || "N/A"}</TableCell>
                  <TableCell>{lastConfig.chunk_size || "N/A"}</TableCell>
                  <TableCell>{lastConfig.chunk_overlap || "N/A"}</TableCell>
                  <TableCell>{lastConfig.total_chunks || "N/A"}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-6 justify-center items-center">
        <GoBackHome />
        <GoBackAdmin />
      </div>
    </main>
  );
}
