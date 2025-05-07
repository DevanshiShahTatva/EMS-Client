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
import { IDoughnutChartProps } from '@/app/admin/dashboard/types';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC<IDoughnutChartProps> = ({ data, labels, showCustomLabels = false }) => {
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
        // maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom',
                display: false
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

    return (
        <>
            <div className='h-[250px] w-full flex justify-center'>
                <Doughnut data={chartData} options={options} />

            </div>
            {
                !!showCustomLabels ?
                    <div className="flex justify-center mt-6">
                        <div className="flex flex-wrap gap-x-6 gap-y-2" style={{ width: '344px' }}>
                            {labels.map((label, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center space-x-2 w-[160px]"
                                >
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: BALANCED_COLORS[idx] }}
                                    />
                                    <span
                                        className="text-sm text-gray-600 truncate max-w-[80px] cursor-pointer"
                                        title={label}
                                    >
                                        {label}
                                    </span>
                                    <span className="font-semibold text-black ml-auto">{data[idx]}</span>
                                </div>
                            ))}
                        </div>
                    </div> : <></>
            }
        </>
    );
};

export default DoughnutChart;
