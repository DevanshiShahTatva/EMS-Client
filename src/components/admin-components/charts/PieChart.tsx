'use client';

import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { LIGHT_COLORS } from '@/utils/constant';
import { IPieChartProps } from '@/app/admin/dashboard/types';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<IPieChartProps> = ({ labels, data }) => {
    const chartData = useMemo(() => ({
        labels,
        datasets: [
            {
                label: 'Likes',
                data,
                backgroundColor: LIGHT_COLORS.slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    }), [labels, data]);

    const options: ChartOptions<'pie'> = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.formattedValue || 0;
                        const likesText = value === '1' ? 'Like' : 'Likes';
                        return `${label}: ${value} ${likesText}`;
                    },
                },
            },
        },
    }), []);

    return (
        <Pie data={chartData} options={options} />
    );
};

export default PieChart;
