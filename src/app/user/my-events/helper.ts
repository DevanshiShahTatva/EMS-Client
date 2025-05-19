import moment from "moment";
import { ITicket, IEventsState } from "./types";

export const formatDateTime = (date: string) => {
  return moment(date).local().format("ddd, DD MMM, YYYY | h:mm A");
};

export const getTicketTypes = (array: ITicket[], ticketId: string) => {
  let ticketTypes = "";
  const findTicketType = array.find((ticket) => ticket._id === ticketId);
  if (findTicketType) {
    ticketTypes = findTicketType.type?.name;
  }

  return ticketTypes;
};

export const getEventStatus = (start: string, end: string) => {
  const now = moment();
  const startMoment = moment(start);
  const endMoment = moment(end);

  if (now.isBetween(startMoment, endMoment)) return "ongoing";
  if (now.isBefore(startMoment)) return "upcoming";
  return "past";
};

export const getEventAttendStatus = (isAttended: boolean) => {
  if (isAttended) {
    return "Attended";
  } else {
    return "Missed";
  }
};

export const getBgColor = (isAttended: boolean) => {
  if (isAttended) {
    return "bg-green-500";
  } else {
    return "bg-red-500";
  }
};

export const formatDateRange = (startRaw:string, endRaw:string) => {
  const format = "ddd, D MMM, YYYY | hh:mm A"; // based on your input
  const start = moment(startRaw, format);
  const end = moment(endRaw, format);

  if (!start.isValid() || !end.isValid()) {
    return "Invalid date range";
  }

  const isSameDay = start.isSame(end, "day");

  if (isSameDay) {
    return `${start.format("D MMM YYYY")} | ${start.format("hh:mm A")} to ${end.format("hh:mm A")}`;
  } else {
    return `${start.format("D MMM YYYY | hh:mm A")} to ${end.format("D MMM YYYY | hh:mm A")}`;
  }
};

export const sortEvents = (sortOption: string) => {
  return (a: IEventsState, b: IEventsState): number => {
    if (sortOption === "date-asc") {
      return (
        new Date(a.eventFullResponse.event.startDateTime).getTime() -
        new Date(b.eventFullResponse.event.startDateTime).getTime()
      );
    } else if (sortOption === "date-desc") {
      return (
        new Date(b.eventFullResponse.event.startDateTime).getTime() -
        new Date(a.eventFullResponse.event.startDateTime).getTime()
      );
    } else if (sortOption === "title-asc") {
      return a.eventName.localeCompare(b.eventName);
    } else if (sortOption === "title-desc") {
      return b.eventName.localeCompare(a.eventName);
    }

    return 0;
  };
};
