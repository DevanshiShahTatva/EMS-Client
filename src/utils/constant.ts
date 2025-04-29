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
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        EVENTS: "/admin/event",
        CREATE_EVENT: "/admin/event/create",
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
        // DASHBOARD
        DASHBOARD_OVERVIEW: 'dashboard/analytics/dashboard-overview',
        TOP_LIKED_EVENTS: 'dashboard/analytics/top-liked-events',
        BOOKING_BY_TICKET_TYPE: 'dashboard/analytics/bookings-by-ticket-type',
        REVENUE_OVER_TIME: 'dashboard/analytics/total-revenue',
        REVENUE_BY_CATEGORY: 'dashboard/analytics/average-booking-value',
        TOP_USERS_HIGHEST_BOOKING: 'dashboard/analytics/repeat-customers',
        BOOKING_BY_MONTH_DATE: 'dashboard/analytics/bookings-time-trends',
        TOP_REVENUE_BY_EVENTS: 'dashboard/analytics/top-revenue-events',
    },
    AUTH: {
        LOGIN: `/login`,
        SIGNUP: `/signup`,
        FORGOT_PASSWORD: `/forgot_password`,
        RESET_PASSWORD:`/reset_password`
    },
    EVENT:{
      PAYMENT:`/ticket/book`,
      MY_EVENTS: "/ticket/book"
    }
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
]

export const USER_HEADER_ITEMS = [
    { id: 1, title: "Home", route: ROUTES.HOME },
    { id: 2, title: "Browse Events", route: ROUTES.USER_EVENTS},
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

export const FEATURES_DATA = [
    {
        title: "Discover Events",
        description: "Evently connects you with amazing events happening around you! Whether it's a concert, a festival, or a creative workshop, you can easily explore what's going on in your city. Stay up to date with the latest happenings and never miss out on fun events nearby.",
        imageUrl: "/assets/banner-image-1.png",
    },
    {
        title: "Easy & Secure Booking",
        description: "Booking your tickets has never been easier or more secure. With just a few clicks, you can reserve your spot at any event. Our secure payment system ensures your details are kept safe while you enjoy a smooth booking process. Say goodbye to paper tickets — everything is stored digitally.",
        imageUrl: "/assets/banner-image-2.jpg",
    },
    {
        title: "Instant E-Tickets",
        description: "Evently provides instant electronic tickets right on your phone! No need to worry about printing or losing physical tickets. Once you've booked, your e-ticket is ready to use immediately. Simply show your phone at the venue for quick access to the event. Fast, easy, and efficient — everything you need in one place.",
        imageUrl: "/assets/tickets.png",
    },
]

export const FAQs_DATA = [
  {
    question: 'How do I book a ticket for an event?',
    answer: `To book a ticket, simply browse our Events page where you'll find a variety of events listed by category and date. Click on the event you're interested in, review the details, and press the "Book Ticket" button. You'll be guided through a secure checkout process. Once completed, your e-ticket will be available instantly in your profile and sent to your email.`,
  },
  {
    question: 'Can I cancel or reschedule my ticket?',
    answer: `Cancellation and rescheduling policies vary depending on the event organizer. Some events offer full refunds up to a certain date, while others might not allow cancellations at all. You can find these details on the event description page. For rescheduling, please contact the event organizer directly through the support link provided in your booking summary.`,
  },
  {
    question: 'Will I receive a confirmation after booking?',
    answer: `Yes! Right after your successful booking, you will receive a confirmation email containing your ticket, event details, and a QR code. This QR code will be used for event entry. Additionally, you can always find your active and past bookings under the "My Tickets" section inside your dashboard.`,
  },
  {
    question: 'How do I find events happening near me?',
    answer: `We offer powerful search and filtering tools. Simply allow location access or manually set your preferred city to discover concerts, festivals, workshops, and more happening nearby. You can also explore events by category, popularity, or date.`,
  },
  {
    question: 'Is online payment secure?',
    answer: `Absolutely. We partner with trusted payment providers like Stripe and Razorpay. All transactions are protected using advanced SSL encryption. Your payment information is never stored on our servers, ensuring maximum privacy and security.`,
  },
  {
    question: 'Can I attend events without creating an account?',
    answer: `No, creating an account is mandatory to book and attend events. This allows us to manage your bookings securely, send you event updates, and provide a personalized experience. It also ensures that you can easily access, manage, or transfer your tickets if needed.`,
  },
];

export const TERMS_DATA = [
    {
        title: 'Introduction',
        content: 'These Terms & Conditions ("Terms") govern your use of our event management services ("Services"). By using our Services, you agree to these Terms. If you do not agree with any part of these Terms, you must not use our Services.',
    },
    {
        title: 'User Responsibilities',
        content: 'As a user of our platform, you agree to provide accurate and complete information when creating or managing events. You are solely responsible for the events you create and for ensuring that all content complies with applicable laws.',
    },
    {
        title: 'Privacy Policy',
        content: 'We value your privacy. For detailed information on how we collect, use, and protect your personal information, please refer to our Privacy Policy.',
    },
    {
        title: 'Payment and Fees',
        content: 'If applicable, users may be required to pay a fee for event creation or other premium services. Payment terms and procedures are outlined in our Payment Policy.',
    },
    {
        title: 'Termination of Account',
        content: 'We reserve the right to suspend or terminate your account if we suspect any violation of our terms, misuse of our Services, or non-payment of fees.',
    },
    {
        title: 'Limitation of Liability',
        content: 'We are not liable for any damages, losses, or claims arising from your use of the Services. You use the Services at your own risk, and we are not responsible for any third-party content or actions.',
    },
    {
        title: 'Governing Law',
        content: 'These Terms are governed by the laws of the jurisdiction in which our company is based. Any legal disputes related to the Terms & Conditions will be handled in the applicable courts in that jurisdiction.',
    },
    {
        title: 'Changes to the Terms',
        content: 'We may update or modify these Terms at any time. Any changes will be posted on this page, and the new Terms will take effect immediately upon posting.',
    }
];


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