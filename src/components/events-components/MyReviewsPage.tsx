"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StarIcon,
  EditIcon,
  Trash2Icon,
  ChevronDown,
  ChevronUp,
  ArrowLeftIcon,
} from "lucide-react";
import Image from "next/image";
import { apiCall } from "@/utils/services/request";
import { API_ROUTES, ROUTES } from "@/utils/constant";
import { format } from "date-fns";
import Loader from "../common/Loader";
import { useRouter } from "next/navigation";
import FeedbackModal from "./FeedbackModal";
import { FeedbackDetails, FeedbackItem } from "@/app/events/types";
import DeleteModal from "../common/DeleteModal";
import { toast } from "react-toastify";
import SearchInput from "../common/CommonSearchBar";

const ReviewsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<FeedbackItem[]>([]);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const [showEditModal, setEditModal] = useState(false);
  const [editReview, setEditReview] = useState<FeedbackItem>();
  const [deleteReviewId, setDeleteReviewId] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const emojiMap: Record<number, { emoji: string; text: string }> = useMemo(() => ({
    1: { emoji: '/Enraged_Face.png', text: 'Mad' },
    2: { emoji: '/Unamused_Face.png', text: 'Sad' },
    3: { emoji: '/Smiling_Face.png', text: 'Okay Event' },
    4: { emoji: '/Grinning_Face.png', text: 'Good' },
    5: { emoji: '/Great_Face.png', text: 'Great' },
  }), []);

  const setReview = useCallback((review: FeedbackItem) => {
    setEditReview(review);
    setEditModal(true);
  }, []);

  const deleteReview = useCallback((reviewId: string) => {
    setDeleteReviewId(reviewId);
    setDeleteModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModal(false);
    setEditReview(undefined);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal(false);
    setDeleteReviewId("");
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const result = await apiCall({
      endPoint: API_ROUTES.USER_FEEDBACK,
      method: "GET",
    });
    if (result && result.success) {
      setReviews(result.data);
      setLoading(false);
    } else {
      setReviews([]);
      setLoading(false);
    }
  }, []);

  const filteredReviews = useMemo(() => {
    let filtered = reviews.filter(review => review.user !== null && review.event !== null);

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.event?.title.toLowerCase().includes(lowerQuery) ||
          review.description.toLowerCase().includes(lowerQuery) ||
          review.rating.toString().includes(lowerQuery)
      );
    }

    if (filterRating !== null) {
      filtered = filtered.filter((review) => review.rating === filterRating);
    }

    return filtered;
  }, [searchQuery, filterRating, reviews]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleDescription = useCallback((id: string) => {
    setExpandedReview((prev) => (prev === id ? null : id));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const result = await apiCall({
      endPoint: API_ROUTES.PUT_FEEDBACK(id),
      method: "DELETE",
    });
    if (result && result.success) {
      toast.success("Deleted feedback successfully!");
      closeDeleteModal();
      fetchReviews();
    } else {
      toast.error("Unable to delete, please try again.");
      closeDeleteModal();
    }
  }, [closeDeleteModal, fetchReviews]);

  const navigateToHome = useCallback(() => {
    router.push("/user/my-events");
  }, [router]);

  const handleSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const navigateToEvent = useCallback((eventId: string) => {
    const eventDetailsRoute = `${ROUTES.USER_EVENTS}/${eventId}`
    router.push(eventDetailsRoute);
  }, [router])

  const emptyState = useMemo(() => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Feedbacks not found
        </h2>
        <p className="text-gray-600 mb-4">
          You can provide your valuable feedback for your past attended events, under my bookings sections.
        </p>
        <button
          onClick={navigateToHome}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Go to my bookings
        </button>
      </div>
    </div>
  ), [navigateToHome]);

  const ratingFilterButtons = useMemo(() => (
    [1, 2, 3, 4, 5].map((star: number) => (
      <button
        key={star}
        onClick={() => setFilterRating(filterRating === star ? null : star)}
        className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm cursor-pointer
          transition ${filterRating === star ? "bg-blue-600 text-white" : "bg-white border-gray-300"
          }`}
      >
        <Image
          src={emojiMap[star].emoji}
          alt={emojiMap[star].text}
          height={20}
          width={20}
        />
        <span>{emojiMap[star].text}</span>
      </button>
    ))
  ), [filterRating, emojiMap]);

  if (!reviews.length && !loading) {
    return emptyState;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">My Reviews</h1>
      <div className="flex flex-col-reverse md:grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6 max-h-[80vh] overflow-y-auto pr-2">
          {loading && !filteredReviews.length ? (
            <Loader />
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center col-span-2">
              <p className="text-gray-500 text-lg">No feedbacks found.</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review._id} className="bg-white shadow rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => review.event?.id && navigateToEvent(review.event.id)}>
                    {review.event?.image ? (
                      <Image
                        src={review.event.image}
                        alt="Event"
                        width={56}
                        height={56}
                        className="rounded-md object-cover w-14 h-14"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded-md" />
                    )}
                    <p className="text-lg font-bold text-gray-900">{review?.event?.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => setReview(review)}>
                      <EditIcon className="w-4 h-4 cursor-pointer" />
                    </button>
                    <button onClick={() => deleteReview(review._id)} className="text-red-500 hover:text-red-700">
                      <Trash2Icon className="w-4 h-4 cursor-pointer" />
                    </button>
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
                    className="text-blue-500 text-sm flex items-center gap-1 cursor-pointer"
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

                <p className="text-xs text-gray-500 mt-3">
                  {format(new Date(review.createdAt), "MMM d, yyyy - h:mm a")}{" "}
                  {review.isEdited ? "(Edited)" : ""}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="space-y-4 bg-white shadow rounded-xl p-5 min-h-[80vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <SearchInput
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={handleSearchQuery}
                inputClassName="pl-10 pr-4 py-2 w-full"
                wrapperClassName="flex-grow w-full bg-white rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Rating</label>
            <div className="flex flex-wrap gap-2">
              {ratingFilterButtons}
            </div>
          </div>
        </div>
        {editReview && (
          <FeedbackModal
            eventId={editReview.event.id}
            isOpen={showEditModal}
            onClose={closeEditModal}
            onSubmitAfter={fetchReviews}
            isEditFlag={true}
            feedback={editReview}
          />
        )}

        {deleteReviewId && (
          <DeleteModal
            isOpen={deleteModal}
            onClose={closeDeleteModal}
            onConfirm={() => handleDelete(deleteReviewId)}
            description="Are you sure you want to delete feedback?"
          />
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;