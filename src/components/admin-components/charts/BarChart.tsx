'use client';

import { useMemo } from 'react';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BALANCED_COLORS } from '@/utils/constant';
import { formatNumberShort, RupeeSymbol } from '@/utils/helper';
import { IBarChartProps } from '@/app/admin/dashboard/types';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function BarChart({ data, labels }: IBarChartProps) {
    const chartData = useMemo(() => ({
        labels,
        datasets: [
            {
                label: 'Revenue',
                data,
                backgroundColor: BALANCED_COLORS.slice(0, labels.length),
                barThickness: 20,
            },
        ],
    }), [data, labels]);

    const options: ChartOptions<'bar'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.formattedValue;
                        return `Revenue: ${RupeeSymbol} ${value}`; // ← Append any string here
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => formatNumberShort(Number(value)),
                    color: '#6B7280',
                    count: 6
                },
               
            },
            x: {
                categoryPercentage: 0.6,
                barPercentage: 0.7,
                ticks: {
                    color: '#6B7280',
                },
                grid: {
                    display: false, 
                },
            },
        },
    }), []);

    return (
        <Bar data={chartData} options={options} />
    );
}
