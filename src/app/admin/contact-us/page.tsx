"use client"
import React, { useCallback, useEffect, useState } from 'react'

// Custom Components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import TooltipWrapper from '@/components/common/TooltipWrapper'
import Pagination from '@/components/admin-components/Pagination'
import DeleteModal from '@/components/common/DeleteModal'
import ContactModal from '@/components/admin-components/ViewContactInfo'
import TableSkeleton from '@/components/common/TableSkeloton'
import Breadcrumbs from '@/components/common/BreadCrumbs'
import TitleSection from '@/components/common/TitleSection'

// Icons
import { MagnifyingGlassIcon, TrashIcon, EyeIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { SquareCheckBig } from 'lucide-react'

// Types
import { IRequestResponse, IRequestType } from './types'

// Constant
import { API_ROUTES, BREAD_CRUMBS_ITEMS } from '@/utils/constant'

// Helpers
import { getPaginatedData, getSearchResults, INITIAL_CONTATC_INFO, statusColor } from './helper'

//  Services
import { apiCall } from '@/utils/services/request'

// library
import { toast } from 'react-toastify'

const AdminContactUsPage = () => {

    const [allRequestsData, setAllRequestData] = useState<IRequestType[]>([])
    const [requestsData, setRequestsData] = useState<IRequestType[]>([])
    const [tableRowData, setTableRowData] = useState<IRequestType[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const [contactInfo, setContactInfo] = useState<IRequestType>(INITIAL_CONTATC_INFO)

    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = requestsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleSearch = (searchVal : string) => {
        const result = getSearchResults(allRequestsData,searchVal)
        const rowResult = getPaginatedData(result, 1, itemsPerPage);

        setTableRowData(rowResult);
        setRequestsData(result)
        setCurrentPage(1);
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

    const openViewModal = (item : IRequestType) => {
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
                body :  httpBody
            });

            if(response && response.success) {
                await fetchRequestData()
                toast.success("Record Deleted Successfully")
                setCurrentPage(1)
                setSelectedIds([])
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoading(false);
        }
    }

    const markAsComplete = async (id : string) => {
        setLoading(true);
        try {
            const httpBody = {
                "status": "responded"
            }
            const response = await apiCall({ 
                endPoint: API_ROUTES.UPDATE_CONTACT_US_STATUS(id), 
                method: 'PATCH',
                body :  httpBody
            });

            if(response && response.success) {
                await fetchRequestData()
                toast.success("Status Updated Successfully")
                setCurrentPage(1)
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
            const response : IRequestResponse = await apiCall({ 
                endPoint: API_ROUTES.CONNNTACT_US, 
                method: 'GET' 
            });

            if(response && response.success) {
                const receivedArray = response.data

                const tableRowData = getPaginatedData(receivedArray, currentPage, itemsPerPage)
                
                setAllRequestData(receivedArray)
                setRequestsData(receivedArray)
                setTableRowData(tableRowData)
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequestData()
    },[fetchRequestData])

    useEffect(() => {
        const paginated = requestsData.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );
        setTableRowData(paginated);
      }, [currentPage, requestsData, itemsPerPage]);

    const renderTableRows = () => {
        return tableRowData.map(item =>
            <tr key={item._id} className="border-b hover:bg-gray-50">
                <td className="pl-4 w-8">
                    <input
                        type="checkbox"
                        className="form-checkbox accent-[#2563EB] h-4 w-4 cursor-pointer"
                        checked={selectedIds.includes(item._id)}
                        onChange={() => selectParticulartRowId(item._id)}
                    />
                </td>
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.email}</td>
                <td className="p-4">{item.subject}</td>
                <td className="p-4">
                    <TooltipWrapper tooltip={`${item.message}`}>
                        <p className='max-w-60 truncate'>{item.message}</p>
                    </TooltipWrapper>
                </td>
                <td className="p-4">
                    <span
                        className={`px-2 py-1 rounded-full text-xs capitalize font-semibold ${statusColor[item.status as keyof typeof statusColor]}`}
                    >
                        {item.status}
                    </span>
                </td>
                <td className="p-4">
                    <div className='flex gap-2 items-center'>
                        <button
                            disabled={item.status !== "pending"}
                            className="text-green-700 hover:text-green-800 cursor-pointer disabled:cursor-not-allowed ml-4 disabled:text-gray-400"
                            onClick={() => markAsComplete(item._id)}
                        >
                            <SquareCheckBig className="h-5 w-5" />
                        </button>
                        <button
                            className="text-blue-500 hover:text-blue-700 cursor-pointer ml-4"
                            onClick={() => openViewModal(item)}
                        >
                            <EyeIcon className="h-5 w-5" />
                        </button>
                        <a
                            className="text-gray-700 hover:text-gray-800 cursor-pointer ml-4"
                            href={`mailto:${item.email}?subject=${encodeURIComponent(item.subject)}`}
                            target='_blank'
                        >
                            <EnvelopeIcon className="h-5 w-5" />
                        </a>
                    </div>
                </td>
            </tr>
        )
    }

    const renderSkeleton = () => {
        return (
            <TableSkeleton rows={itemsPerPage} columns={7} />
        ) 
    }

    const renderNoDataFound = () => {
        return <tr className='text-center'>
            <td colSpan={6} >
                <div className='font-bold h-20 m-auto flex items-center justify-center'>
                    No data found
                </div>
            </td>
        </tr>
    }

  return (
    <div className='p-8'>

          <ChartCard>

             <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.CONTACT_US.MAIN_PAGE} />

             <TitleSection title='All Support Requests' />

              {/* Search Bar & Delete All  */}
              <div className="flex justify-between items-center gap-2 space-x-2 w-full my-5">
                  {/* Search Input */}
                  <div className="relative w-full">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <MagnifyingGlassIcon className="h-6 w-6" />
                      </span>
                      <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Search requests"
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                  </div>

                  <button
                      onClick={openDeleteModal}
                      disabled={selectedIds.length === 0}
                      className="disabled:bg-red-300 disabled:cursor-not-allowed md:flex gap-1 items-center font-bold cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                      <TrashIcon className="w-5 h-5 font-bold" />
                      <p className="hidden md:block">Delete</p>
                  </button>
              </div>

              {/* TABLE  */}
              <div className="overflow-x-auto my-2">
                  <table className="min-w-full bg-white text-gray-700 text-sm">
                      <thead className="bg-gray-100 whitespace-nowrap">
                          <tr>
                              <th className="pl-4 w-8">
                                  <input
                                      type="checkbox"
                                      className="form-checkbox accent-[#2563EB] h-4 w-4 cursor-pointer"
                                      checked={!loading && selectedIds.length === allRequestsData.length}
                                      onChange={() => selectAllRowsId()}
                                  />
                              </th>
                              <th className="p-4 text-left">Name</th>
                              <th className="p-4 text-left">Email</th>
                              <th className="p-4 text-left">Subject</th>
                              <th className="p-4 text-left">Message</th>
                              <th className="p-4 text-left">Status</th>
                              <th className="p-4 text-left">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="whitespace-nowrap">
                        {loading ? renderSkeleton() : tableRowData.length > 0 ? renderTableRows() : renderNoDataFound()}
                      </tbody>
                  </table>
              </div>

              {/* Pagination */}
              {!loading && requestsData.length > 0 && (
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