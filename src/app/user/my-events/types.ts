export interface IBooking {
    bookingStatus: string;
    cancelledAt: Date;
    isAttended: boolean;
    _id: string;
    user: IUser;
    event: IEvent;
    ticket: string;
    seats: number;
    totalAmount: number;
    paymentId: string;
    bookingDate: string;
    __v: number;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    address: string | null;
    profileimage: string | null;
}

export interface IEvent {
    _id: string;
    title: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    duration: string;
    category: string;
    tickets: ITicket[];
    images: IEventImage[];
    likes: number;
    isLiked: boolean;
    likesCount: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    location: IEventLocation;
}

export interface IEventLocation {
    address: string;
    lat: number;
    lng: number;
}

export interface ITicket {
    _id: string;
    type: string;
    price: number;
    totalSeats: number;
    totalBookedSeats: number;
    description: string;
}

export interface IEventImage {
    _id: string;
    imageId: string;
    url: string;
}


export interface IEventBookingResponse {
    status: number;
    data: IBooking[];
    success: boolean;
    message: string;
}

export interface IEventsState {
    id : string,
    eventBookedOn : string,
    eventName : string,
    eventCatogory : string,
    eventStartTime : string,
    eventEndTime : string,
    eventDuration : string
    eventLocation : string,
    eventTicketCount : number,
    eventTicketType : string,
    eventTicketPrice: number,
    eventStatus : string,
    eventImage : string,
    eventFullResponse : IBooking,
    bookingStatus: string,
    cancelledAt: Date,
    isAttended: boolean;
}