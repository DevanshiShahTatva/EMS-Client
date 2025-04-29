"use client"

import React, { useState, useEffect } from 'react'

// Custom Components
import Loader from '@/components/common/Loader'
import TooltipWrapper from '@/components/common/TooltipWrapper'

// Contsant & Helper Imports
import { apiCall } from '@/utils/services/request'
import { API_ROUTES } from '@/utils/constant'
import { formatDateTime, getEventStatus, getTicketTypes } from './helper'

// Types import
import { IEventBookingResponse, IEventsState } from './types'

// Library imports
import moment from 'moment'

// Icons imports
import { CalendarDays, Clock9, MapPin, IndianRupee, Ticket, SearchIcon } from 'lucide-react'


const MyEventsPage = () => {
    const [myEvents, setMyEvents] = useState<IEventsState[]>([])
    const [allMyEvents, setAllMyEvents] = useState<IEventsState[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchMyEvents = async () => {
        const result : IEventBookingResponse = await apiCall({
            endPoint : API_ROUTES.EVENT.MY_EVENTS,
            method : "GET",
            withToken : true
        })

        if(result && result.success) {
            const eventsArray = result.data.map(item => {
                return {
                    id : item._id,
                    eventBookedOn : moment(item.bookingDate).format("DD MMM YYYY, [at] hh:mm:ss A"),
                    eventName : item.event.title,
                    eventCatogory : item.event.category,
                    eventStartTime : formatDateTime(item.event.startDateTime),
                    eventEndTime : formatDateTime(item.event.endDateTime),
                    eventDuration: item.event.duration,
                    eventLocation : item.event.location.address,
                    eventTicketCount : item.seats,
                    eventTicketType : getTicketTypes(item.event.tickets, item.ticket),
                    eventTicketPrice: item.totalAmount,
                    eventStatus : getEventStatus(item.event.startDateTime, item.event.endDateTime),
                    eventImage : item.event.images.length > 0 ? item.event.images[0].url  : ""
                }
            })

            setMyEvents(eventsArray)
            setAllMyEvents(eventsArray)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyEvents()
    },[])

    const renderUpcomingSection = () => {
        return (
            <div>
                <div className='flex gap-3 items-center'>
                    <button
                        className='px-4 py-2 mr-0 sm:mr-3 bg-blue-900 hover:bg-blue-950 text-white rounded-[8px]'
                    >
                        UPCOMING
                    </button>
                    <div className='pl-2 sm:pl-5 text-sm sm:text-xl text-gray-800 border-l border-l-gray-400'>
                         Get ready for your upcoming event. Click here to <span className='text-blue-500 cursor-pointer hover:underline'>Cancel.</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderEndedSection = () => {
        return (
            <div>
                <div className='flex gap-3 items-center'>
                    <button
                        className='px-4 py-2 mr-0 sm:mr-3 bg-red-900 hover:bg-red-950 text-white rounded-[8px]'
                    >
                        FINISHED
                    </button>
                    <div className='pl-2 sm:pl-5 text-sm sm:text-xl text-gray-800 border-l border-l-gray-400'>
                        Hope you enjoyed this Event. Please give your <span className='text-blue-500 cursor-pointer hover:underline'>Feedback</span> here.
                    </div>
                </div>
            </div>
        )
    }

    const renderOngoingSection = () => {
        return (
            <div>
                <div className='flex gap-3 items-center'>
                    <button
                        className='px-4 py-2 mr-0 sm:mr-3 bg-yellow-700 hover:bg-yellow-800 text-white rounded-[8px]'
                    >
                        ONGOING
                    </button>
                    <div className='pl-2 sm:pl-5 text-sm sm:text-xl text-gray-800 border-l border-l-gray-400'>
                        You're currently attending this event. 
                    </div>
                </div>
                 
            </div>
        )
    }

    const renderStatusTittle = (title: string) => {
        switch (title) {
            case "upcoming": 
              return renderUpcomingSection()
            case "ended" : 
              return renderEndedSection()
            case "ongoing" : 
              return renderOngoingSection()
            default : 
              return 
        }
    }

    const handleSearchQuery = (query: string) => {
        const filteredEvents = allMyEvents
            .filter((event) =>
                event.eventName.toLowerCase().includes(query.toLowerCase())
        )

        setMyEvents(filteredEvents)
        setSearchQuery(query)
    }


    return (
        <div>
            {loading && <Loader />}

            <div className='mx-auto p-10'>
                <h1 className="text-3xl font-bold mb-6">My Events</h1>

                {/* Search Bar  */}
                <div className="relative flex-grow w-full bg-white mt-3 mb-9">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search booked events..."
                        value={searchQuery}
                        onChange={(e) => handleSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5'>
                    {myEvents.length > 0 && myEvents.map(item =>
                        <div key={item.id} className='bg-white border border-gray-100 p-5 rounded-xl w-full shadow-lg'>
                            <p className='text-lg pb-2 border-b border-b-gray-200'>Tickets booked on : <span className='font-bold'>{item.eventBookedOn}</span></p>
                            <div className='flex flex-col md:flex-row gap-5 my-5 pb-6 border-b border-b-gray-200'>
                                
                                <img
                                    src={item.eventImage}
                                    className='rounded-lg  h-60 w-full md:w-[50%] lg:w-[40%] object-cover'
                                />

                                <div>
                                    <p className='text-xl font-bold mb-1'>{item.eventName}</p>
                                    <p className='text-gray-500 mb-3'>{item.eventCatogory}</p>

                                    <div className='flex gap-3 items-center my-2'>
                                        <CalendarDays className='h-5 w-5' />
                                        <p className='text-gray-800 text-md'>{item.eventStartTime} - {item.eventEndTime}</p>
                                    </div>

                                    <div className='flex gap-3 items-center my-2'>
                                        <Clock9 className='h-5 w-5' />
                                        <p className='text-gray-800 text-md'>{item.eventDuration}</p>
                                    </div>

                                    <div className='flex gap-3 items-center my-2'>
                                        <MapPin className='h-5 w-5' />
                                        <TooltipWrapper tooltip={item.eventLocation}>
                                            <p className='text-gray-800 text-md truncate  max-w-[250px] sm:max-w-[250px]'>{item.eventLocation}</p>
                                        </TooltipWrapper>
                                    </div>

                                    <div className='flex gap-3 items-center my-2'>
                                        <Ticket className='h-5 w-5' />
                                        <div className='text-gray-800 font-bold'>{item.eventTicketCount} {item.eventTicketCount === 1 ? "ticket" : "tickets"} of
                                            <span className='text-blue-500'> &nbsp;
                                                <TooltipWrapper tooltip={`Cost per ticket : ${item.eventTicketPrice/item.eventTicketCount} Rs.`}>
                                                    {item.eventTicketType}
                                                </TooltipWrapper>
                                            </span> catogory
                                        </div>
                                    </div>

                                    <div className='flex gap-3 items-center my-2'>
                                        <IndianRupee className='h-5 w-5' />
                                        <p className='text-gray-800 font-bold'>Total Paid : {item.eventTicketPrice} Rs.</p>
                                    </div>

                                </div>
                            </div>
                            
                            {renderStatusTittle(item.eventStatus)}
                        </div>
                    )}
                </div>

                {myEvents.length === 0 && <div className="text-center py-12">
                    <p className="text-gray-500">No bookings found.</p>
                </div>}

            </div>
        </div>
    )
}

export default MyEventsPage