export interface EventsDataTypes {
    id: string
    img: string;
    title: string;
    category: string;
    startTime: string;
    duration: string;
    location: string;
    price: string | number;
    ticketsAvailable: number;
}


export type EventLocation = {
    address: string;
    lat: number;
    lng: number;
  };
  
  export type EventTicket = {
    _id: string;
    type: string;
    price: number;
    totalSeats: number,
    totalBookedSeats: number,
    description: string;
  };
  
  export type EventImage = {
    _id: string;
    imageId: string;
    url: string;
  };
  
  export type EventDataObjResponse = {
    _id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    startDateTime: string; // ISO string
    endDateTime: string;   // ISO string
    location: EventLocation;
    tickets: EventTicket[];
    images: EventImage[]; // optional, since second object has no images
    createdAt: string;
    updatedAt: string;
    __v?: number;
  };
  
  export type EventResponse = EventDataObjResponse[];

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
  