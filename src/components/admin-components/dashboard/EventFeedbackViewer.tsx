'use client'
import { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import BarChart from '../charts/BarChart';
import { apiCall } from '@/utils/services/request';
import { EventFeedbackSummary, IFilter } from '@/app/admin/dashboard/types';
import { API_ROUTES } from '@/utils/constant';
import ChartFallbackUI from './ChartFallbackUI';

const EventFeedbackViewer = () => {
  const [events, setEvents] = useState<EventFeedbackSummary[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventFeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
      try {
        const response = await apiCall({
          endPoint: `${API_ROUTES.ADMIN.FEEDBACK_ANALYTICS}?period=overall`,
          method: 'GET',
        });
        const eventList = response?.data?.data || [];

        if(eventList.length > 0) {
          const filterdEventList = eventList.filter((event: any) => event?.eventTitle !== null)
          setEvents(filterdEventList);
          setSelectedEvent(filterdEventList[0] || null);
        }
      } catch (error) {
        console.error('Error fetching event feedback:', error);
      } finally {
        setLoading(false);
      }
    },[]);
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="flex h-[500px] rounded-lg overflow-hidden shadow mt-4">
      <div className={(events.length>0) ? "w-1/3 overflow-y-auto p-4 bg-gray-50":"w-full overflow-y-auto p-4 bg-gray-50 flex items-center justify-center"}>
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (events.length>0) ? (
          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event.eventId}
                className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${selectedEvent?.eventId === event.eventId ? 'bg-gray-300' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                {event.eventTitle}
              </li>
            ))}
          </ul>
        ) : (
          <div className="min-h-[250px] h-[400px] md:h-[300px] w-full flex items-center justify-center">
            <ChartFallbackUI handleRefresh={fetchEvents} />
          </div>
        )}
      </div>

      <div className={(events.length>0)? "w-2/3 p-6" : ""}>
        {loading || !selectedEvent ? (
          <Skeleton className="w-full h-full" />
        ) : (selectedEvent.eventId) ? (
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
        ):(<></>)}
      </div>
    </div>
  );
};

export default EventFeedbackViewer;
