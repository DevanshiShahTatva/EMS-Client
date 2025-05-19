'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES } from '@/utils/constant';
import { Skeleton } from '@/components/ui/skeleton';
import DoughnutChart from '../charts/DoughnutChart';
import { IBookingByTicketTypeData } from '@/app/admin/dashboard/types';
import { ChartLegendSkeleton } from '../charts/PieChart';

const BookingByTicketType: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [labels, setLabels] = useState<string[]>([]);
    const [data, setData] = useState<number[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await apiCall({
                endPoint: API_ROUTES.ADMIN.BOOKING_BY_TICKET_TYPE,
                method: 'GET',
            });

            const resultData = response?.data as IBookingByTicketTypeData[] || []

            const bookingMap = resultData.reduce((acc, item) => {
                acc[item.ticketType] = (acc[item.ticketType] || 0) + item.totalBookings;
                return acc;
            }, {} as Record<string, number>);

            setLabels(Object.keys(bookingMap));
            setData(Object.values(bookingMap));

        } catch (err) {
            console.error('Error fetching data:', err);
            setLabels([]);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <div className='min-h-[450px] mt-6 flex items-center justify-center'>
                <div>
                    {loading ?
                        <div className="w-full flex justify-center items-center flex-col">
                            <Skeleton className="sm:w-40 md:w-50 lg:w-62.5 aspect-square rounded-full" />
                            <ChartLegendSkeleton />
                        </div> :
                        <DoughnutChart data={data} labels={labels} showCustomLabels />
                    }
                </div>
            </div>
        </>
    );
};

export default BookingByTicketType;
