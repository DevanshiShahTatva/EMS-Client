"use client";

import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { LIGHT_COLORS } from "@/utils/constant";
import { IPieChartProps } from "@/app/admin/dashboard/types";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<IPieChartProps> = ({
  labels,
  data,
  showCustomLabels = false,
  customLabelPrefix,
}) => {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Likes",
          data,
          backgroundColor: LIGHT_COLORS.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    }),
    [labels, data]
  );

  const options: ChartOptions<"pie"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.formattedValue || 0;
              const likesText = value === "1" ? "Like" : "Likes";
              return `${label}: ${value} ${
                customLabelPrefix ? customLabelPrefix : likesText
              }`;
            },
          },
        },
      },
    }),
    []
  );

  const getDataValue = (idx: number) => {
    if (customLabelPrefix) {
      return data[idx] + customLabelPrefix;
    } else {
      return data[idx];
    }
  };

  return (
    <>
      <div className="h-[250px] w-full flex justify-center">
        <Pie data={chartData} options={options} />
      </div>
      {!!showCustomLabels ? (
        <div className="flex justify-center mt-6">
          <div
            className="flex flex-wrap gap-x-6 gap-y-2"
            style={{ width: "344px" }}
          >
            {labels.map((label, idx) => (
              <div key={idx} className="flex items-center space-x-2 w-[160px]">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: LIGHT_COLORS[idx] }}
                />
                <span
                  className="text-sm text-gray-600 truncate max-w-[80px] cursor-pointer"
                  title={label}
                >
                  {label}
                </span>
                <span className="font-semibold text-black ml-auto">
                  {getDataValue(idx)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export function ChartLegendSkeleton() {
  return (
    <div className="flex justify-center mt-6">
      <div
        className="flex flex-wrap gap-x-6 gap-y-2"
        style={{ width: "344px" }}
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex items-center space-x-2 w-[160px]">
            <Skeleton className="w-3 h-3 rounded-full" />
            <Skeleton className="h-6 w-[80px]" />
            <Skeleton className="h-6 w-6 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PieChart;
