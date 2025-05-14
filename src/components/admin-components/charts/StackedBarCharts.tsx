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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

// Props type
interface IStackedBarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
  }[];
}

export default function StackedBarChart({ labels, datasets }: IStackedBarChartProps) {
  const chartData = useMemo(() => {
    return {
      labels,
      datasets: datasets.map((ds, index) => ({
        ...ds,
        backgroundColor: ds.backgroundColor || BALANCED_COLORS[index % BALANCED_COLORS.length],
        barThickness: 20,
        stack: 'stack1', // Important for stacking
      })),
    };
  }, [labels, datasets]);

    const options: ChartOptions<'bar'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,     
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw as number;
                        return `${context.dataset.label}:  ${formatNumberShort(value)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: '#6B7280',
                },
                grid: {
                    display: false,
                },
                categoryPercentage: 0.6,
                barPercentage: 0.7,
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    color: '#6B7280',
                    callback: (value) => formatNumberShort(Number(value)),
                },
            },
        },
    }), []);

  return (
    <Bar data={chartData} options={options} />
  );
}
