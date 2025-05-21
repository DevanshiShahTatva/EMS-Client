export interface IBarChartProps {
  data: number[];
  labels: string[];
  symbolType?: string;
}

export interface IDoughnutChartProps {
  data: number[];
  labels: string[];
  showCustomLabels?: boolean;
}

export interface IHeatmapChartProps {
  series: ApexAxisChartSeries;
  categories: string[];
}

export interface ILineChartProps {
  data: number[];
  labels: string[];
}

export interface IPieChartProps {
  labels: string[];
  data: number[];
  showCustomLabels?: boolean;
  customLabelPrefix?: string;
  isUserBadge?: boolean;
}

export interface IStatResponse {
  totalUsers: number;
  totalRevenue: number;
  totalEvents: number;
  totalLocations: number;
}

export interface ITopEventsChartData {
  _id: string;
  title: string;
  category: string;
  likesCount: number;
}

export interface ITopTicketCancelledChartData {
  totalBookedUsers: number;
  cancelledUsers: number;
  event: {
    title: string;
    startDate: string;
    category: string;
    location: string;
  };
  eventId: string;
  cancellationRate: 100;
}

export interface ITopTicketCancelledTableData {
  title: string;
  totalBookedUsers: number;
  cancelledUsers: number;
}

export interface IMostRevenueByEventsData {
  totalRevenue: number;
  eventTitle: string;
  category?: string;
}

export interface ITopAttendedEventsData {
  totalAttendees: number;
  totalBookedSeats: number;
  attendanceRatio: string; // e.g., "16.67%"
  eventId: string;
  eventTitle: string;
}

export type TFilterType = "monthly" | "yearly" | "overall";

export interface IFilter {
  type: TFilterType;
  value: string;
}

export interface IRevenueData {
  _id: string;
  total: number;
  bookings: number;
}

export interface IRevenueByCategoryData {
  totalValue: number;
  category: string;
  bookings: number;
}

export interface IBookingByTicketTypeData {
  ticketType: string;
  totalBookings: number;
}

export interface IMonthDateHeatmapData {
  month: string;
  data: {
    date: string;
    bookings: number;
    revenue: number;
  }[];
}

export type TOutputData = {
  name: string;
  data: {
    x: string;
    y: number;
  }[];
}[];


export interface IBadgeCountData {
  badge: string;
  count: number;
}

export interface RatingsBreakdown {
  [key: string]: number; 
}

export interface EventFeedbackSummary {
  totalFeedbacks: number;
  eventTitle: string | null;
  eventImage: string | null;
  ratingsBreakdown: RatingsBreakdown;
  eventId: string;
  averageRating: number;
}

export interface FeedbackAnalyticsData {
  period: string;
  currentReference: string;
  startDate: string;
  endDate: string;   
  data: EventFeedbackSummary[];
}

export interface FeedbackAnalyticsResponse {
  status: number;
  success: boolean;
  message: string;
  data: FeedbackAnalyticsData;
}
