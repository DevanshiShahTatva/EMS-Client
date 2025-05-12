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
import { formatDateTime, getEventStatus, getTicketTypes } from "./helper";

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
  IndianRupee,
  Ticket,
  SearchIcon,
  QrCode,
} from "lucide-react";
import CancelTicketModal from "@/components/events-components/CancelTicketModal";
import { toast } from "react-toastify";

const MyEventsPage = () => {
  const [myEvents, setMyEvents] = useState<IEventsState[]>([]);
  const [allMyEvents, setAllMyEvents] = useState<IEventsState[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [tickeModal, setTicketModal] = useState(false);
  const [ticketSummary, setTicketSuumary] = useState<IBooking | null>(null);
  const [showFeedbackModal, setFeedbackModal] = useState(false);
  const [showCancelTicketModal, setShowCancelTicketModal] = useState(false);
  const [eventDetails, setEventDetails] = useState<IEventsState | null>(null);
  const openDownloadTicketModal = (events: IBooking) => {
    setTicketSuumary(events);
    setTicketModal(true);
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
      let data = result.data.toSorted((a, b) => {
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
      let eventsArray = data.map((item) => {
        return {
          id: item._id,
          eventBookedOn: moment(item.bookingDate).format(
            "DD MMM YYYY, [at] hh:mm:ss A"
          ),
          eventName: item.event?.title || "",
          eventCatogory: item.event?.category || "",
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
    try {
      const response = await apiCall({
        endPoint: API_ROUTES.EVENT.CANCEL_EVENT + eventDetails?.id,
        method: "PUT",
        withToken: true,
      });

      if (response && response.success) {
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
      <div>
        <div className="flex gap-3 items-center">
          <div>Upcoming</div>
          <div className="pl-2 sm:pl-5 text-sm sm:text-xl text-gray-800 border-l border-l-gray-400">
            Get ready for your upcoming event. Click here to{" "}
            <span
              onClick={() => handleCancelTicket(event)}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Cancel.
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderEndedSection = () => {
    return (
      <div>
        <div className="flex gap-3 items-center">
          <div>Finished</div>
          <div className="pl-2 sm:pl-5 text-sm sm:text-xl text-gray-800 border-l border-l-gray-400">
            Hope you enjoyed this Event. Please give your{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => setFeedbackModal(true)}
            >
              Feedback
            </span>{" "}
            here.
          </div>
        </div>
      </div>
    );
  };

  const renderOngoingSection = () => {
    return (
      <div>
        <div className="flex gap-3 items-center">
          <div>Ongoing</div>
          <div className="pl-2 sm:pl-5 text-sm sm:text-xl text-gray-800 border-l border-l-gray-400">
            You've secured your spot. Stay tuned for updates and notifications.
          </div>
        </div>
      </div>
    );
  };

  const renderStatusTittle = (event: IEventsState) => {
    switch (event.eventStatus) {
      case "upcoming":
        return renderUpcomingSection(event);
      case "ended":
        return renderEndedSection();
      case "ongoing":
        return renderOngoingSection();
      default:
        return;
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

  return (
    <div>
      {loading && <Loader />}
      <div className="min-h-[calc(100vh-76px)] flex flex-col">
        <div className="mx-auto p-10 w-full">
          <h1 className="text-3xl font-bold mb-6">My Events</h1>

          {/* Search Bar  */}
          <div className="relative flex-grow w-full bg-white mt-3 mb-9">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5">
            {myEvents.length > 0 &&
              myEvents.map((item) => (
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
                    <TooltipWrapper tooltip="Get QR">
                      <QrCode
                        onClick={() =>
                          openDownloadTicketModal(item.eventFullResponse)
                        }
                        className="h-5 w-5 cursor-pointer"
                      />
                    </TooltipWrapper>
                  </div>

                  <div className="flex flex-col md:flex-row gap-5 my-5 pb-6 border-b border-b-gray-200">
                    <img
                      alt="not found"
                      src={item.eventImage}
                      className="rounded-lg  h-60 w-full md:w-[50%] lg:w-[40%] object-cover"
                    />

                    <div>
                      <p className="text-xl font-bold mb-1">{item.eventName}</p>
                      <p className="text-gray-500 mb-3">{item.eventCatogory}</p>

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

                      <div className="flex gap-3 items-center my-2">
                        <IndianRupee className="h-5 w-5" />
                        <p className="text-gray-800 font-bold">
                          Total Paid : ₹ {item.eventTicketPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  {renderStatusTittle(item)}
                </div>
              ))}
          </div>

          {myEvents.length === 0 && (
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
            isOpen={showFeedbackModal}
            onClose={() => setFeedbackModal(false)}
            onSubmit={(formData) => {
              console.log("Submitted Feedback:", formData);
            }}
          />

          <CancelTicketModal
            isOpen={showCancelTicketModal}
            onClose={() => handleCloseCancelTicketModal()}
            onSubmit={() => handleCancelTicketSubmit()}
            eventDetails={eventDetails as IEventsState}
          />
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MyEventsPage;
