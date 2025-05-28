import React from 'react';
import moment from 'moment';
import { StarRating } from './CustomerReviews';

interface IReviewCard {
  name: string;
  updatedAt: string;
  profileimage: string | null;
  rating: number;
  description: string;
}

const ReviewCard = ({ name, updatedAt, profileimage, rating, description }: IReviewCard) => (
  <div className="bg-white p-5 rounded-xl shadow border mb-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        {profileimage ?
          <img src={profileimage} alt={name} className="w-10 h-10 rounded-full" />
          : <div className='flex justify-center items-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold'>
            {name.charAt(0).toUpperCase()}
          </div>
        }
        <div>
          <h4 className="text-sm font-semibold">{name}</h4>
          <p className="text-xs text-gray-500">{moment(updatedAt).format('DD MMM, YYYY - hh:mm A')}</p>
        </div>
      </div>
      <StarRating rating={rating} />
    </div>
    <p className="text-sm text-gray-600 mt-3">{description}</p>
  </div>
);

const ReviewsRightSection = ({ reviews, averageRating, eventName }: { eventName: string; averageRating: string; reviews: IReviewCard[] }) => {
  const formatToBucket = (num: number) => {
    if (num % 10 === 0) {
      return `(${num})`;
    }
    if (num < 10) {
      return `(${num})`;
    }
    const bucket = Math.floor(num / 10) * 10;
    return `(${bucket}+)`;
  }

  return (
    <div className="w-full md:w-2/3 space-y-4">
      <div className="bg-blue-500 text-white p-5 rounded-xl shadow-md relative">
        <h2 className="text-lg font-bold">{eventName}</h2>
        <p className="text-sm">{formatToBucket(reviews.length)} {averageRating} Ratings</p>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex -space-x-4">
          {reviews.slice(0, 5).map((review, i) => {
            return review.profileimage ?
              <img
                alt="not found"
                key={`${i + 1}`}
                src={review.profileimage}
                className={`z-${i + 1} w-10 h-10 rounded-full border-2 border-white`}
              /> :
              <div className={`z-${i + 1} border flex justify-center items-center h-10 w-10 rounded-full bg-white text-indigo-600 font-bold relative`}>
                {review.name.charAt(0).toUpperCase()}
              </div>
          })}
          {reviews.length > 5 && (
            <div className='z-10 border flex justify-center items-center h-10 w-10 rounded-full bg-white text-indigo-600 font-bold relative'>
              {reviews.length - 5}+
            </div>
          )}
        </div>
      </div>
      <div className='max-h-[476px] overflow-auto pr-2 pl-2'>
        {reviews.map((review, i) => (
          <ReviewCard key={`${i + 1}`} {...review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsRightSection;