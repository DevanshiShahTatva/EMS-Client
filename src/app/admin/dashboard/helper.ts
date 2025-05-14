import { RupeeSymbol } from "@/utils/helper"
import moment from "moment"

export const DASHBOARD_TITLE = {
    PIE_CHART: "Top 5 Liked Events",
    CANCELLED_TICKET: "Top 5 Events By Cancellation Rate",
    DOUGHNUT_CHART: "Bookings by Ticket Type",
    LINE_CHART: "Total Revenue Over Time",
    BAR_CHART1: "Top 5 Events by Revenue",
    BAR_CHART2: "Revenue By Category",
    TABLE: "Top 10 Users By Booking",
    HEATMAP: "Bookings by Month and Date",
    LIKE_MODAL_TITLE: "All Events by Likes",
    CANCELLLED_EVENT_BY_RATIO: "All Events By Cancellation Rate",
    REVENUE_MODAL_TITLE: "All Events by Revenue",
    MAP: "All Users on Map",
    TOP_ATTENDED_EVENTS : "Top Attended Events",
    ATTENDE_EVENTS_MODAL_TITLE : "All Attended Events"
}

export const LikeTableColumns = [
    { label: 'Event Title', key: 'title' },
    { label: 'Category', key: 'category' },
    { label: 'Likes', key: 'likesCount' },
]

export const CancelledEventTicketTableColumns = [
    { label: 'Event Title', key: 'title' },
    { label: 'Total Booking', key: 'totalBookedUsers' },
    { label: 'Total Cancelled', key: 'cancelledUsers' },
]

export const RevenueTableColumns = [
    { label: 'Event Title', key: 'eventTitle' },
    { label: `Total Revenue (${RupeeSymbol})`, key: 'totalRevenue' },
]

export const AttendedEventsTableColumns = [
    { label: 'Event Title', key: 'eventTitle' },
    { label: 'Attendees', key: 'totalAttendees' },
    { label: 'Booking', key: 'totalBookedSeats' },
    { label: 'Percentage', key: 'attendanceRatio' },
]

export const getCurrentYear = moment().format('YYYY')