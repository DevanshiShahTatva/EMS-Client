import { LucideIcon } from "lucide-react";
export interface IDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    description?: string;
    loading?: boolean
}

export interface IFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    applyFilters: (filterValues : IApplyFiltersKey) => void;
    maxTicketPrice?: number
    isUserRole? : boolean
    filterValues? : IApplyFiltersKey
}

export interface IBreadcrumbItem {
    label: string;
    navigateTo : string
}
export interface IBreadcrumbsProps {
    breadcrumbsItems : IBreadcrumbItem[]
}
export interface IEventRangeDate {
    from : Date | string
    to : Date | string
}

export interface IEventPrice {
    max : number
    min : number
}

export interface IApplyFiltersKey {
    catogories?: string[]
    durations?: string[]
    status? : string
    ticketsTypes?: string
    eventsDates?: IEventRangeDate
    priceRange?: IEventPrice
    search? : string
    likeEvent? : string
    locationRadius? : string
}

export interface ISidebarPageProps {
  children : React.ReactNode, 
  isOpen?: boolean; 
  onClose?: () => void,
  activeLink? : string
}

export type EventStatus = 'ongoing' | 'ended' | 'upcoming';
export type EventCategory = 'movies' | 'conference' | 'party' | 'music' | 'dance' | 'all';
export type SortOption = 'none' | 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc';

export interface EventData {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    time: string;
    priceRange: string;
    category: EventCategory;
    isSoldOut: boolean;
    isLiked: boolean;
    status: EventStatus;
    isFeatured?: boolean;
}
export interface Category {
    id: string;
    name: string;
    icon: LucideIcon;
}

export type ApiParams = {
    endPoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: string | FormData;
    headers?: HeadersInit;
};


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
    totalTickets : number,
    ticketsArray : EventTicket[]
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
    isLiked:boolean;
    likesCount:number;
    __v?: number;
};

export type EventResponse = EventDataObjResponse[];

// API
export type TRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IRequestParams {
    endPoint: string;
    method: TRequestMethod;
    headers?: Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    withToken?: boolean; // optional flag
    isFormData?: boolean;
}