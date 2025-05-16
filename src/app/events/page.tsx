'use client'
import React, { useEffect, useState } from 'react'

// Custom components
import { FilterOptions } from '@/components/events-components/FilterOptions'
import { FeaturedEvent } from '@/components/events-components/FeaturedEvent'
import { EventList } from '@/components/events-components/EventList'
import Loader from '@/components/common/Loader'
import FilterModal from '@/components/common/FilterModal'

// Constant support
import { API_ROUTES } from '@/utils/constant'
import { getTicketPriceRange } from '../admin/event/helper'
import { areAllTicketsBooked, convertFiltersToArray, getEventStatus, isNearbyWithUserLocation, removeFilterFromObject, getFilteredEventsData, getMaxTicketPrice } from './event-helper'

// Types support
import { EventData, EventCategory, SortOption, EventResponse } from "./types";
import { IApplyFiltersKey } from '@/utils/types'
import { LabelValue } from './types'

// Api services
import { apiCall } from '@/utils/services/request';

// Other library
import moment from 'moment'

// Icons & Images
import { FunnelIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from "@heroicons/react/24/solid";
import { SearchIcon } from 'lucide-react'


const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([])
  const [allEvents, setAllEvents] = useState<EventData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all')
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [loading, setLoading] = useState<boolean>(true)
  
  const [filterModal, setFilterModal] = useState<boolean>(false)
  const [appliedFilters, setAppliedFilters] = useState<IApplyFiltersKey>({})
  const [appliedFiltersArray, setAppliedFiltersArray] = useState<LabelValue[]>([])


  const openFilterModal = () => setFilterModal(true)

  const closeFilterModal = () => setFilterModal(false)

  const handleSearchQuery = (keyword : string) => {
    const updatedFilters = {
      ...appliedFilters,
      search: keyword,
    };

    const result = getFilteredEventsData(allEvents, updatedFilters);

    setEvents(result);
    setSearchQuery(keyword);
    setAppliedFilters(updatedFilters);
  }

  const applyFilters = (filterValues : IApplyFiltersKey) => {
    const updatedFilters = {
      ...filterValues,
      search: searchQuery || "", // include active search in filter logic
    };

    const results = convertFiltersToArray(filterValues)
    const filteredData = getFilteredEventsData(allEvents, updatedFilters) 
    setAppliedFilters(filterValues)
    setAppliedFiltersArray(results)
    setEvents(filteredData)
    closeFilterModal()
  }

  const removeFilterChip = (key : keyof IApplyFiltersKey, value : string) => {
    const modifiedArray = appliedFiltersArray.filter(item => item.value !== value)
    const updatedFiltersObject = removeFilterFromObject(key,value,appliedFilters)
    const filteredData = getFilteredEventsData(allEvents, updatedFiltersObject)
    setAppliedFilters(updatedFiltersObject)
    setAppliedFiltersArray(modifiedArray)
    setEvents(filteredData)
  }

  const fetchEvents = async () => {
        const result = await apiCall({
          endPoint : API_ROUTES.ADMIN.GET_EVENTS,
          method : "GET", 
        })
        if(result && result.success && result.data.length > 0) {
           const receivedArrayObj : EventResponse = result.data

           const top3Events = receivedArrayObj
              .filter(event => getEventStatus(event.startDateTime, event.endDateTime) !== "ended")
              .sort((a, b) => b.likesCount - a.likesCount)
              .slice(0, 3);
  
           const modifiedArray : EventData[] = await Promise.all (receivedArrayObj.map(async (item) => {
            return {
              id : item._id,
              description:item.description,
              image: item.images?.length > 0 ? item.images[0]?.url : "",
              title: item.title,
              category: item.category,
              date:moment(item.startDateTime).format(
                "DD MMM YYYY, h:mm A"
              ),   
              location: item.location.address,
              priceRange: getTicketPriceRange(item.tickets ),
              isSoldOut: areAllTicketsBooked(item.tickets),
              status:getEventStatus(item.startDateTime,item.endDateTime),
              isFeatured:await isNearbyWithUserLocation(item.location.lat,item.location.lng, top3Events, item),
              isLiked:item.isLiked,
              startTime : item.startDateTime,
              endTime : item.endDateTime,
              ticketsAvailable: item.tickets.reduce(
                (sum, ticket) => sum + (ticket.totalSeats - ticket.totalBookedSeats),
                0
              ),
              totalTickets: item.tickets.reduce(
                (sum, ticket) => sum + ticket.totalSeats,
                0
              ),
              ticketsArray: item.tickets,
              lat: item.location.lat,
              lng : item.location.lng
            }
           }))
  
          setEvents(modifiedArray)
          setAllEvents(modifiedArray)
          setLoading(false)
        } else {
           setEvents([])
           setLoading(false)
        }
  }
  useEffect(()=>{
    fetchEvents(); 
  },[])
  const filteredEvents = events
  .filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter((event) =>
    activeCategory === 'all' ? true : event.category?.name === activeCategory
  )
  .sort((a, b) => {
    if (sortOption === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortOption === 'date-desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortOption === 'title-asc') {
      return a.title.localeCompare(b.title)
    } else if (sortOption === 'title-desc') {
      return b.title.localeCompare(a.title)
    }
    return 0
  })

  const featuredEvent = filteredEvents.filter(event => event.isFeatured && event.status!=="ended");
  const regularEvents = filteredEvents;
  return (
    
    <div className="mx-auto p-10">
       {loading && <Loader />}
      <h1 className="text-3xl font-bold mb-6">Discover Events</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        {/* Search Bar  */}
        <div className="relative flex-grow w-full bg-white rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => handleSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className='flex gap-2 justify-between md:justify-start'>

          <button
            onClick={openFilterModal}
            className="flex items-center cursor-pointer bg-white border-1 text- px-4 py-3 text-sm font-medium text-gray-700 border-gray-300 rounded-lg"
          >
            <FunnelIcon className="w-5 h-5 font-bold mr-2" />
            Filters
          </button>

        <FilterOptions sortOption={sortOption} setSortOption={setSortOption} />
        </div>

      </div>

      <div className='my-3 flex flex-wrap gap-2' >

        {appliedFiltersArray.map((item, index) => {
          return (
            <div key={index} className="inline-flex items-center px-4 py-3 rounded-full bg-blue-100 gap-2">
              <p className='text-blue-600 text-lg font-semibold'> {item.label} </p>
              <button className='cursor-pointer' onClick={() => removeFilterChip(item.rowKey, item.value)}>
                <XMarkIcon className='h-5 w-5 font-bold text-blue-500 hover:text-blue-700 focus:outline-none' />
              </button>
            </div>  
          )
        })} 

      </div>

      {(featuredEvent.length>0 && searchQuery==="") && (
        <div className="mb-8 mt-6">
          <h2 className="text-xl font-semibold mb-4">Featured Event</h2>
          <FeaturedEvent event={featuredEvent} />
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Events</h2>
        <EventList events={regularEvents} />
      </div>

      <FilterModal
        isOpen={filterModal}
        onClose={closeFilterModal}
        applyFilters={(values) => applyFilters(values)}
        maxTicketPrice={getMaxTicketPrice(allEvents)}
        isUserRole={true}
        filterValues={appliedFilters}
      />
    </div>
  )
}
export default EventsPage