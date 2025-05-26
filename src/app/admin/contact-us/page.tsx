"use client"
import React, { useCallback, useEffect, useState } from 'react'

// Custom Components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import TooltipWrapper from '@/components/common/TooltipWrapper'
import DeleteModal from '@/components/common/DeleteModal'
import ContactModal from '@/components/admin-components/ViewContactInfo'
import Breadcrumbs from '@/components/common/BreadCrumbs'
import TitleSection from '@/components/common/TitleSection'
import CustomButton from '@/components/common/CustomButton'
import SearchInput from '@/components/common/CommonSearchBar'
import DataTable from '@/components/common/DataTable'

// Icons
import { TrashIcon, EyeIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { Sparkles, SquareCheckBig } from 'lucide-react'

// Types
import { IRequestResponse, IRequestType } from './types'
import { Action, Column } from '@/utils/types'

// Constant
import { API_ROUTES, BREAD_CRUMBS_ITEMS } from '@/utils/constant'

// Helpers
import { getSearchResults, INITIAL_CONTATC_INFO, statusColor } from './helper'

//  Services
import { apiCall } from '@/utils/services/request'

// library
import { toast } from 'react-toastify'

const AdminContactUsPage = () => {

    const [allRequestsData, setAllRequestData] = useState<IRequestType[]>([])
    const [requestsData, setRequestsData] = useState<IRequestType[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [contactInfo, setContactInfo] = useState<IRequestType>(INITIAL_CONTATC_INFO)

    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isGeneratingAns, setIsGeneratingAns] = useState<boolean>(false);

    const totalItems = requestsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleSearch = (searchVal: string) => {
        const result = getSearchResults(allRequestsData, searchVal)
        setRequestsData(result)
        setSearchQuery(searchVal)
    }

    const selectParticulartRowId = (id: string) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                // If the id is already in the array, remove it
                return prevSelectedIds.filter((item) => item !== id);
            } else {
                // If the id is not in the array, add it
                return [...prevSelectedIds, id];
            }
        });
    };

    const selectAllRowsId = () => {
        const allIds = allRequestsData.map(item => item._id)
        setSelectedIds(prev =>
            prev.length === allIds.length ? [] : allIds
        );
    }

    const openViewModal = (item: IRequestType) => {
        setContactInfo(item)
        setViewModal(true)
    }

    const closeViewModal = () => {
        setContactInfo(INITIAL_CONTATC_INFO)
        setViewModal(false)
    }

    const openDeleteModal = () => {
        setDeleteModal(true)
    }

    const closeDeleteModal = () => {
        setDeleteModal(false)
    }

    const deleteRequestById = async () => {
        setDeleteModal(false)
        setLoading(true);
        try {
            const httpBody = {
                "ids": selectedIds
            }
            const response = await apiCall({
                endPoint: API_ROUTES.CONNNTACT_US,
                method: 'DELETE',
                body: httpBody
            });

            if (response && response.success) {
                await fetchRequestData()
                toast.success("Record Deleted Successfully")
                setSelectedIds([])
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoading(false);
        }
    }

    const markAsComplete = async (id: string) => {
        setLoading(true);
        try {
            const httpBody = {
                "status": "responded"
            }
            const response = await apiCall({
                endPoint: API_ROUTES.UPDATE_CONTACT_US_STATUS(id),
                method: 'PATCH',
                body: httpBody
            });

            if (response && response.success) {
                await fetchRequestData()
                toast.success("Status Updated Successfully")
                setSelectedIds([])
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoading(false);
        }
    }

    // Fecth Contact Us Data 
    const fetchRequestData = useCallback(async () => {
        setLoading(true);
        try {
            const response: IRequestResponse = await apiCall({
                endPoint: API_ROUTES.CONNNTACT_US,
                method: 'GET'
            });

            if (response && response.success) {
                const receivedArray = response.data

                setAllRequestData(receivedArray)
                setRequestsData(receivedArray)
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequestData()
    }, [fetchRequestData])

    useEffect(() => {
        const paginated = requestsData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        // setTableRowData(paginated);
    }, [currentPage, requestsData, itemsPerPage]);

    const handleClickAiReply = async (item: IRequestType) => {
    try {
        setIsGeneratingAns(true);

        const res = await apiCall({
            method: "POST",
            endPoint: API_ROUTES.ADMIN.AI_GENERATE_CONTACT_QUERY_ANSWER,
            body: {
                query: item.message,
            },
        });

        if (res.success) {
            // Clean Markdown from response
            const markdownText = res.data.replace(/\\n/g, "\n").replace(/\*\*/g, "");
            
            const encodedBody = encodeURIComponent(markdownText);

            // Build the mailto link
            const mailtoLink = `mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(item.subject)}&body=${encodedBody}`;

            // Create and trigger anchor
            const element = document.createElement("a");
            element.setAttribute("href", mailtoLink);
            element.setAttribute("target", "_blank");
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
    } finally {
        setIsGeneratingAns(false);
    }
};

    const tableHeaders: Column<IRequestType>[] = [
        {
            header: <input
                type="checkbox"
                className="form-checkbox accent-[#2563EB] h-4 w-4 cursor-pointer"
                checked={!loading && selectedIds.length === allRequestsData.length}
                onChange={() => selectAllRowsId()}
            />,
            key: 'name',
            isSortable: false,
            render: (row) =>
                <input
                    type="checkbox"
                    className="form-checkbox accent-[#2563EB] h-4 w-4 cursor-pointer"
                    checked={selectedIds.includes(row._id)}
                    onChange={() => selectParticulartRowId(row._id)}
                />
        },

        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Subject', key: 'subject' },
        {
            header: 'Message', key: 'message', render: (row) =>
                <TooltipWrapper tooltip={`${row.message}`}>
                    <p className='max-w-60 truncate'>{row.message}</p>
                </TooltipWrapper>
        },
        {
            header: 'Status', key: 'status', render: (item) =>
                <span
                    className={`px-2 py-1 rounded-full text-xs capitalize font-semibold ${statusColor[item.status as keyof typeof statusColor]}`}
                >
                    {item.status}
                </span>
        },
    ];

    const tableActions: Action<IRequestType>[] = [
        {
            icon: <SquareCheckBig className="h-5 w-5 text-green-700 hover:text-green-800 cursor-pointer disabled:cursor-not-allowed ml-4 disabled:text-gray-400" />,
            onClick: (row: IRequestType) => markAsComplete(row._id),
            disabled: (row) => row.status !== "pending"
        },
        {
            icon: <EyeIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer ml-4" />,
            onClick: (row: IRequestType) => openViewModal(row),
        },
        {
            icon: <EnvelopeIcon className="h-5 w-5 text-gray-700 hover:text-gray-800 cursor-pointer ml-4" />,
            onClick: (row) => window.open(`mailto:${row.email}?subject=${encodeURIComponent(row.subject)}`, '_blank'),
        },
        {
            icon: <Sparkles className="w-5 h-5 text-gray-700 hover:text-gray-800 ml-4 cursor-pointer" />,
            onClick: (row) => handleClickAiReply(row)
        }
    ];

    return (
        <div className='px-8 py-5'>

            <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.CONTACT_US.MAIN_PAGE} />

            <ChartCard>

                <TitleSection title='All Support Requests' />

                {/* Search Bar & Delete All  */}
                <div className="flex justify-between items-center gap-2 space-x-2 w-full my-5">
                    {/* Search Input */}
                    <SearchInput
                        value={searchQuery}
                        onChange={(value) => handleSearch(value)}
                        placeholder="Search requests"
                        inputClassName='pl-10 pr-4 py-2 w-full'
                    />

                    <CustomButton
                        onClick={openDeleteModal}
                        disabled={selectedIds.length === 0}
                        variant='delete'
                        startIcon={<TrashIcon className="w-5 h-5 font-bold" />}
                        className="disabled:bg-red-300 disabled:cursor-not-allowed cursor-pointer md:flex gap-1 items-center"
                    >
                        <p className="hidden md:block">Delete</p>
                    </CustomButton>
                </div>

                {/* TABLE  */}
                <DataTable
                    loading={loading}
                    data={requestsData}
                    columns={tableHeaders}
                    actions={tableActions}
                />

            </ChartCard>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal}
                onClose={closeDeleteModal}
                onConfirm={deleteRequestById}
                description='Are you sure you want to delete selected items?'
            />

            {/* View Modal */}
            <ContactModal
                isOpen={viewModal}
                onClose={closeViewModal}
                contactInfo={contactInfo}
            />

        </div>
    )
}

export default AdminContactUsPage