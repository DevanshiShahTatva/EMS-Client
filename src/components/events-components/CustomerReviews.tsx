import React from 'react';
import { StarIcon } from 'lucide-react';
import ReviewsRightSection from './PeopleReview';
import { FeedbackDetails } from '@/app/events/types';

const colorArr: Record<number, string> = {
  1: 'text-purple-600 bg-purple-100',
  2: 'text-green-600 bg-green-100',
  3: 'text-orange-600 bg-orange-100',
  4: 'text-pink-600 bg-pink-100',
  5: 'text-blue-600 bg-blue-100',
}

const labelArr: Record<number, string> = {
  1: 'Mad',
  2: 'Sad',
  3: 'Okay Events',
  4: 'Good',
  5: 'Great',
}

export const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex space-x-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
      />
    ))}
  </div>
);

const CustomerReviews = ({ feedbacks }: { feedbacks: FeedbackDetails[] }) => {
  const ratingDistribution: Record<number, number> = {
    5: feedbacks.filter((feedback) => feedback.rating === 5).length,
    4: feedbacks.filter((feedback) => feedback.rating === 4).length,
    3: feedbacks.filter((feedback) => feedback.rating === 3).length,
    2: feedbacks.filter((feedback) => feedback.rating === 2).length,
    1: feedbacks.filter((feedback) => feedback.rating === 1).length,
  }

  let maxCount = 0;
  if (ratingDistribution) {
    maxCount = Math.max(...Object.values(ratingDistribution));
  }

  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  const averageRating = (totalRating / feedbacks.length).toFixed(1);

  const ratingData = [5, 4, 3, 2, 1].map((rating) => ({
    stars: rating,
    percent: maxCount > 0 ? Math.round((ratingDistribution[rating] / maxCount) * 100) : 0
  }));

  return (
    <div className='flex gap-10 mt-10'>
      <div className="max-w-sm w-full border p-6 bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
            <img src="/icon.png" alt="icon" className="w-8 h-8" />
          </div>
          <p className="text-gray-600 text-sm">Customer reviews</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{averageRating}</p>
          <p className="text-sm text-gray-400 mb-2">130 Reviews</p>
          <div>
            <StarRating rating={4} />
          </div>
        </div>
        <div className="mt-6 space-y-2">
          {ratingData.map(({ stars, percent }) => (
            <div key={stars} className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600 w-4">{stars}</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-gray-500 text-xs w-8 text-right">{percent}%</span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">What User Like</h4>
          <div className="space-y-2 text-sm">
            {[5, 4, 3, 2, 1].map((aspect, i: number) => (
              <div key={`${i + 1}`} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className={`w-5 h-5 pt-0.5 rounded-full text-center text-xs font-semibold ${colorArr[aspect]}`}>
                    {i + 1}
                  </span>
                  <span className="text-gray-700">{labelArr[aspect]}</span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-md ${colorArr[aspect]}`}>
                  {ratingDistribution[aspect] < 10 ? `0${ratingDistribution[aspect]}` : ratingDistribution[aspect]} votes
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReviewsRightSection reviews={feedbacks} />
    </div>
  )
}

export default CustomerReviews;