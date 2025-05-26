
import React from 'react'

const SkeletonBox = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
)

const EventDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <SkeletonBox className="w-8 h-8" />
        <SkeletonBox className="h-6 w-1/3" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <SkeletonBox className="lg:col-span-2 h-[380px] w-full" />

        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <SkeletonBox className="h-6 w-2/3" />
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-4 w-2/3" />
            <SkeletonBox className="h-4 w-4/5" />
            <SkeletonBox className="h-4 w-1/2" />
          </div>
          <div className="pt-4 border-t-2 border-gray-200 flex justify-between items-center">
            <div className="space-y-1">
              <SkeletonBox className="h-5 w-20" />
              <SkeletonBox className="h-4 w-16" />
            </div>
            <SkeletonBox className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <SkeletonBox className="h-5 w-32" />
        <SkeletonBox className="h-24 w-full" />
      </div>

      <div className="space-y-2">
        <SkeletonBox className="h-5 w-32" />
        <SkeletonBox className="h-48 w-full" />
      </div>
    </div>
  )
}

export default EventDetailsSkeleton
