import React from 'react'
import { StarIcon } from 'lucide-react'

const RatingDistribution = ({ distribution, averageRating, totalReviews }:{distribution:Record<number, number>,averageRating:any,totalReviews:any}) => {
  
    let maxCount = 0;
  if(distribution){
     maxCount = Math.max(...Object.values(distribution))
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="flex flex-col items-center justify-center border rounded-lg p-4">
        <div className="text-4xl font-bold text-blue-600">{averageRating}</div>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, index) => (
            <StarIcon
              key={index}
              className={`w-5 h-5 ${index < Math.round(parseFloat(averageRating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-gray-600 mt-2">{totalReviews} reviews</p>
      </div>

      <div className="col-span-1 md:col-span-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center mb-2">
            <div className="flex items-center w-16">
              <span className="mr-1">{rating}</span>
              <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${maxCount > 0 ? (distribution[rating] / maxCount) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="w-10 text-right text-gray-600 text-sm">
              {distribution[rating]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default RatingDistribution
