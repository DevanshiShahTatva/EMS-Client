'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { HeartIcon, CalendarIcon, MapPin, TagIcon } from 'lucide-react'
import { EventData } from '../../app/events/types'
import { useRouter } from 'next/navigation'
import {  ROUTES } from '@/utils/constant';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import he from 'he'
import CategoryChip from './CategoryChip'
import CustomButton from '../common/CustomButton'

interface EventCardProps {
  event: EventData
  likeEvent : (id : string) => void
}
export const EventCard: React.FC<EventCardProps> = ({ event, likeEvent }) => {
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
          onClick={() => likeEvent(event.id)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm cursor-pointer"
        >
          <HeartIcon
            className={`h-5 w-5 ${event.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
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
              <CategoryChip _id={event.category._id} name={event.category.name} isActive={event.category.isActive} color={event.category.color} bgColor={event.category.bgColor} icon={event.category.icon} createdAt={event.category.createdAt} updatedAt={event.category.updatedAt} __v={event.category.__v} isUsed={false} />
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
        {event.isSoldOut ? 
          <CustomButton
             variant='disabled'
             disabled
             className='w-full font-medium'
          >
             Sold out
          </CustomButton>
          :
          <CustomButton
             variant='primary'
             className='w-full font-medium'
             onClick={()=>navigateToEventDetails(event.id)}
          >
             View details
          </CustomButton>
      
        }
      </div>
    </div>
  )
}
