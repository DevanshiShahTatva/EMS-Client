'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import ApexCharts from 'apexcharts';
import { IHeatmapChartProps } from '@/app/admin/dashboard/types';

const colorRanges = [
    { from: 0, to: 2, color: '#D1F8EF', name: 'Low' },
    { from: 3, to: 5, color: '#578FCA', name: 'Medium' },
    { from: 6, to: 10, color: '#003285', name: 'High' },
];

const HeatmapChart: React.FC<IHeatmapChartProps> = ({ series, categories }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartInstance = useRef<ApexCharts | null>(null);

    const chartOptions = useMemo<ApexCharts.ApexOptions>(() => ({
        chart: {
            type: 'heatmap',
            height: 400,
            toolbar: { show: false },
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 1,
                radius: 6,
                enableShades: true,
                colorScale: { ranges: colorRanges },
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            type: 'category',
            categories,
        },
        yaxis: {
            labels: {
                rotate: 0,
                offsetY: 4,
            },
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} bookings`,
            },
        },
        legend: { show: false }, // Hide Apex legend
        series,
    }), [series, categories]);

    const renderChart = useCallback(() => {
        if (chartRef.current) {
            chartInstance.current = new ApexCharts(chartRef.current, chartOptions);
            chartInstance.current.render();
        }
    }, [chartOptions]);

    useEffect(() => {
        renderChart();
        return () => {
            chartInstance.current?.destroy();
            chartInstance.current = null;
        };
    }, [renderChart]);

    return (
        <>
            <div ref={chartRef} />
            <div className="flex justify-center mt-6">
                <div className="flex flex-wrap gap-x-6 gap-y-2" style={{ width: '344px' }}>
                    {colorRanges.map((range, idx) => (
                        <div
                            key={idx}
                            className="flex items-center space-x-2 w-[160px]"
                        >
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: range.color }}
                            />
                            <span
                                className="text-sm text-gray-600 truncate max-w-[80px]"
                                title={range.name}
                            >
                                {range.name}
                            </span>
                            <span className="font-semibold text-black ml-auto">
                                {`${range.from}-${range.to}`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HeatmapChart;
