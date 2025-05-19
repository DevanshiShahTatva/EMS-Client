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
import CustomButton from "@/components/common/CustomButton";

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
    fetchChargeInfo();
  }, []);

  const fetchChargeInfo = async () => {
    const res = await apiCall({
      method: "GET",
      endPoint: API_ROUTES.ADMIN.CANCEL_CHARGE,
    });
    if (res.success) {
      setCharge(res.data.charge);
    }
  };

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

  const updateCharge = async () => {
    if (Number(charge) < 0) {
      toast.error("charge should be 0 or more than 0");
    }

    if (Number(charge) > MAX_CHARGE_VALUE) {
      toast.error(`charge should not be more than ${MAX_CHARGE_VALUE}`);
    }

    const res = await apiCall({
      method: "PUT",
      body: {
        charge: charge,
      },
      endPoint: API_ROUTES.ADMIN.CANCEL_CHARGE,
    });

    if (res.success) {
      toast.success(res.message);
      fetchChargeInfo();
    }
  };

  return (
    <div className="px-8 py-5">
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
              <CustomButton
                disabled={!points}
                onClick={updatePoints}
                variant="primary"
                className="px-4 py-3 mb-4 text-white text-sm"
              >
                Update
              </CustomButton>
            </div>
          </div>
          <div>
            <p className="text-lg font-bold">Admin Charge</p>
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
              <CustomButton
                disabled={!charge}
                onClick={updateCharge}
                variant="primary"
                className="px-4 py-3 text-white text-sm mb-4 cursor-pointer"
              >
                Update
              </CustomButton>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default PointConfiguration;
