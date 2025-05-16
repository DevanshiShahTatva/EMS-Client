"use client";

import React, { useState, useEffect } from "react";

// Custom Components
import Loader from "@/components/common/Loader";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import DownloadTicketModal from "@/components/events-components/DownloadTicketModal";
import FeedbackModal from "@/components/events-components/FeedbackModal";

// Contsant & Helper Imports
import { apiCall } from "@/utils/services/request";
import { API_ROUTES } from "@/utils/constant";
import {
  formatDateTime,
  getBgColor,
  getEventAttendStatus,
  getEventStatus,
  getTicketTypes,
} from "./helper";

// Types import
import { IBooking, IEventBookingResponse, IEventsState } from "./types";

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

    if(event.isAttended) {
      return renderOngoingSection()
    } 
    
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

  const filteredEvents = myEvents.filter((event) => {
    if (event.eventFullResponse.bookingStatus === "cancelled") {
      // Show cancelled events in their original time category
      return event.eventStatus === activeTab;
    }
    return event.eventStatus === activeTab;
  });

  return (
    <div>
      {loading && <Loader />}
      <div className="min-h-[calc(100vh-76px)] flex flex-col">
        <div className="mx-auto p-10 w-full">
          <h1 className="text-3xl font-bold mb-6">My Events</h1>

          <div className="flex items-center justify-between mt-8 mb-6">
            {/* Tabs Bar  */}
            <div className="flex justify-center w-1/3">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-2 w-1/3 border border-gray-400 rounded-l-lg ${
                  activeTab === "upcoming"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 bg-white"
                } transition-colors cursor-pointer`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("ongoing")}
                className={`px-4 py-2 w-1/3 border border-gray-400 border-r-0 border-l-0 ${
                  activeTab === "ongoing"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 bg-white"
                } transition-colors cursor-pointer`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-4 py-2 w-1/3 border border-gray-400 rounded-r-lg ${
                  activeTab === "past"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 bg-white"
                } transition-colors cursor-pointer`}
              >
                Past
              </button>
            </div>

            {/* Search Bar  */}
            <div className="relative max-w-1/3 w-full bg-white rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search booked events..."
                value={searchQuery}
                onChange={(e) => handleSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5">
              {filteredEvents
                .sort((a, b) => {
                  const aDate = new Date(
                    a.eventFullResponse.event.startDateTime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ) as any;
                  const bDate = new Date(
                    b.eventFullResponse.event.startDateTime
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ) as any;
                  return aDate - bDate;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-100 p-5 rounded-xl w-full shadow-lg"
                  >
                    <div className="pb-2 border-b border-b-gray-200 flex justify-between items-center">
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
                      {item.eventStatus === "past" && (
                        <div
                          className={`px-2 py-1 ${getBgColor(
                            item.isAttended
                          )} rounded-lg text-white`}
                        >
                          {getEventAttendStatus(item.isAttended)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 my-5 pb-6 border-b border-b-gray-200">
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
                          <CalendarDays className="h-[30px] w-[30px]" />
                          <p className="text-gray-800 text-md">
                            {item.eventStartTime}{" "}
                            <span className="font-bold">to</span>{" "}
                            {item.eventEndTime}
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
                          <div className="text-gray-800 font-bold">
                            {item.eventTicketCount}{" "}
                            {item.eventTicketCount === 1 ? "ticket" : "tickets"}{" "}
                            of
                            <span className="text-blue-500">
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
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MyEventsPage;
