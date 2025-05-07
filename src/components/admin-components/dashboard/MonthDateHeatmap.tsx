'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import DateRangeFilter from './DateRangeFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES } from '@/utils/constant';
import { getCurrentYear } from '@/app/admin/dashboard/helper';
import { IMonthDateHeatmapData, TOutputData } from '@/app/admin/dashboard/types';
import { ChartLegendSkeleton } from '../charts/PieChart';

const HeatmapChart = dynamic(() => import('../charts/HeatmapChart'), { ssr: false });

const MonthDateHeatmap: React.FC = () => {
    const [filter, setFilter] = useState({ type: 'yearly', value: getCurrentYear });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<TOutputData>([]);

    const days = useMemo(() => Array.from({ length: 31 }, (_, i) => `${i + 1}`), []);

    const transformMonthlyData = useCallback(
        (data: IMonthDateHeatmapData[], use: 'bookings' | 'revenue' = 'bookings'): TOutputData => {
            return data.map((monthItem) => ({
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
                const responseData = response?.data as IMonthDateHeatmapData[] || [];
                const result = transformMonthlyData(responseData);
                setChartData(result);
            } catch (err) {
                console.error('Failed to fetch heatmap data:', err);
                setChartData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [filter, transformMonthlyData]);

    return (
        <div>


            <div className="my-6">
                <DateRangeFilter
                    onChange={setFilter}
                    allowedTypes={['yearly']}
                    initialType="yearly"
                    initialValue={getCurrentYear}
                />
            </div>

            {loading ? (
                <>
                    <Skeleton className="w-full h-[400px] rounded-xl" />
                    <ChartLegendSkeleton />
                </>
            ) : (
                <HeatmapChart series={chartData} categories={days} />
            )}
        </div>
    );
};

export default MonthDateHeatmap;
