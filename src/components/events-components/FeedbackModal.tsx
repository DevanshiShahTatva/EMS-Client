'use client'

import React, { useEffect, useState } from 'react'
import { XIcon, StarIcon } from 'lucide-react'
import { API_ROUTES } from '@/utils/constant'
import { apiCall } from '@/utils/services/request'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'
import { motion, AnimatePresence } from 'framer-motion'
import { FeedbackDetails } from '@/app/events/types'

interface FeedbackModalProps {
  eventId: string
  isOpen: boolean
  onClose: () => void
  isEditFlag:boolean
  feedback:FeedbackDetails
}

interface ValidationErrors {
  rating?: string
}

const emojiMap = {
  1: { emoji: '/Enraged_Face.png', text: 'Mad' },
  2: { emoji: '/Unamused_Face.png', text: 'Sad' },
  3: { emoji: '/Smiling_Face.png', text: 'Okay Event' },
  4: { emoji: '/Grinning_Face.png', text: 'Good' },
  5: { emoji: '/Great_Face.png', text: 'Great' },
}


export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isEditFlag,eventId, isOpen, onClose,feedback }) => {
  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loader, setLoder] = useState(false)

  const validate = () => {
    const newErrors: any = {}
    if (eventId === '') newErrors.eventId = 'Event Id is required'
    if (rating < 1) newErrors.rating = 'Rating is required'
    return newErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    const feedbackData = {
      rating: rating.toString(),
      description: description,
    }
    setLoder(true)
    const result = await apiCall({
      endPoint: isEditFlag ? API_ROUTES.PUT_FEEDBACK(feedback._id) :API_ROUTES.FEEDBACK(eventId),
      method: isEditFlag ? 'PUT':'POST',
      body: feedbackData,
      isFormData: true,
      headers: {},
    })
    setLoder(false)
    if (result.success) {
      setRating(0)
      setDescription('')
      onClose();
      isEditFlag ? toast.success('Feedback updated successfully.'):toast.success('Feedback submitted successfully.')
    } else {
      toast.error('Some error has occurred. Please try again later.')
      setRating(0)
      setDescription('')
      onClose()
    }
  }
  const checkUpdate=()=>{
    if(isEditFlag && feedback){
      setRating(feedback.rating)
      setDescription(feedback.description)
    }
  }
  useEffect(()=>{
    checkUpdate();
  },[])
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-30 flex items-center justify-center p-4">
      {loader && <Loader />}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative ">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <XIcon className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">{isEditFlag ? "Update Feedback" : "Submit Feedback"}</h2>

        <div className="space-y-4">
          <div className="flex flex-col items-center">
            {rating > 0 && (
              <AnimatePresence>
                <motion.div
                  key={rating}
                   initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                      duration: 0.4,
                      scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                  }}
                  className="text-2xl"
                >
                  <img src={emojiMap[rating as keyof typeof emojiMap].emoji} alt="emotiicon" width={72} height={72}/>
                </motion.div>
              </AnimatePresence>
            )}

            <label className="block text-sm font-medium text-gray-700 mt-2">Rating</label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <StarIcon
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            {rating > 0 && (
              <motion.p
                key={`text-${rating}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-base mt-2 text-gray-700"
              >
                {emojiMap[rating as keyof typeof emojiMap].text}
              </motion.p>
            )}
            {errors.rating && <p className="text-sm text-red-500 mt-1">{errors.rating}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              rows={4}
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={()=>{onClose()}}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
          {isEditFlag ? "Update":"Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
