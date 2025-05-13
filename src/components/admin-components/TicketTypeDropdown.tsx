"use client";
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ChartCard from '@/components/admin-components/dashboard/ChartCard';
import Pagination from '@/components/admin-components/Pagination';
import DeleteModal from '@/components/common/DeleteModal';
import TableSkeleton from '@/components/common/TableSkeloton';
import TitleSection from '@/components/common/TitleSection';
import { MagnifyingGlassIcon, TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import { toast } from 'react-toastify';
import AddEditTicketTypeModal from '@/components/admin-components/AddEditTicketTypeModal';
import { ITicketType, ITicketTypeFormValues, ITicketTypesResp } from '@/app/admin/dropdowns/types';
import { getPaginatedData, getSearchResults, initialTicketTypeFormValues } from '@/app/admin/dropdowns/helper';

function TicketTypeDropdown() {
    const [loading, setLoading] = useState(true);

    const [deleteApiLoading, setDeleteApiLoading] = useState(false);
    const [updateApiLoading, setUpdateApiLoading] = useState(false);
    const [createApiLoading, setCreateApiLoading] = useState(false);

    const [allTicketTypesData, setAllTicketTypesData] = useState<ITicketType[]>([]);
    const [ticketTypesData, setTicketTypesData] = useState<ITicketType[]>([]);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<ITicketTypeFormValues>(initialTicketTypeFormValues);

    const [searchQuery, setSearchQuery] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = ticketTypesData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const tableRowData = useMemo(() => {
        return getPaginatedData(ticketTypesData, currentPage, itemsPerPage);
    }, [ticketTypesData, currentPage, itemsPerPage]);

    const handleSearch = useCallback((searchVal: string) => {
        const result = getSearchResults(allTicketTypesData, searchVal);
        setTicketTypesData(result);
        setCurrentPage(1);
        setSearchQuery(searchVal);
    }, [allTicketTypesData]);

    const openAddModal = useCallback(() => {
        setInitialValues(initialTicketTypeFormValues);
        setModalOpen(true);
    }, []);

    const openEditModal = useCallback((item: ITicketType) => {
        setInitialValues({
            id: item._id,
            name: item.name,
            description: item.description,
        });
        setModalOpen(true);
    }, []);

    const closeAddEditModal = useCallback(() => {
        setInitialValues(initialTicketTypeFormValues);
        setModalOpen(false);
    }, []);

    const openDeleteModal = useCallback((id: string) => {
        setDeleteItemId(id);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setDeleteItemId(null);
    }, []);



    const fetchTicketTypesData = useCallback(async () => {
        setLoading(true);
        try {
            const response: ITicketTypesResp = await apiCall({
                endPoint: API_ROUTES.ADMIN.TICKET_TYPE,
                method: 'GET',
            });

            if (response && response.success) {
                const receivedArray = response.data || [];
                setAllTicketTypesData(receivedArray);
                setTicketTypesData(receivedArray);
            }
        } catch (err) {
            console.error('Error fetching ticket types', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTicketTypesData();
    }, [fetchTicketTypesData]);

    const createTicketType = useCallback(async (form: ITicketTypeFormValues) => {
        setCreateApiLoading(true);
        try {
            const response = await apiCall({
                endPoint: `${API_ROUTES.ADMIN.TICKET_TYPE}`,
                method: 'POST',
                body: form,
            });

            if (response && response.success) {
                closeAddEditModal();
                await fetchTicketTypesData();
                toast.success("Ticket Type Created Successfully");
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error creating ticket type', err);
        } finally {
            setCreateApiLoading(false);
        }
    }, [fetchTicketTypesData, closeAddEditModal]);

    const updateTicketType = useCallback(async (form: ITicketTypeFormValues) => {
        setUpdateApiLoading(true);
        try {
            const response = await apiCall({
                endPoint: `${API_ROUTES.ADMIN.TICKET_TYPE}/${form.id}`,
                method: 'PUT',
                body: form,
            });

            if (response && response.success) {
                closeAddEditModal();
                await fetchTicketTypesData();
                toast.success("Ticket Type Updated Successfully");
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error updating ticket type', err);
        } finally {
            setUpdateApiLoading(false);
        }
    }, [fetchTicketTypesData, closeAddEditModal]);

    const handleSave = useCallback((data: ITicketTypeFormValues) => {
        if (data.id) {
            updateTicketType(data);
        } else {
            createTicketType(data);
        }
    }, [createTicketType, updateTicketType]);

    const deleteTicketTypeById = useCallback(async () => {
        if (!deleteItemId) return;
        setDeleteApiLoading(true);
        try {
            const response = await apiCall({
                endPoint: `${API_ROUTES.ADMIN.TICKET_TYPE}/${deleteItemId}`,
                method: 'DELETE',
            });

            if (response && response.success) {
                closeDeleteModal();
                await fetchTicketTypesData();
                toast.success("Ticket Type Deleted Successfully");
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error deleting ticket type', err);
        } finally {
            setDeleteApiLoading(false);
        }
    }, [deleteItemId, fetchTicketTypesData, closeDeleteModal]);

    return (
        <>
            <ChartCard>
                <TitleSection title="Ticket Types" />
                <div className="flex justify-between items-center gap-2 space-x-2 w-full my-5">
                    <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MagnifyingGlassIcon className="h-6 w-6" />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search ticket type"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>

                    <button
                        onClick={openAddModal}
                        className="md:flex gap-1 items-center font-bold cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        <PlusIcon className="w-5 h-5 font-bold" />
                        <p className="hidden md:block">Add</p>
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto py-4 bg-white rounded-lg">
                    <table className="min-w-full table-fixed text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 text-xs uppercase">
                            <tr>
                                <th className="p-3">No</th>
                                <th className="p-3">Ticket Type</th>
                                <th className="p-3">Description</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton rows={itemsPerPage} columns={4} />
                            ) : tableRowData.length > 0 ? (
                                tableRowData.map((item, idx) => (
                                    <tr key={item._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.description}</td>
                                        <td className="p-3 space-x-2 text-center">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(item._id)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        <p className="my-3 font-bold">No data found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {ticketTypesData.length > 0 && (
                    <Pagination
                        totalItems={totalItems}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                )}
            </ChartCard>

            {/* DELETE MODAL */}
            <DeleteModal
                isOpen={!!deleteItemId}
                onClose={closeDeleteModal}
                onConfirm={deleteTicketTypeById}
                confirmLoading={deleteApiLoading}
            />

            {/* ADD & EDIT MODAL */}
            <AddEditTicketTypeModal
                isOpen={isModalOpen}
                onClose={closeAddEditModal}
                onSubmit={handleSave}
                initialValues={initialValues}
                mode={initialValues.id ? "edit" : "add"}
                submitLoading={createApiLoading || updateApiLoading}
            />
        </>
    );
}

export default TicketTypeDropdown;
