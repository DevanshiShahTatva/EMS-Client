import { EventTicket } from "@/utils/interfaces";

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
  