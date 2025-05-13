import React from 'react'
import { CardWithTitle } from '@/components/admin-components/dashboard/ChartCard';
import StatCards from '@/components/admin-components/dashboard/StatCards';
import TopEventsChart from '@/components/admin-components/dashboard/TopEventsChart';
import BookingByTicketType from '@/components/admin-components/dashboard/BookingByTicketType';
import TotalRevenueOverTime from '@/components/admin-components/dashboard/TotalRevenueOverTime';
import MostRevenueByEvents from '@/components/admin-components/dashboard/MostRevenueByEvents';
import RevenueByCategory from '@/components/admin-components/dashboard/RevenueByCategory';
import MostBookedUsersTable from '@/components/admin-components/dashboard/MostBookedUsersTable';
import MonthDateHeatmap from '@/components/admin-components/dashboard/MonthDateHeatmap';
import { DASHBOARD_TITLE } from './helper';
import MapView from '@/components/admin-components/dashboard/MapView';
import 'leaflet/dist/leaflet.css';

function DashboardPage() {

    return (
        <section className="text-gray-400 p-8">
            <StatCards />

            <div className="flex flex-wrap -m-4 mt-4">
                <div className="lg:w-1/2 w-full p-4 h-full">
                    <div className="bg-white rounded-lg shadow-lg w-full">
                        <TopEventsChart />
                    </div>
                </div>
                <div className="lg:w-1/2 w-full p-4 h-full">
                    <div className="bg-white rounded-lg shadow-lg w-full">
                        <MostRevenueByEvents />
                    </div>
                </div>
            </div>



            <div className="flex flex-wrap -m-4 mt-4">
                <div className="lg:w-1/2 w-full p-4 h-full">
                    <CardWithTitle title={DASHBOARD_TITLE.BAR_CHART2}>
                        <RevenueByCategory />
                    </CardWithTitle>
                </div>
                <div className="lg:w-1/2 w-full p-4 h-full">
                    <CardWithTitle title={DASHBOARD_TITLE.DOUGHNUT_CHART}>
                        <BookingByTicketType />
                    </CardWithTitle>
                </div>
            </div>

            <div className="flex flex-wrap mt-8">
                <CardWithTitle title={DASHBOARD_TITLE.TABLE}>
                    <MostBookedUsersTable />
                </CardWithTitle>
            </div>

            <div className="flex flex-wrap mt-8">
                <CardWithTitle title={DASHBOARD_TITLE.LINE_CHART}>
                    <TotalRevenueOverTime />
                </CardWithTitle>
            </div>

            <div className="flex flex-wrap mt-8">
                <CardWithTitle title={DASHBOARD_TITLE.HEATMAP}>
                    <MonthDateHeatmap />
                </CardWithTitle>
            </div>

            <div className="flex flex-wrap mt-8">
                <CardWithTitle title={DASHBOARD_TITLE.MAP}>
                    <MapView />
                </CardWithTitle>
            </div>
        </section >
    )
}

export default DashboardPage