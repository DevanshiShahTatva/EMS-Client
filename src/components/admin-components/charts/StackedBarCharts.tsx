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

// Helper function to truncate long labels
const truncateLabel = (label: string, maxLength: number = 10) => {
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

interface IStackedBarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
  }[];
}

export default function StackedBarChart({ labels, datasets }: IStackedBarChartProps) {
  // Process labels to truncate long text
  const processedLabels = useMemo(() => {
    return labels.map(label => truncateLabel(label));
  }, [labels]);

  const chartData = useMemo(() => {
    return {
      labels: processedLabels,
      datasets: datasets.map((ds, index) => ({
        ...ds,
        backgroundColor: ds.backgroundColor || BALANCED_COLORS[index % BALANCED_COLORS.length],
        barThickness: 20,
        stack: 'stack1',
      })),
    };
  }, [processedLabels, datasets]);

  const options: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // Show only the value in the tooltip label
          label: (context) => {
            const value = context.raw as number;
            return `${formatNumberShort(value)}`;
          },
          // Show full original label as title
          title: (context) => {
            return labels[context[0].dataIndex];
          },
          // Show dataset label before the values
          beforeLabel: (context) => {
            return context.dataset.label;
          }
        },
        displayColors: true,
        boxPadding: 6,
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
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
  }), [labels]);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}