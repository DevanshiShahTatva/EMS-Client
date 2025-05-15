import moment from "moment";
import { ITicket } from "./types";

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
