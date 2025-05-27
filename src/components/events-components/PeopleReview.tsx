import React from 'react';
import moment from 'moment';
import { StarRating } from './CustomerReviews';

interface IReviewCard {
  name: string;
  updatedAt: string;
  eventImage: string;
  rating: number;
  description: string;
}

const ReviewCard = ({ name, updatedAt, eventImage, rating, description }: IReviewCard) => (
  <div className="bg-white p-5 rounded-xl shadow border mb-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        <img src={eventImage} alt={name} className="w-10 h-10 rounded-full" />
        <div>
          <h4 className="text-sm font-semibold">{name}</h4>
          <p className="text-xs text-gray-500">{moment(updatedAt).format('DD MMM, YYYY')}</p>
        </div>
      </div>
      <StarRating rating={rating} />
    </div>
    <p className="text-sm text-gray-600 mt-3">{description}</p>
  </div>
);

const ReviewsRightSection = ({ reviews }: { reviews: IReviewCard[] }) => {
  return (
    <div className="w-full md:w-2/3 space-y-4">
      <div className="bg-purple-600 text-white p-5 rounded-xl shadow-md relative">
        <h2 className="text-lg font-bold">Trendy Studio</h2>
        <p className="text-sm">(100+) 5.0 Ratings</p>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex -space-x-3">
          <img
            alt="not found"
            src="https://i.pravatar.cc/40?img=4"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <img
            alt="not found"
            src="https://i.pravatar.cc/40?img=5"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <img
            alt="not found"
            src="https://i.pravatar.cc/40?img=6"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
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