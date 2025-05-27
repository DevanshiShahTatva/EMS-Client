'use client'
import React, { useEffect, useState, useRef } from 'react'

import { useRouter } from 'next/navigation'

// Library
import {
  CalendarIcon,
  TagIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react'

// types
import { EventData } from '../../app/events/types'

// constants
import { ROUTES } from '@/utils/constant'
interface FeaturedEventProps {
  event: EventData[]
  likeEvent : (id : string) => void
}

export const FeaturedEvent: React.FC<FeaturedEventProps> = ({ event }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter();
   
  useEffect(() => {
    if (event.length <= 1) return

    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % event.length)
    }, 10000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [event.length])

  const statusColors = {
    ongoing: 'bg-yellow-100 text-yellow-800',
    ended: 'bg-red-100 text-red-800',
    upcoming: 'bg-green-100 text-green-800',
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % event.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + event.length) % event.length)
  }
  const navigateToEventDetails=(eventId:string)=>{
      router.push(`${ROUTES.USER_EVENTS}\\${eventId}`);  
  }
  return (
    <div className="relative w-full mx-auto overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `100%`,
        }}
      >
        {event.map(ev => {
          const formattedDate = new Date(ev.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })

          return (
            <div
              key={ev.id}
              className="w-full flex-shrink-0 cursor-pointer group"
              onClick={() => navigateToEventDetails(ev.id)}
            >
              <div className="relative w-full h-90 rounded-xl overflow-hidden shadow-md border border-gray-200 group">
                <div className="absolute inset-0 rounded-xl overflow-hidden z-0">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                </div>

                <div className="relative z-20 h-full flex flex-col justify-between p-5 text-white">
                <div className="flex justify-between items-start">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ev.status]}`}>
                      {ev.status.charAt(0).toUpperCase() + ev.status.slice(1)}
                    </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold truncate">{ev.title}</h2>
                  </div>
                   
                  <div className="text-sm space-y-1 text-gray-200">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1.5" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <TagIcon className="h-4 w-4 mr-1.5" />
                      <span>{ev.priceRange}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>
      {event.length > 1 && (
        <>
          <div className="flex justify-center mt-4 mb-2 space-x-2">
            {event.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-blue-600 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md cursor-pointer"
          >
            <ChevronRight />
          </button>
        </>
      )}
    </div>
  )
}
