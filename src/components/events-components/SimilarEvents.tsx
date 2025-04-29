import React from 'react'
import Link from 'next/link'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { EventData, EventDataObjResponse } from '../../app/events/types'
import { getTicketPriceRange } from '@/app/admin/event/helper'
import { EventResponse } from '@/utils/types'

interface SimilarEventsProps {
  events: EventDataObjResponse[] | undefined;
}
const SimilarEvents: React.FC<SimilarEventsProps> = ({ events }) => {
  if (!events) {
    return null
  }
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Similar Events
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link href={`/event/${event._id}`} key={event._id} className="block">
            <div className="bg-white overflow-hidden shadow rounded-lg transition-shadow hover:shadow-md flex">
              <div className="w-1/3">
                <img
                  src={event.images[0].url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 w-2/3">
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  <span className="truncate">{event.location.address}</span>
                </div>
                <div className="mt-2 text-xs font-medium">
                   
                    <span className="text-gray-900">${getTicketPriceRange(event.tickets)}</span>
                  
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
export default SimilarEvents
