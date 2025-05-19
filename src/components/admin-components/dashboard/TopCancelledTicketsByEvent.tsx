"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiCall } from "@/utils/services/request";
import { API_ROUTES } from "@/utils/constant";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PieChart, { ChartLegendSkeleton } from "../charts/PieChart";
import TableModal from "./TableModal";
import { CardTitle } from "./ChartCard";
import {
  DASHBOARD_TITLE,
  CancelledEventTicketTableColumns,
} from "@/app/admin/dashboard/helper";
import {
  ITopTicketCancelledChartData,
  ITopTicketCancelledTableData,
} from "@/app/admin/dashboard/types";

const TopCancelledTicketsByEvent = () => {
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableData, setTableData] = useState<ITopTicketCancelledTableData[]>(
    []
  );
  const [open, setOpen] = useState(false);

  // Fetch chart data
  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.CANCELLED_EVENT_RATIO}?limit=5`,
        method: "GET",
      });
      const result = (response?.data as ITopTicketCancelledChartData[]) || [];

      const dynamicLabel = result.map((e) => e.event.title);
      const dynamicValue = result.map((e) => e.cancellationRate);

      setChartLabels(dynamicLabel);
      setChartData(dynamicValue);
    } catch (err) {
      console.error("Error fetching chart data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch table data
  const fetchTableData = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await apiCall({
        endPoint: `${API_ROUTES.ADMIN.CANCELLED_EVENT_RATIO}`,
        method: "GET",
      });
      const result = (response?.data as ITopTicketCancelledChartData[]) || {};
      const updateResponse = result.map((data) => {
        return {
          title: data.event.title,
          totalBookedUsers: data.totalBookedUsers,
          cancelledUsers: data.cancelledUsers,
        };
      });
      setTableData(updateResponse);
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    } finally {
      setTableLoading(false);
    }
  }, []);

  // Trigger table data fetch on button click
  const handleViewDetails = () => {
    fetchTableData();
    setOpen(true);
  };

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return (
    <div>
      <CardTitle
        title={DASHBOARD_TITLE.CANCELLED_TICKET}
        tooltip={DASHBOARD_TITLE.CANCELLED_TICKET_TOOLTIP}
        right={
          <Button
            variant="link"
            className="underline text-primary p-0 h-7 cursor-pointer"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        }
      />

      <div className="p-6">
        {loading ? (
          <>
            <div className="w-full flex justify-center items-center flex-col">
              <Skeleton className="sm:w-40 md:w-50 lg:w-62.5 aspect-square rounded-full" />
              <ChartLegendSkeleton />
            </div>
          </>
        ) : (
          <>
            <PieChart
              labels={chartLabels}
              data={chartData}
              showCustomLabels
              customLabelPrefix="%"
            />
          </>
        )}
      </div>
      <TableModal
        open={open}
        onClose={() => setOpen(false)}
        columns={CancelledEventTicketTableColumns}
        data={tableData}
        loading={tableLoading}
        title={DASHBOARD_TITLE.CANCELLLED_EVENT_BY_RATIO}
        pagesize={5}
      />
    </div>
  );
};

export default TopCancelledTicketsByEvent;
