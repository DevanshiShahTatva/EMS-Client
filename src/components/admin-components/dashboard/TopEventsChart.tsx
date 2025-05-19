'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES } from '@/utils/constant';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import PieChart, { ChartLegendSkeleton } from '../charts/PieChart';
import TableModal from './TableModal';
import { CardTitle } from './ChartCard';
import { DASHBOARD_TITLE, LikeTableColumns } from '@/app/admin/dashboard/helper';
import { ITopEventsChartData } from '@/app/admin/dashboard/types';

const TopEventsChart = () => {

    const [chartLabels, setChartLabels] = useState<string[]>([]);
    const [chartData, setChartData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState<ITopEventsChartData[]>([]);
    const [open, setOpen] = useState(false);

    // Fetch chart data
    const fetchChartData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiCall({ endPoint: `${API_ROUTES.ADMIN.TOP_LIKED_EVENTS}?limit=5`, method: 'GET' });
            const result = response?.data as ITopEventsChartData[] || [];

            const dynamicLabel = result.map(e => e.title)
            const dynamicValue = result.map(e => e.likesCount)

            setChartLabels(dynamicLabel);
            setChartData(dynamicValue);
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch table data
    const fetchTableData = useCallback(async () => {
        setTableLoading(true);
        try {
            const response = await apiCall({ endPoint: `${API_ROUTES.ADMIN.TOP_LIKED_EVENTS}`, method: 'GET' });
            const result = response?.data as ITopEventsChartData[] || {};
            setTableData(result);
        } catch (error) {
            console.error('Error fetching detailed data:', error);
        } finally {
            setTableLoading(false);
        }
    }, []);

    // Trigger table data fetch on button click
    const handleViewDetails = () => {
        fetchTableData();
        setOpen(true);
    };

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    return (
        <div>

            <CardTitle
                title={DASHBOARD_TITLE.PIE_CHART}
                tooltip={DASHBOARD_TITLE.PIE_CHART_TOOLTIP}
                right={<Button
                    variant="link"
                    className="underline text-primary p-0 h-7 cursor-pointer"
                    onClick={handleViewDetails}
                >
                    View Details
                </Button>
                } />

            <div className='p-6'>

                {loading ? (
                    <>
                        <div className="w-full flex justify-center items-center flex-col">
                            <Skeleton className="sm:w-40 md:w-50 lg:w-62.5 aspect-square rounded-full" />
                            <ChartLegendSkeleton />
                        </div>

                    </>
                ) : (
                    <>
                        <PieChart labels={chartLabels} data={chartData} showCustomLabels />
                    </>
                )}
            </div>
            <TableModal
                open={open}
                onClose={() => setOpen(false)}
                columns={LikeTableColumns}
                data={tableData}
                loading={tableLoading}
                title={DASHBOARD_TITLE.LIKE_MODAL_TITLE}
                pagesize={5}
            />
        </div>
    );
};

export default TopEventsChart;
