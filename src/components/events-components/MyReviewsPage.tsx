"use client";

import React, { useEffect, useState } from "react";
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
import { API_ROUTES } from "@/utils/constant";
import { format } from "date-fns";
import Loader from "../common/Loader";
import { useRouter } from "next/navigation";
import FeedbackModal from "./FeedbackModal";
import { FeedbackDetails } from "@/app/events/types";
import DeleteModal from "../common/DeleteModal";
import { toast } from "react-toastify";
import SearchInput from "../common/CommonSearchBar";
import { getUserName } from "@/utils/helper";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<FeedbackDetails[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<FeedbackDetails[]>([]);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditModal, setEditModal] = useState(false);
  const [editReview, setEditReview] = useState<FeedbackDetails>();
  const [deleteReviewId, setDeleteReviewId] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const setReview = (review: FeedbackDetails) => {
    setEditReview(review);
    setEditModal(true);
  };

  const deleteReview = (reviewId: string) => {
    setDeleteReviewId(reviewId);
    setDeleteModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setEditReview(undefined);
    refreshReviews();
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteReviewId("");
  };

  const fetchReviews = async () => {
    setLoading(true);
    const result = await apiCall({
      endPoint: API_ROUTES.USER_FEEDBACK,
      method: "GET",
    });
    if (result && result.success) {
      setReviews(result.data);
      setFilteredReviews(result.data);
      setLoading(false);
    } else {
      setReviews([]);
      setFilteredReviews([]);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    let filtered = reviews;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.name.toLowerCase().includes(lowerQuery) ||
          review.eventTitle.toLowerCase().includes(lowerQuery) ||
          review.description.toLowerCase().includes(lowerQuery) ||
          review.rating.toString().includes(lowerQuery)
      );
    }

    if (filterRating !== null) {
      filtered = filtered.filter((review) => review.rating === filterRating);
    }

    setFilteredReviews(filtered);
    const name = getUserName();
    if (name) {
      setName(name)
    }
  }, [searchQuery, filterRating, reviews, name]);

  const toggleDescription = (id: string) => {
    setExpandedReview((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (id: string) => {
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
  };

  const navigateToHome = () => {
    router.push("/user/my-events");
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
  };
  const refreshReviews = () => {
    fetchReviews();
  };
  const emojiMap: Record<number, { emoji: string; text: string }> = {
    1: { emoji: '/Enraged_Face.png', text: 'Mad' },
    2: { emoji: '/Unamused_Face.png', text: 'Sad' },
    3: { emoji: '/Smiling_Face.png', text: 'Okay Event' },
    4: { emoji: '/Grinning_Face.png', text: 'Good' },
    5: { emoji: '/Great_Face.png', text: 'Great' },
  };
  if (!reviews.length && !loading) {
    return (
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
    );
  }

  return (

    <div className="p-8 flex flex-col-reverse md:grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        {loading ? (
          <Loader />
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center col-span-2">
            <p className="text-gray-500 text-lg">No feedbacks found.</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review._id} className="bg-white shadow rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {review.profileimage ? (
                    <Image
                      src={review.profileimage}
                      alt="User"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <button className='h-10 w-10 rounded-full bg-indigo-600 text-white font-bold relative cursor-pointer'>
                      {name.charAt(0).toUpperCase()}
                    </button>
                  )}
                  <p className="font-semibold text-gray-800">{review.name}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700" onClick={() => setReview(review)}>
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteReview(review._id)} className="text-red-500 hover:text-red-700">
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-2">
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
                <p className="text-lg font-bold text-gray-900 mt-2">{review.eventTitle}</p>
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

              <p className="text-xs text-gray-500 mt-3">
                {format(new Date(review.createdAt), "MMM d, yyyy - h:mm a")}{" "}
                {review.isEdited ? "(Edited)" : ""}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="space-y-4 bg-white shadow rounded-xl p-5">
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
            {[1, 2, 3, 4, 5].map((star: number) => (
              <button
                key={star}
                onClick={() => setFilterRating(filterRating === star ? null : star)}
                className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm transition ${filterRating === star
                    ? "bg-blue-600 text-white"
                    : "bg-white border-gray-300"
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
            ))}
          </div>
        </div>
      </div>
      {editReview && (
        <FeedbackModal
          eventId={editReview.eventId}
          isOpen={showEditModal}
          onClose={closeEditModal}
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
  );
};

export default ReviewsPage;


