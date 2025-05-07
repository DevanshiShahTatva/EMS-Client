import { RupeeSymbol } from "@/utils/helper"
import moment from "moment"

export const DASHBOARD_TITLE = {
    PIE_CHART: "Top 5 Liked Events",
    DOUGHNUT_CHART: "Bookings by Ticket Type",
    LINE_CHART: "Total Revenue Over Time",
    BAR_CHART1: "Top 5 Events by Revenue",
    BAR_CHART2: "Revenue By Category",
    TABLE: "Top 10 Users By Booking",
    HEATMAP: "Bookings by Month and Date",
    LIKE_MODAL_TITLE: "All Events by Likes",
    REVENUE_MODAL_TITLE: "All Events by Revenue"
}

export const LikeTableColumns = [
    { label: 'Event Title', key: 'title' },
    { label: 'Category', key: 'category' },
    { label: 'Likes', key: 'likesCount' },
]

export const RevenueTableColumns = [
    { label: 'Event Title', key: 'eventTitle' },
    { label: `Total Revenue (${RupeeSymbol})`, key: 'totalRevenue' },
]

export const getCurrentYear = moment().format('YYYY')