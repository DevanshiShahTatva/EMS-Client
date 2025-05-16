"use client";

import React, { useState, useEffect } from "react";

// Custom Components
import Loader from "@/components/common/Loader";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import DownloadTicketModal from "@/components/events-components/DownloadTicketModal";
import FeedbackModal from "@/components/events-components/FeedbackModal";
import { FilterOptions } from '@/components/events-components/FilterOptions'

// Contsant & Helper Imports
import { apiCall } from "@/utils/services/request";
import { API_ROUTES } from "@/utils/constant";
import {
  formatDateTime,
  getEventStatus,
  getTicketTypes,
  formatDateRange, 
  sortEvents
} from "./helper";

// Types import
import { IBooking, IEventBookingResponse, IEventsState, SortOption } from "./types";

// Library imports
import moment from "moment";
import Footer from "@/components/common/Footer";

// Icons imports
import {
  CalendarDays,
  Clock9,
  MapPin,
  Ticket,
  SearchIcon,
  QrCode,
  IndianRupee
} from "lucide-react";
import CancelTicketModal from "@/components/events-components/CancelTicketModal";
import { toast } from "react-toastify";
import AlertBox from "@/components/events-components/AlertBox";

const MyEventsPage = () => {
  const [myEvents, setMyEvents] = useState<IEventsState[]>([]);
  const [allMyEvents, setAllMyEvents] = useState<IEventsState[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [tickeModal, setTicketModal] = useState(false);
  const [ticketSummary, setTicketSuumary] = useState<IBooking | null>(null);
  const [showFeedbackModal, setFeedbackModal] = useState(false);
  const [feedbackEventId, setFeedbackEventId] = useState("");
  const [showCancelTicketModal, setShowCancelTicketModal] = useState(false);
  const [eventDetails, setEventDetails] = useState<IEventsState | null>(null);
  const [isTicketCancelling, setIsTicektCancelling] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('none')
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past">(
    "upcoming"
  );

  const openDownloadTicketModal = (events: IBooking) => {
    setTicketSuumary(events);
    setTicketModal(true);
  };

  const setFeedbackEvent = (eventId: string) => {
    setFeedbackModal(true);
    setFeedbackEventId(eventId);
  };

  const closeFeedbackEvent = () => {
    setFeedbackModal(false);
    setFeedbackEventId("");
  };

  const closeDownloadTicketModal = () => {
    setTicketSuumary(null);
    setTicketModal(false);
  };

  const getEventsStatus = (
    startDateTime: string,
    endDateTime: string,
    now = moment()
  ) => {
    const start = moment(startDateTime);
    const end = moment(endDateTime);

    if (start.isBefore(now) && end.isAfter(now)) {
      return 0; // Ongoing
    } else if (start.isAfter(now)) {
      return 1; // Upcoming
    } else {
      return 2; // Past
    }
  };

  const fetchMyEvents = async () => {
    const result: IEventBookingResponse = await apiCall({
      endPoint: API_ROUTES.EVENT.MY_EVENTS,
      method: "GET",
      withToken: true,
    });

    if (result?.success) {
      const data = result.data.toSorted((a, b) => {
        const aStatus = getEventsStatus(
          a.event.startDateTime,
          a.event.endDateTime
        );
        const bStatus = getEventsStatus(
          b.event.startDateTime,
          b.event.endDateTime
        );
        if (aStatus !== bStatus) {
          return aStatus - bStatus;
        } else {
          return moment(b.event.startDateTime).diff(
            moment(a.event.startDateTime)
          );
        }
      });
      const eventsArray = data.map((item) => {
        return {
          id: item._id,
          eventBookedOn: moment(item.bookingDate).format(
            "DD MMM YYYY, [at] hh:mm:ss A"
          ),
          eventName: item.event?.title || "",
          eventCatogory: item.event?.category?.name || "",
          eventStartTime: formatDateTime(item.event?.startDateTime || "") || "",
          eventEndTime: formatDateTime(item.event?.endDateTime || "") || "",
          eventDuration: item.event?.duration || "",
          eventLocation: item.event?.location?.address || "",
          eventTicketCount: item?.seats,
          eventTicketType: getTicketTypes(item.event?.tickets, item?.ticket),
          eventTicketPrice: item?.totalAmount,
          eventStatus: getEventStatus(
            item.event?.startDateTime || "",
            item.event?.endDateTime
          ),
          eventImage:
            item.event.images.length > 0 ? item.event.images[0].url : "",
          eventFullResponse: item,
          bookingStatus: item.bookingStatus,
          cancelledAt: item.cancelledAt,
          isAttended: item.isAttended,
        };
      });

      setMyEvents(eventsArray);
      setAllMyEvents(eventsArray);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCancelTicket = (event: IEventsState) => {
    setShowCancelTicketModal(true);
    setEventDetails(event);
  };

  const handleCloseCancelTicketModal = () => {
    setShowCancelTicketModal(false);
    setEventDetails(null);
  };

  const handleCancelTicketSubmit = async () => {
    setIsTicektCancelling(true);
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.EVENT.CANCEL_EVENT + eventDetails?.id,
        method: "PUT",
        withToken: true,
      });

      if (response && response.success) {
        setIsTicektCancelling(false);
        toast.success(response.message);
        setShowCancelTicketModal(false);
        fetchMyEvents();
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const renderUpcomingSection = (event: IEventsState) => {
    return (
      <AlertBox type="success">
        <div className="text-green-700">
          Get ready for your upcoming event. Click here to{" "}
          <span
            onClick={() => handleCancelTicket(event)}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Cancel.
          </span>
        </div>
      </AlertBox>
    );
  };

  const renderEndedSection = (event: IEventsState) => {
    return (
      <AlertBox type="warning">
        {event.isAttended ? (
          <div className="text-yellow-700">
            Hope you enjoyed this Event. Please give your{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => setFeedbackEvent(event.id)}
            >
              Feedback
            </span>{" "}
            here.
          </div>
        ) : (
          "Sorry, You missed this event"
        )}
      </AlertBox>
    );
  };

  const renderOngoingSection = () => {
    return (
      <AlertBox type="info">
        {`You've secured your spot. Stay tuned for updates and notifications.`}
      </AlertBox>
    );
  };

  const renderStatusTitle = (event: IEventsState) => {
    if (event.eventFullResponse.bookingStatus === "cancelled") {
      return (
        <AlertBox type="error">
          Your booking for this event has been cancelled
        </AlertBox>
      );
    }

    switch (event.eventStatus) {
      case "upcoming":
        return renderUpcomingSection(event);
      case "ongoing":
        return renderOngoingSection();
      case "past":
        return renderEndedSection(event);
      default:
        return null;
    }
  };

  const formateDate = (date: string) => {
    return moment(date, "DD MMM YYYY, [at] hh:mm:ss A").format(
      "DD MMM YYYY, [at] hh:mm A"
    );
  };

  const handleSearchQuery = (query: string) => {
    const filteredEvents = allMyEvents.filter(
      (event) =>
        event.eventName.toLowerCase().includes(query.toLowerCase()) ||
        event.eventCatogory.toLowerCase().includes(query.toLowerCase()) ||
        event.eventLocation.toLowerCase().includes(query.toLowerCase()) ||
        event.eventStatus.toLowerCase().includes(query.toLowerCase()) ||
        event.eventTicketPrice
          .toString()
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        event.eventDuration
          .toString()
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        formateDate(event.eventBookedOn)
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        event.eventStartTime.toLowerCase().includes(query.toLowerCase()) ||
        event.eventEndTime.toLowerCase().includes(query.toLowerCase())
    );

    setMyEvents(filteredEvents);
    setSearchQuery(query);
  };

  let filteredEvents = myEvents.filter((event) => {
    if (event.eventFullResponse.bookingStatus === "cancelled") {
      // Show cancelled events in their original time category
      return event.eventStatus === activeTab;
    }
    return event.eventStatus === activeTab;
  });

  filteredEvents = [...filteredEvents].sort(sortEvents(sortOption));

  return (
    <div>
      {loading && <Loader />}
      <div className="min-h-[calc(100vh-76px)] flex flex-col">
        <div className="mx-auto px-5 py-10 md:px-10 w-full">
          <div className="bg-white border border-gray-100 p-5 rounded-xl w-full shadow-lg">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between my-5 gap-4 border-b-0 md:border-b  border-gray-200">
          {/* Tabs Bar */}
          <div className="relative space-x-4 flex w-full md:w-auto">
            {["upcoming", "ongoing", "past"].map((tab: string) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "upcoming" | "ongoing" | "past")}
                className={`relative pb-5 pt-7 px-2 text-sm md:text-base font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "text-blue-600 after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-blue-600"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex gap-3 justify-between md:justify-start flex-wrap">
            <div className="relative bg-white rounded-lg md:w-[300px] w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search booked events..."
                value={searchQuery}
                onChange={(e) => handleSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-2 text-lg w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full md:w-auto">
            <FilterOptions
              sortOption={sortOption}
              setSortOption={(option: SortOption) => setSortOption(option)}
            />
            </div>
          </div>
        </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5">
              {filteredEvents.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-300 p-5 rounded-xl w-full transition-shadow hover:shadow-lg">
                    <div className="pb-2 border-b border-b-gray-200 flex justify-between items-center relative">
                      <p className="text-lg">
                        Tickets booked on :{" "}
                        <span className="font-bold">
                          {formateDate(item.eventBookedOn)}
                        </span>
                      </p>
                      {item.eventFullResponse.bookingStatus === "booked" &&
                        item.eventStatus !== "past" && (
                        <TooltipWrapper tooltip="Get QR">
                          <QrCode
                              onClick={() =>
                                openDownloadTicketModal(item.eventFullResponse)
                              }
                            className="h-5 w-5 cursor-pointer"
                          />
                        </TooltipWrapper>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 my-5 ">
                      <img
                        alt="not found"
                        src={item.eventImage}
                        className="rounded-lg h-60 w-full md:w-[50%] lg:w-[40%] object-cover"
                      />
                      <div>
                        <p className="text-xl font-bold mb-1">
                          {item.eventName}
                        </p>
                        <p className="text-gray-500 mb-3">
                          {item.eventCatogory}
                        </p>

                        <div className="flex gap-3 items-center my-2">
                          <CalendarDays className="h-5 w-5" />
                          <p className="text-gray-800 text-md">
                            {formatDateRange(item.eventStartTime, item.eventEndTime)}
                          </p>
                        </div>

                        <div className="flex gap-3 items-center my-2">
                          <Clock9 className="h-5 w-5" />
                          <p className="text-gray-800 text-md">
                            {item.eventDuration}
                          </p>
                        </div>

                        <div className="flex gap-3 items-center my-2">
                          <MapPin className="h-5 w-5" />
                          <TooltipWrapper tooltip={item.eventLocation}>
                            <p className="text-gray-800 text-md truncate  max-w-[275px] sm:max-w-[275px]">
                              {item.eventLocation}
                            </p>
                          </TooltipWrapper>
                        </div>

                        <div className="flex gap-3 items-center my-2">
                          <Ticket className="h-5 w-5" />
                          <div className="text-gray-800">
                            {item.eventTicketCount} {item.eventTicketCount === 1 ? "ticket" : "tickets"} of
                            <span className="text-blue-500 font-bold">
                              {" "}
                              &nbsp;
                              <TooltipWrapper
                                tooltip={`Cost per ticket : ${
                                  item.eventTicketPrice / item.eventTicketCount
                                }`}
                              >
                                {item.eventTicketType}
                              </TooltipWrapper>
                            </span>{" "}
                            category
                          </div>
                        </div>

                        <div className="flex gap-3 items-center my-2">
                          <IndianRupee className="h-5 w-5" />
                          <p className="text-gray-800 ">Total Paid : ₹ {item.eventTicketPrice}</p>
                        </div>
                      </div>
                    </div>
                    {renderStatusTitle(item)}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No bookings found.</p>
            </div>
          )}

          <DownloadTicketModal
            isOpen={tickeModal}
            eventData={ticketSummary}
            onClose={closeDownloadTicketModal}
          />

          <FeedbackModal
            eventId={feedbackEventId}
            isOpen={showFeedbackModal}
            onClose={() => closeFeedbackEvent()}
          />

          {showCancelTicketModal && (
            <CancelTicketModal
              isOpen={showCancelTicketModal}
              onClose={() => handleCloseCancelTicketModal()}
              onSubmit={() => handleCancelTicketSubmit()}
              eventDetails={eventDetails as IEventsState}
              isSubmitting={isTicketCancelling}
            />
          )}
        </div>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MyEventsPage;
