"use client"

import React, { useEffect, useState } from "react"
import { StarIcon, EditIcon, Trash2Icon, ChevronDown, ChevronUp, ArrowLeftIcon, CircleUserRound } from "lucide-react"
import Image from "next/image"
import { apiCall } from "@/utils/services/request"
import { API_ROUTES } from "@/utils/constant"
import { format } from "date-fns"
import Loader from "../common/Loader"
import { useRouter } from "next/navigation"
import FeedbackModal from "./FeedbackModal"
import { FeedbackDetails } from "@/app/events/types"
import DeleteModal from "../common/DeleteModal"
import { toast } from "react-toastify"

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<FeedbackDetails[]>([])
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [loading, setLoading] = useState<Boolean>(false);
  const [showEditModal, setEditModal] = useState(false);
  const [editReview, setEditReview] = useState<FeedbackDetails>();
  const [deleteReviewId, setDeleteReviewId] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState(false);
  const setReview = (review: FeedbackDetails) => {
    setEditReview(review);
    setEditModal(true);
  }
  const deleteReview = (reviewId: string) => {
    setDeleteReviewId(reviewId);
    setDeleteModal(true);
  }
  const closeEditModal = () => {
    setEditModal(false);
    setEditReview({
      _id: '',
      eventId: '',
      userId: '',
      name: '',
      email: '',
      rating: 0,
      description: '',
      isEdited: false,
      createdAt: '',
      updatedAt: '',
      profileimage: '',
      eventImage: '',
      eventTitle: '',
      __v: 0
    });
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteReviewId("");
  }
  const router = useRouter();
  const fetchReviews = async () => {
    const result = await apiCall({
      endPoint: API_ROUTES.USER_FEEDBACK,
      method: "GET",
    })
    if (result && result.success && result.data.length > 0) {
      setReviews(result.data)
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
    const result = await apiCall({
      endPoint: API_ROUTES.PUT_FEEDBACK(id),
      method: "DELETE",
    })
    if (result && result.success) {
      toast.success("Deleted feedback successfully!");
      closeDeleteModal()
      fetchReviews();
    } else {
      toast.error("Unable to delete, Please try again");
      closeDeleteModal();
    }
  }
  const navigateToHome = () => {
    router.push('/events')
  }



  if (!reviews) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {loading && <Loader />}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Feedbacks not found
          </h2>
          <p className="text-gray-600 mb-4">
            {`The event you're looking for doesn't exist or has been removed.`}
          </p>
          <button
            onClick={() => navigateToHome()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Events
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white shadow-md rounded-xl p-5 relative">

            <div className="mb-4 flex items-center gap-4">
              {review.eventImage ? (
                <Image
                  src={review.eventImage}
                  alt="Event"
                  width={56}
                  height={56}
                  className="rounded-md object-cover w-14 h-14"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded-md" />
              )}
              <p className="text-lg font-semibold text-gray-800">{review.eventTitle}</p>
            </div>

            <div className="flex items-center gap-4 mb-3">
              {review.profileimage ? (
                <Image
                  src={review.profileimage}
                  alt="User"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <CircleUserRound width={48} height={48} className="rounded-full" />
              )}
                <div className="flex-1">
                <div className="flex items-center">
                  <p className="font-medium text-gray-900">{review.name}</p>
                  <div className="ml-auto flex items-center gap-2">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => setReview(review)}>
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteReview(review._id)} className="text-red-500 hover:text-red-700">
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                {format(new Date(review.createdAt), "MMM d, yyyy - h:mm a")} {review.isEdited ? "(Edited)" :""}
                </p>
              </div>
              <div>
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
          </div>
        ))}
      </div>

      {editReview && <FeedbackModal
        eventId={editReview.eventId}
        isOpen={showEditModal}
        onClose={() => closeEditModal()}
        isEditFlag={true}
        feedback={editReview}
      />}
      {deleteReviewId &&
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => closeDeleteModal()}
          onConfirm={() => handleDelete(deleteReviewId)}
          description='Are you sure you want to delete feedback?'
        />
      }
    </div>
  )
}

export default ReviewsPage
