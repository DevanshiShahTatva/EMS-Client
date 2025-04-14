"use client";

import React, { useEffect, useState} from 'react'
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useRouter } from 'next/navigation';
import { API_ROUTES, PAGINATION_OPTIONS, ROUTES, token } from '@/utils/constant';
import moment from 'moment';
import Select from 'react-select';
import { apiCall } from '@/utils/helper';
import { EventResponse, EventsDataTypes, getTicketPriceRange } from './helper';
import Loader from '@/components/Loader';
import DeleteDialog from '@/components/DeleteModal';
import { toast } from 'react-toastify';

function EventsListpage() {
    const router = useRouter()

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [eventsData, setEventsData] = useState<EventsDataTypes[]>([])
    const [allEventsData, setAllEventsData] = useState<EventsDataTypes[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [deletableEventId, setDeletableId] = useState<string>("")

    const [searchQuery, setSearchQuery] = useState("")

    const totalItems = allEventsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrev = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
  
    const handleNext = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const navToCreateEventPage = () => {
        router.push(ROUTES.ADMIN.CREATE_EVENT)
    } 

    const navToEditPage = (eventId : string) => {
      router.push(`${ROUTES.ADMIN.EVENTS}/${eventId}`)
    }

    const openDeleteModal = (eventId : string) => {
      setDeletableId(eventId)
    }

    const searchEvents = (keyword: string) => {
      const lowerKeyword = keyword.toString().toLowerCase();
      const searchResult =  allEventsData.filter(event =>
        event.title.toLowerCase().includes(lowerKeyword) ||
        event.category.toLowerCase().includes(lowerKeyword) ||
        event.startTime.toLowerCase().includes(lowerKeyword) ||
        event.location.toLowerCase().includes(lowerKeyword) ||
        event.price.toString().toLowerCase().includes(lowerKeyword)
      );

      setSearchQuery(keyword)
      setEventsData(searchResult)
      setCurrentPage(1)
    };

    const getStatus = (startTime: string, durationStr: string, tickets: number) => {
        const now = moment();
        const start = moment(startTime);
      
        // Extract hours and minutes from duration string like "2h 30m"
        const hoursMatch = durationStr.match(/(\d+)h/);
        const minsMatch = durationStr.match(/(\d+)m/);
      
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const minutes = minsMatch ? parseInt(minsMatch[1]) : 0;
      
        const end = moment(start).add(moment.duration({ hours, minutes }));
      
        if (tickets === 0) return "Sold Out";
        if (now.isBefore(start)) return "Upcoming";
        if (now.isAfter(end)) return "Ended";
        return "Ongoing";
      };
      
      const statusColor = {
        Upcoming: "bg-blue-100 text-blue-700",
        Ongoing: "bg-green-100 text-green-700",
        Ended: "bg-gray-100 text-gray-700",
        "Sold Out": "bg-red-100 text-red-700",
      };

    const fetchEvents = async () => {
      const request = await apiCall({
        endPoint : API_ROUTES.ADMIN.GET_EVENTS,
        method : "GET",
        headers : {
          token : token
        }
      })

      const result = await request.json()

      if(result && result.success && result.data.length > 0) {
         const receivedArrayObj : EventResponse = result.data

         const modifiedArray = receivedArrayObj.map(item => {
          return {
            id : item._id,
            img: item.images?.length > 0 ? item.images[0]?.url : "",
            title: item.title,
            category: item.category,
            startTime:moment(item.startDateTime).format(
              "DD MMM YYYY, h:mm A"
            ),  
            duration: item.duration,
            location: item.location.address,
            price: getTicketPriceRange(item.tickets ),
            ticketsAvailable: item.tickets.reduce(
              (sum, ticket) => sum + (ticket.totalSeats - ticket.totalBookedSeats),
              0
            ),
          }
         })

        setAllEventsData(modifiedArray)
        setLoading(false)
      } else {
         setAllEventsData([])
         setLoading(false)
      }
    }

    const deleteEvents = async () => {
      setLoading(true)
      const request = await apiCall({
        endPoint : API_ROUTES.ADMIN.DELETE_EVENT(deletableEventId),
        method : "DELETE",
        headers : {
          token : token
        }
      })

      const result = await request.json()

      if(result && result.success) {
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
    },[])

    useEffect(() => {
      const paginated = allEventsData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      setEventsData(paginated);
    }, [allEventsData, currentPage, itemsPerPage]);

    return (
      <div className="my-5 md:my-10 lg:mx-15 md:mx-15 mx-5">
        {loading && <Loader />}

        <div className="rounded-[12px] bg-white p-5">
          <p className="text-2xl font-bold">All Events</p>

          {/* Search Bar & Filters  */}

          <div className="flex justify-between items-start sm:items-center my-5">
            <div className="flex  items-baseline sm:items-center sm:flex-row flex-col gap-3 space-x-2">
              {/* Search Input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => searchEvents(e.target.value)}
                  placeholder="Search events"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-80 md:w-40 w-full"
                />
              </div>

              {/* Filters Button */}
              <button className="flex items-center font-bold cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
                <FunnelIcon className="w-6 h-6 font-bold mr-2" />
                Filters
              </button>
            </div>

            {/* Add Event Button */}
            <button
              onClick={navToCreateEventPage}
              className="flex items-center font-bold cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              <PlusIcon className="w-6 h-6 font-bold mr-0 md:mr-2" />
              <p className="hidden md:block">Add Event</p>
            </button>
          </div>

          {/* Data Table  */}

          <div className="overflow-x-auto p-4 bg-white rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="p-3 text-center">Image</th>
                  <th className="p-3 text-center">Title</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-center">Start Date/Time</th>
                  <th className="p-3 text-center">Duration</th>
                  <th className="p-3 text-center">Location</th>
                  <th className="p-3 text-center">Ticket Price</th>
                  <th className="p-3 text-center">Tickets Available</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventsData.length > 0 ? (
                  eventsData.map((event, idx) => {
                    const status = getStatus(
                      event.startTime,
                      event.duration,
                      event.ticketsAvailable
                    );
                    return (
                      <tr key={idx} className="border-b hover:bg-gray-50 text-center">
                        <td className="p-3">
                          {event.img === "" ? (
                            "-"
                          ) : (
                            <img
                              src={event.img}
                              alt="avatar"
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                        </td>
                        <td className="p-3">{event.title}</td>
                        <td className="p-3">{event.category}</td>
                        <td className="p-3">
                          {moment(event.startTime).format(
                            "DD MMM YYYY, h:mm A"
                          )}
                        </td>
                        <td className="p-3">{event.duration}</td>
                        <td className="p-3">{event.location}</td>
                        <td className="p-3">
                          {event.price}
                        </td>
                        <td className="p-3">{event.ticketsAvailable}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[status]}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="p-3 space-x-2">
                          <button onClick={() => navToEditPage(event.id)} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => openDeleteModal(event.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center">
                      <p className="my-3 font-bold">No data available</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {eventsData.length > 0 && (
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">
                Total items: {totalItems}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  className="px-2 py-1 text-sm rounded border hover:bg-gray-200"
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 text-sm rounded border ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={handleNext}
                  className="px-2 py-1 text-sm rounded border hover:bg-gray-200"
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">
                  Show items on one page:
                </span>
                <Select
                  options={PAGINATION_OPTIONS}
                  defaultValue={PAGINATION_OPTIONS.find(
                    (opt) => opt.value === itemsPerPage
                  )}
                  onChange={(option) => {
                    if (option) {
                      setItemsPerPage(option.value);
                    }
                    setCurrentPage(1);
                  }}
                  className="w-20 text-sm"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minHeight: "32px",
                      height: "32px",
                    }),
                    indicatorsContainer: (provided) => ({
                      ...provided,
                      height: "32px",
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      height: "32px",
                      padding: "0 6px",
                    }),
                    input: (provided) => ({
                      ...provided,
                      margin: 0,
                      padding: 0,
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      fontSize: "0.875rem",
                    }),
                  }}
                  isSearchable={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Delete Popup */}
        <DeleteDialog 
           isOpen={deletableEventId !== ""}
           onClose={() => setDeletableId("")}
           onConfirm={deleteEvents}
           loading={loading}
        />
      </div>
    );
}

export default EventsListpage