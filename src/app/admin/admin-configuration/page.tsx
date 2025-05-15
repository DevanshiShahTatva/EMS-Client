"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { apiCall } from "@/utils/services/request";
import CustomTextField from "@/components/admin-components/InputField";
import ChartCard from "@/components/admin-components/dashboard/ChartCard";
import Breadcrumbs from "@/components/common/BreadCrumbs";
import {
  API_ROUTES,
  BREAD_CRUMBS_ITEMS,
  MAX_CHARGE_VALUE,
} from "@/utils/constant";

const PointConfiguration = () => {
  const [points, setPoints] = useState("");
  const [charge, setCharge] = useState("0");

  useEffect(() => {
    const fetchPointInfo = async () => {
      const res = await apiCall({
        method: "GET",
        endPoint: API_ROUTES.ADMIN.POINT_SETTING,
      });
      if (res.success) {
        setPoints(res.conversionRate);
      }
    };
    fetchPointInfo();
  }, []);

  const updatePoints = async () => {
    const res = await apiCall({
      method: "PUT",
      body: {
        conversionRate: points,
      },
      endPoint: API_ROUTES.ADMIN.POINT_SETTING,
    });

    if (res.success) {
      toast.success("Points updated successfully!");
    }
  };

  const updateCharge = () => {
    if (Number(charge) < 0) {
      toast.error("charge should be 0 or more than 0");
    }

    if (Number(charge) > MAX_CHARGE_VALUE) {
      toast.error(`charge should not be more than ${MAX_CHARGE_VALUE}`);
    }
  };

  return (
    <div className="p-8">
      <Breadcrumbs
        breadcrumbsItems={BREAD_CRUMBS_ITEMS.ADMIN_CONFIGURATION.MAIN_PAGE}
      />
      <ChartCard>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-lg font-bold mb-2">Point Configuration</p>
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
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setPoints(e.target.value);
                  }
                }}
              />
              <p className="mb-4">Points</p>
              <button
                disabled={!points}
                onClick={updatePoints}
                className="px-4 py-3 rounded-md bg-black text-white text-sm mb-4 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
          <div>
            <p className="text-lg font-bold">Cancel Charge</p>
            <p className="mb-3 text-sm text-gray-600">
              Note: Please add tax here in below in percentage only max by{" "}
              {MAX_CHARGE_VALUE}%.
            </p>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <CustomTextField
                  label=""
                  name="setChargeVal"
                  type="number"
                  errorMsg=""
                  value={charge}
                  errorKey={!charge}
                  placeholder="Enter charge"
                  onChange={(e) => setCharge(e.target.value)}
                />
                <p className="mb-4">%</p>
              </div>
              <button
                disabled={!charge}
                onClick={updateCharge}
                className="px-4 py-3 rounded-md bg-black text-white text-sm mb-4 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default PointConfiguration;
