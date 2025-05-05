'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BarChart from '../charts/BarChart';
import { Skeleton } from '@/components/ui/skeleton';
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import { Button } from '@/components/ui/button';
import TableModal from './TableModal';
import { chartTitle } from './ChartCard';
import { DASHBOARD_TITLE, RevenueTableColumns } from '@/app/admin/dashboard/helper';
import { IMostRevenueByEventsData } from '@/app/admin/dashboard/types';

const MostRevenueByEvents = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IMostRevenueByEventsData[]>([]);
    const [open, setOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState<IMostRevenueByEventsData[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const endPoint = `${API_ROUTES.ADMIN.TOP_REVENUE_BY_EVENTS}?limit=${5}`;
            const response = await apiCall({ endPoint, method: 'GET' });

            const resultData = response?.data as IMostRevenueByEventsData[] || []
            setData(resultData);
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTableData = useCallback(async () => {
        setTableLoading(true);
        try {
            const response = await apiCall({ endPoint: API_ROUTES.ADMIN.TOP_REVENUE_BY_EVENTS, method: 'GET' });
            const resultData = response?.data as IMostRevenueByEventsData[] || []
            setTableData(resultData);
        } catch (error) {
            console.error('Error fetching detailed table data:', error);
            setTableData([]);
        } finally {
            setTableLoading(false);
        }
    }, []);

    const handleViewDetails = () => {
        fetchTableData();
        setOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const chartLabels = useMemo(() => data.map((item) => item.eventTitle), [data]);
    const chartData = useMemo(() => data.map((item) => item.totalRevenue), [data]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex justify-between gap-4">
                {chartTitle(DASHBOARD_TITLE.BAR_CHART1)}

                {loading ? (
                    <Skeleton className="w-[100px] h-8 mb-4" />
                ) : (
                    <Button
                        variant="link"
                        className="underline text-primary px-0 cursor-pointer"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </Button>
                )}
            </div>

            {loading ? (
                <Skeleton className="h-75 w-full rounded-md" />
            ) : (
                <div className="min-h-[250px] h-[400px] md:h-[300px] w-full flex items-center justify-center">
                    <BarChart data={chartData} labels={chartLabels} />
                </div>
            )}

            <TableModal
                open={open}
                onClose={() => setOpen(false)}
                columns={RevenueTableColumns}
                data={tableData}
                loading={tableLoading}
                title={DASHBOARD_TITLE.REVENUE_MODAL_TITLE}
                pagesize={10}
            />
        </div>
    );
};

export default MostRevenueByEvents;
