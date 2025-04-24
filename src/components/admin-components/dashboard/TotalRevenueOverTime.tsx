'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Skeleton } from '@/components/ui/skeleton';
import DateRangeFilter from '@/components/admin-components/dashboard/DateRangeFilter';
import { chartTitle } from './ChartCard';
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import LineChart from '../charts/LineChart';
import { DASHBOARD_TITLE } from '@/app/admin/dashboard/helper';

type FilterType = 'monthly' | 'yearly' | 'overall';
interface Filter { type: FilterType; value: string; }
interface IData { _id: string; total: number; bookings: number; }
const currentYear = moment().format('YYYY')
const TotalRevenueOverTime: React.FC = () => {
    const [filter, setFilter] = useState<Filter>({
        type: 'yearly',
        value: currentYear,
    });

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<number[]>([]);

    const chartLabels = useMemo(() => {
        if (filter.type === 'monthly') {
            const days = moment(filter.value, 'YYYY-MM').daysInMonth();
            return Array.from({ length: days }, (_, i) =>
                moment(filter.value, 'YYYY-MM').date(i + 1).format('D MMM')
            );
        }
        if (filter.type === 'yearly') {
            return moment.months();
        }
        return [];
    }, [filter]);

    const fetchRevenueData = useCallback(async () => {
        setLoading(true);
        try {
            const endPoint = `${API_ROUTES.ADMIN.REVENUE_OVER_TIME}?period=${filter.type}&reference=${filter.value}`;
            const response = await apiCall({ endPoint, method: 'GET' });
            const result = (response?.data?.data as IData[]) || [];
            setData(result.map(item => item.total));
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchRevenueData();
    }, [fetchRevenueData]);

    return (
        <div>
            <div className="flex justify-between mb-6">
                {chartTitle(DASHBOARD_TITLE.LINE_CHART)}
                <DateRangeFilter
                    onChange={setFilter}
                    allowedTypes={['monthly', 'yearly']}
                    initialType={filter.type}
                    initialValue={filter.value}
                />
            </div>

            {loading ? (
                <Skeleton className="w-full h-100 rounded-xl" />
            ) : (
                <div className="min-h-[300px] max-h-[450px] w-full flex items-center justify-center">
                    <LineChart data={data} labels={chartLabels} />
                </div>
            )}
        </div>
    );
};

export default TotalRevenueOverTime;