import React, { useMemo, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  Button,
} from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";
import { getLogsActivity } from "@/services/apiVirtualAssistant";
import LoadingIcon from "@/assets/gif/Rolling@1x-1.0s-200px-200px.gif";
import Image from "next/image";

export default function LogsActivity() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    const response = await getLogsActivity();
    setLogs(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSync = async () => {
    await fetchLogs();
  };

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs;
    return logs.filter((log) => {
      const logValues = Object.values(log).map((value: any) =>
        value.toString().toLowerCase()
      );
      return logValues.some((value) =>
        value.includes(searchQuery.toLowerCase())
      );
    });
  }, [logs, searchQuery]);

  const totalPages = useMemo(
    () => Math.ceil(filteredLogs.length / rowsPerPage),
    [filteredLogs, rowsPerPage]
  );

  const currentItems = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, page, rowsPerPage]);

  const onClear = React.useCallback(() => {
    setSearchQuery("");
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Table
      aria-label="Logs"
      topContent={
        <div className="flex w-full justify-start sm:justify-end gap-2">
          <button
            className={`text-white font-semibold px-4 py-2 rounded-xl text-sm flex justify-center items-center gap-1 cursor-pointer transition-all ease-in-out ${
              loading ? "bg-green-400" : "bg-green-500"
            }`}
            onClick={handleSync}
            disabled={loading}
          >
            {loading ? (
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => onClear()}
            className="w-full sm:max-w-[25%] max-w-[55%]"
            placeholder="Cari Riwayat"
            startContent={<SearchIcon color="disabled" />}
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
            total={totalPages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn key="no">NO</TableColumn>
        {/* <TableColumn key="id">ID</TableColumn> */}
        <TableColumn key="timestamp">WAKTU (WITA)</TableColumn>
        <TableColumn key="method">METODE</TableColumn>
        <TableColumn key="status">KODE</TableColumn>
        <TableColumn key="success">STATUS</TableColumn>
        <TableColumn key="description">DESKRIPSI</TableColumn>
      </TableHeader>
      <TableBody items={currentItems} emptyContent={"Logs tidak ditemukan"}>
        {(item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div>
                {(page - 1) * rowsPerPage + currentItems.indexOf(item) + 1}
              </div>
            </TableCell>
            {/* <TableCell>
              <div>{item.id}</div>
            </TableCell> */}
            <TableCell>{item.timestamp}</TableCell>
            <TableCell>{item.method}</TableCell>
            <TableCell>{item.status_code}</TableCell>
            <TableCell>{item.success ? "True" : "False"}</TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
