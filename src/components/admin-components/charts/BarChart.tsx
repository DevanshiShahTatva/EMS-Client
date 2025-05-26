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
import { formatNumberShort, RupeeSymbol, StarSymbol } from '@/utils/helper';
import { IBarChartProps } from '@/app/admin/dashboard/types';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

// Helper function to wrap long labels
const wrapLabel = (label: string, maxLength: number) => {
    if (label.length <= maxLength) return label;
    return `${label.substring(0, maxLength)}...`;
};

export default function BarChart({ data, labels,symbolType="rupee" }: IBarChartProps) {
    // Process labels to handle long text
    const processedLabels = useMemo(() => {
        return labels.map(label => wrapLabel(label, 10));
    }, [labels]);

    const chartData = useMemo(() => ({
        labels: processedLabels,
        datasets: [
            {
                label: 'Revenue',
                data,
                backgroundColor: BALANCED_COLORS.slice(0, labels.length),
                barThickness: 20,
            },
        ],
    }), [data, processedLabels, labels.length]);

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
                        return symbolType==="count" ? `${value} ${StarSymbol}` : `${RupeeSymbol} ${value}`;
                    },
                    // Use the original label as the tooltip title
                    title: function (context) {
                        return labels[context[0].dataIndex];
                    }
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => symbolType==="count" ? `${formatNumberShort(Number(value))}` : `${RupeeSymbol} ${formatNumberShort(Number(value))}`,
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
    }), [labels]);

    return (
        <Bar data={chartData} options={options} />
    );
}