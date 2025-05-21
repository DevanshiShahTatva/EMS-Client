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
import Pagination from '@/components/admin-components/Pagination';
import DeleteModal from '@/components/common/DeleteModal';
import TableSkeleton from '@/components/common/TableSkeloton';
import { MagnifyingGlassIcon, TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { getCategoryPaginatedData, getCategorySearchResults, initialCategoryFormValues } from '@/app/admin/dropdowns/helper';
import EventCategoryFormModal from './EventCategoryFormModal';
import { getTruthyString } from '@/utils/helper';
import CustomButton from '../common/CustomButton';
import SearchInput from '../common/CommonSearchBar';

function EventCategoryDropdown() {
    const [loading, setLoading] = useState<TLoadingState>({
        getApi: true,
        createApi: false,
        updateApi: false,
        deleteApi: false,
    });
    const [allCategoriesData, setAllCategoriesData] = useState<IEventCategory[]>([]);
    const [categoriesData, setCategoriesData] = useState<IEventCategory[]>([]);

    const [deleteItemId, setDeleteItemId] = useState<string>("");

    const [searchQuery, setSearchQuery] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState<TCategoryFormValues>(initialCategoryFormValues);

    const tableRowData = useMemo(() => {
        return getCategoryPaginatedData(categoriesData, currentPage, itemsPerPage);
    }, [categoriesData, currentPage, itemsPerPage]);

    const totalItems = categoriesData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        setCurrentPage(1);
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
                setCurrentPage(1);
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
                setCurrentPage(1);
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
                setCurrentPage(1);
            }
        } catch (err) {
            console.error('Error deleting category', err);
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

                {/* Data Table */}
                <div className="overflow-x-auto py-4 bg-white rounded-lg">
                    <table className="min-w-full table-fixed text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 text-xs uppercase">
                            <tr>
                                <th className="p-3">No</th>
                                <th className="p-3">Category Name</th>
                                <th className="p-3">Preview</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading.getApi ? (
                                <TableSkeleton rows={itemsPerPage} columns={4} />
                            ) : tableRowData.length > 0 ? (
                                tableRowData.map((item, idx) => (
                                    <tr key={item._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">
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
                                        </td>
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
                {categoriesData.length > 0 && (
                    <Pagination
                        totalItems={totalItems}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                )}

                {/* DELETE MODAL */}
                <DeleteModal
                    isOpen={!!deleteItemId}
                    onClose={closeDeleteModal}
                    onConfirm={deleteCategoryById}
                    confirmLoading={loading.deleteApi}
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