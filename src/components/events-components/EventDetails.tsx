'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon,
  TagIcon
} from 'lucide-react'
import ImageCarousel from '@/components/events-components/ImageCarousel'
import EventDescription from '@/components/events-components/EventDescription'
import SimilarEvents from '@/components/events-components/SimilarEvents'
import { EventDataObjResponse, EventDetails, FeedbackDetails, FeedbackResponseData } from '@/app/events/types'
import { onwardPriceRange } from '@/app/admin/event/helper'
import {
  getAllTicketStatus,
  getSimilarEvents,
  hasEventEnded,
  openMapDirection,
  getLikesCount
} from '@/app/events/event-helper'
import { apiCall } from '@/utils/services/request'
import { API_ROUTES } from '@/utils/constant'
import { useRouter } from 'next/navigation'
import BookingButton from './BookingButton'
import GoogleMap from './GoogleMap'
import CustomButton from '../common/CustomButton'
import EventDetailsSkeleton from './EventDetailsSkeleton'
import CustomerReviews from './CustomerReviews'
import CategoryChip from './CategoryChip'
import { toast } from 'react-toastify'

export default function EventDetailsPage({ eventId }: { eventId: string }) {
  const [eventsDetails, setEventsDetails] = useState<EventDataObjResponse[]>([])
  const [event, setEventDetail] = useState<EventDetails>()
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const [feedbackData, setFeedbackData] = useState<FeedbackResponseData>()
  const [activeTab, setActiveTab] = useState<string>('Event details');
  const likeTimersRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  }

  const getEventDetail = async () => {
    const result = await apiCall({
      endPoint: `${API_ROUTES.ADMIN.GET_EVENTS}/${eventId}`,
      method: 'GET',
    })

    if (result?.success && result.data) {
      setEventDetail(result.data)
    }
  }
  const getEventFeedback = async () => {
    const result = await apiCall({
      endPoint: `${API_ROUTES.GET_FEEDBACK(eventId)}`,
      method: 'GET'
    })
    if (result?.success && result.data) {
      setFeedbackData(result.data)
    }
  }
  useEffect(() => {
    if (eventId) {
      fetchEvents();
      getEventDetail();
      getEventFeedback();
      setTimeout(() => setLoading(false), 2000);
    }
  }, [eventId])
    const likeEvent = (isLiked:boolean,id: string) => {
      setEventDetail((prevEvent)=>{
        if(!prevEvent) return event;
        return {
        ...prevEvent,
        isLiked:!prevEvent.isLiked,
        likesCount:!prevEvent.isLiked ? prevEvent.likesCount + 1 : prevEvent.likesCount - 1,
        }
      })
      if(!isLiked){
        toast.success('Liked the Event!');
      } else {
        toast.error('Disliked the Event!');
      }   
      if(likeTimersRef.current){
        clearTimeout(likeTimersRef.current);
      }     
      likeTimersRef.current = setTimeout(async()=>{
        try {
          const response = await apiCall({
            endPoint: `${API_ROUTES.ADMIN.GET_EVENTS}/${id}/like`,
            method: 'POST',
          });
          if(response && response.success){
            await getEventDetail();
          }
        } catch (err) {
          console.error('Error sending like API call:', err);
        }
      },500)
    };
  if (loading) {
    return <EventDetailsSkeleton />
  }
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            {`The event you're looking for doesn't exist or has been removed.`}
          </p>
          <CustomButton
            variant='primary'
            startIcon={<ArrowLeftIcon className="mr-2 h-4 w-4" />}
            onClick={() => navigateToHome()}
            className='inline-flex items-center font-medium'
          >
            Back to Events
          </CustomButton>
        </div>
      </div>
    )
  }
  const similarEvents = getSimilarEvents(eventsDetails, eventId)
  const { status, color } = getAllTicketStatus(event.tickets);

  return (
    <div className="min-h-screen bg-gray-50">
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
          <div className="lg:col-span-2">
            <div
              className="bg-white shadow rounded-lg overflow-hidden">
              <div className='h-[380px]'>
                <ImageCarousel images={event.images} />
              </div>
            </div>
            <div className='flex justify-between items-center px-4 py-3'>
                  <CategoryChip {...event.category} />
                    <div className='flex items-center space-x-1'>
                      <div className='flex items-center space-x-1 p-1'>
                        <StarIcon className='w-5 h-5 text-yellow-400 fill-yellow-400'/>
                        <span className="text-sm font-semibold text-yellow-800">
                          {feedbackData?.averageRating ?? 0}/5
                        </span>
                      </div>
                      <div className='flex items-center'>
                        <button
                          onClick={() =>{likeEvent(event.isLiked,event._id)}}
                          className="p-1 bg-white rounded-full shadow-sm cursor-pointer"
                        >
                          <HeartIcon
                            className={`h-5 w-5 ${event.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                          />
                        </button>
                          <span className="text-sm font-semibold text-gray-800">
                            {getLikesCount(event.likesCount)} Likes
                          </span>
                      </div>
                    </div>
              </div>
          </div>
          <div className="lg:col-span-1 h-[380]">
            <div className="bg-white shadow rounded-lg p-6 h-full flex flex-col justify-between min-h-[380px]">
              {/* Top section */}
              <div>
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
              </div>
              {/* Bottom section */}
              <div className="flex items-center justify-between bg-white pt-4 border-t-2 border-gray-200">
                <div className="flex flex-col">
                  <span className="font-semibold text-md mb-1">
                    {onwardPriceRange(event.tickets)}
                  </span>
                  <span className={`${color} text-md`}>
                    {status}
                  </span>
                </div>

                <BookingButton
                  points={event.userPoints}
                  tickets={event.tickets}
                  eventTitle={event.title}
                  conversionRate={event.conversionRate}
                  status={hasEventEnded(event.endDateTime)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-10 p-6 shadow-lg rounded-lg bg-white'>
          <div className="bg-white w-full border-b border-gray-300">
            <div className="relative space-x-4 flex w-full md:w-auto">
              {["Event details", "Reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 px-2 text-sm md:text-base font-medium transition-all duration-200 cursor-pointer ${activeTab === tab
                    ? "text-blue-600 after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-blue-600"
                    : "text-gray-500 hover:text-blue-500"
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {activeTab === "Event details" && (
            <div>
              <EventDescription description={event.description} />
              <div className="mt-5">
                <div className='flex items-center justify-between mb-4'>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Location
                  </h2>
                  <button className='text-l text-blue-600 hover:underline font-semibold cursor-pointer' onClick={() => openMapDirection(event.location)}>
                    Get Directions
                  </button>
                </div>
                <GoogleMap
                  location={{ lat: event.location.lat, lng: event.location.lng }}
                  locationName={event.location.address}
                />
              </div>
              {similarEvents?.length !== 0 && <SimilarEvents events={similarEvents} />}
            </div>
          )}
          {activeTab === "Reviews" && (
            <div>
              {feedbackData && feedbackData.allFeedbacks?.length !== 0
                ? <CustomerReviews eventName={event.title} feedbacks={feedbackData.allFeedbacks} />
                : <div className='py-20 flex justify-center'>No feedback available!</div>
              }
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
