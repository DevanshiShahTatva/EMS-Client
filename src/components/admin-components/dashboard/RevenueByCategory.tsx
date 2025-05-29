'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BarChart from '../charts/BarChart';
import { Skeleton } from '@/components/ui/skeleton';
import DateRangeFilter from '@/components/admin-components/dashboard/DateRangeFilter';
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import { IFilter, IRevenueByCategoryData } from '@/app/admin/dashboard/types';
import ChartFallbackUI from './ChartFallbackUI';

const RevenueByCategory = () => {
    const [filter, setFilter] = useState<IFilter>({ type: 'overall', value: 'overall' });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IRevenueByCategoryData[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let endpoint = `${API_ROUTES.ADMIN.REVENUE_BY_CATEGORY}?period=${filter.type}`;
            if (filter.type !== 'overall') {
                endpoint += `&reference=${filter.value}`;
            }
            const response = await apiCall({ endPoint: endpoint, method: 'GET' });
            const result = response?.data?.data as IRevenueByCategoryData[] || []
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
        <div className='min-h-[450px] flex items-center justify-center'>
            <div className='w-full'>
                {chartData.length ?
                    <div className="mb-6">
                        <DateRangeFilter
                            onChange={setFilter}
                            allowedTypes={['overall', 'monthly', 'yearly']}
                            initialType={filter.type}
                            initialValue={filter.value}
                        />
                    </div> : <></>
                }

                {loading ? (
                    <Skeleton className="h-75 w-full rounded-md" />
                ) : chartData.length ? (
                    <div className="min-h-[250px] h-[400px] md:h-[300px] w-full flex items-center justify-center">
                        <BarChart data={chartData} labels={chartLabels} />
                    </div>
                ) : <ChartFallbackUI handleRefresh={fetchData} />}
            </div>
        </div>
    );
};

export default RevenueByCategory;