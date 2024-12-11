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
} from "@nextui-org/react";
import { setupConfig, checkConfig } from "@/services/apiVirtualAssistant";
import AccessChecker from "@/components/AccessChecker";

export default function CheckModel() {
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
          Manajemen User
        </h1>
      </div>
      <div className="pt-6 w-full flex flex-col gap-6">

        <div id="last-config">
          <div className="pb-4 flex justify-end">
            <Button color="primary" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-fill-add" viewBox="0 0 16 16">
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
            </svg>
              Add User
            </Button>
          </div>
          <Table
            aria-label="Configuration Model"
            topContent={
              <p className="text-center font-semibold sm:text-base">
                Daftar Pengguna Aktif
              </p>
            }
          >
            <TableHeader>
              <TableColumn>Avatar</TableColumn>
              <TableColumn>User ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>User Login Type</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Konfigurasi tidak ditemukan."}>
              {lastConfig && (
                <TableRow key="x">
                  <TableCell>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#00FF00" className="bi bi-emoji-neutral-fill flex justify-center" viewBox="0 0 16 16">
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m-3 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8"/>
                    </svg>
                  </TableCell>
                  <TableCell>123</TableCell>
                  <TableCell>Diar</TableCell>
                  <TableCell>sudiar@example.com</TableCell>
                  <TableCell>Google</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>
                    <Button isIconOnly color="danger">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </main>
  );
}
