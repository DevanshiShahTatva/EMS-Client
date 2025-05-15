import React from 'react'
import RatingDistribution from './RatingDistribution'
import ReviewCarousel from './ReviewCarousel'
import { FeedbackDetails } from '@/app/events/types'
const ReviewsSection = ({ feedbacks }: { feedbacks:FeedbackDetails[] }) => {
  const ratingDistribution = {
    5: feedbacks.filter((feedback) => feedback.rating === 5).length,
    4: feedbacks.filter((feedback) => feedback.rating === 4).length,
    3: feedbacks.filter((feedback) => feedback.rating === 3).length,
    2: feedbacks.filter((feedback) => feedback.rating === 2).length,
    1: feedbacks.filter((feedback) => feedback.rating === 1).length,
  }
  
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0)
  const averageRating = (totalRating / feedbacks.length).toFixed(1)
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Reviews & Ratings</h2>
      <RatingDistribution
        distribution={ratingDistribution}
        averageRating={averageRating}
        totalReviews={feedbacks.length}
      />
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">What attendees are saying</h3>
        <ReviewCarousel feedbacks={feedbacks} />
      </div>
    </div>
  )
}
export default ReviewsSection
