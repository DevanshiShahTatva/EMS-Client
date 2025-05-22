"use client";
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ChartCard from '@/components/admin-components/dashboard/ChartCard';
import DeleteModal from '@/components/common/DeleteModal';
import TitleSection from '@/components/common/TitleSection';
import { TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import { toast } from 'react-toastify';
import AddEditTicketTypeModal from '@/components/admin-components/AddEditTicketTypeModal';
import { ITicketType, ITicketTypeFormValues, ITicketTypesResp } from '@/app/admin/dropdowns/types';
import { getSearchResults, initialTicketTypeFormValues } from '@/app/admin/dropdowns/helper';
import CustomButton from '../common/CustomButton';
import SearchInput from '../common/CommonSearchBar';
import DataTable from '../common/DataTable';
import { Action } from '@/utils/types';

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

    const handleSearch = useCallback((searchVal: string) => {
        const result = getSearchResults(allTicketTypesData, searchVal);
        setTicketTypesData(result);
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
            }
        } catch (err) {
            console.error('Error deleting ticket type', err);
        } finally {
            setDeleteApiLoading(false);
        }
    }, [deleteItemId, fetchTicketTypesData, closeDeleteModal]);

    const tableheaders: { header: string; key: keyof ITicketType }[] = [
        { header: 'Ticket Type', key: 'name' },
        { header: 'Description', key: 'description' },
    ];

    const tableActions: Action<ITicketType>[] = [
        {
            icon: <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer" />,
            onClick: (row: ITicketType) => openEditModal(row),
        },
        {
            icon: <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer" />,
            onClick: (row: ITicketType) => openDeleteModal(row._id),
        },
    ];

    return (
        <>
            <ChartCard>
                <TitleSection title="Ticket Types" />
                <div className="flex justify-between items-center gap-2 space-x-2 w-full my-5">
                    <SearchInput
                        value={searchQuery}
                        onChange={(value) => handleSearch(value)}
                        placeholder="Search ticket type"
                        inputClassName='pl-10 pr-4 py-2 w-full'
                    />

                    <CustomButton
                        onClick={openAddModal}
                        variant='primary'
                        startIcon={<PlusIcon className="w-5 h-5 font-bold" />}
                        className="md:flex gap-1 items-center"
                    >
                        <p className="hidden md:block">Add</p>
                    </CustomButton>
                </div>

                {/* Data Table & Pagination */}
                <DataTable
                    loading={loading}
                    data={ticketTypesData}
                    columns={tableheaders}
                    actions={tableActions}
                    showSerialNumber
                />

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
