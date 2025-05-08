"use client";

import React, { useState, useCallback, useEffect } from 'react'

// Next Support
import { useRouter } from 'next/navigation';

// Custom Components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import Pagination from '@/components/admin-components/Pagination';
import DeleteModal from '@/components/common/DeleteModal';
import TableSkeleton from '@/components/common/TableSkeloton';
import EditFaqModal from '@/components/admin-components/EditFaqsModal';

// Icons
import { MagnifyingGlassIcon, TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline"

// Constant imports
import { API_ROUTES, ROUTES } from '@/utils/constant';

// Heleper & Service 
import { apiCall } from '@/utils/services/request';
import { getPaginatedData, getSearchResults } from './helper';

// Types
import { IFAQsItem, IFaqApiResponse, IFaqData } from './types';

// Library support
import { toast } from 'react-toastify';

const AdminFaqsPage = () => {
  const router = useRouter()

  const [allFaqsData, setAllFaqsData] = useState<IFaqData[]>([])
  const [faqsData, setFaqsData] = useState<IFaqData[]>([])
  const [tableRowData, setTableRowData] = useState<IFaqData[]>([])

  const [faqInfo, setFaqInfo] = useState<IFAQsItem>({
    answer: "",
    question: "",
  })
  const [faqRowId, setFaqRowId] = useState("")

  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = faqsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const navToFAQCreationPage = () => {
    router.push(ROUTES.ADMIN.CREATE_FAQs)
  }

  const openDeleteModal = (id: string) => {
    setFaqRowId(id)
    setDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setFaqRowId("")
    setDeleteModal(false)
  }

  const openEditModal = (faqItem: IFaqData) => {
    const faqObject = {
      answer: faqItem.answer,
      question: faqItem.question,
    }
    setFaqRowId(faqItem._id)
    setFaqInfo(faqObject)
    setEditModal(true)
  }

  const closeEditModal = () => {
    setFaqRowId("")
    setEditModal(false)
  }

  const handleSearch = (searchVal: string) => {
    const result = getSearchResults(allFaqsData, searchVal)
    const rowResult = getPaginatedData(result, 1, itemsPerPage);

    setTableRowData(rowResult);
    setFaqsData(result)
    setCurrentPage(1);
    setSearchQuery(searchVal)
  }

  const deleteFaqById = async () => {
    setDeleteModal(false)
    setLoading(true);
    try {

      const response = await apiCall({
        endPoint: `${API_ROUTES.FAQs}/${faqRowId}`,
        method: 'DELETE',
      });

      if (response && response.success) {
        await fetchFaqsData()
        toast.success("Faq Deleted Successfully")
        setFaqRowId("")
        setCurrentPage(1)
      }
    } catch (err) {
      console.error('Error fetching chart data', err);
    } finally {
      setLoading(false);
    }
  }

  const updateFaqById = async (faqsValus: IFAQsItem) => {
    setEditModal(false)
    setLoading(true);
    try {

      const response = await apiCall({
        endPoint: `${API_ROUTES.FAQs}/${faqRowId}`,
        method: 'PUT',
        body: faqsValus
      });

      if (response && response.success) {
        await fetchFaqsData()
        toast.success("Faq Updated Successfully")
        setFaqRowId("")
        setCurrentPage(1)
      }
    } catch (err) {
      console.error('Error fetching chart data', err);
    } finally {
      setLoading(false);
    }
  }

  // Fecth FAQs Data Data 
  const fetchFaqsData = useCallback(async () => {
    setLoading(true);
    try {
      const response: IFaqApiResponse = await apiCall({
        endPoint: API_ROUTES.FAQs,
        method: 'GET'
      });

      if (response && response.success) {
        const receivedArray = response.data.slice().reverse();

        const tableRowData = getPaginatedData(receivedArray, currentPage, itemsPerPage)

        setAllFaqsData(receivedArray)
        setFaqsData(receivedArray)
        setTableRowData(tableRowData)
      }
    } catch (err) {
      console.error('Error fetching chart data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqsData()
  }, [fetchFaqsData])

  useEffect(() => {
    const paginated = faqsData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setTableRowData(paginated);
  }, [currentPage, faqsData, itemsPerPage]);



  return (
    <div className='p-8'>

      <ChartCard>
        <p className="text-2xl font-bold">All FAQs</p>

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
              placeholder="Search faqs"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <button
            onClick={navToFAQCreationPage}
            className="md:flex gap-1 items-center font-bold cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon className="w-5 h-5 font-bold" />
            <p className="hidden md:block">Add</p>
          </button>
        </div>

        {/* Data Table  */}

        <div className="overflow-x-auto py-4 bg-white rounded-lg">
          <table className="min-w-full table-fixed text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">
                  Question
                </th>
                <th className="p-3">Answer</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ?
                <TableSkeleton rows={itemsPerPage} columns={4} />
                : tableRowData.length > 0 ? (
                  tableRowData.map((item, idx) => {
                    return (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3">{item.question}</td>
                        <td className="p-3">{item.answer}</td>
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
                    );
                  })
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
        {faqsData.length > 0 && (
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
        onConfirm={deleteFaqById}
      />

      {/* Edit Modal */}
      <EditFaqModal
        isOpen={editModal}
        onClose={closeEditModal}
        saveChnages={(values) => updateFaqById(values)}
        faqsValues={faqInfo}
      />

    </div>
  )
}

export default AdminFaqsPage