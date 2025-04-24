import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { EventImage } from '@/types/events'
interface ImageCarouselProps {
  images:EventImage[];
  autoSwitchInterval?: number
}
const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoSwitchInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoSwitchInterval)
    return () => clearInterval(interval)
  }, [images.length, autoSwitchInterval])
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }
  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    )
  }
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }
  if (images.length === 0) {
    return (
      <div className="bg-gray-200 h-full w-full flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }
  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full overflow-hidden rounded-lg">
        <img
          src={images[currentIndex].url}
          alt={`Event image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default ImageCarousel
