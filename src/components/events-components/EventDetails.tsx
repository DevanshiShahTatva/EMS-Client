'use client'
import React, { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon
} from 'lucide-react'
import ImageCarousel from '@/components/events-components/ImageCarousel'
import EventDescription from '@/components/events-components/EventDescription'
import SimilarEvents from '@/components/events-components/SimilarEvents'
import { EventDataObjResponse, EventDetails, FeedbackDetails } from '@/app/events/types'
import { getTicketPriceRange, onwardPriceRange } from '@/app/admin/event/helper'
import {
  getAllTicketStatus,
  getSimilarEvents,
  hasEventEnded,
  openMapDirection,
} from '@/app/events/event-helper'
import { apiCall } from '@/utils/services/request'
import { API_ROUTES } from '@/utils/constant'
import { useRouter } from 'next/navigation'
import Loader from '../common/Loader'
import BookingButton from './BookingButton'
import GoogleMap from './GoogleMap'
import ReviewsSection from './ReviewSection'

export default function EventDetailsPage({ eventId }: { eventId: string }) {
  const [eventsDetails, setEventsDetails] = useState<EventDataObjResponse[]>([])
  const [event, setEventDetail] = useState<EventDetails>()
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const [feedbackData, setFeedbackData] = useState<FeedbackDetails[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('eventId', eventId)
    }
  }, [eventId])

  const navigateToHome = () => {
    router.push('/events')
  }

  const fetchEvents = async () => {
    const result = await apiCall({
      endPoint: API_ROUTES.ADMIN.GET_EVENTS,
      method: 'GET',
    })

    if (result?.success && result.data?.length > 0) {
      setEventsDetails(result.data)
    }
    setLoading(false)
  }

  const getEventDetail = async () => {
    const result = await apiCall({
      endPoint: `${API_ROUTES.ADMIN.GET_EVENTS}/${eventId}`,
      method: 'GET',
    })

    if (result?.success && result.data) {
      setEventDetail(result.data)
    }
    setLoading(false)
  }
  const getEventFeedback=async()=>{
    const result = await apiCall({
      endPoint:`${API_ROUTES.GET_FEEDBACK(eventId)}`,
      method:'GET'
    })
    if(result?.success && result.data){
      setFeedbackData(result.data)
    }
    setLoading(false)
  }
  useEffect(() => {
    if (eventId) {
      fetchEvents();
      getEventDetail();
      getEventFeedback();
    }
  }, [eventId])

  if (!event || !eventId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {loading && <Loader />}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            {`The event you're looking for doesn't exist or has been removed.`}
          </p>
          <button
            onClick={() => navigateToHome()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const similarEvents = getSimilarEvents(eventsDetails, eventId)
  const {status,color} = getAllTicketStatus(event.tickets);
  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <Loader />}
      <header className="bg-white shadow">
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
          <button
            onClick={() => navigateToHome()}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Back to events"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {event.title}
          </h1>
        </div>
      </header>
      <main className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 lg:mb-0">
            <div
              className="bg-white shadow rounded-lg overflow-hidden"
              style={{ height: '380px' }}
            >
              <ImageCarousel images={event.images} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {event.title}
              </h2>
              <div className="space-y-3 pb-4">
                <div className="flex items-top text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>
                    {new Date(event.startDateTime).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )} - {new Date(event.endDateTime).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )} 
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>
                    Duration - ({event.duration})
                  </span>
                </div>
                <div className="flex items-top text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400 shrink-0" />
                  <span >{event.location.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <TagIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{event.category?.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white pt-4 border-t-2 border-gray-200 w-full">
                <div className="flex flex-col">
                  <span className="font-semibold text-md mb-1">
                    {onwardPriceRange(event.tickets)}
                  </span>
                  <span className={`${color} text-md`}>
                    {status}
                  </span>
                </div>

                <BookingButton
                  tickets={event.tickets}
                  eventTitle={event.title}
                  status={hasEventEnded(event.endDateTime)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <EventDescription description={event.description} />
        </div>
        <div className="mt-8">
          <div className='flex items-center justify-between mb-4'>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Location
            </h2>
            <button className='text-sm text-blue-600 hover:underline font-medium cursor-pointer' onClick={()=>openMapDirection(event.location)}>
              Get Directions
            </button>
          </div>
          <GoogleMap
            location={{lat:event.location.lat,lng:event.location.lng}}
            locationName={event.location.address}
          />
        </div>
        { feedbackData?.length!==0 && <ReviewsSection feedbacks={feedbackData}/> }
        { similarEvents?.length!==0 && <SimilarEvents events={similarEvents} />}
      </main>
    </div>
  )
}
