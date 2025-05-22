export const ROUTES = {
    LOGIN: "/login",
    SIGN_UP: "/sign-up",
    HOME: "/",
    FAQs: "/faq",
    CONTACT_US: "/contact-us",
    TERMS_AND_CONDITIONS: "/terms-and-conditions",
    USER_EVENTS: "/events",
    USER_EVENTS_DETAILS: "/events/*",
    USER_PROFILE: "/user/profile",
    USER_MY_EVENTS  :"/user/my-events",
    USER_MY_CALENDER: "/user/my-calender",
    USER_REWARDED_HISTORY: "/user/reward-history",
    USER_REVIEW_HISTORY: "/user/my-reviews",
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        EVENTS: "/admin/event",
        CREATE_EVENT: "/admin/event/create",
        CONTACT_US : "/admin/contact-us",
        FAQs : "/admin/faqs",
        CREATE_FAQs : "/admin/faqs/create",
        TERMS_AND_CONDITIONS : "/admin/terms-and-conditions",
        ADMIN_CONFIGURATION: "/admin/admin-configuration",
        DROPDOWNS : "/admin/dropdowns",
    },
    ORGANIZER: {
        VERIFY_TICKETS : "/organizer/verify-tickets",
        DASHBOARD : "/organizer/dashboard"
    },
    RESET_PASSWORD: "/reset-password"
}

export const API_ROUTES = {
    ADMIN: {
        CREATE_EVENT: `/events`,
        GET_EVENTS: `/events`,
        DELETE_EVENT: (id: string) => `/events/${id}`,
        SHOW_EVENT: (id: string) => `/events/${id}`,
        UPDATE_EVENT: (id: string) => `/events/${id}`,
        AI_GENERATE_DESCRIPTION: "events/generate/event-description",
        AI_GENERATE_FAQ_ANSWER: "faq/generate/faq-answer",
        AI_GENERATE_CONTACT_QUERY_ANSWER: "contact-us/query-ans-generate",
        // DASHBOARD
        DASHBOARD_OVERVIEW: 'dashboard/analytics/dashboard-overview',
        TOP_LIKED_EVENTS: 'dashboard/analytics/top-liked-events',
        BOOKING_BY_TICKET_TYPE: 'dashboard/analytics/bookings-by-ticket-type',
        REVENUE_OVER_TIME: 'dashboard/analytics/total-revenue',
        REVENUE_BY_CATEGORY: 'dashboard/analytics/average-booking-value',
        TOP_USERS_HIGHEST_BOOKING: 'dashboard/analytics/repeat-customers',
        BOOKING_BY_MONTH_DATE: 'dashboard/analytics/bookings-time-trends',
        TOP_REVENUE_BY_EVENTS: 'dashboard/analytics/top-revenue-events',
        USER_BADGE_INFO: 'dashboard/analytics/user-badge-info',
        POINT_SETTING: 'point-setting',
        CANCEL_CHARGE: "/admin/setting/cancel-charge",
        GET_ALL_USERS: 'all_users',
        // TICKET TYPE
        TICKET_TYPE: "ticket-types",
        CANCELLED_EVENT_RATIO: "dashboard/analytics/cancellation-ratio",
        ATTENDED_EVENTS_ANALYTICS : "/dashboard/analytics/top-attended-events",
        GENERATE_TERMS_CONDITIONS: "/terms-and-conditions/generate-ai"
    },
    AUTH: {
        LOGIN: `/login`,
        SIGNUP: `/signup`,
        FORGOT_PASSWORD: `/forgot_password`,
        RESET_PASSWORD:`/reset_password`
    },
    EVENT:{
      PAYMENT:`/ticket/book`,
      MY_EVENTS: "/ticket/book",
      CANCEL_EVENT: "/ticket/book/cancel/"
    },
    USER: {
        PROFILE : {
            UPDATE_USER_INFO : "/update/user",
            RESET_EMAIL : "/reset_setting_email",
            VERIFY_EMAIL : "/verify_setting_email",
            RESET_PASSWORD: "/reset_setting_password"
        },
        USER_DETAILS : "/user_details",
        REWARD_HISTORY: "/point-setting/reward-history"
    },
    STAFF : {
        VALIDATE_TICKETS : "/ticket/book/validate",
    },
    CONNNTACT_US : "/contact-us",
    UPDATE_CONTACT_US_STATUS : (id: string) => `/contact-us/${id}/status`,
    FAQs : "/faq",
    TERMS_AND_CONDITIONS : "/terms-and-conditions",
    FEEDBACK:(id:string)=>`/events/${id}/feedback`,
    GET_FEEDBACK:(id:string)=>`/events/${id}/feedbacks`,
    USER_FEEDBACK:"/feedbacks",
    PUT_FEEDBACK:(id:string|null)=>`/feedbacks/${id}`,
    CATEGORY: "/ticket-categories",
}
export const LIGHT_COLORS = [
    '#FFB3BA', // Light Red
    '#D5F4E6', // Mint
    '#FFFACD', // Lemon Chiffon
    '#FADADD', // Light Pink
    '#C1F0F6', // Pale Cyan
    '#FFDFBA', // Light Orange
    '#FFFFBA', // Light Yellow
    '#BAFFC9', // Light Green
    '#BAE1FF', // Light Blue
    '#E0BBE4', // Light Purple
];

export const DARK_COLORS = [
    '#4B0082', // Indigo
    '#2F4F4F', // Dark Slate Gray
    '#800000', // Maroon
    '#003366', // Dark Blue
    '#5C4033', // Dark Brown
    '#1C1C1C', // Almost Black
    '#4B5320', // Army Green
    '#2C2C54', // Dark Purple
    '#3B3B98', // Space Blue
    '#0B3D91', // Navy Blue
];
export const BALANCED_COLORS = [
    '#90B4ED', // Sky Blue
    '#FF8C94', // Soft Coral
    '#FDCB82', // Warm Peach
    '#A3DE83', // Fresh Green
    '#F48FB1', // Rosy Pink
    '#85D2D0', // Cool Aqua
    '#FFD972', // Soft Amber
    '#B39CD0', // Soft Purple
    '#FFAB91', // Melon
    '#D1C4E9', // Lavender Gray
];

export const ADMIN_SIDEBAR_ITEMS = [
    { id: 1, title: "Dashboard", route: ROUTES.ADMIN.DASHBOARD, icon: "/assets/DashboardIcon.svg" },
    { id: 2, title: "Events", route: ROUTES.ADMIN.EVENTS, icon: "/assets/EventsIcon.svg" },
    { id: 3, title: "Support Requests", route: ROUTES.ADMIN.CONTACT_US, icon:  "/assets/support.svg"},
    { id: 4, title: "FAQs", route: ROUTES.ADMIN.FAQs, icon:  "/assets/faqs.svg"},
    { id: 5, title: "Terms & Conditions", route: ROUTES.ADMIN.TERMS_AND_CONDITIONS, icon:  "/assets/terms.svg"},
    { id: 7, title: "Admin Config", route: ROUTES.ADMIN.ADMIN_CONFIGURATION, icon:  "/assets/terms.svg"},
    { id: 8, title: "Dropdowns", route: ROUTES.ADMIN.DROPDOWNS, icon:  "/assets/dropdownsIcon.svg"},
]

export const USER_SIDEBAR_ITEMS = [
    { id: 1, title: "Home", route: ROUTES.HOME, icon: "/assets/DashboardIcon.svg" },
    { id: 2, title: "Events", route: ROUTES.USER_EVENTS, icon: "/assets/EventsIcon.svg" },
    { id: 3, title: "Contact Us", route: ROUTES.CONTACT_US, icon:  "/assets/support.svg"},
    { id: 4, title: "FAQs", route: ROUTES.FAQs, icon:  "/assets/faqs.svg"},
]

export const ORGANIZER_SIDEBAR_ITEMS = [
    { id: 1, title: "Dashboard", route: ROUTES.ORGANIZER.DASHBOARD, icon: "/assets/DashboardIcon.svg" },
    { id: 2, title: "Scan Tickets", route: ROUTES.ORGANIZER.VERIFY_TICKETS, icon:  "/assets/scannerIcon.svg"},
]

export const USER_HEADER_ITEMS = [
    { id: 1, title: "Home", route: ROUTES.HOME },
    { id: 2, title: "Events", route: ROUTES.USER_EVENTS},
    { id: 3, title: "Contact Us", route: ROUTES.CONTACT_US },
    { id: 4, title: "FAQs", route: ROUTES.FAQs},
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

export const SIGN_UP_IMAGE_BANNER_LINK = "https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?semt=ais_hybrid&w=740"
export const LOG_IN_IMAGE_BANNER_LINK = "https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-2242.jpg?semt=ais_hybrid&w=740"
export const CONTACT_US_IMAGE_BANNER_LINK = "https://d2r3fkmprkayl1.cloudfront.net/Eventtitans-new-img/EventTitans-inner/inner-page-img15.png"
export const FAQ_BANNER_LINK = "/assets/faqBanner.png"
export const TC_BANNER_LINK = "/assets/tc-banner.jpg"

export const USER_ROLES = [ 
    { label: "User", value: "user" }, 
    { label: "Organizer", value: "organizer"}
]


export const BREAD_CRUMBS_ITEMS = {
    EVENT: {
        LIST_PAGE: [{ label: "Events", navigateTo: "" }],
        CREATE_PAGE: [
            { label: "Events", navigateTo: ROUTES.ADMIN.EVENTS },
            { label: "Create", navigateTo: "" }
        ],
        UPDATE_PAGE: [
            { label: "Events", navigateTo: ROUTES.ADMIN.EVENTS },
            { label: "Update", navigateTo: "" }
        ]
    },
    FAQs: {
        LIST_PAGE: [{ label: "FAQs", navigateTo: "" }],
        CREATE_PAGE: [
            { label: "FAQs", navigateTo: ROUTES.ADMIN.FAQs },
            { label: "Create", navigateTo: "" }
        ]
    },
    CONTACT_US: {
        MAIN_PAGE: [{ label: "Support Requests", navigateTo: "" }],
    },
    TERMS_AND_CONDITIONS: {
        MAIN_PAGE: [{ label: "Terms & Conditions", navigateTo: "" }],
    },
    ADMIN_CONFIGURATION: {
        MAIN_PAGE: [{ label: "Admin Configuration", navigateTo: "" }],
    },
    DROPDOWN: {
        MAIN_PAGE: [{ label: "Dropdowns", navigateTo: "" }],
    },
    ORGANIZER : {
        SCAN_TICKET_ITEMS : [{ label: "Scan QR", navigateTo: "" }]
    }
}

export enum ROLE {
    Admin = "admin",
    User = "user",
    Organizer = "organizer"
}

export const INITIAL_TICKETS_TYPES = [
    { id: "1", type: "Premium", price: "300", maxQty: 100, description: "All access, Goodies", _id: "" },
    { id: "2", type: "Standard", price: "150", maxQty: 50, description: "Front row, extra access", _id: "" },
    { id: "3", type: "Free", price: "0", maxQty: 50, description: "General admission", _id: "" },
]

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string;

export const AUTOCOMPLETE_API = (debouncedQuery: string) => `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
    debouncedQuery
)}&format=json`


export const ALLOWED_FILE_FORMATS = ["jpg", "jpeg", "png", "webp"];
export const MAX_FILE_SIZE_MB = 2;

export const PAGINATION_OPTIONS = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
];

export const LOCATION_OPTIONS = [
  { value: "5", label: '0 km - 5 km' },
  { value: "10", label: '5 km - 10 km' },
  { value: "25", label: 'upto 25 km' },
  { value: "50", label: 'upto 50 km' },
];

export const durationOptions = [
    { label: "Short - Less than 1 hour", value: "short" },
    { label: "Medium - 1 to 4 hours", value: "medium" },
    { label: "Long - 4 to 12 hours", value: "long" },
    { label: "Full Day - 12 to 24 hours", value: "fullDay" },
    { label: "Multi-Day - More than 1 day", value: "multiDay" },
]

export const CATOGORIES_ITEMS_ARRAY = [
    { id: 1, label: "Music", value: "Music" },
    { id: 2, label: "Art & Culture", value: "Art & Culture" },
    { id: 3, label: "Film & Media", value: "Film & Media" },
    { id: 4, label: "Education", value: "Education" },
    { id: 5, label: "Sports", value: "Sports" },
    { id: 6, label: "Food & Drink", value: "Food & Drink" },
    { id: 7, label: "Wellness", value: "Wellness" },
    { id: 8, label: "Gaming", value: "Gaming" },
    { id: 9, label: "Business", value: "Business" },
]

export const STATUS_OPTIONS = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Ended", value: "ended" }
]

export const TICKETS_OPTIONS = [
    { label: "Available", value: "available", colorKey: "green" },
    { label: "Filling Fast", value: "fastFilling", colorKey: "yellow" },
    { label: "Almost Full", value: "almostFull", colorKey: "red" },
    { label: "Sold Out", value: "soldOut", colorKey: "gray" }
]

export const PROFILE_TAB_OPTIONS = [
    { id: 1, value: "personal", label: "Personal Information" },
    { id: 2, value: "email", label: "Update Email Address" },
    { id: 3, value: "password", label: "Change Password" },
]


import {
    MusicIcon,
    PartyPopperIcon,
    UsersIcon,
    FilmIcon,
    LayoutGridIcon,
    Gamepad2,
    GraduationCap,
    BriefcaseMedical,
    Medal,
    Utensils,
} from 'lucide-react';
import { Category } from './types'

export const CATEGORIES: Category[] = [
    {
        id: 'all',
        name: 'All Events',
        icon: LayoutGridIcon,
    },
    {
        id: 'Music',
        name: 'Music',
        icon: MusicIcon,
    },
    {
        id: 'Art & Culture',
        name: 'Art & Culture',
        icon: PartyPopperIcon,
    },
    {
        id: 'Business',
        name: 'Business',
        icon: UsersIcon,
    },
    {
        id: 'Film & Media',
        name: 'Film & Media',
        icon: FilmIcon,
    },
    {
        id: 'Gaming',
        name: 'Gaming',
        icon: Gamepad2,
    },
    {
        id: 'Education',
        name: 'Education',
        icon: GraduationCap,
    },
    {
        id: 'Wellness',
        name: 'Wellness',
        icon: BriefcaseMedical,
    },
    {
        id: 'Food & Drink',
        name: 'Food & Drink',
        icon: Utensils,
    },
    {
        id: 'Sports',
        name: 'Sports',
        icon: Medal,
    },
]

export const MAX_CHARGE_VALUE = 18;