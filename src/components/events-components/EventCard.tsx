'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { HeartIcon, CalendarIcon, MapPin, TagIcon } from 'lucide-react'
import { EventData } from '../../app/events/types'
import { useRouter } from 'next/navigation'
import { API_ROUTES, ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import { toast } from 'react-toastify'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Square3Stack3DIcon } from '@heroicons/react/24/outline'
import he from 'he'
import CategoryChip from './CategoryChip'

interface EventCardProps {
  event: EventData
}
export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isLiked, setIsLiked] = useState(false)
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
  const router = useRouter();
  const navigateToEventDetails = (eventId: string) => {
    router.push(`${ROUTES.USER_EVENTS}\\${eventId}`);
  }

  const handleLikeEvent = async () => {
    if(!isLiked)
      toast.success("Liked the Event!")
    else
      toast.error("Disliked the Event!");
    const response = await apiCall({
      endPoint: API_ROUTES.ADMIN.GET_EVENTS + `/${event.id}/like`,
      method: "POST",
    });
    if (response.success) {
      setIsLiked(!isLiked)
    }
  };

  useEffect(()=>{
   setIsLiked(event.isLiked)
  },[event])
  const decodedHTML = useMemo(()=>he.decode(event.description),[event.description]);
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col h-full">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleLikeEvent}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm cursor-pointer"
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
        <div className="text-gray-600 text-sm line-clamp-2 mb-4" dangerouslySetInnerHTML={{__html:decodedHTML}}/>
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-gray-500">
              <CategoryChip _id={event.category._id} name={event.category.name} isActive={event.category.isActive} color={event.category.color} bgColor={event.category.bgColor} icon={event.category.icon} createdAt={event.category.createdAt} updatedAt={event.category.updatedAt} __v={event.category.__v} />
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="truncate max-w-60 font-bold">
                  {event.location}
                </TooltipTrigger>
                <TooltipContent>
                  <p className=" text-white font-bold">
                    {event.location}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span className='font-bold'>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <TagIcon className="h-4 w-4 mr-2" />
            <span className='font-bold'>{event.priceRange}</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          disabled={event.isSoldOut}
          className={`w-full py-2 px-4 rounded-md font-medium ${event.isSoldOut ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'}`}
          onClick={()=>navigateToEventDetails(event.id)}
        >
          {event.isSoldOut ? 'Sold Out' : 'View Details'}
        </button>
      </div>
    </div>
  )
}
