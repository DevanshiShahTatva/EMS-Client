"use client";

import React, { useEffect, useState } from 'react'
import Image from 'next/image';

// Custom Compoents
import Loader from '@/components/common/Loader';
import DeleteDialog from '@/components/common/DeleteModal';
import FilterModal from '@/components/common/FilterModal';
import ChartCard from '@/components/admin-components/dashboard/ChartCard';
import Pagination from '@/components/admin-components/Pagination';

// types import
import { EventResponse, EventsDataTypes, IApplyFiltersKey } from '@/utils/types';

// library support 
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, PencilSquareIcon, TrashIcon, ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline"
import { toast } from 'react-toastify';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// constant import
import { API_ROUTES, ROUTES } from '@/utils/constant';


// helper functions
import { apiCall } from '@/utils/services/request';
import { getStatus, getTicketPriceRange, sortEvents, getFilteredData, getMaxTicketPrice, getPaginatedData } from './helper';

function EventsListpage() {
  const router = useRouter()

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [allEventsData, setAllEventsData] = useState<EventsDataTypes[]>([]) // Initial
  const [eventsData, setEventsData] = useState<EventsDataTypes[]>([]) // filtered
  const [rowData, setRowData] = useState<EventsDataTypes[]>([]) // tableRow 
  const [loading, setLoading] = useState<boolean>(true)
  const [deletableEventId, setDeletableId] = useState<string>("")

  const [filterModal, setFilterModal] = useState(false)
  const [filterValues, setFilterValues] = useState<IApplyFiltersKey>({})
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortByKey, setSortByKey] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0)


  const totalItems = eventsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const navToCreateEventPage = () => {
    router.push(ROUTES.ADMIN.CREATE_EVENT)
  }

  const navToEditPage = (eventId: string) => {
    router.push(`${ROUTES.ADMIN.EVENTS}/${eventId}`)
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

  const sortEventsByKey = (key: keyof Omit<EventsDataTypes, "img"> | "status") => {

    let newOrder: "asc" | "desc" = "asc";

    if (key === sortByKey) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    const result = sortEvents(rowData, key, newOrder);
    setRowData(result);
    setSortOrder(newOrder);
    setSortByKey(key);
  };

  const searchEvents = (keyword: string) => {
    const updatedFilters = {
      ...filterValues,
      search: keyword,
    };
  
    const result = getFilteredData(allEventsData, updatedFilters);
    const rowResult = getPaginatedData(result.data, 1, itemsPerPage);
  
    setRowData(rowResult);
    setEventsData(result.data);
    setSearchQuery(keyword);
    setFilterValues(updatedFilters);
    setCurrentPage(1);
  };

  const submitFilters = (filterValues: IApplyFiltersKey) => {
    closeFilterModal();
    const updatedFilters = {
      ...filterValues,
      search: searchQuery || "", // include active search in filter logic
    };

    const result = getFilteredData(allEventsData, updatedFilters);
    const rowResult = getPaginatedData(result.data, 1, itemsPerPage);

    setRowData(rowResult);
    setEventsData(result.data);
    setFilterValues(updatedFilters);
    setAppliedFiltersCount(result.filterCount);
    setCurrentPage(1);
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
          ticketsArray: item.tickets
        }
      })

      const tableRowData = getPaginatedData(modifiedArray, currentPage, itemsPerPage)

      setAllEventsData(modifiedArray)
      setEventsData(modifiedArray)
      setRowData(tableRowData)
      setLoading(false)
    } else {
      setAllEventsData([])
      setLoading(false)
    }
  }

  const deleteEvents = async () => {
    setLoading(true)
    const result = await apiCall({
      endPoint: API_ROUTES.ADMIN.DELETE_EVENT(deletableEventId),
      method: "DELETE",
    })

    if (result && result.success) {
      fetchEvents()
      setDeletableId("")
      toast.success("Event deleted successfully")
    } else {
      toast.warning("Something went wrong. try again later")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const paginated = eventsData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setRowData(paginated);
  }, [currentPage, eventsData, itemsPerPage]);

  const renderSortableRow = (
    title: string,
    sortKey: keyof Omit<EventsDataTypes, "img"> | "status"
  ) => {
    return (
      <div
        className="flex gap-1 cursor-pointer"
        onClick={() => sortEventsByKey(sortKey)}
      >
        <p>{title}</p>
        {sortByKey === sortKey && (
          <div>
            {sortOrder === "asc" ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      {loading && <Loader />}

      <ChartCard>
        <p className="text-2xl font-bold">All Events</p>

        {/* Search Bar & Filters  */}

        <div className="flex gap-4 justify-between items-start sm:items-center my-5">
          <div className="flex  items-baseline sm:items-center sm:flex-row flex-col gap-2 space-x-2 w-full">
            {/* Search Input */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => searchEvents(e.target.value)}
                placeholder="Search events"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

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

          {/* Add Event Button */}
          <button
            onClick={navToCreateEventPage}
            className="md:w-40 md:hidden w-auto sm:flex gap-1 items-center font-bold cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon className="w-5 h-5 font-bold" />
            <p className="hidden md:block">Add Event</p>
          </button>
        </div>

        {/* Data Table  */}

        <div className="overflow-x-auto py-4 bg-white rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">{renderSortableRow("Title", "title")}</th>
                <th className="p-3">
                  {renderSortableRow("Category", "category")}
                </th>
                <th className="p-3">
                  {renderSortableRow("Start Date/Time", "startTime")}
                </th>
                <th className="p-3">
                  {renderSortableRow("Duration", "duration")}
                </th>
                <th className="p-3">
                  {renderSortableRow("Location", "location")}
                </th>
                <th className="p-3">
                  {renderSortableRow("Ticket Price", "price")}
                </th>
                <th className="p-3">
                  {renderSortableRow("Tickets Available", "ticketsAvailable")}
                </th>
                <th className="p-3">{renderSortableRow("Status", "status")}</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rowData.length > 0 ? (
                rowData.map((event, idx) => {
                  const status = getStatus(
                    event.startTime,
                    event.endTime,
                    event.ticketsAvailable
                  );
                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {event.img === "" ? (
                          "-"
                        ) : (
                          <Image
                            src={event.img}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                      </td>
                      <td className="p-3">{event.title}</td>
                      <td className="p-3">{event.category}</td>
                      <td className="p-3">
                        {moment(event.startTime).format("DD MMM YYYY, h:mm A")}
                      </td>
                      <td className="p-3">{event.duration}</td>
                      <td className="p-3 max-w-40">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="truncate max-w-40">
                              {event.location}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className=" text-white font-bold">
                                {event.location}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="p-3">{event.price}</td>
                      <td className="p-3">{event.ticketsAvailable}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => navToEditPage(event.id)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(event.id)}
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
                  <td colSpan={10} className="text-center">
                    <p className="my-3 font-bold">No events found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {eventsData.length > 0 && (
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
      />
    </div>
  );
}

export default EventsListpage