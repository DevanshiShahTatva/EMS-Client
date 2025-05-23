"use client";

import React, { useState, useEffect } from "react";

// custom componets
import CommonModalLayout from "../common/CommonModalLayout";
import SelectField from "../admin-components/SelectField";

// library support
import { Checkbox } from "@/components/ui/checkbox"
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// types support
import { IApplyUserFiltersKey, IFilterUserModalProps } from "@/utils/types";

// constanst imports
import { USER_BADGES_OPTIONS , USERS_ROLE_OPTIONS  } from "@/utils/constant";

const FilterModal: React.FC<IFilterUserModalProps> = ({
  isOpen,
  onClose,
  applyFilters,
  maxPoints = 100,
}) => {

  const MIN = 0;
  const MAX = maxPoints ?? 100;

  const INITIAL_FILTER_VALUES: IApplyUserFiltersKey = {
    role: "",
    badges: [],
    pointRange: {
      max: maxPoints,
      min: -1
    }
  }

  const [rangeVal, setRangeVal] = useState<number[]>([MIN, MAX]);
  const [isPointsFilterAdded, setIsPointsFilterAdded] = useState(false)
  const [badges, setBadges] = useState<string[]>([])
  const [role, setRole] = useState("")

  const handleCheckboxChange = (checked: boolean, value: string) => {
    setBadges((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setBadges(USER_BADGES_OPTIONS.map((item) => item.value))
    } else {
      setBadges([])
    }
  }

  const isAllSelected = USER_BADGES_OPTIONS.length === badges.length

  const clearAllFilters = () => {
      setRangeVal([MIN,MAX])
      setRole("")
      setBadges([])
      setIsPointsFilterAdded(false)
      applyFilters(INITIAL_FILTER_VALUES)
    }
  
    const submitFilters = () => {
      const pointObj = {
        max : rangeVal[1],
        min : rangeVal[0],
      }
  
      const filterValues: IApplyUserFiltersKey = {
        role: role,
        badges: badges,
        ...isPointsFilterAdded && { pointRange : pointObj },
      };
      applyFilters(filterValues);
    };

  useEffect(() => {
    if (maxPoints) {
      setRangeVal([MIN, maxPoints])
    }
  }, [maxPoints])


  if (!isOpen) return null;
  
  
  return (
    <CommonModalLayout
      modalTitle="Filters"
      footerActions={[
        { label: "Reset", onClick: () => clearAllFilters(), variant: "outlined" },
        { label: "Apply", onClick: () => submitFilters(), variant: "primary" }
      ]}
      onClose={onClose}
    >
      <div>
        {/* Content UI Start */}

        <div className="my-5">
          <p className="font-semibold text-lg">Points</p>

          <div className="w-full">
            {/* Display Range Label */}
            <div className="text-center mb-6 relative">
              <div className="inline-block bg-blue-600 text-white text-sm font-semibold py-1 px-4 rounded-md relative">
                ₹{rangeVal[0]} – ₹{rangeVal[1]}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45" />
              </div>
            </div>

            <Slider
              range
              min={MIN}
              max={MAX}
              value={rangeVal}
              onChange={(val) => {
                setIsPointsFilterAdded(true)
                setRangeVal(val as number[])
              }}
              styles={{
                track: { backgroundColor: "#3b82f6", height: 10 },
                handle: { backgroundColor: "#000", borderColor: "#000", height: 18, width: 18 },
                rail: { backgroundColor: "#ddd", height: 10 },
              }}
            />

            {/* Inputs */}
            <div className="mt-6 flex items-center gap-4">
              <div className="w-1/2">
                <label className="text-sm">Min Point</label>
                <input
                  type="number"
                  className="w-full mt-1 border bg-gray-100 rounded-md px-3 py-1"
                  value={rangeVal[0]}
                  disabled
                  readOnly
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm">Max Point</label>
                <input
                  type="number"
                  className="w-full mt-1 bg-gray-100 border rounded-md px-3 py-1"
                  value={rangeVal[1]}
                  disabled
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-5">
          <p className="font-semibold text-lg mb-4">Roles</p>

          <div className="space-y-4">
            <SelectField
                name="role"
                value={role}
                onChange={(val) => setRole(val)}
                placeholder="Select Role"
                options={USERS_ROLE_OPTIONS}
                errorKey={false}               
            />
          </div>
         
        </div>

        <div className="my-5">
          <p className="font-semibold text-lg mb-4">Badges</p>

          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                className="border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <label
                htmlFor="select-all"
                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                All
              </label>
            </div>

            {/* Badges */}
            {USER_BADGES_OPTIONS.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={item.value}
                  checked={badges.includes(item.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(!!checked, item.value)
                  }
                  className="border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <label
                  htmlFor={item.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
              </div>
            ))}

          </div>

        </div>

        {/* Content UI End*/}
      </div>
    </CommonModalLayout>
  );
};

export default FilterModal;
