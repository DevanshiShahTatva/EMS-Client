'use client'
import { useCallback, useEffect, useState } from 'react';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES } from '@/utils/constant';
import { Skeleton } from '@/components/ui/skeleton';
import BarChart from '../charts/BarChart';
import ChartFallbackUI from './ChartFallbackUI';
import DateRangeFilter from '@/components/admin-components/dashboard/DateRangeFilter';
import { IFilter } from '@/app/admin/dashboard/types';

interface FeedbackBreakdown {
  period: string;
  feedbacks: number;
  averageRating: number;
}

interface FeedbackOverviewData {
  period: string;
  currentReference: string;
  startDate: string;
  endDate: string;
  totalFeedbacks: number;
  averageRating: number;
  feedbackGrowthRate: number | null;
  breakdown: FeedbackBreakdown[];
}

const FeedbackOverviewGraph = () => {
  const [filter, setFilter] = useState<IFilter>({ type: 'yearly', value: new Date().getFullYear().toString() });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FeedbackOverviewData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = `${API_ROUTES.ADMIN.FEEDBACK_OVERVIEW}?period=${filter.type}`;
      if (filter.type !== 'overall') {
        endpoint += `&reference=${filter.value}`;
      }
      const response = await apiCall({ endPoint: endpoint, method: 'GET' });
      setData(response?.data || null);
    } catch (error) {
      console.error('Error fetching feedback overview:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartLabels = data?.breakdown.map((item) => item.period) || [];
  const chartData = data?.breakdown.map((item) => item.feedbacks) || [];

  return (
    <div className='min-h-[450px] mt-6 flex flex-col gap-6'>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <DateRangeFilter
          onChange={setFilter}
          allowedTypes={['monthly', 'yearly']}
          initialType={filter.type}
          initialValue={filter.value}
        />

        {data && (
          <div className="flex gap-4 text-sm md:text-base mt-4 md:mt-0">
            <span>Total Feedbacks: <strong>{data.totalFeedbacks}</strong></span>
            <span>Average Rating: <strong>{data.averageRating.toFixed(1)} ★</strong></span>
            {data.feedbackGrowthRate !== null && (
              <span>
                Growth: <strong className={data.feedbackGrowthRate > 0 ? 'text-green-600' : 'text-red-500'}>
                  {data.feedbackGrowthRate > 0 ? '+' : ''}{data.feedbackGrowthRate.toFixed(2)}%
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-72 w-full rounded-md" />
      ) : data && chartData.length ? (
        <div className="min-h-[250px] h-[400px] md:h-[300px] w-full">
          <BarChart
            data={chartData}
            labels={chartLabels}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context: { formattedValue: any; }) {
                      return `Feedbacks: ${context.formattedValue}`;
                    },
                    title: function (context: { label: any; }[]) {
                      return `Period: ${context[0].label}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <ChartFallbackUI handleRefresh={fetchData} />
      )}
    </div>
  );
};

export default FeedbackOverviewGraph;
