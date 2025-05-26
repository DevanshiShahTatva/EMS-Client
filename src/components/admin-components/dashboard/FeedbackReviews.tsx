'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BarChart from '../charts/BarChart';
import { Skeleton } from '@/components/ui/skeleton';
import DateRangeFilter from '@/components/admin-components/dashboard/DateRangeFilter';
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';
import { IFeedbackChartData, IFilter, ITopEventsChartData } from '@/app/admin/dashboard/types';
import ChartFallbackUI from './ChartFallbackUI';
import { CardTitle } from './ChartCard';
import { DASHBOARD_TITLE } from '@/app/admin/dashboard/helper';
import { Button } from '@/components/ui/button';
import TableModal from './TableModal';

interface RatingDistribution {
  rating: number;
  count: number;
}

const FeedbackReviews = () => {
  const [filter, setFilter] = useState<IFilter>({ type: 'overall', value: 'overall' });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RatingDistribution[]>([]);
  const [open, setOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState<IFeedbackChartData[]>([]);
  const LikeTableColumns = [
    { label: 'Event Title', key: 'title' },
    { label: 'Avg. Ratings', key: 'averageRating' },
    { label: 'Total Feedback', key: 'totalFeedbacks' },
]
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = `${API_ROUTES.ADMIN.FEEDBACK_OVERVIEW}?period=${filter.type}`;
      if (filter.type !== 'overall') {
        endpoint += `&reference=${filter.value}`;
      }
      const response = await apiCall({ endPoint: endpoint, method: 'GET' });
      const result = response?.data?.ratings || [];
      setData(result);
    } catch (error) {
      console.error('Error fetching overall feedback distribution:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);
  const fetchTableData = useCallback(async () => {
          setTableLoading(true);
          try {
              const response = await apiCall({ endPoint: `${API_ROUTES.ADMIN.FEEDBACK_DETAILS}`, method: 'GET' });
              const result = response?.data as IFeedbackChartData[] || {};
              setTableData(result);
          } catch (error) {
              console.error('Error fetching detailed data:', error);
          } finally {
              setTableLoading(false);
          }
      }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

    const handleViewDetails = () => {
        fetchTableData();
        setOpen(true);
    };
  const chartLabels = useMemo(() => data.map((d) => `${d.rating} Star`), [data]);
  const chartData = useMemo(() => data.map((d) => d.count), [data]);

  return (
    <div>
      <CardTitle
        title={DASHBOARD_TITLE.FEEDBACK_ALL_DETAILS}
        tooltip={DASHBOARD_TITLE.FEEDBACK_ALL_DETAILS_TOOLTIP}
        right={<Button
            variant="link"
            className="underline text-primary p-0 h-7 cursor-pointer"
            onClick={handleViewDetails}
        >
            View Details
        </Button>
        } />
      <div className='p-6 min-h-[450px] w-full'>
        {chartData.length ? (
          <div className="mb-6 justify-around">
            <DateRangeFilter
              onChange={setFilter}
              allowedTypes={['overall', 'monthly', 'yearly']}
              initialType={filter.type}
              initialValue={filter.value}
            />
          </div>
        ) : null}

        {loading ? (
          <Skeleton className="h-75 w-full rounded-md" />
        ) : chartData.length ? (
          <div className="min-h-[250px] h-[400px] md:h-[300px] w-full flex items-center justify-center">
            <BarChart data={chartData} labels={chartLabels} symbolType="count" />
          </div>
        ) : (
          <ChartFallbackUI handleRefresh={fetchData} />
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

export default FeedbackReviews;
