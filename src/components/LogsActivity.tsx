import React, { useMemo } from "react";
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
import { useEffect, useState } from "react";
import { getLogsActivity } from "../services/apiVirtualAssistant";

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

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      `<mark style="background-color: yellow;">$1</mark>`
    );
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
          <Button
            variant="solid"
            color="success"
            className="text-white font-semibold"
            onClick={handleSync}
            isLoading={loading}
          >
            Sync
          </Button>
          <Input
            isClearable
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => onClear()}
            className="w-full sm:max-w-[25%] max-w-[55%]"
            placeholder="Search"
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
        <TableColumn key="id">ID</TableColumn>
        <TableColumn key="timestamp">TIMESTAMP</TableColumn>
        <TableColumn key="method">METHOD</TableColumn>
        <TableColumn key="status">STATUS</TableColumn>
        <TableColumn key="success">SUCCESS</TableColumn>
        <TableColumn key="description">DESCTIPTION</TableColumn>
      </TableHeader>
      <TableBody items={currentItems} emptyContent={"Logs tidak ditemukan."}>
        {(item) => (
          <TableRow key={item.ID}>
            <TableCell>
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightText(item.ID.toString(), searchQuery),
                }}
              />
            </TableCell>
            <TableCell>
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightText(item.Timestamp.toString(), searchQuery),
                }}
              />
            </TableCell>
            <TableCell>
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightText(item.Method.toString(), searchQuery),
                }}
              />
            </TableCell>
            <TableCell>
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    item["Status Code"].toString(),
                    searchQuery
                  ),
                }}
              />
            </TableCell>
            <TableCell>
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    item.Success ? "true" : "false",
                    searchQuery
                  ),
                }}
              />
            </TableCell>
            <TableCell>
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    item.Description.toString(),
                    searchQuery
                  ),
                }}
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
