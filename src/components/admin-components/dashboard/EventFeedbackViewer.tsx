'use client'
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import BarChart from '../charts/BarChart';
import { apiCall } from '@/utils/services/request';
import { EventFeedbackSummary, IFilter } from '@/app/admin/dashboard/types';
import { API_ROUTES } from '@/utils/constant';

const EventFeedbackViewer = () => {
  const [events, setEvents] = useState<EventFeedbackSummary[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventFeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiCall({
          endPoint: `${API_ROUTES.ADMIN.FEEDBACK_ANALYTICS}?period=overall`,
          method: 'GET',
        });
        const eventList = response?.data?.data || [];
        setEvents(eventList);
        setSelectedEvent(eventList[0] || null);
      } catch (error) {
        console.error('Error fetching event feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex h-[500px] rounded-lg overflow-hidden shadow mt-12">
      <div className="w-1/3 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event.eventId}
                className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${selectedEvent?.eventId === event.eventId ? 'bg-gray-300' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                {event.eventTitle || 'Untitled Event'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-2/3 p-6">
        {loading || !selectedEvent ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">{selectedEvent.eventTitle || 'Untitled Event'}</h2>
              <p>Total Feedbacks: {selectedEvent.totalFeedbacks}</p>
              <p>Average Rating: {selectedEvent.averageRating.toFixed(1)} ⭐</p>
            </div>

            <div className="h-[300px]">
              <BarChart
                data={Object.values(selectedEvent.ratingsBreakdown)}
                labels={['1⭐', '2⭐', '3⭐', '4⭐', '5⭐']}
                symbolType='count'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFeedbackViewer;
