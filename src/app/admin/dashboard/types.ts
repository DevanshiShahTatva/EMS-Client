export interface IBarChartProps {
    data: number[];
    labels: string[];
}

export interface IDoughnutChartProps {
    data: number[];
    labels: string[];
}

export interface IHeatmapChartProps {
    series: ApexAxisChartSeries;
    categories: string[];
}

export interface ILineChartProps {
    data: number[];
    labels: string[];
};

export interface IPieChartProps {
    labels: string[];
    data: number[];
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

export interface IMostRevenueByEventsData {
    totalRevenue: number;
    eventTitle: string;
    category?: string;
}

export type TFilterType = 'monthly' | 'yearly' | 'overall';

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
    bookings: number
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