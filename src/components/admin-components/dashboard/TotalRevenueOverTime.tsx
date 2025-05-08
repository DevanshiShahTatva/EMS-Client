'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Skeleton } from '@/components/ui/skeleton';
import DateRangeFilter from '@/components/admin-components/dashboard/DateRangeFilter';
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import LineChart from '../charts/LineChart';
import { IFilter, IRevenueData } from '@/app/admin/dashboard/types';

const TotalRevenueOverTime: React.FC = () => {
    const [filter, setFilter] = useState<IFilter>({ type: 'overall', value: 'overall' });
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
        if (filter.type === 'overall') {
            const currentYear = moment().year();
            const last5Years = Array.from({ length: 5 }, (_, i) => (currentYear - 4 + i).toString())
            return last5Years;
        }
        return [];
    }, [filter]);

    const fetchRevenueData = useCallback(async () => {
        setLoading(true);
        try {
            let endPoint = `${API_ROUTES.ADMIN.REVENUE_OVER_TIME}?period=${filter.type}`;
            if (filter.type !== 'overall') {
                endPoint += `&reference=${filter.value}`;
            }
            const response = await apiCall({ endPoint, method: 'GET' });

            const result = (response?.data?.data as IRevenueData[]) || [];


            if (filter.type === 'overall') {
                const currentYear = moment().year();
                const last5Years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
                const fullData = last5Years.map(year => {
                    const yearData = result.find(item => item._id === year.toString());
                    return yearData ? yearData.total : 0;
                });

                setData(fullData);
            } else {
                const dataValue = result.map(item => item.total);
                setData(dataValue);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchRevenueData();
    }, [fetchRevenueData]);

    return (
        <div>
            <div className="my-6">
                <DateRangeFilter
                    onChange={setFilter}
                    allowedTypes={['overall', 'monthly', 'yearly']}
                    initialType={filter.type}
                    initialValue={filter.value}
                />
            </div>

            {loading ? (
                <Skeleton className="w-full h-100 rounded-xl" />
            ) : (
                <div className="w-full flex items-center justify-center h-[400px]">
                    <LineChart data={data} labels={chartLabels} />
                </div>
            )}
        </div>
    );
};

export default TotalRevenueOverTime;