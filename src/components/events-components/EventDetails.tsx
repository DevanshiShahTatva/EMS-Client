'use client'
import React, { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
} from 'lucide-react'
import ImageCarousel from '@/components/events-components/ImageCarousel'
import EventDescription from '@/components/events-components/EventDescription'
import SimilarEvents from '@/components/events-components/SimilarEvents'
import { EventDataObjResponse, EventDetails } from '@/types/events'
import { getTicketPriceRange } from '@/app/admin/event/helper'
import {
  areAllTicketsBooked,
  getEventStatus,
  getSimilarEvents,
  isNearbyWithUserLocation,
} from '@/app/events/event-helper'
import { apiCall } from '@/utils/services/request'
import { API_ROUTES } from '@/utils/constant'
import { useRouter } from 'next/navigation'
import Loader from '../common/Loader'
import BookingButton from './BookingButton'
import GoogleMap from './GoogleMap'

export default function EventDetailsPage({ eventId }: { eventId: string }) {
  const [eventsDetails, setEventsDetails] = useState<EventDataObjResponse[]>([])
  const [event, setEventDetail] = useState<EventDetails>()
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

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

  useEffect(() => {
    if (eventId) {
      fetchEvents()
      getEventDetail()
    }
  }, [eventId])

  if (!event || !eventId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist or has been removed.
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

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <Loader />}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
          <button
            onClick={() => navigateToHome()}
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
            aria-label="Back to events"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 truncate">
            {event.title}
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 mb-6 lg:mb-0">
            <div
              className="bg-white shadow rounded-lg overflow-hidden"
              style={{ height: '400px' }}
            >
              <ImageCarousel images={event.images} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {event.title}
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
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
                    )}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>
                    {event.endDateTime} ({event.duration})
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{event.location.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <TagIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{event.category}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-lg">
                    {getTicketPriceRange(event.tickets)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Availability:</span>
                  <span
                    className={`font-medium ${
                      areAllTicketsBooked(event.tickets)
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {areAllTicketsBooked(event.tickets)
                      ? 'Sold Out'
                      : 'Available'}
                  </span>
                </div>
              </div>
              <BookingButton
                tickets={event.tickets}
                eventTitle={event.title}
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <EventDescription description={event.description} />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Location
          </h2>
          <GoogleMap
            location={{lat:event.location.lat,lng:event.location.lng}}
            locationName={event.location.address}
          />
        </div>
        <SimilarEvents events={similarEvents} />
      </main>
    </div>
  )
}
