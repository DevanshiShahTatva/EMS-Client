import { IApplyFiltersKey } from "@/utils/types";

export interface IEventDetailPageProps {
    params: Promise<{ eventId: string }>;
}

export interface LabelValue {
    label: string;
    value: string;
    rowKey : keyof IApplyFiltersKey
}


import { IEventCategory, ITicketType } from "../admin/dropdowns/types";
export type EventStatus = 'ongoing' | 'ended' | 'upcoming';
export type EventCategory = 'Music' | 'all' | 'Film & Media' | 'Food & Drink' | 'Sports' | 'Art & Culture' | 'Business' | 'Wellness' | 'Education' | 'Gaming';
export type SortOption = 'none' | 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc';
export interface EventData {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    priceRange: string;
    category: IEventCategory;
    isSoldOut: boolean;
    isLiked: boolean;
    status: EventStatus;
    isFeatured: boolean;
    startTime?: string;
    endTime?: string;
    ticketsAvailable?: number;
    totalTickets?: number,
    ticketsArray?: EventTicket[],
    location?: string;
    lat? : number,
    lng?: number
}
  
export type EventLocation = {
  address: string;
  lat: number;
  lng: number;
};

export type EventTicket = {
  _id: string;
  type: ITicketType;
  price: number;
  totalSeats: number,
  totalBookedSeats: number,
  description: string;
};

export type CheckoutTicket = {
  totalPrice:number;
  quantity:number;
  type:string;
  ticketId:string;
  usedPoints: number;
}

export type EventImage = {
  _id: string;
  imageId: string;
  url: string;
};

export type EventDataObjResponse = {
  _id: string;
  title: string;
  description: string;
  category: IEventCategory;
  duration: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  location: EventLocation;
  tickets: EventTicket[];
  images: EventImage[]; // optional, since second object has no images
  createdAt: string;
  updatedAt: string;
  __v?: number;
  numberOfPoint: number;
  isLiked:boolean;
  likesCount:number;
};

export type EventResponse = EventDataObjResponse[];

export interface Ticket {
  type: ITicketType
  price: number
  totalSeats: number
  totalBookedSeats: number
  description: string
  _id: string
}

export interface Location {
  address: string
  lat: number
  lng: number
}

export interface EventDetails {
  _id: string
  title: string
  description: string 
  location: Location
  startDateTime: string
  endDateTime: string
  duration: string
  category: IEventCategory
  tickets: Ticket[]
  images: EventImage[]
  createdAt: string
  updatedAt: string
  __v: number
  likes: string[]
  isLiked: boolean
  likesCount: number
  userPoints: number;
  conversionRate: number;
}


export interface EventData {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  priceRange: string;
  category: IEventCategory;
  isSoldOut: boolean;
  isLiked: boolean;
  status: EventStatus;
  isFeatured: boolean;
}
export interface EventsDataTypes {
  id: string
  img: string;
  title: string;
  category: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  price: string | number;
  ticketsAvailable: number;
}


export interface Location {
  address: string
  lat: number
  lng: number
}
