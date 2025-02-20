"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import GoBackAdmin from "@/components/GoBackAdmin";
import GoBackHome from "@/components/GoBackHome";
import SearchIcon from "@mui/icons-material/Search";
import LoadingIcon from "@/assets/gif/Rolling@1x-1.0s-200px-200px.gif";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Pagination,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  Image,
} from "@nextui-org/react";
import {
  listDataset,
  uploadDataset,
  readDataset,
  updateDataset,
  deleteDataset,
} from "@/services/apiVirtualAssistant";
import AccessChecker from "@/components/AccessChecker";
import EditIcon from "@mui/icons-material/Edit";

export default function ManagementDatasets() {
  const [datasets, setDatasets] = useState<string[]>([]);
  const [loadingSync, setLoadingSync] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isSingleDelete, setIsSingleDelete] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const rowsPerPage = 10;
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false); // Modal untuk update file
  const [fileToUpdate, setFileToUpdate] = useState<string | null>(null); // File yang dipilih untuk update
  const [newFile, setNewFile] = useState<File | null>(null);
  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  useEffect(() => {
    const fetchDatasets = async () => {
      setLoadingSync(true);
      const data = await listDataset();
      setDatasets(data);
      setLoadingSync(false);
    };
    fetchDatasets();
  }, []);

  const handleSync = async () => {
    setLoadingSync(true);
    const data = await listDataset();
    setDatasets(data);
    setLoadingSync(false);
  };

  const pages = Math.ceil(datasets.length / rowsPerPage);
  const filteredDatasets = useMemo(() => {
    return datasets.filter(
      (filename) =>
        filename && filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, datasets]);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredDatasets.slice(start, end);
  }, [page, filteredDatasets]);

  const handleViewFile = async (filename: string) => {
    const fileUrl = await readDataset(filename);
    if (fileUrl) {
      window.location.href = fileUrl;
    } else {
      alert("Gagal membuka file.");
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleChangeInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter((file) =>
        allowedFileTypes.includes(file.type)
      );
      const newFiles = validFiles.filter(
        (file) =>
          !selectedFiles.some((existingFile) => existingFile.name === file.name)
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadFile = async () => {
    if (selectedFiles.length > 0) {
      setLoadingAdd(true);
      const result = await uploadDataset(selectedFiles);
      setLoadingAdd(false);
      handleSync();
      if (result.success) {
        setDatasets((prevDatasets) => [
          ...prevDatasets,
          ...result.data.uploaded_files,
        ]);
        setSelectedFiles([]);
        setIsModalAddOpen(false);
      } else {
        alert("Gagal mengupload file.");
      }
    } else {
      alert("Tidak ada file yang valid untuk diupload.");
    }
  };

  const handleUpdateFile = async () => {
    if (newFile && fileToUpdate) {
      setLoadingUpdate(true);
      const result = await updateDataset(fileToUpdate, newFile);
      setLoadingUpdate(false);
      handleSync();
      if (result.success) {
        setDatasets((prevDatasets) =>
          prevDatasets.map((file) =>
            file === fileToUpdate ? result.data.updated_file : file
          )
        );
        setIsModalUpdateOpen(false);
        setNewFile(null);
      } else {
        alert("Gagal memperbarui file.");
      }
    } else {
      alert("Pilih file baru untuk menggantikan file lama.");
    }
  };

  const handleSelectionChange = (filename: string) => {
    const newSelectedKeys = new Set(selectedKeys);
    if (newSelectedKeys.has(filename)) {
      newSelectedKeys.delete(filename);
    } else {
      newSelectedKeys.add(filename);
    }
    setSelectedKeys(newSelectedKeys);
  };

  const handleSelectAll = () => {
    if (selectedKeys.size === filteredDatasets.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(filteredDatasets));
    }
  };

  const handleDelete = async (filenames: string[]) => {
    setLoadingDelete(true);
    const result = await deleteDataset(filenames);
    setLoadingDelete(false);
    if (result.success) {
      setDatasets((prevDatasets) =>
        prevDatasets.filter((file) => !filenames.includes(file))
      );
      setSelectedKeys(new Set());
      setFileToDelete(null);
      setIsModalDeleteOpen(false);
    } else {
      alert("Gagal menghapus file.");
    }
  };

  const handleDeleteMultiple = () => {
    if (selectedKeys.size > 0) {
      setIsSingleDelete(false);
      setIsModalDeleteOpen(true);
      setFileToDelete(null);
    } else {
      alert("Tidak ada file yang dipilih.");
    }
  };

  const handleDeleteSingle = (filename: string) => {
    setFileToDelete(filename);
    setIsSingleDelete(true);
    setIsModalDeleteOpen(true);
  };

  const onClear = React.useCallback(() => {
    setSearchQuery("");
  }, []);

  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const handleAccessChecked = (valid: boolean) => {
    setIsValidKey(valid);
  };
  if (!isValidKey) {
    return <AccessChecker onAccessChecked={handleAccessChecked} />;
  }

  return (
    <main className="flex flex-col items-center justify-center p-4 pt-6 mx-auto max-w-screen-xl 2xl:max-w-screen-2xl">
      <div className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">
          Manajemen Dataset
        </h1>
      </div>
      <div className="pt-6 w-full flex flex-col gap-6">
        <div className="">
          <div className="pb-4 flex justify-end"></div>
          <Table
            className="w-full overflow-auto rounded-2xl shadow-md"
            aria-label="Manajement Users"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            topContent={
              <div className="flex flex-wrap w-full justify-start sm:justify-end gap-2">
                {/* Tombol Open Add User Modal */}
                <button
                  onClick={() => setIsModalAddOpen(true)}
                  className="bg-primary-500 px-3 py-2 rounded-lg text-white  hover:bg-primary-400 transition-all ease-in-out"
                >
                  <NoteAddIcon />
                </button>

                {/* Tombol Delete */}
                {selectedKeys.size > 0 && (
                  <button
                    onClick={handleDeleteMultiple}
                    className="bg-red-500 px-4 py-2 rounded-lg text-white"
                  >
                    <DeleteIcon /> {selectedKeys.size}
                  </button>
                )}

                <button
                  className={`text-white font-semibold px-4 py-2 rounded-xl text-sm flex justify-center items-center gap-1 cursor-pointer transition-all ease-in-out ${
                    loadingSync
                      ? "bg-green-400"
                      : "bg-green-500 hover:bg-green-400"
                  }`}
                  onClick={handleSync}
                  disabled={loadingSync}
                >
                  {loadingSync ? (
                    <Image
                      width={20}
                      height={20}
                      src={LoadingIcon.src}
                      alt={"Loading"}
                    />
                  ) : (
                    ""
                  )}
                  Sync
                </button>
                <Input
                  isClearable
                  className="w-full sm:max-w-[25%] max-w-[55%]"
                  placeholder="Cari Dataset"
                  startContent={<SearchIcon color="disabled" />}
                  onClear={() => onClear()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            }
          >
            {/* HEADER UNTUK TABEL */}
            <TableHeader>
              {/* <TableColumn className="uppercase">
                <input
                  type="checkbox"
                  checked={
                    filteredDatasets.length > 0 &&
                    selectedKeys.size === filteredDatasets.length
                  }
                  ref={(input) => {
                    if (input) {
                      input.indeterminate =
                        filteredDatasets.length > 0 &&
                        selectedKeys.size > 0 &&
                        selectedKeys.size < filteredDatasets.length;
                    }
                  }}
                  onClick={handleSelectAll}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
              </TableColumn> */}
              <TableColumn className="uppercase">NO</TableColumn>
              <TableColumn className="uppercase">Nama File</TableColumn>
              <TableColumn className="uppercase">Aksi</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Dataset tidak ditemukan"}>
              {items.map((filename, index) => (
                <TableRow key={filename} className="cursor-context-menu">
                  {/* <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedKeys.has(filename)}
                      onClick={() => handleSelectionChange(filename)}
                      className="h-5 w-5 text-blue-500"
                    />
                  </TableCell> */}
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{filename}</TableCell>
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Button
                        isIconOnly
                        color="warning"
                        onPress={() => handleViewFile(filename)}
                      >
                        <VisibilityOutlinedIcon className="text-white" />
                      </Button>
                      <Button
                        isIconOnly
                        color="success"
                        onPress={() => {
                          setFileToUpdate(filename);
                          setIsModalUpdateOpen(true);
                        }}
                      >
                        <EditIcon className="text-white" />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        onPress={() => handleDeleteSingle(filename)}
                      >
                        <DeleteIcon className="text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* MODAL UNTUK MENGHAPUS FILE */}
          <Modal
            id="delete-files"
            backdrop="opaque"
            isOpen={isModalDeleteOpen}
            onClose={() => setIsModalDeleteOpen(false)}
            placement="center"
            className="m-2"
          >
            <ModalContent className="p-1">
              <ModalHeader>
                <h4>Konfirmasi Penghapusan</h4>
              </ModalHeader>
              <ModalBody>
                {isSingleDelete && fileToDelete ? (
                  <p className="text-sm text-center">
                    Anda yakin menghapus file <strong>{fileToDelete}</strong>?
                  </p>
                ) : (
                  <p className="text-sm text-center">
                    Anda yakin menghapus {selectedKeys.size} file yang dipilih?
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="solid"
                  color="danger"
                  className="font-semibold"
                  onPress={() =>
                    isSingleDelete && fileToDelete
                      ? handleDelete([fileToDelete])
                      : handleDelete(Array.from(selectedKeys))
                  }
                  isLoading={loadingDelete}
                >
                  Hapus
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  className="font-semibold"
                  onPress={() => setIsModalDeleteOpen(false)}
                >
                  Batal
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* MODAL UNTUK MENAMBAHKAN FILE */}
          <Modal
            isOpen={isModalAddOpen}
            onClose={() => {
              setIsModalAddOpen(false);
              setSelectedFiles([]);
            }}
            id="add-files"
            backdrop="opaque"
            placement="center"
            className="m-2"
          >
            <ModalContent className="p-1">
              <ModalHeader>
                <h4>Tambahkan Dataset</h4>
              </ModalHeader>
              <ModalBody>
                <Input
                  isClearable
                  baseRef={fileInputRef}
                  type="file"
                  multiple
                  accept={allowedFileTypes.join(", ")}
                  onChange={handleChangeInputFile}
                  description="File yang didukung: .pdf, .docx, .doc"
                />
                <div className="mt-2">
                  {selectedFiles.length > 0 && (
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li
                          className="bg-slate-100 mb-1 rounded-lg p-1 pl-2 text-sm"
                          key={index}
                        >
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => {
                    setIsModalAddOpen(false);
                    setSelectedFiles([]);
                  }}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  onPress={handleUploadFile}
                  isLoading={loadingAdd}
                  isDisabled={selectedFiles.length === 0}
                >
                  Tambah
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* MODAL UNTUK MEMPERBARUI FILE */}
          <Modal
            isOpen={isModalUpdateOpen}
            onClose={() => {
              setIsModalUpdateOpen(false);
              setNewFile(null);
            }}
            id="update-file"
            backdrop="opaque"
            placement="center"
            className="m-2"
          >
            <ModalContent className="p-1">
              <ModalHeader>
                <h4>Perbarui Dataset</h4>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-6">
                <div>
                  <p className="text-sm pb-1">File Lama</p>
                  <Input disabled value={fileToUpdate || ""} />
                </div>
                <div>
                  <p className="text-sm pb-1">File Baru</p>
                  <Input
                    isClearable
                    type="file"
                    accept={allowedFileTypes.join(", ")}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setNewFile(e.target.files[0]);
                      }
                    }}
                    description="File yang didukung: .pdf, .docx, .doc"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => setIsModalUpdateOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  onPress={handleUpdateFile}
                  isLoading={loadingUpdate}
                  isDisabled={!newFile}
                >
                  Perbarui
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-6 justify-center items-center">
        <GoBackAdmin />
        <GoBackHome />
      </div>
    </main>
  );
}
