'use client'
import React, { useState,useMemo } from 'react'
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
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900">Description</h3>
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
