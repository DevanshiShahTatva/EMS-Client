'use client'
import React, { useEffect, useState } from 'react'
import {
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react'
import EditReviewModal from './EditReviewModal'
import Image from "next/image"
import { FeedbackDetails } from '@/app/events/types'
import { getUserName } from '@/utils/helper'

const ReviewCard = ({ feedback, onEdit }: { feedback: FeedbackDetails, onEdit: any }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [name, setName] = useState("")
  const maxLength = 100
  const needsExpansion = feedback.description.length > maxLength

  useEffect(() => {
    const userName = getUserName();
    if (userName) setName(userName);
  }, []);

  return (
    <>
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 w-full h-full relative">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            {
              feedback.profileimage ?
                <Image
                  src={feedback.profileimage}
                  alt="User"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                /> :
                (
                  <button className='h-10 w-10 rounded-full bg-indigo-600 text-white font-bold relative cursor-pointer'>
                    {name.charAt(0).toUpperCase()}
                  </button>
                )
            }
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-sm truncate">{feedback.name}</h4>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-3 h-3 ${index < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative mb-2 max-w-[240px]">
          <p
            className={`text-gray-600 text-sm transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-48 overflow-y-auto pr-1' : 'max-h-14 overflow-hidden'
            }`}
          >
            {feedback.description}
          </p>
          {needsExpansion && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-blue-600 text-xs mt-1 hover:text-blue-700"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUpIcon className="w-3.5 h-3.5 ml-0.5" />
                </>
              ) : (
                <>
                  Read more <ChevronDownIcon className="w-3.5 h-3.5 ml-0.5" />
                </>
              )}
            </button>
          )}
        </div>

        <div className="text-xs text-gray-400 mt-auto">
          {new Date(feedback.createdAt).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      {isEditModalOpen && (
        <EditReviewModal
          review={feedback}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedReview: any) => {
            onEdit?.(updatedReview)
            setIsEditModalOpen(false)
          }}
        />
      )}
    </>
  )
}

export default ReviewCard
