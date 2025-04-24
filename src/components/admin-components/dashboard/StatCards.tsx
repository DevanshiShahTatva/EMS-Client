'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { HandCoins, MapPinCheck, PackageCheck, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES } from '@/utils/constant';
import { getTruthyNumber, formatNumberShort } from '@/utils/helper';
import TooltipWrapper from '@/components/common/TooltipWrapper';

interface IStatResponse {
    totalUsers: number;
    totalRevenue: number;
    totalEvents: number;
    totalLocations: number;
}

const iconMap = {
    Users: Users,
    Revenue: HandCoins,
    Events: PackageCheck,
    Places: MapPinCheck,
};

type StatKey = keyof typeof iconMap;

const StatCards: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Record<StatKey, number>>({
        Users: 0,
        Revenue: 0,
        Events: 0,
        Places: 0,
    });

    const fetchStats = useCallback(async () => {
        try {
            const response = await apiCall({
                endPoint: API_ROUTES.ADMIN.DASHBOARD_OVERVIEW,
                method: 'GET',
            });
            const result = response?.data as IStatResponse;

            setStats({
                Users: getTruthyNumber(result?.totalUsers),
                Revenue: getTruthyNumber(result?.totalRevenue),
                Events: getTruthyNumber(result?.totalEvents),
                Places: getTruthyNumber(result?.totalLocations),
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const cards = useMemo(() => {
        return (Object.keys(iconMap) as StatKey[]).map((key) => ({
            label: key,
            value: formatNumberShort(stats[key]),
            rawValue: stats[key],
            Icon: iconMap[key],
        }));
    }, [stats]);

    return (
        <div className="flex flex-wrap -m-4 text-center">
            {cards.map(({ label, value, rawValue, Icon }, idx) => (
                <div key={idx} className="p-4 lg:w-1/4 md:w-1/2 sm:w-1/2 w-full">
                    <div className="border-2 border-gray-200 px-4 py-6 rounded-lg bg-white shadow-lg">
                        <div className="flex justify-between items-center gap-4">
                            {loading ? (
                                <Skeleton className="h-12 w-12 rounded-full" />
                            ) : (
                                <Icon size={48} className="text-chart-1" />
                            )}
                            <div className="text-right">
                                {loading ? (
                                    <>
                                        <Skeleton className="h-8 w-20 mb-2" />
                                        <Skeleton className="h-4 w-16" />
                                    </>
                                ) : (
                                    <TooltipWrapper tooltip={`Total ${label}: ${rawValue}`}>
                                        <div className="cursor-pointer">
                                            <h2 className="title-font font-medium text-3xl xl:text-3xl lg:text-xl md:text-2xl text-gray-900">
                                                {value}
                                            </h2>
                                            <p className="leading-relaxed">{label}</p>
                                        </div>
                                    </TooltipWrapper>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
