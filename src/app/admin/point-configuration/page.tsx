"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { apiCall } from "@/utils/services/request";
import CustomTextField from "@/components/admin-components/InputField";
import ChartCard from "@/components/admin-components/dashboard/ChartCard";
import Breadcrumbs from "@/components/common/BreadCrumbs";
import { API_ROUTES, BREAD_CRUMBS_ITEMS } from "@/utils/constant";

const PointConfiguration = () => {
  const [points, setPoints] = useState("");

  useEffect(() => {
    const fetchPointInfo = async () => {
      const res = await apiCall({
        method: "GET",
        endPoint: API_ROUTES.ADMIN.POINT_SETTING,
      });
      if (res.success) {
        setPoints(res.conversionRate);
      }
    }
    fetchPointInfo();
  }, []);

  const updatePoints = async () => {
    const res = await apiCall({
      method: "PUT",
      body: {
        "conversionRate": points
      },
      endPoint: API_ROUTES.ADMIN.POINT_SETTING,
    });

    if (res.success) {
      toast.success("Points updated successfully!");
    }
  }

  return (
    <div className='p-8'>
      <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.POINT_CONFIGURATION.MAIN_PAGE} />
      <ChartCard>
        <div className="flex items-center gap-3 ">
          <div className="mb-4">Rs. 1 = </div>
          <CustomTextField
            label=""
            name="points"
            type="text"
            errorMsg=""
            value={points}
            errorKey={!points}
            placeholder="Enter points"
            onChange={(e) => setPoints(e.target.value)}
          />
          <button
            disabled={!points}
            onClick={updatePoints}
            className="px-3 py-2 rounded-md bg-black text-white text-sm mb-4"
          >
            Update
          </button>
        </div>
      </ChartCard>
    </div>
  );
}

export default PointConfiguration;