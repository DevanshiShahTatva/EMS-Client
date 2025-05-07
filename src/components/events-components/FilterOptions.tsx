'use client'
import React, { useState } from 'react'
import { SlidersIcon, ChevronDownIcon } from 'lucide-react'
import { SortOption } from '../../app/events/types'
interface FilterOptionsProps {
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
}
export const FilterOptions: React.FC<FilterOptionsProps> = ({
  sortOption,
  setSortOption,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const sortOptions = [
    {
      value: 'none',
      label: 'Default',
    },
    {
      value: 'date-asc',
      label: 'Date (Earliest first)',
    },
    {
      value: 'date-desc',
      label: 'Date (Latest first)',
    },
    {
      value: 'title-asc',
      label: 'Title (A-Z)',
    },
    {
      value: 'title-desc',
      label: 'Title (Z-A)',
    },
  ]
  const currentLabel =
    sortOptions.find((option) => option.value === sortOption)?.label ||
    'Sort by'
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-max items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <SlidersIcon className="h-4 w-4" />
        <span>{currentLabel}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortOption(option.value as SortOption)
                  setIsOpen(false)
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${sortOption === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}