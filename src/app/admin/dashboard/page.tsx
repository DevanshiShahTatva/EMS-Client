import React from 'react'
import ChartCard from '@/components/admin-components/dashboard/ChartCard';
import StatCards from '@/components/admin-components/dashboard/StatCards';
import TopEventsChart from '@/components/admin-components/dashboard/TopEventsChart';
import BookingByTicketType from '@/components/admin-components/dashboard/BookingByTicketType';
import TotalRevenueOverTime from '@/components/admin-components/dashboard/TotalRevenueOverTime';
import MostRevenueByEvents from '@/components/admin-components/dashboard/MostRevenueByEvents';
import RevenueByCategory from '@/components/admin-components/dashboard/RevenueByCategory';
import MostBookedUsersTable from '@/components/admin-components/dashboard/MostBookedUsersTable';
import MonthDateHeatmap from '@/components/admin-components/dashboard/MonthDateHeatmap';
import { DASHBOARD_TITLE } from './helper';

function DashboardPage() {

    return (
        <section className="text-gray-400 p-8">
            <StatCards />

            <div className="flex flex-wrap -m-4 my-4">
                <div className="lg:w-1/2 w-full p-4 h-full">
                    <ChartCard>
                        <TopEventsChart />
                    </ChartCard>
                </div>
                <div className="lg:w-1/2 w-full p-4 h-full">
                    <ChartCard>
                        <MostRevenueByEvents />
                    </ChartCard>
                </div>
            </div>

            <div className="flex flex-wrap -m-4 p-4">
                <ChartCard>
                    <TotalRevenueOverTime />
                </ChartCard>
            </div>

            <div className="flex flex-wrap -m-4 my-4">
                <div className="lg:w-1/2 w-full p-4 h-full">
                    <ChartCard>
                        <RevenueByCategory />
                    </ChartCard>
                </div>
                <div className="lg:w-1/2 w-full p-4 h-full">
                    <ChartCard title={DASHBOARD_TITLE.DOUGHNUT_CHART}>
                        <BookingByTicketType />
                    </ChartCard>
                </div>
            </div>

            <div className="flex flex-wrap mt-4">
                <ChartCard title={DASHBOARD_TITLE.TABLE}>
                    <MostBookedUsersTable />
                </ChartCard>
            </div>

            <div className="flex flex-wrap mt-8">
                <ChartCard>
                    <MonthDateHeatmap />
                </ChartCard>
            </div>
        </section >
    )
}

export default DashboardPage