"use client"

import React, { useEffect, useState } from "react"
import { StarIcon, EditIcon, Trash2Icon, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { apiCall } from "@/utils/services/request"
import { API_ROUTES } from "@/utils/constant"
import { format } from "date-fns"

interface Feedback {
  _id: string
  name: string
  email: string
  rating: number
  description: string
  createdAt: string
  userId: string
  eventId: string
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Feedback[]>([])
  const [expandedReview, setExpandedReview] = useState<string | null>(null)

  const fetchReviews = async () => {
  const result = await apiCall({
        endPoint : API_ROUTES.USER_FEEDBACK,
        method : "GET", 
      })
      if(result && result.success && result.data.length > 0) {
        setReviews(result)
      } else {
          setReviews([])
      }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const toggleDescription = (id: string) => {
    setExpandedReview((prev) => (prev === id ? null : id))
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    const res = await apiCall({ endPoint: API_ROUTES.FEEDBACK(id), method: "DELETE" })
    if (res.success) fetchReviews()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white shadow-md rounded-xl p-5 relative">
            <div className="flex items-center gap-4 mb-3">
              <Image
                src="/default-avatar.png"
                alt="User"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{review.name}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(review.createdAt), "MMM d, yyyy - h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-5 h-5 ${index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>

            <p className="text-gray-700 text-sm mb-2">
              {expandedReview === review._id || review.description.length < 100
                ? review.description
                : `${review.description.slice(0, 100)}...`}
            </p>
            {review.description.length > 100 && (
              <button
                className="text-blue-500 text-sm flex items-center gap-1"
                onClick={() => toggleDescription(review._id)}
              >
                {expandedReview === review._id ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Read More <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            <div className="absolute top-4 right-4 flex gap-3">
              <button className="text-blue-500 hover:text-blue-700">
                <EditIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(review._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsPage
