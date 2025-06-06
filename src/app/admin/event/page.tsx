"use client";

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image';

// Custom Compoents
import DeleteDialog from '@/components/common/DeleteModal';
import FilterModal from '@/components/common/FilterModal';
import CustomButton from '@/components/common/CustomButton';
import ChartCard from '@/components/admin-components/dashboard/ChartCard';
import Breadcrumbs from '@/components/common/BreadCrumbs';
import TitleSection from '@/components/common/TitleSection';
import SearchInput from '@/components/common/CommonSearchBar';
import DataTable from '@/components/common/DataTable';

// types import
import { Action, Column, EventResponse, EventsDataTypes, IApplyFiltersKey } from '@/utils/types';
import { IEventCategoryResp } from '../dropdowns/types';

// library support 
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { FunnelIcon, PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// constant import
import { API_ROUTES, BREAD_CRUMBS_ITEMS, ROUTES } from '@/utils/constant';


// helper functions
import { apiCall } from '@/utils/services/request';
import { getStatus, getTicketPriceRange, getFilteredData, getMaxTicketPrice, parseDurationToMinutes } from './helper';

function EventsListpage() {
  const router = useRouter()

  const [allEventsData, setAllEventsData] = useState<EventsDataTypes[]>([]) // Initial
  const [eventsData, setEventsData] = useState<EventsDataTypes[]>([]) // filtered
  const [loading, setLoading] = useState<boolean>(true)
  const [deletableEventId, setDeletableId] = useState<string>("")

  const [filterModal, setFilterModal] = useState(false)
  const [filterValues, setFilterValues] = useState<IApplyFiltersKey>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0)
  const [categoriesOptions, setCategoriesOptions] = useState<{ id: string, label: string, value: string }[]>([])


  const navToCreateEventPage = () => {
    router.push(ROUTES.ADMIN.CREATE_EVENT)
  }

  const navToEditPage = (eventId: string) => {
    router.push(`${ROUTES.ADMIN.EVENTS}/${eventId}`)
  }

  const navToClonePage = (eventId: string) => {
    router.push(`${ROUTES.ADMIN.EVENTS}/clone/${eventId}`)
  }

  const openDeleteModal = (eventId: string) => {
    setDeletableId(eventId)
  }

  const openFilterModal = () => {
    setFilterModal(true)
  }

  const closeFilterModal = () => {
    setFilterModal(false)
  }

  const searchEvents = (keyword: string) => {
    const updatedFilters = {
      ...filterValues,
      search: keyword,
    };
  
    const result = getFilteredData(allEventsData, updatedFilters);

    setEventsData(result.data);
    setSearchQuery(keyword);
    setFilterValues(updatedFilters);
  };

  const submitFilters = (filterValues: IApplyFiltersKey) => {
    closeFilterModal();
    const updatedFilters = {
      ...filterValues,
      search: searchQuery || "", // include active search in filter logic
    };

    const result = getFilteredData(allEventsData, updatedFilters);

    setEventsData(result.data);
    setFilterValues(updatedFilters);
    setAppliedFiltersCount(result.filterCount);
  }

  const statusColor = {
    Upcoming: "bg-blue-100 text-blue-700",
    Ongoing: "bg-green-100 text-green-700",
    Ended: "bg-gray-100 text-gray-700",
    "Sold Out": "bg-red-100 text-red-700",
  };

  const fetchEvents = async () => {
    const response = await apiCall({
      endPoint: API_ROUTES.ADMIN.GET_EVENTS,
      method: "GET",
    })

    if (response && response.success && response.data.length > 0) {
      const receivedArrayObj: EventResponse = response.data

      const modifiedArray = receivedArrayObj.map(item => {
        return {
          id: item._id,
          img: item.images?.length > 0 ? item.images[0]?.url : "",
          title: item.title,
          category: item.category,
          startTime: moment(item.startDateTime).format(
            "DD MMM YYYY, h:mm A"
          ),
          endTime: moment(item.endDateTime).format(
            "DD MMM YYYY, h:mm A"
          ),
          duration: item.duration,
          location: item.location.address,
          price: getTicketPriceRange(item.tickets),
          ticketsAvailable: item.tickets.reduce(
            (sum, ticket) => sum + (ticket.totalSeats - ticket.totalBookedSeats),
            0
          ),
          totalTickets: item.tickets.reduce(
            (sum, ticket) => sum + ticket.totalSeats,
            0
          ),
          ticketsArray: item.tickets,
        }
      })

      setAllEventsData(modifiedArray)
      setEventsData(modifiedArray)
      setLoading(false)
    } else {
      setAllEventsData([])
      setLoading(false)
    }
  }

  const deleteEvents = async () => {
    try {
      const result = await apiCall({
        endPoint: API_ROUTES.ADMIN.DELETE_EVENT(deletableEventId),
        method: "DELETE",
      })

      if (result && result.success) {
        setDeletableId("")
        toast.success("Event deleted successfully")
        setLoading(true)
        fetchEvents()
      } else {
        toast.warning("Something went wrong. try again later")
      }

    } catch (err) {
      console.log("ERROR_AT_EVENT_DELETE", err)
    }
  }
  const getCategories = useCallback(async () => {
    try {
      const response: IEventCategoryResp = await apiCall({
        endPoint: API_ROUTES.CATEGORY,
        method: 'GET',
      });

      if (response && response.success) {
        const receivedArray = response.data || [];
        const result = receivedArray?.map((item) => ({
          id: item?._id,
          label: item?.name,
          value: item?.name
        }));
        setCategoriesOptions(result)
      }
    } catch (err) {
      console.error('Error fetching ticket types', err);
    }
  }, []);

  useEffect(() => {
    getCategories()
    fetchEvents()
  }, [])

  const tableHeaders: Column<EventsDataTypes>[] = [
    {
      header: "Image",
      key: "img",
      isSortable: false,
      render: (event) => (
        <Image
          src={event.img}
          alt="avatar"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { header: "Title", key: "title" },
    {
      header: "Category",
      key: "category",
      render: (row) => <p>{row.category.name}</p>,
      sortKey: (row) => row.category.name,
    },
    {
      header: "Start Date/Time",
      key: "startTime",
      render: (row) => (
        <p>{moment(row.startTime).format("DD MMM YYYY, h:mm A")}</p>
      ),
    },
    {
      header: "Duration",
      key: "duration",
      sortKey: (row) => {
        const minutes = parseDurationToMinutes(row.duration);
        return minutes;
      },
    },
    {
      header: "Location",
      key: "location",
      render: (row) => (
        <div className="max-w-40">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="truncate max-w-[90%]">
                {row.location}
              </TooltipTrigger>
              <TooltipContent>
                <p className=" text-white font-bold">{row.location}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      header: "Ticket Price",
      key: "price",
      sortKey: (row) => {
        const prices = row.ticketsArray.map(t => t.price);
        if (prices.length === 0) return 0;
        const min = Math.min(...prices);
        return min;
      },
    },
    { header: "Tickets Available", key: "ticketsAvailable" },
    {
      header: "Status",
      key: "endTime",
      sortKey: (row) => {
        const status = getStatus(
          row.startTime,
          row.endTime,
          row.ticketsAvailable
        );

        return status;
      },
      render: (row) => {
        const status = getStatus(
          row.startTime,
          row.endTime,
          row.ticketsAvailable
        );
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[status]}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const tableActions: Action<EventsDataTypes>[] = [
    {
      icon: <Copy className="h-5 w-5 mr-1 text-gray-500 hover:text-gray-700 cursor-pointer" />,
      onClick: (row: EventsDataTypes) => navToClonePage(row.id),
    },
    {
      icon: <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 cursor-pointer" />,
      onClick: (row: EventsDataTypes) => navToEditPage(row.id),
    },
    {
      icon: <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer" />,
      onClick: (row: EventsDataTypes) => openDeleteModal(row.id),
    },
  ];
    
  return (
    <div className="px-8 py-5">
      <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.EVENT.LIST_PAGE} />

      <ChartCard>
        <TitleSection title='All Events' />

        {/* Search Bar & Filters  */}

        <div className="flex gap-4 justify-between items-start sm:items-center my-5">
          <div className="flex  items-baseline sm:items-center sm:flex-row flex-col gap-2 space-x-2 w-full">
            {/* Search Input */}
            <SearchInput 
                value={searchQuery}
                onChange={(value) => searchEvents(value)}
                placeholder="Search events"
                inputClassName='pl-10 pr-4 py-2 w-full'
            />

            {/* Filters Button */}
            <div className="relative md:inline-block hidden">
              <button
                onClick={openFilterModal}
                className="flex items-center font-bold cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
              >
                <FunnelIcon className="w-5 h-5 font-bold mr-2" />
                Filters
              </button>

              {appliedFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-200 text-green-800 text-sm font-bold px-1.5 py-0.5 rounded-full">
                  {appliedFiltersCount}
                </span>
              )}
            </div>
          </div>

          {/* Add Event Button */}
          <button
            onClick={navToCreateEventPage}
            className="md:w-40 hidden w-auto md:flex gap-1 items-center font-bold cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon className="w-5 h-5 font-bold" />
            <p className="hidden md:block">Add Event</p>
          </button>
        </div>

        {/* Mobile view */}

        <div className="flex gap-4 justify-between items-start sm:items-center">

          {/* Filters Button */}
          <div className="relative inline-block sm:block  md:hidden">
            <CustomButton
              onClick={openFilterModal}
              className="flex items-center font-bold cursor-pointer bg-teal-500 hover:bg-teal-600 text-white"
            >
              <FunnelIcon className="w-5 h-5 font-bold mr-2" />
              Filters
            </CustomButton>

            {appliedFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-slate-200 text-green-800 text-sm font-bold px-1.5 py-0.5 rounded-full">
                {appliedFiltersCount}
              </span>
            )}
          </div>

          {/* Add Event Button */}
          <CustomButton
            onClick={navToCreateEventPage}
            variant='primary'
            startIcon={<PlusIcon className="w-5 h-5 font-bold" />}
            className="md:w-40 md:hidden w-auto sm:flex gap-1 items-center"
          >
            <p className="hidden md:block">Add Event</p>
          </CustomButton>
        </div>

        {/* Data Table  */}
        <DataTable
            loading={loading}
            columns={tableHeaders}
            actions={tableActions}
            data={eventsData}
        />

      </ChartCard>

      {/* Delete Popup */}
      <DeleteDialog
        isOpen={deletableEventId !== ""}
        onClose={() => setDeletableId("")}
        onConfirm={deleteEvents}
        loading={loading}
      />

      {/* Filter Popup */}
      <FilterModal
        isOpen={filterModal}
        onClose={closeFilterModal}
        applyFilters={submitFilters}
        maxTicketPrice={getMaxTicketPrice(allEventsData)}
        categoriesOptions={categoriesOptions}
      />
    </div>
  );
}

export default EventsListpage