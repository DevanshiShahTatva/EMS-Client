'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ILineChartProps } from '@/app/admin/dashboard/types';
import { formatNumberShort, RupeeSymbol } from '@/utils/helper';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart: React.FC<ILineChartProps> = ({ data, labels }) => {
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Revenue',
                data,
                fill: false,
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const, display: false },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.formattedValue;
                        return `Revenue: ${RupeeSymbol} ${value}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: Math.max(...data) * 1.1, // 10% above the highest value
                ticks: {
                    callback: (value) => `${RupeeSymbol} ${formatNumberShort(Number(value))}`,
                    color: '#6B7280',
                    count: 6,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },

        },
    };

    return (
        <Line data={chartData} options={options} />
    );
};

export default LineChart;