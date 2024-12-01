import React from "react";
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

const logs = [
  {
    id: "MSRT3D",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "SDJK3D",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "UIJ89D",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "MSRT3Q",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "SDJK2D",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "UIJ897",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "8SRT3D",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "GDJK3D",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "PIJ89D",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "MSRU3Q",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "OIJK2D",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
  {
    id: "QAJ897",
    timestamp: "2023-01-01 10:00:00",
    method: "GET",
    status: 200,
    success: "true",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adip isci. Lorem ipsum dolor sit amet, consect et sapien. Lorem ipsum dolor sit amet, con sectetur adip isci.",
  },
];

export default function LogsActivity() {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(logs.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return logs.slice(start, end);
  }, [page, rowsPerPage]);

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
            total={pages}
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
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
