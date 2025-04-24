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
import { formatNumberShort } from '@/utils/helper';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

interface Props {
    data: number[];
    labels: string[];
}

export default function BarChart({ data, labels }: Props) {
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
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => formatNumberShort(Number(value)),
                    color: '#6B7280',
                },
            },
            x: {
                categoryPercentage: 0.6,
                barPercentage: 0.7,
                ticks: {
                    color: '#6B7280',
                },
            },
        },
    }), []);

    return (
        <Bar data={chartData} options={options} />
    );
}
