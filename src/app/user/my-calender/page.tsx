'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import { XMarkIcon } from "@heroicons/react/24/solid";
import moment from 'moment';
import Image from 'next/image';
import { apiCall } from '@/utils/services/request';
import Loader from '@/components/common/Loader';
import { API_ROUTES, ROUTES } from '@/utils/constant';
import CalenderDropdown from './CalenderDropdown';
import TooltipWrapper from '@/components/common/TooltipWrapper';
import ModalLayout from '@/components/common/CommonModalLayout';

type ExtendedEventInput = EventInput & {
  address?: string;
  iconUrl?: string
}

export default function MyCalendar() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<ExtendedEventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventInput | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await apiCall({
        endPoint: API_ROUTES.EVENT.MY_EVENTS,
        method: "GET",
        withToken: true
      });
      if (response?.success) {
        const formateData = response.data.map((obj: EventInput) => {
          return ({
            id: obj.event._id,
            title: obj.event.title,
            address: obj.event.location.address,
            start: new Date(obj.event.startDateTime),
            end: new Date(obj.event.endDateTime),
            backgroundColor: obj?.event?.category?.bgColor || "#e6e9ed",
            borderColor: obj?.event?.category?.color || "#424242",
            textColor: obj?.event?.category?.color || "#424242",
            extendedProps: {
              iconUrl: obj?.event?.category?.icon?.url
            }
          });
        });
        setEvents(formateData);
        setLoading(false);
      };
    }
    fetchEvents();
  }, []);

  const redirectToDetailPage = (eventId: string | undefined) => {
    router.push(`${ROUTES.USER_EVENTS}/${eventId}`);
  }

  const handleEventClick = (arg: EventClickArg) => {
    setShowModal(true);
    setSelectedEvent(events.filter((obj) => obj.id === arg.event.id)[0]);
  };

  const handleViewChange = (value: string) => {
    const calendarApi = calendarRef.current.getApi();

    if (value === "today") {
      calendarApi.today();
    } else {
      calendarApi.changeView(value);
    }
    setTitle(calendarApi.view.title);
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setTitle(calendarApi.view.title);
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setTitle(calendarApi.view.title);
  };

  const renderEventContent = (eventInfo: EventInput) => {
    const title = eventInfo.event.title;
    const startTime = moment(eventInfo.event.start).format('h:mm A');
    const iconUrl = eventInfo.event.extendedProps?.iconUrl;
    return (
      <div className="flex justify-between items-center px-[7px] py-[4px] rounded-md text-xs font-medium w-full">
        <div className="flex items-center gap-2">
          {iconUrl && (
            <Image
              src={iconUrl}
              alt="icon"
              height={16}
              width={16}
              className="object-contain"
            />
          )}
          <TooltipWrapper tooltip={title}>
            <span className="font-bold truncate max-w-[70%]">{title}</span>
          </TooltipWrapper>
        </div>
        <span>{startTime}</span>
      </div>
    );
  }

  return (
    <div className='min-h-[calc(100vh-76px)] flex flex-col'>
      {loading && <Loader />}
      <div className="p-5 pt-5 md:p-10">
        <div className="bg-white rounded-lg shadow p-5">
          <CalenderDropdown
            title={title}
            onChange={handleViewChange}
            handleNext={handleNext}
            handlePrev={handlePrev}
            allowedTypes={["Monthly", "Weekly", "List", "Yearly"]}
          />
          <FullCalendar
            ref={calendarRef}
            height="auto"
            events={events}
            editable={true}
            initialView="dayGridMonth"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={false}
            eventDidMount={(info) => {
              info.el.style.backgroundColor = info.event.backgroundColor || '';
              info.el.style.borderColor = info.event.borderColor || '';
              info.el.style.color = info.event.textColor || '';
              info.el.style.borderWidth = '1px';
              info.el.style.borderStyle = 'solid';
              info.el.style.cursor = 'pointer';
            }}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
          />
        </div>
        {showModal && selectedEvent && (
            <ModalLayout
               onClose={() => setShowModal(false)}
               modalTitle='Event Details'
               footerActions={[
                 { label : "View", onClick: () => redirectToDetailPage(selectedEvent.id), variant: "primary"}
               ]}
            >
              <div className="px-0 py-4">
                <div className="grid grid-cols-2 gap-4 text-md mt-2">
                  <div className="space-y-1">
                    <p className="text-gray-600 font-semibold">Event</p>
                    <p className="text-gray-900 font-medium">
                      {selectedEvent.title}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 font-semibold">Date</p>
                    <p className="text-gray-900">{moment(selectedEvent.start?.toString()).local().format("DD MMM YYYY")} - {moment(selectedEvent.end?.toString()).local().format("DD MMM YYYY")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 font-semibold">Location</p>
                    <p className="text-gray-900">{selectedEvent.address}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 font-semibold">Time</p>
                    <p className="text-gray-900">
                      {moment(selectedEvent.start?.toString()).local().format('hh:mm A')} - {moment(selectedEvent.end?.toString()).local().format('hh:mm A')}
                    </p>
                  </div>
                </div>
              </div>
            </ModalLayout>
        )}
      </div>
    </div>
  );
}