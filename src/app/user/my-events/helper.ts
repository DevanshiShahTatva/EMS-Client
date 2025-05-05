import moment from "moment";
import { ITicket } from "./types";


export const formatDateTime = (date: string) => {
    return moment(date)
      .local()
      .format("ddd, DD MMM, YYYY | h:mm A");
  };

export const getTicketTypes = (array : ITicket[], ticketId : string) => {
    let ticketTypes = ""
    const findTicketType = array.find(ticket => ticket._id === ticketId)
    if(findTicketType) {
        ticketTypes = findTicketType.type
    }

    return ticketTypes
}

export const getEventStatus = (startTime: string, endTime: string): "upcoming" | "ongoing" | "ended" => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "ended";
  };