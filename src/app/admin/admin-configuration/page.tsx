"use client";

// React & Core Imports
import { useEffect, useState } from "react";

// Third-Party Libraries
import { toast } from "react-toastify";
import { CurrencyRupeeIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";

// Custom Components
import CustomTextField from "@/components/admin-components/InputField";
import CustomButton from "@/components/common/CustomButton";
import Breadcrumbs from "@/components/common/BreadCrumbs";
import Loader from '@/components/common/Loader';

// Constants
import {
  API_ROUTES,
  BREAD_CRUMBS_ITEMS,
  MAX_CHARGE_VALUE,
} from "@/utils/constant";

// Utilities / Helpers
import { apiCall } from "@/utils/services/request";

const PointConfiguration = () => {
  const [points, setPoints] = useState("0");
  const [charge, setCharge] = useState("0");
  const [loader, setLoader] = useState(false)
  const isInvalidCharge =
  !charge || isNaN(+charge) || +charge < 0 || +charge > 18;

  useEffect(() => {
 
    const fetchPointInfo = async () => {
      setLoader(true)
      const res = await apiCall({
        method: "GET",
        endPoint: API_ROUTES.ADMIN.POINT_SETTING,
      });
      if (res.success) {
        setPoints(res.conversionRate);
        setLoader(false)
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
    setLoader(true)
    const res = await apiCall({
      method: "PUT",
      body: {
        conversionRate: points,
      },
      endPoint: API_ROUTES.ADMIN.POINT_SETTING,
    });

    if (res.success) {
      toast.success("Points updated successfully!");
      setLoader(false)
    }
  };

  const updateCharge = async () => {
    if (Number(charge) < 0) {
      toast.error("charge should be 0 or more than 0");
    }

    if (Number(charge) > MAX_CHARGE_VALUE) {
      toast.error(`charge should not be more than ${MAX_CHARGE_VALUE}`);
    }
    setLoader(true)
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
      setLoader(false)
    }
  };

  return (
    <div className="px-8 py-5">
    {loader && <Loader />}
    <Breadcrumbs
      breadcrumbsItems={BREAD_CRUMBS_ITEMS.ADMIN_CONFIGURATION.MAIN_PAGE}
    />

    <div className="flex flex-col gap-8 mt-5">
      <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center gap-3 mb-4 text-indigo-700">
          <CurrencyRupeeIcon className="h-7 w-7 transform transition-transform duration-200 hover:scale-110" />
          <p className="text-xl font-bold tracking-tight">Point Configuration</p>
        </div>
        <p className="mb-6 text-sm text-gray-600 leading-relaxed">
          Note: The value entered here determines how many points are equivalent to ₹ 1. This sets the conversion rate for points to Indian Rupees.
        </p>
        <div className="flex flex-col gap-4 items-start">
          <div className="w-full sm:max-w-md">
            <CustomTextField
              label="Points Value (for ₹1)"
              name="points"
              type="text"
              errorMsg="Please enter the number of points equivalent to ₹1"
              value={points}
              errorKey={!points}
              placeholder="Enter points value"
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setPoints(e.target.value);
                }
              }}
            />
          </div>
          <CustomButton
            disabled={!points || Number(points) <= 0 || !/^\d*$/.test(points)}
            onClick={updatePoints}
            variant="primary"
            className="px-6 py-2.5 text-white text-base rounded-md shadow-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 transform self-start"
          >
            Update Points
          </CustomButton>
        </div>
      </div>
      <hr className="border-t border-gray-200 my-2" />
      <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="flex items-center gap-3 mb-4 text-teal-700">
          <AdjustmentsHorizontalIcon className="h-7 w-7 transform transition-transform duration-200 hover:rotate-12" />
          <p className="text-xl font-bold tracking-tight">Admin Charge</p>
        </div>
        <p className="mb-6 text-sm text-gray-600 leading-relaxed">
          Note: This is the percentage charge applied by the admin. Please ensure the value is between 0 and{" "}
          <span className="font-semibold text-gray-800">{MAX_CHARGE_VALUE}%</span>.
        </p>
        <div className="flex flex-col gap-4 items-start">
          <div className="w-full sm:max-w-md">
            <CustomTextField
              label="Percentage (%)"
              name="setChargeVal"
              type="text"
              errorMsg={
                !charge
                  ? "Please enter a percentage"
                  : +charge < 0 || +charge > 18
                  ? "Percentage must be between 0 and 18"
                  : ""
              }
              value={charge}
              errorKey={isInvalidCharge}
              placeholder="Enter charge percentage"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) || value === "") {
                  setCharge(value);
                }
              }}
            />
          </div>
          <CustomButton
            onClick={updateCharge}
            variant="primary"
            className="px-6 py-2.5 text-white text-base rounded-md shadow-lg bg-green-600 hover:bg-green-700 active:scale-[0.98] transition-all duration-200 transform self-start" 
          >
            Update Charge
          </CustomButton>
        </div>
      </div>

    </div>
  </div>
  );
};

export default PointConfiguration;
