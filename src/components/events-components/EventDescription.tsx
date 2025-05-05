'use client'
import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
interface EventDescriptionProps {
  description: string
  initiallyExpanded?: boolean
}
const EventDescription: React.FC<EventDescriptionProps> = ({
  description,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900">Description</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center text-sm font-medium"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUpIcon className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-20'}`}
      >
            <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
        />      
        </div>
    </div>
  )
}
export default EventDescription
