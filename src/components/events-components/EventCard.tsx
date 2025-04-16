'use client'
import React, { useState } from 'react'
import { HeartIcon, CalendarIcon, ClockIcon, TagIcon } from 'lucide-react'
import { EventData } from '@/utils/types'
interface EventCardProps {
  event: EventData
}
export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isLiked, setIsLiked] = useState(event.isLiked)
  const statusColors = {
    ongoing: 'bg-yellow-100 text-yellow-800',
    ended: 'bg-red-100 text-red-800',
    upcoming: 'bg-green-100 text-green-800',
  }
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col h-full">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
        >
          <HeartIcon
            className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{event.title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ml-2 whitespace-nowrap ${statusColors[event.status]}`}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {event.description}
        </p>
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <TagIcon className="h-4 w-4 mr-2" />
            <span>{event.priceRange}</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          disabled={event.isSoldOut}
          className={`w-full py-2 px-4 rounded-md font-medium ${event.isSoldOut ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {event.isSoldOut ? 'Sold Out' : 'View Details'}
        </button>
      </div>
    </div>
  )
}
