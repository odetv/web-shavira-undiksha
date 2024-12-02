import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { getLogsActivity } from "../services/apiVirtualAssistant";

export default function LogsActivity() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLogsActivity();
        if (response.success) {
          setLogs(response.data);
        } else {
          setError(response.message || "Gagal memuat log.");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data log.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Hitung jumlah halaman
  const totalPages = useMemo(
    () => Math.ceil(logs.length / rowsPerPage),
    [logs, rowsPerPage]
  );

  // Data yang akan ditampilkan pada halaman saat ini
  const currentItems = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return logs.slice(startIndex, endIndex);
  }, [logs, page, rowsPerPage]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Table
      aria-label="Logs"
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
        <TableColumn key="id">ID</TableColumn>
        <TableColumn key="timestamp">TIMESTAMP</TableColumn>
        <TableColumn key="method">METHOD</TableColumn>
        <TableColumn key="status">STATUS</TableColumn>
        <TableColumn key="success">SUCCESS</TableColumn>
        <TableColumn key="description">DESCTIPTION</TableColumn>
      </TableHeader>
      <TableBody items={currentItems}>
        {(item) => (
          <TableRow key={item.ID}>
            <TableCell>{item.ID}</TableCell>
            <TableCell>{item.Timestamp}</TableCell>
            <TableCell>{item.Method}</TableCell>
            <TableCell>{item["Status Code"]}</TableCell>
            <TableCell>{item.Success ? "true" : "false"}</TableCell>
            <TableCell>{item.Description}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
