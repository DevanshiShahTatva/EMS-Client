import React, { useState } from 'react'
import {
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  CircleUserRound,
} from 'lucide-react'
import EditReviewModal from './EditReviewModal'
import Image from "next/image"
import { FeedbackDetails } from '@/app/events/types'
const ReviewCard = ({ feedback, onEdit }:{feedback:FeedbackDetails,onEdit:any}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const maxLength = 100
  const needsExpansion = feedback.description.length > maxLength
  const displayText =
    needsExpansion && !isExpanded
      ? `${feedback.description.slice(0, maxLength)}...`
      : feedback.description
  return (
    <>
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 h-full relative">
      
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Edit review"
        >
          <PencilIcon className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
        </button>
      
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={feedback.profileimage}
              alt="User name"
              className="w-full h-full object-cover"
            />
            {
              feedback.profileimage ? 
              <Image
                src={feedback.profileimage}
                alt="User"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              /> : 
                (<CircleUserRound width={48}
                height={48}
                className="rounded-full"
                />)
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
      
        <div className="relative mb-2">
          <p
            className={`text-gray-600 text-sm ${isExpanded ? 'max-h-48 overflow-y-auto pr-2' : 'max-h-20 overflow-hidden'}`}
          >
            {displayText}
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
      
        <div className="text-xs text-gray-400 mt-auto">{new Date(feedback.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
        })}</div>
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
