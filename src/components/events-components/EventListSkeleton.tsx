import React from 'react'

const SkeletonBox = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
)

const EventListSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <SkeletonBox className="h-10 w-1/3" /> 
        <SkeletonBox className="h-10 w-24" />  
      </div>

      <div className="w-full h-56 rounded-lg bg-gray-200 animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow space-y-3">
            <SkeletonBox className="h-40 w-full rounded-md" /> 
            <SkeletonBox className="h-5 w-3/4" /> 
            <SkeletonBox className="h-4 w-1/2" /> 
            <SkeletonBox className="h-4 w-2/3" /> 
            <SkeletonBox className="h-4 w-1/3" /> 
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventListSkeleton
