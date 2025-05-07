'use client'

import React, { ChangeEvent, useState } from 'react'
import { XIcon, StarIcon } from 'lucide-react'
import Image from 'next/image'

const MAX_IMAGES = 3
interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (formData: FormData) => void
  }
  
  interface ValidationErrors {
    name?: string
    email?: string
    rating?: string
  }
export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [rating, setRating] = useState(0)
    const [description, setDescription] = useState('')
    const [images, setImages] = useState<File[]>([])
    const [errors, setErrors] = useState<ValidationErrors>({})
  
  

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : []
        if (files.length + images.length > MAX_IMAGES) {
          alert(`You can only upload up to ${MAX_IMAGES} images.`)
          return
        }
        setImages(prev => [...prev, ...files])
      }

  const validate = () => {
    const newErrors: any = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email required'
    if (rating < 1) newErrors.rating = 'Rating is required'
    return newErrors
  }

  const handleSubmit = () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('rating', rating.toString())
    formData.append('description', description)
    images.forEach((img, i) => formData.append(`image${i + 1}`, img))
    onSubmit(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <XIcon className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Feedback</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <StarIcon
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
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
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
