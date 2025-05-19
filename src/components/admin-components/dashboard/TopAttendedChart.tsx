'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Cistom Components
import StackedBarChart from '../charts/StackedBarCharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CardTitle } from './ChartCard';
import TableModal from './TableModal';

// Constants
import { API_ROUTES } from '@/utils/constant';
import { AttendedEventsTableColumns, DASHBOARD_TITLE } from '@/app/admin/dashboard/helper';

// Services
import { apiCall } from '@/utils/services/request';

// Types
import { ITopAttendedEventsData } from '@/app/admin/dashboard/types';

const TopAttendedEvents = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ITopAttendedEventsData[]>([]);
    const [open, setOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState<ITopAttendedEventsData[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const endPoint = `${API_ROUTES.ADMIN.ATTENDED_EVENTS_ANALYTICS}?limit=${5}`;
            const response = await apiCall({ endPoint, method: 'GET', withToken: true });

            const resultData = response?.data as ITopAttendedEventsData[] || []
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
            const resultData = response?.data as ITopAttendedEventsData[] || []
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
    const chartDataSet = useMemo(() => {
        const attended = data.map(item => item.totalAttendees);
        const booked = data.map(item => item.totalBookedSeats);
        const remaining = booked.map((b, i) => Math.max(b - attended[i], 0));

        return [
            {
                label: 'Attendees',
                data: attended,
                backgroundColor: '#90B4ED',
            },
            {
                label: 'Non-Attendees',
                data: remaining,
                backgroundColor: '#FF8C94',
            },
        ];
    }, [data]);


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
                                labels={chartLabels}
                                datasets={chartDataSet}
                            />
                    </div>
                )}
            </div>
            <TableModal
                open={open}
                onClose={() => setOpen(false)}
                columns={AttendedEventsTableColumns}
                data={tableData}
                loading={tableLoading}
                title={DASHBOARD_TITLE.ATTENDE_EVENTS_MODAL_TITLE}
                pagesize={5}
            />
        </div>
    );
};

export default TopAttendedEvents;
