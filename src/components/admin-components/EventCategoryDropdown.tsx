"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Badge } from "@/components/ui/badge";
import { apiCall } from '@/utils/services/request';
import ChartCard from './dashboard/ChartCard';
import TitleSection from '../common/TitleSection';
import { TLoadingState, IEventCategoryResp, IEventCategory, TCategoryFormValues } from '@/app/admin/dropdowns/types';
import { API_ROUTES } from '@/utils/constant';
import DeleteModal from '@/components/common/DeleteModal';
import TableSkeleton from '@/components/common/TableSkeloton';
import { TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { getCategorySearchResults, initialCategoryFormValues } from '@/app/admin/dropdowns/helper';
import EventCategoryFormModal from './EventCategoryFormModal';
import { getTruthyString } from '@/utils/helper';
import CustomButton from '../common/CustomButton';
import SearchInput from '../common/CommonSearchBar';
import { AxiosError } from 'axios';
import CannotDeleteModal from './CannotDeleteModal';
import DataTable from '../common/DataTable';
import { Action, Column } from '@/utils/types';

function EventCategoryDropdown() {
    const [loading, setLoading] = useState<TLoadingState>({
        getApi: true,
        createApi: false,
        updateApi: false,
        deleteApi: false,
    });
    const [allCategoriesData, setAllCategoriesData] = useState<IEventCategory[]>([]);
    const [categoriesData, setCategoriesData] = useState<IEventCategory[]>([]);
    const [cannotDeleteModalOpen, setCannotDeleteModalOpen] = useState(false);
    const [usedInEvents, setUsedInEvents] = useState<{ _id: string, title: string, endDateTime: string }[]>([]);

    const [deleteItemId, setDeleteItemId] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState<TCategoryFormValues>(initialCategoryFormValues);

    const setLoadingState = (key: keyof TLoadingState, value: boolean) => {
        setLoading((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const fetchCategoriesData = useCallback(async () => {
        setLoadingState('getApi', true)
        try {
            const response: IEventCategoryResp = await apiCall({
                endPoint: API_ROUTES.CATEGORY,
                method: 'GET',
            });

            if (response && response.success) {
                const receivedArray = response.data || [];
                setAllCategoriesData(receivedArray);
                setCategoriesData(receivedArray);
            }
        } catch (err) {
            console.error('Error fetching ticket types', err);
        } finally {
            setLoadingState('getApi', false)
        }
    }, []);

    useEffect(() => {
        fetchCategoriesData();
    }, [fetchCategoriesData]);

    const handleSearch = useCallback((searchVal: string) => {
        const result = getCategorySearchResults(allCategoriesData, searchVal);
        setCategoriesData(result);
        setSearchQuery(searchVal);
    }, [allCategoriesData]);

    const openAddModal = useCallback(() => {
        setFormValues(initialCategoryFormValues);
        setModalOpen(true);
    }, []);

    const closeAddEditModal = useCallback(() => {
        setModalOpen(false)
        setFormValues(initialCategoryFormValues)
    }, [])

    const openEditModal = useCallback((item: IEventCategory) => {
        setFormValues({
            id: item._id,
            name: getTruthyString(item.name),
            color: getTruthyString(item?.color),
            bgColor: getTruthyString(item?.bgColor),
            icon: {
                ...item.icon,
                imageId: getTruthyString(item?.icon?.imageId),
                url: getTruthyString(item?.icon?.url),
                previewUrl: getTruthyString(item?.icon?.url),
            }
        });
        setModalOpen(true);
    }, []);

    const createCategory = useCallback(async (form: TCategoryFormValues) => {
        setLoadingState('createApi', true)

        try {
            const bodyFormData = new FormData()
            bodyFormData.append("name", form.name);
            bodyFormData.append("color", form.color);
            bodyFormData.append("bgColor", form.bgColor);
            if (form?.icon?.file) {
                bodyFormData.append("icon", form?.icon?.file);
            }

            const response = await apiCall({
                endPoint: `${API_ROUTES.CATEGORY}`,
                method: 'POST',
                body: bodyFormData,
                isFormData: true,
                headers: {}
            });

            if (response && response.success) {
                closeAddEditModal();
                await fetchCategoriesData();
                toast.success("Category Created Successfully");
            }
        } catch (err) {
            console.error('Error creating category', err);
        } finally {
            setLoadingState('createApi', false)
        }
    }, [fetchCategoriesData, closeAddEditModal]);

    const updateCategory = useCallback(async (form: TCategoryFormValues) => {
        setLoadingState('updateApi', true)

        try {
            const bodyFormData = new FormData()
            bodyFormData.append("name", form.name);
            bodyFormData.append("color", form.color);
            bodyFormData.append("bgColor", form.bgColor);
            if (form?.icon?.file) {
                bodyFormData.append("icon", form?.icon?.file);
            }

            if (!form?.icon?.previewUrl && !form?.icon?.file && form?.icon?.imageId) {
                bodyFormData.append("removeIcon", "true");
            }

            const response = await apiCall({
                endPoint: `${API_ROUTES.CATEGORY}/${form.id}`,
                method: 'PUT',
                body: bodyFormData,
                isFormData: true,
                headers: {}
            });

            if (response && response.success) {
                closeAddEditModal();
                await fetchCategoriesData();
                toast.success("Category Updated Successfully");
            }
        } catch (err) {
            console.error('Error updating category', err);
        } finally {
            setLoadingState('updateApi', false)
        }
    }, [fetchCategoriesData, closeAddEditModal]);

    const openDeleteModal = useCallback((id: string) => {
        setDeleteItemId(id);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setDeleteItemId("");
    }, []);

    const deleteCategoryById = useCallback(async () => {
        if (!deleteItemId) return;
        setLoadingState('deleteApi', true)

        try {
            const response = await apiCall({
                endPoint: `${API_ROUTES.CATEGORY}/${deleteItemId}`,
                method: 'DELETE',
            });

            if (response && response.success) {
                closeDeleteModal();
                await fetchCategoriesData();
                toast.success("Category Deleted Successfully");
            }
        } catch (err) {
            if (err instanceof AxiosError && err.response?.status === 400) {
                closeDeleteModal();
                setCannotDeleteModalOpen(true);
                setUsedInEvents(err.response?.data.data);
            }
        } finally {
            setLoadingState('deleteApi', false)
        }
    }, [deleteItemId, fetchCategoriesData, closeDeleteModal]);

    const handleSubmit = (formValues: TCategoryFormValues) => {
        if (formValues?.id) {
            updateCategory(formValues)
        } else {
            createCategory(formValues)
        }
    }

    const tableHeaders: Column<IEventCategory>[] = [
        { header: 'Ticket Type', key: 'name' },
        { header: 'Preview', key: 'color', sortKey: (row) => row.name, render: (item : IEventCategory) => 
                <Badge
                    style={{
                        color: item.color,
                        backgroundColor: item.bgColor,
                    }}
                    className="h-10 rounded-3xl px-4 gap-2"

                >
                    {item?.icon?.url ?
                        <Image
                            src={item?.icon?.url}
                            alt="Icon preview"
                            className="object-cover"
                            width={16}
                            height={16}
                        /> : <></>}
                    {item.name}
                </Badge>
        },
        { header: 'Status', key: 'isUsed', render: (item: IEventCategory) => item.isUsed ? "In Use" : "Not Used" }
    ];

    const tableActions: Action<IEventCategory>[] = [
        {
            icon: <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer" />,
            onClick: (row: IEventCategory) => openEditModal(row),
        },
        {
            icon: <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer" />,
            onClick: (row: IEventCategory) => openDeleteModal(row._id),
        },
    ];

    return (
        <div className='pt-8'>
            <ChartCard>
                <TitleSection title="Event Category" />

                <div className="flex justify-between items-center gap-2 space-x-2 w-full my-5">
                    <SearchInput
                        value={searchQuery}
                        onChange={(value) => handleSearch(value)}
                        placeholder="Search category"
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
                    loading={loading.getApi}
                    data={categoriesData}
                    columns={tableHeaders}
                    actions={tableActions}
                    showSerialNumber
                />

                {/* DELETE MODAL */}
                <DeleteModal
                    isOpen={!!deleteItemId}
                    onClose={closeDeleteModal}
                    onConfirm={deleteCategoryById}
                    confirmLoading={loading.deleteApi}
                />

                {/* CANNOT DELETE MODAL */}
                <CannotDeleteModal
                    isOpen={cannotDeleteModalOpen}
                    onClose={() => setCannotDeleteModalOpen(false)}
                    eventList={usedInEvents}
                    title="Cannot delete category"
                    description="This category is currently linked to the following events."
                />

                {modalOpen &&
                    <EventCategoryFormModal
                        open={modalOpen}
                        onClose={closeAddEditModal}
                        onSubmit={handleSubmit}
                        formData={formValues}
                        submitLoading={loading.createApi || loading.updateApi}
                    />}
            </ChartCard>
        </div>
    )
}

export default EventCategoryDropdown