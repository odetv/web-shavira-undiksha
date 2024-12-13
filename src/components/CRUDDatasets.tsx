import React, { useEffect, useState, useMemo, useRef } from "react";
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
  Input,
  ModalFooter,
} from "@nextui-org/react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getDatasets,
  uploadDataset,
  readDataset,
  updateDataset,
  deleteDataset,
} from "@/services/apiVirtualAssistant";

export default function CRUDDatasets() {
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
      const data = await getDatasets();
      setDatasets(data);
      setLoadingSync(false);
    };
    fetchDatasets();
  }, []);

  const handleSync = async () => {
    setLoadingSync(true);
    const data = await getDatasets();
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

  return (
    <main className="w-full">
      <Table
        aria-label="CRUDDatasets"
        topContent={
          <div className="flex flex-wrap w-full justify-center sm:justify-end gap-2">
            <button
              onClick={() => setIsModalAddOpen(true)}
              className="bg-cyan-500 px-2 py-2 rounded-lg text-white"
            >
              <AddIcon />
            </button>

            {selectedKeys.size > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="bg-red-500 px-4 py-2 rounded-lg text-white"
              >
                <DeleteIcon /> {selectedKeys.size}
              </button>
            )}

            <Button
              variant="solid"
              color="success"
              className="text-white font-semibold"
              isLoading={loadingSync}
              onPress={handleSync}
            >
              Sync
            </Button>
            <Input
              isClearable
              className="w-full sm:max-w-[25%] max-w-[55%]"
              placeholder="Search"
              startContent={<SearchIcon color="disabled" />}
              onClear={() => onClear()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        }
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
      >
        <TableHeader>
          <TableColumn>
            <input
              type="checkbox"
              checked={selectedKeys.size === filteredDatasets.length}
              ref={(input) => {
                if (input) {
                  input.indeterminate =
                    selectedKeys.size > 0 &&
                    selectedKeys.size < filteredDatasets.length;
                }
              }}
              onChange={handleSelectAll}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </TableColumn>
          <TableColumn>NO</TableColumn>
          <TableColumn>NAMA FILE</TableColumn>
          <TableColumn>AKSI</TableColumn>
        </TableHeader>

        <TableBody emptyContent={"Dataset tidak ditemukan."}>
          {items.map((filename, index) => (
            <TableRow key={filename} className="cursor-context-menu">
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedKeys.has(filename)}
                  onChange={() => handleSelectionChange(filename)}
                  className="h-5 w-5 text-blue-500"
                />
              </TableCell>
              <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
              <TableCell>{filename}</TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Lihat File">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={() => handleViewFile(filename)}
                    >
                      <VisibilityOutlinedIcon />
                    </span>
                  </Tooltip>
                  <Tooltip content="Perbarui File">
                    <span
                      className="text-lg text-default-400 cursor-pointer active:opacity-50"
                      onClick={() => {
                        setFileToUpdate(filename);
                        setIsModalUpdateOpen(true);
                      }}
                    >
                      <EditOutlinedIcon />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Hapus File">
                    <span
                      className="text-lg text-danger cursor-pointer active:opacity-50"
                      onClick={() => handleDeleteSingle(filename)}
                    >
                      <DeleteForeverOutlinedIcon />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        id="delete-files"
        backdrop="opaque"
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        placement="center"
      >
        <ModalContent className="m-4 p-1">
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

      <Modal
        isOpen={isModalAddOpen}
        onClose={() => {
          setIsModalAddOpen(false);
          setSelectedFiles([]);
        }}
        id="add-files"
        backdrop="opaque"
        placement="center"
      >
        <ModalContent className="m-4 p-1">
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

      <Modal
        isOpen={isModalUpdateOpen}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setNewFile(null);
        }}
        id="update-file"
        backdrop="opaque"
        placement="center"
      >
        <ModalContent className="m-4 p-1">
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
            <Button color="danger" onPress={() => setIsModalUpdateOpen(false)}>
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
    </main>
  );
}
