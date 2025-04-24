'use client';

import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import React from 'react';
import { BALANCED_COLORS } from '@/utils/constant';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    data: number[];
    labels: string[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, labels }) => {
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Data',
                data,
                backgroundColor: BALANCED_COLORS.slice(0, labels.length),
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.formattedValue || 0;
                        const bookingText = value === '1' ? 'Booking' : 'Bookings';
                        return `${label}: ${value} ${bookingText}`;
                    },
                },
            },
        },
    };

    return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
