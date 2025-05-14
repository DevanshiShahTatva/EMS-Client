'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Cistom Components
// import BarChart from '../charts/BarChart';
import StackedBarChart from '../charts/StackedBarCharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CardTitle } from './ChartCard';
import TableModal from './TableModal';

// Constants
import { API_ROUTES } from '@/utils/constant';
import { DASHBOARD_TITLE, RevenueTableColumns } from '@/app/admin/dashboard/helper';

// Services
import { apiCall } from '@/utils/services/request';

// Types
import { IMostRevenueByEventsData } from '@/app/admin/dashboard/types';

const TopAttendedEvents = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IMostRevenueByEventsData[]>([]);
    const [open, setOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState<IMostRevenueByEventsData[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const endPoint = `${API_ROUTES.ADMIN.ATTENDED_EVENTS_ANALYTICS}?limit=${5}`;
            const response = await apiCall({ endPoint, method: 'GET', withToken: true });

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
            const response = await apiCall({ endPoint: API_ROUTES.ADMIN.ATTENDED_EVENTS_ANALYTICS, method: 'GET' });
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
                title={DASHBOARD_TITLE.TOP_ATTENDED_EVENTS}
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
                            <StackedBarChart
                                labels={['Jan', 'Feb', 'Mar', 'Apr', "May"]}
                                datasets={[
                                    {
                                        label: 'Attended',
                                        data: [10, 20, 15, 18, 25],
                                        backgroundColor: '#90B4ED',
                                    },
                                    {
                                        label: 'Booked',
                                        data: [5, 10, 5, 2, 12], // This would be Booked - Attended
                                        backgroundColor: '#FF8C94',
                                    },
                                ]}
                            />
                    </div>
                )}
            </div>
            <TableModal
                open={open}
                onClose={() => setOpen(false)}
                columns={RevenueTableColumns}
                data={tableData}
                loading={tableLoading}
                title={DASHBOARD_TITLE.ATTENDE_EVENTS_MODAL_TITLE}
                pagesize={10}
            />
        </div>
    );
};

export default TopAttendedEvents;
