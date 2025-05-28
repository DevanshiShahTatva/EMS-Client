'use client'
import React, { useMemo } from 'react'
import he from 'he';
import "../../app/customDescription.css";
interface EventDescriptionProps {
  description: string
  initiallyExpanded?: boolean
}
const EventDescription: React.FC<EventDescriptionProps> = ({
  description,
  initiallyExpanded = false,
}) => {
  const decodedHTML = useMemo(()=>he.decode(description),[description]);
  return (
    <div className="bg-white rounded-lg pt-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
      </div>
      <div
        className={`transition-all duration-300`}
      >
            <div
            className="prose max-w-none prose-blue  no-scrollbar overflow-auto custom-description-class"
            dangerouslySetInnerHTML={{ __html: decodedHTML }}
        />      
        </div>
    </div>
  )
}
export default EventDescription
