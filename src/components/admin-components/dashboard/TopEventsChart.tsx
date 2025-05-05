'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES } from '@/utils/constant';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import PieChart from '../charts/PieChart';
import TableModal from './TableModal';
import { chartTitle } from './ChartCard';
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
            <div className="flex justify-between gap-4">
                {chartTitle(DASHBOARD_TITLE.PIE_CHART)}

                {loading ?
                    <div className="flex justify-end">
                        <Skeleton className="w-[100px] h-8 mb-4" />
                    </div>
                    :
                    <Button
                        variant="link"
                        className="underline text-primary px-0 cursor-pointer"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </Button>
                }
            </div>
            {loading ? (
                <>
                    <div className="w-full flex justify-center items-center">
                        <Skeleton className="w-40 sm:w-60 md:w-70 lg:w-75 aspect-square rounded-full" />
                    </div>

                </>
            ) : (
                <>
                    <div className='min-h-[250px] h-[400px] md:h-[300px] w-full flex items-center justify-center'>
                        <PieChart labels={chartLabels} data={chartData} />
                    </div>
                </>
            )}
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
