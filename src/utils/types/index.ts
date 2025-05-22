import { IEventCategory, ITicketType } from "@/app/admin/dropdowns/types";
import { LucideIcon } from "lucide-react";
export interface IDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    description?: string;
    loading?: boolean;
    confirmLoading?: boolean
}

export interface ICannotDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    eventList?: { _id: string, title: string, endDateTime: string }[];
}

export interface IFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    applyFilters: (filterValues : IApplyFiltersKey) => void;
    maxTicketPrice?: number
    isUserRole? : boolean
    filterValues? : IApplyFiltersKey
    categoriesOptions?: { id: string, label: string, value: string }[]
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
  role: string
  isOpen?: boolean;
  isCollase?: boolean; 
  onClose?: () => void,
  activeLink? : string
}

export type ITicketQRData = {
  id: string;
  eventName: string;
  eventTicketCount: number;
  eventTicketPrice: number;
};

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
    category: IEventCategory;
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

export type Column<T> = {
    header: string | React.ReactNode;
    key: keyof T;
    render?: (row: T) => React.ReactNode;
    sortKey?: (row: T) => string | number;
    isSortable? : boolean
};

export type Action<T> = {
    icon: React.ReactNode;
    onClick: (row: T) => void;
    tooltip?: string;
    disabled?: (row: T) => boolean;
};

export type DtataTable<T> = {
    data: T[];
    columns: Column<T>[];
    actions?: Action<T>[];
    loading?: boolean
    showSerialNumber? : boolean
};


export interface EventsDataTypes {
    id: string
    img: string;
    title: string;
    category: IEventCategory;
    startTime: string;
    endTime: string;
    duration: string;
    location: string;
    price: string | number;
    ticketsAvailable: number;
    totalTickets : number,
    ticketsArray : EventTicket[],
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

export type EventImage = {
    _id: string;
    imageId: string;
    url: string;
};

export type EventDataObjResponse = {
    _id: string;
    title: string;
    description: string;
    category:  IEventCategory;
    duration: string;
    startDateTime: string; // ISO string
    endDateTime: string;   // ISO string
    location: EventLocation;
    tickets: EventTicket[];
    images: EventImage[]; // optional, since second object has no images
    createdAt: string;
    updatedAt: string;
    isLiked:boolean;
    numberOfPoint: number;
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