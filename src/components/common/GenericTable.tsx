"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TruncatedCell } from "../admin-components/dashboard/MostBookedUsersTable";

interface Column {
  label: string;
  key: string;
}

interface GenericTableProps<T> {
  columns: Column[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GenericTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pageSize = 5,
}: GenericTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.some((col) =>
        row[col.key]
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data, columns]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search..."
        value={searchTerm}
        className="placeholder:text-gray-400"
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page when searching
        }}
        disabled={loading}
      />

      <div>
        <Table className="text-gray-700">
          <TableHeader className="bg-gray-100 text-xs uppercase">
            <TableRow className="hover:bg-transparent spac">
              {columns.map((col) => (
                <TableHead key={col.key} className="text-gray-700 font-[700]">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="whitespace-pre-wrap">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="text-center">
                  No data found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="whitespace-pre-wrap">
                      <TruncatedCell text={row[col.key]} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default GenericTable;
