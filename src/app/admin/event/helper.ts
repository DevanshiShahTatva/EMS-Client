import { EventTicket } from "@/utils/types";
import { IEventFormData } from "./types";
import moment from "moment";

export const getTicketPriceRange = (data: EventTicket[]) => {
    const prices = data.map((ticket) => ticket.price);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const priceRange =
        minPrice === 0
            ? `Free - ${maxPrice}`
            : minPrice === maxPrice
                ? `${minPrice}`
                : `${minPrice} - ${maxPrice}`;
    return priceRange
};

export const getStatus = (startDate: string, endDate: string, tickets: number) => {
    const now = moment();
    const start = moment(startDate);
    const end = moment(endDate);

    if (tickets === 0) return "Sold Out";
    if (now.isBefore(start)) return "Upcoming";
    if (now.isAfter(end)) return "Ended";
    return "Ongoing";
};

export const InitialEventFormDataValues: IEventFormData = {
    title: "",
    description: "",
    location: {
        address: "",
        lat: 0,
        long: 0,
    },
    start_time: null,
    end_time: null,
    duration: "",
    category: null,
    ticket_type: [
        {
            type: "",
            price: "",
            max_qty: "",
            description: "",
        },
    ],
    images: [],
}

export const InitialEventFormDataErrorTypes = {
    title: false,
    description: false,
    location: false,
    start_time: false,
    end_time: false,
    duration: false,
    category: false,
    ticket_type: false,
    images: false,
};