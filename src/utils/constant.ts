export const ROUTES = {
    LOGIN: "/login",
    SIGN_UP: "/sign-up",
    HOME: "/",
    USER_EVENTS: "/events",
    USER_PROFILE: "/user/profile",
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        EVENTS: "/admin/event",
        CREATE_EVENT: "/admin/event/create",
    }
}

export const API_ROUTES = {
    ADMIN: {
        CREATE_EVENT: `/events`,
        GET_EVENTS: `/events`,
        DELETE_EVENT: (id: string) => `/events/${id}`,
        SHOW_EVENT: (id: string) => `/events/${id}`,
        UPDATE_EVENT: (id: string) => `/events/${id}`
    },
    AUTH: {
        LOGIN: `/login`,
        SIGNUP: `/signup`,
    }
}

export const ADMIN_SIDEBAR_ITEMS = [
    { id: 1, title: "Dashboard", route: ROUTES.ADMIN.DASHBOARD, icon: "/assets/DashboardIcon.svg" },
    { id: 2, title: "Events", route: ROUTES.ADMIN.EVENTS, icon: "/assets/EventsIcon.svg" },
]

export const CATOGORIES_ITEMS = [
    { id: 1, label: "Music", value: "Music", icon: "🎵" },
    { id: 2, label: "Art & Culture", value: "Art & Culture", icon: "🎨" },
    { id: 3, label: "Film & Media", value: "Film & Media", icon: "🎬" },
    { id: 4, label: "Education", value: "Education", icon: "🎓" },
    { id: 5, label: "Sports", value: "Sports", icon: "🏅" },
    { id: 6, label: "Food & Drink", value: "Food & Drink", icon: "🍔" },
    { id: 7, label: "Wellness", value: "Wellness", icon: "🧘" },
    { id: 8, label: "Gaming", value: "Gaming", icon: "🎮" },
    { id: 9, label: "Business", value: "Business", icon: "💼" },
]

export enum ROLE {
    Admin = "admin",
    User = "user",
}

export const INITIAL_TICKETS_TYPES = [
    { id: "1", type: "Premium", price: "300", maxQty: 100, description: "All access, Goodies" },
    { id: "2", type: "Standard", price: "150", maxQty: 50, description: "Front row, extra access" },
    { id: "3", type: "Free", price: "0", maxQty: 50, description: "General admission" },
]

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string;

export const AUTOCOMPLETE_API = (debouncedQuery: string) => `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
    debouncedQuery
)}&format=json&limit=5`


export const ALLOWED_FILE_FORMATS = ["jpg", "jpeg", "png", "webp"];
export const MAX_FILE_SIZE_MB = 2;

export const PAGINATION_OPTIONS = [
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
];

import {
    MusicIcon,
    PartyPopperIcon,
    UsersIcon,
    FilmIcon,
    LayoutGridIcon,
} from 'lucide-react';
import { Category, EventData } from './types'

export const EVENT_DATA: EventData[] = [
    {
        id: "1",
        title: "Summer Music Festival 2023",
        description: "Join us for three days of amazing performances from top artists across multiple genres. Food, drinks, and unforgettable experiences await!",
        image: "/concert.avif",
        date: "2023-07-15",
        time: "12:00 PM - 11:00 PM",
        priceRange: "$75 - $250",
        category: "music",
        isSoldOut: false,
        isLiked: true,
        status: "upcoming",
        isFeatured: true
    },
    {
        id: "2",
        title: "Tech Conference 2023",
        description: "The biggest tech conference of the year featuring keynotes from industry leaders, workshops, and networking opportunities.",
        image: "/tech_conference.avif",
        date: "2023-06-10",
        time: "9:00 AM - 6:00 PM",
        priceRange: "$150 - $500",
        category: "conference",
        isSoldOut: false,
        isLiked: false,
        status: "upcoming"
    },
    {
        id: "3",
        title: "Film Festival Weekend",
        description: "Celebrate independent cinema with screenings, director Q&As, and workshops for aspiring filmmakers.",
        image: "/movie.avif",
        date: "2023-05-20",
        time: "10:00 AM - 10:00 PM",
        priceRange: "$25 - $100",
        category: "movies",
        isSoldOut: false,
        isLiked: true,
        status: "ongoing"
    },
    {
        id: "4",
        title: "New Year's Eve Gala",
        description: "Ring in the new year with an elegant gala featuring live music, gourmet dining, and a midnight champagne toast.",
        image: "/new_year_gala.avif",
        date: "2022-12-31",
        time: "8:00 PM - 1:00 AM",
        priceRange: "$200 - $350",
        category: "party",
        isSoldOut: true,
        isLiked: false,
        status: "ended"
    },
    {
        id: "5",
        title: "Contemporary Dance Showcase",
        description: "Experience innovative choreography from emerging and established dance companies pushing the boundaries of movement.",
        image: "/ballet.avif",
        date: "2023-06-18",
        time: "7:00 PM - 9:30 PM",
        priceRange: "$35 - $75",
        category: "dance",
        isSoldOut: false,
        isLiked: true,
        status: "upcoming"
    },
    {
        id: "6",
        title: "Food & Wine Festival",
        description: "Taste exceptional cuisine from top chefs paired with select wines from around the world. A culinary journey not to be missed!",
        image: "/food_wine.avif",
        date: "2023-07-08",
        time: "11:00 AM - 8:00 PM",
        priceRange: "$85 - $150",
        category: "party",
        isSoldOut: false,
        isLiked: false,
        status: "upcoming"
    },
    {
        id: "7",
        title: "Classic Movie Marathon",
        description: "24 hours of beloved classic films on the big screen. From silent era masterpieces to the golden age of Hollywood.",
        image: "/cinema.avif",
        date: "2023-05-27",
        time: "12:00 PM - 12:00 PM (next day)",
        priceRange: "$20 - $50",
        category: "movies",
        isSoldOut: false,
        isLiked: true,
        status: "ongoing"
    },
    {
        id: "8",
        title: "Startup Pitch Competition",
        description: "Watch innovative startups pitch their ideas to a panel of industry experts and investors. Networking reception to follow.",
        image: "/tech_conference.avif",
        date: "2023-06-15",
        time: "1:00 PM - 6:00 PM",
        priceRange: "$0 - $25",
        category: "conference",
        isSoldOut: false,
        isLiked: false,
        status: "upcoming"
    },
    {
        id: "9",
        title: "Jazz in the Park",
        description: "Bring a blanket and enjoy smooth jazz under the stars with performances from local and national jazz artists.",
        image: "/jazz.avif",
        date: "2023-06-24",
        time: "6:00 PM - 10:00 PM",
        priceRange: "Free",
        category: "music",
        isSoldOut: false,
        isLiked: true,
        status: "upcoming"
    },
    {
        id: "10",
        title: "Ballet: Swan Lake",
        description: "Experience Tchaikovsky's masterpiece performed by the National Ballet Company with full orchestra.",
        image: "/ballet.avif",
        date: "2023-04-15",
        time: "7:30 PM - 10:00 PM",
        priceRange: "$45 - $120",
        category: "dance",
        isSoldOut: true,
        isLiked: false,
        status: "ended"
    },
    {
        id: "11",
        title: "Blockchain & Crypto Summit",
        description: "Join industry leaders for discussions on the future of blockchain technology, cryptocurrency, and decentralized finance.",
        image: "/bit_coin.avif",
        date: "2023-07-22",
        time: "9:00 AM - 5:00 PM",
        priceRange: "$125 - $300",
        category: "conference",
        isSoldOut: false,
        isLiked: true,
        status: "upcoming"
    },
    {
        id: "12",
        title: "Halloween Costume Party",
        description: "The city's biggest Halloween bash with contests, themed cocktails, and dancing until dawn. Costumes required!",
        image: "/halloween.avif",
        date: "2022-10-31",
        time: "9:00 PM - 3:00 AM",
        priceRange: "$30 - $50",
        category: "party",
        isSoldOut: true,
        isLiked: false,
        status: "ended"
    }
]
export const CATEGORIES: Category[] = [
    {
        id: 'all',
        name: 'All Events',
        icon: LayoutGridIcon,
    },
    {
        id: 'music',
        name: 'Music',
        icon: MusicIcon,
    },
    {
        id: 'party',
        name: 'Party',
        icon: PartyPopperIcon,
    },
    {
        id: 'conference',
        name: 'Conference',
        icon: UsersIcon,
    },
    {
        id: 'movie',
        name: 'Movie',
        icon: FilmIcon,
    },
]