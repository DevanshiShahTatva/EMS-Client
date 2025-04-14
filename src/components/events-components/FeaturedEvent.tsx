'use client'
import React, { useState } from 'react'
import { HeartIcon, CalendarIcon, ClockIcon, TagIcon } from 'lucide-react'
import { EventData } from '@/types/events'
interface FeaturedEventProps {
  event: EventData
}
export const FeaturedEvent: React.FC<FeaturedEventProps> = ({ event }) => {
  const [isLiked, setIsLiked] = useState(event.isLiked)
  const statusColors = {
    ongoing: 'bg-yellow-100 text-yellow-800',
    ended: 'bg-red-100 text-red-800',
    upcoming: 'bg-green-100 text-green-800',
  }
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 md:h-full object-cover"
          />
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
          >
            <HeartIcon
              className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>
        <div className="p-6 md:w-3/5 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <span
              className={`text-sm px-3 py-1 rounded-full ml-3 ${statusColors[event.status]}`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 mb-6">{event.description}</p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-3" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-5 w-5 mr-3" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <TagIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">{event.priceRange}</span>
            </div>
          </div>
          <div className="mt-auto">
            <button
              disabled={event.isSoldOut}
              className={`py-3 px-6 rounded-md font-medium ${event.isSoldOut ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {event.isSoldOut ? 'Sold Out' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
