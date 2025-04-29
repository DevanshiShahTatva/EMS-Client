import React from 'react'
import { EventCategory } from '@/app/events/types'
interface CategoryTabsProps {
  activeCategory: EventCategory
  setActiveCategory: (category: EventCategory) => void
}
export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  const categories: {
    id: EventCategory
    label: string
  }[] = [
    {
      id: 'all',
      label: 'All',
    },
    {
      id: 'Film & Media',
      label: 'Film & Media',
    },
    {
      id: 'Business',
      label: 'Business',
    },
    {
      id: 'Art & Culture',
      label: 'Art & Culture',
    },
    {
      id: 'Music',
      label: 'Music',
    },
    {
      id: 'Gaming',
      label: 'Gaming',
    },
    {
      id: 'Food & Drink',
      label: 'Food & Drink',
    },
    {
      id: 'Sports',
      label: 'Sports',
    },
    {
      id: 'Education',
      label: 'Education',
    },
    {
      id: 'Wellness',
      label: 'Wellness',
    },
  ]

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <div className="flex space-x-1 min-w-full py-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
