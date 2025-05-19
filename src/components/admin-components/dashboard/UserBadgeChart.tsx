'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import PieChart, { ChartLegendSkeleton } from '../charts/PieChart';
import { CardTitle } from './ChartCard';
import { apiCall } from '@/utils/services/request';

import { API_ROUTES } from '@/utils/constant';
import { IBadgeCountData } from '@/app/admin/dashboard/types';
import { DASHBOARD_TITLE } from '@/app/admin/dashboard/helper';
import ChartFallbackUI from './ChartFallbackUI';

const UserBadgeChart = () => {

  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiCall({ endPoint: `${API_ROUTES.ADMIN.USER_BADGE_INFO}`, method: 'GET' });
      const result = response?.data as IBadgeCountData[] || [];

      const dynamicLabel = result.map(e => e.badge);
      const dynamicValue = result.map(e => e.count);

      setChartLabels(dynamicLabel);
      setChartData(dynamicValue);
    } catch (err) {
      console.error('Error: ', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div>
      <CardTitle title={DASHBOARD_TITLE.USER_BADGE_PIE_CHART} tooltip={DASHBOARD_TITLE.USER_BADGE_PIE_CHART_TOOLTIP} />
      <div className='p-6 min-h-[450px] flex items-center justify-center flex-col'>
        {loading ? (
          <div className="w-full flex justify-center items-center flex-col">
            <Skeleton className="sm:w-40 md:w-50 lg:w-62.5 aspect-square rounded-full" />
            <ChartLegendSkeleton />
          </div>
        ) : chartData?.length ? (
          <PieChart
            isUserBadge
            showCustomLabels
            data={chartData}
            labels={chartLabels}
          />
        ) : <ChartFallbackUI handleRefresh={fetchChartData} />}
      </div>
    </div>
  );
};

export default UserBadgeChart;