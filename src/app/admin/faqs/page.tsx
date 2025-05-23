"use client";

import React, { useState, useCallback, useEffect } from 'react'

// Next Support
import { useRouter } from 'next/navigation';

// Custom Components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import DeleteModal from '@/components/common/DeleteModal';
import EditFaqModal from '@/components/admin-components/EditFaqsModal';
import Breadcrumbs from '@/components/common/BreadCrumbs';
import TitleSection from '@/components/common/TitleSection';
import CustomButton from '@/components/common/CustomButton';
import SearchInput from '@/components/common/CommonSearchBar';

// Icons
import { TrashIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline"

// Constant imports
import { API_ROUTES, BREAD_CRUMBS_ITEMS, ROUTES } from '@/utils/constant';

// Heleper & Service 
import { apiCall } from '@/utils/services/request';
import { getPaginatedData, getSearchResults } from './helper';

// Types
import { IFAQsItem, IFaqApiResponse, IFaqData } from './types';

// Library support
import { toast } from 'react-toastify';
import DataTable from '@/components/common/DataTable';

const AdminFaqsPage = () => {
  const router = useRouter()

  const [allFaqsData, setAllFaqsData] = useState<IFaqData[]>([])
  const [faqsData, setFaqsData] = useState<IFaqData[]>([])

  const [faqInfo, setFaqInfo] = useState<IFAQsItem>({
    answer: "",
    question: "",
  })
  const [faqRowId, setFaqRowId] = useState("")

  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
    setFaqsData(result)
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
        setAllFaqsData(receivedArray)
        setFaqsData(receivedArray)
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

  const tableheaders: { header: string; key: keyof IFaqData }[] = [
    { header: 'Question', key: 'question' },
    { header: 'Answer', key: 'answer' },
  ];

  const tableActions = [
    {
      icon: <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer" />,
      onClick: (row: IFaqData) => openEditModal(row),
    },
    {
      icon: <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer" />,
      onClick: (row: IFaqData) => openDeleteModal(row._id),
    },
  ];



  return (
    <div className='px-8 py-5'>

        <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.FAQs.LIST_PAGE} />

      <ChartCard>

      <TitleSection title='All FAQs'/>

        {/* Search Bar & Delete All  */}
        <div className="flex justify-between items-center gap-2 space-x-2 w-full my-5">
          {/* Search Input */}
          <SearchInput
            value={searchQuery}
            onChange={(value) => handleSearch(value)}
            placeholder="Search faqs"
            inputClassName='pl-10 pr-4 py-2 w-full'
          />

          <CustomButton
            variant='primary'
            onClick={navToFAQCreationPage}
            className='md:flex gap-1 items-center'
            startIcon={<PlusIcon className="w-5 h-5 font-bold" />}
          >
              <p className="hidden md:block">Add</p>
          </CustomButton>
        </div>

        {/* Data Table + Pagination */}

        <DataTable 
            loading={loading}
            data={faqsData}
            columns={tableheaders}
            actions={tableActions}
            showSerialNumber
        />

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