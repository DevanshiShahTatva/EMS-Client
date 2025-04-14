'use client'
import React, { useEffect, useState } from 'react'
import { SearchBar } from '@/components/events-components/SearchBar'
import { CategoryTabs } from '@/components/events-components/CategoryTabs'
import { FilterOptions } from '@/components/events-components/FilterOptions'
import { FeaturedEvent } from '@/components/events-components/FeaturedEvent'
import { EventList } from '@/components/events-components/EventList'
import { EVENT_DATA } from '@/utils/constant'
import { EventData, EventCategory, SortOption } from "@/types/events";
const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(EVENT_DATA)
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(EVENT_DATA)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all')
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const featuredEvent = EVENT_DATA.find((event) => event.isFeatured)
  const regularEvents = filteredEvents.filter((event) => !event.isFeatured)
  useEffect(() => {
    let result = [...EVENT_DATA]
    if (searchQuery) {
      result = result.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    if (activeCategory !== 'all') {
      result = result.filter((event) => event.category === activeCategory)
    }
    if (sortOption === 'date-asc') {
      result = [...result].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
    } else if (sortOption === 'date-desc') {
      result = [...result].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    } else if (sortOption === 'title-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOption === 'title-desc') {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title))
    }
    setFilteredEvents(result)
  }, [searchQuery, activeCategory, sortOption])
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Discover Events</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterOptions sortOption={sortOption} setSortOption={setSortOption} />
      </div>
      <CategoryTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      {featuredEvent && (
        <div className="mb-8 mt-6">
          <h2 className="text-xl font-semibold mb-4">Featured Event</h2>
          <FeaturedEvent event={featuredEvent} />
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Events</h2>
        <EventList events={regularEvents} />
      </div>
    </div>
  )
}
export default EventsPage