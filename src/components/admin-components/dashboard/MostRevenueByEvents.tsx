'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BarChart from '../charts/BarChart';
import { Skeleton } from '@/components/ui/skeleton';
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import { Button } from '@/components/ui/button';
import TableModal from './TableModal';
import { CardTitle } from './ChartCard';
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
        <div>
            <CardTitle
                title={DASHBOARD_TITLE.BAR_CHART1}
                tooltip={DASHBOARD_TITLE.BAR_CHART1_TOOLTIP}
                right={
                    <Button
                        variant="link"
                        className="underline text-primary p-0 h-7 cursor-pointer"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </Button>
                } />
            <div className="p-6">
                {loading ? (
                    <Skeleton className="h-90 w-full rounded-md" />
                ) : (
                    <div className="min-h-[250px] h-[400px] md:h-[360px] w-full flex items-center justify-center">
                        <BarChart data={chartData} labels={chartLabels} />
                    </div>
                )}
            </div>
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
