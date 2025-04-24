'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import BarChart from '../charts/BarChart';
import { Skeleton } from '@/components/ui/skeleton';
import DateRangeFilter from '@/components/admin-components/dashboard/DateRangeFilter';
import { chartTitle } from './ChartCard';
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import { DASHBOARD_TITLE } from '@/app/admin/dashboard/helper';

type FilterType = 'monthly' | 'yearly' | 'overall';
interface Filter {
    type: FilterType;
    value: string;
}

interface IData {
    totalValue: number;
    category: string;
    bookings: number
}

const currentYear = moment().format('YYYY')

const RevenueByCategory = () => {
    const [filter, setFilter] = useState<Filter>({ type: 'yearly', value: currentYear });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IData[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const endpoint = `${API_ROUTES.ADMIN.REVENUE_BY_CATEGORY}?period=${filter.type}&reference=${filter.value}`;
            const response = await apiCall({ endPoint: endpoint, method: 'GET' });
            console.log("response3666", response)
            const result = response?.data?.data as IData[] || []
            setData(result);
        } catch (error) {
            console.error('Error fetching revenue by category:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const chartLabels = useMemo(() => data.map((item) => item.category), [data]);
    const chartData = useMemo(() => data.map((item) => item.totalValue), [data]);

    return (
        <div>
            <div className="flex justify-between flex-wrap gap-4 mb-4">
                {chartTitle(DASHBOARD_TITLE.BAR_CHART2)}
                <DateRangeFilter
                    onChange={setFilter}
                    allowedTypes={['monthly', 'yearly']}
                    initialType={filter.type}
                    initialValue={filter.value}
                />
            </div>

            {loading ? (
                <Skeleton className="h-75 w-full rounded-md" />
            ) : (
                <div className="min-h-[250px] h-[400px] md:h-[300px] w-full flex items-center justify-center">
                    <BarChart data={chartData} labels={chartLabels} />
                </div>
            )}
        </div>
    );
};

export default RevenueByCategory;
