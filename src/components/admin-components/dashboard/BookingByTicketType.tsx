'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES } from '@/utils/constant';
import { Skeleton } from '@/components/ui/skeleton';
import DoughnutChart from '../charts/DoughnutChart';
import { IBookingByTicketTypeData } from '@/app/admin/dashboard/types';

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


    if (loading) {
        return (
            <div className="mt-6 w-full flex justify-center items-center">
                <Skeleton className="w-40 sm:w-60 md:w-70 lg:w-75 aspect-square rounded-full" />
            </div>
        );
    }

    return (
        <div className="mt-7 min-h-[250px] h-[350px] md:h-[300px] w-full flex items-center justify-center">
            <DoughnutChart data={data} labels={labels} />
        </div>
    );
};

export default BookingByTicketType;
