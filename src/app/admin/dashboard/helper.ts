import { RupeeSymbol } from "@/utils/helper"
import moment from "moment"

export const DASHBOARD_TITLE = {
    PIE_CHART: "Top Liked Events",
    PIE_CHART_TOOLTIP: "This shows the events with the most likes",
    BAR_CHART1: "Top Events by Revenue",
    BAR_CHART1_TOOLTIP: "Displays events ranked by total revenue generated, including ticket sales and merchandise",
    BAR_CHART2: "Revenue By Category",
    BAR_CHART2_TOOLTIP: "Comparison of earnings across different event genres",
    DOUGHNUT_CHART: "Bookings by Ticket Type",
    DOUGHNUT_CHART_TOOLTIP: "This shows the sales across different ticket tiers",
    CANCELLED_TICKET: "Top Events By Cancellation Rate",
    CANCELLED_TICKET_TOOLTIP: "Ranking of events with highest percentage of canceled tickets",
    TOP_ATTENDED_EVENTS: "Top Attended Events",
    TOP_ATTENDED_EVENTS_TOOLTIP: "Events with the highest number of attendees",
    USER_BADGE_PIE_CHART: "User badge details",
    USER_BADGE_PIE_CHART_TOOLTIP: "Visualizes distribution of earned badges (Gold, Silver, Bronze) among your user base",
    LINE_CHART: "Total Revenue Over Time",
    LINE_CHART_TOOLTIP: "Monthly/Yearly revenue trends including ticket sales",
    TABLE: "Top Users By Booking",
    TABLE_TOOLTIP: "Users with the highest number of completed bookings, including repeat purchases",
    HEATMAP: "Bookings by Month and Date",
    HEATMAP_TOOLTIP: "Booking volume patterns showing yearly peaks",
    MAP: "All Users on Map",
    MAP_TOOLTIP: "Users who booked tickets, mapped by their location",
    LIKE_MODAL_TITLE: "All Events by Likes",
    CANCELLLED_EVENT_BY_RATIO: "All Events By Cancellation Rate",
    REVENUE_MODAL_TITLE: "All Events by Revenue",
    ATTENDE_EVENTS_MODAL_TITLE: "All Attended Events",
    FEEDBACK_REVIEW_TITLE: "All Events Feedbacks",
    FEEDBACK_REVIEW_CHART_TOOLTIP: "Avg. Ratio of feedbacks provided for each events",
    EVENT_FEEDBACK_TITLE:"Individual Event Ratings",
    EVENT_FEEDBACK_TOOLTIP:"Individual Event Ratings provided",
    FEEDBACK_OVERVIEW_TITLE:"Feedbacks Given by users",
    FEEDBACK_OVERVIEW_TOOLTIP:"Feedbacks analysis whether they have been increased or descreased from last time",
    FEEDBACK_ALL_DETAILS:"Feedback details",
    FEEDBACK_ALL_DETAILS_TOOLTIP:"Analysis of the feedbacks given throughout each event and number of positive and negative feedbacks",
    FEEDBACK_ALL_REVIEW:"Avg. Feedback rating details by Events"
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