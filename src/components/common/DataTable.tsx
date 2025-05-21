"use client";

import React, { useState } from 'react';

// custom components
import Pagination from '../admin-components/Pagination';
import TableSkeleton from './TableSkeloton';

// icons
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline"

// types
import { DtataTable } from '@/utils/types';

export default function DataTable<T>({
    data,
    columns,
    actions = [],
    loading = false,
    showSerialNumber = false
}: DtataTable<T>) {
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleSort = (key: keyof T) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;

        const column = columns.find(col => col.key === sortKey);
        if (!column) return 0;

        const valA = column.sortKey ? column.sortKey(a) : a[sortKey];
        const valB = column.sortKey ? column.sortKey(b) : b[sortKey];

        if (typeof valA === 'string') {
            return sortOrder === 'asc'
                ? valA.localeCompare(valB as string)
                : (valB as string).localeCompare(valA);
        }

        if (typeof valA === 'number') {
            return sortOrder === 'asc'
                ? (valA as number) - (valB as number)
                : (valB as number) - (valA as number);
        }

        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalColumsCount = columns.length + (showSerialNumber ? 1 : 0) + (actions.length > 0 ? 1 : 0)

    return (
        <div className="overflow-x-auto py-4 bg-white rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase">
                    <tr>
                        {showSerialNumber && <th className="p-3">S.No.</th>}
                        {columns.map((col, index) => (
                            <th
                                key={`${String(col.key)}-${index}`}
                                onClick={() => handleSort(col.key)}
                                className="p-3 text-left cursor-pointer select-none"
                            >
                                <div className='flex gap-1 cursor-pointer'>
                                    <p>{col.header}</p>
                                    {sortKey === col.key && (
                                        <div className="ml-1">{sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}</div>
                                    )}
                                </div>
                            </th>
                        ))}
                        {actions.length > 0 && <th className="px-4 py-2">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <TableSkeleton rows={itemsPerPage} columns={totalColumsCount} />
                    ) : paginatedData.length > 0 ? (
                        paginatedData.map((row, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                                {showSerialNumber && (
                                    <td className="p-3">
                                        {(currentPage - 1) * itemsPerPage + idx + 1}
                                    </td>
                                )}
                                {columns.map((col, index) => (
                                    <td key={`${String(col.key)}-${index}`} className="p-3">
                                       {col.render ? col.render(row) : String(row[col.key])}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            {actions.map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => action.onClick(row)}
                                                    className="text-gray-600 hover:text-black"
                                                    title={action.tooltip ?? ''}
                                                >
                                                    {action.icon}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={totalColumsCount} className="text-center">
                                <p className="my-3 font-bold">No data found</p>
                            </td>
                        </tr>
                    )}


                </tbody>
            </table>

            {/* Pagination */}
            {!loading && paginatedData.length > 0 &&
                <Pagination
                    totalItems={data.length}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            }
        </div>
    );
}
