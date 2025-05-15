import React, { useEffect, useState, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import ReviewCard from './ReviewCard'
import { FeedbackDetails } from '@/app/events/types'
const ReviewCarousel = ({ feedbacks }:{feedbacks:FeedbackDetails[]}) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [maxScroll, setMaxScroll] = useState(0)
  const [visibleWidth, setVisibleWidth] = useState(0)
  useEffect(() => {
    if (carouselRef.current) {
      setMaxScroll(
        carouselRef.current.scrollWidth - carouselRef.current.clientWidth,
      )
      setVisibleWidth(carouselRef.current.clientWidth)
    }
    const handleResize = () => {
      if (carouselRef.current) {
        setMaxScroll(
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth,
        )
        setVisibleWidth(carouselRef.current.clientWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [feedbacks])
  const scrollLeft = () => {
    if (carouselRef.current) {
      const newPosition = Math.max(0, scrollPosition - visibleWidth / 2)
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      })
      setScrollPosition(newPosition)
    }
  }
  const scrollRight = () => {
    if (carouselRef.current) {
      const newPosition = Math.min(maxScroll, scrollPosition + visibleWidth / 2)
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      })
      setScrollPosition(newPosition)
    }
  }
  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft)
    }
  }
  return (
    <div className="relative">
      <div className="absolute -top-12 right-0 flex space-x-2">
        <button
          onClick={scrollLeft}
          disabled={scrollPosition <= 0}
          className={`p-1.5 rounded-full ${scrollPosition <= 0 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
          aria-label="Previous reviews"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={scrollRight}
          disabled={scrollPosition >= maxScroll}
          className={`p-1.5 rounded-full ${scrollPosition >= maxScroll ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
          aria-label="Next reviews"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {feedbacks.map((feedback) => (
          <div
            key={feedback._id}
            className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] flex-shrink-0 snap-start"
          >
            <ReviewCard feedback={feedback} onEdit={undefined} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default ReviewCarousel
