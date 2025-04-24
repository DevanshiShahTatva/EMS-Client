'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import moment from 'moment';
import { chartTitle } from './ChartCard';
import DateRangeFilter from './DateRangeFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES } from '@/utils/constant';

const HeatmapChart = dynamic(() => import('../charts/HeatmapChart'), { ssr: false });

interface IData {
    month: string;
    data: {
        date: string;
        bookings: number;
        revenue: number;
    }[];
}

type OutputData = {
    name: string;
    data: {
        x: string;
        y: number;
    }[];
}[];
const currentYear = moment().format('YYYY')
const MonthDateHeatmap: React.FC = () => {
    const [filter, setFilter] = useState({ type: 'yearly', value: currentYear });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<OutputData>([]);

    const days = useMemo(() => Array.from({ length: 31 }, (_, i) => `${i + 1}`), []);

    const transformMonthlyData = useCallback(
        (input: IData[], use: 'bookings' | 'revenue' = 'bookings'): OutputData => {
            return input.map((monthItem) => ({
                name: monthItem.month,
                data: monthItem.data.map((day) => ({
                    x: new Date(day.date).getDate().toString(),
                    y: day[use],
                })),
            }));
        },
        []
    );

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const endpoint = `${API_ROUTES.ADMIN.BOOKING_BY_MONTH_DATE}?year=${filter.value}`;
                const response = await apiCall({ endPoint: endpoint, method: 'GET' });
                const responseData = response.data as IData[];
                const result = transformMonthlyData(responseData);
                setChartData(result);
            } catch (err) {
                console.error('Failed to fetch heatmap data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [filter, transformMonthlyData]);

    return (
        <div>
            <div className="flex justify-between mb-6">
                {chartTitle('Bookings by Month and Date')}
                <DateRangeFilter
                    onChange={setFilter}
                    allowedTypes={['yearly']}
                    initialType="yearly"
                    initialValue={moment().format('YYYY')}
                />
            </div>

            {loading ? (
                <Skeleton className="w-full h-[400px] rounded-xl" />
            ) : (
                <HeatmapChart series={chartData} categories={days} />
            )}
        </div>
    );
};

export default MonthDateHeatmap;
