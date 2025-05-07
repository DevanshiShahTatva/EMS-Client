"use client";

import React, { useState, useEffect } from "react";

// library support
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import moment from "moment";
import { X } from "lucide-react"; 
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// types support
import { IApplyFiltersKey, IFilterModalProps } from "@/utils/types";

// constanst imports
import { durationOptions, CATOGORIES_ITEMS_ARRAY, TICKETS_OPTIONS, STATUS_OPTIONS, LOCATION_OPTIONS  } from "@/utils/constant";

const FilterModal: React.FC<IFilterModalProps> = ({
  isOpen,
  onClose,
  applyFilters,
  maxTicketPrice = 100,
  isUserRole = false,
  filterValues
}) => {

  const MIN = 0;
  const MAX = maxTicketPrice ?? 100;

  const INITIAL_FILTER_VALUES : IApplyFiltersKey = {
      catogories : [],
      durations : [],
      status : "",
      ticketsTypes : "",
      eventsDates : {
        from : "",
        to : ""
      },
      priceRange : {
        max : isUserRole ? maxTicketPrice : 100,
        min : -1
      },
      likeEvent : "",
      locationRadius: ""
  }

  const [selectedDurations, setSelectedDurations] = useState<string[]>([])
  const [selectedCatogory, setSelectedCatogory] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedTicket, setSelectedTicket] = useState("")
  const [showAll, setShowAll] = useState(false)
  const [locationRadius, setLocationRadius] = useState("")
  const [isLikedEvent, setIsLikedEvent] = useState(false)

  const [date, setDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

    const [rangeVal, setRangeVal] = useState<number[]>([MIN,MAX]);
    const [isPriceFilterAdded, setIsPriceFilterAdded] = useState(false)
  
    useEffect(() => {
      if(maxTicketPrice) {
        setRangeVal([MIN,maxTicketPrice])
      }
    },[maxTicketPrice])


    useEffect(() => {
      if(filterValues) {

        setRangeVal([filterValues.priceRange?.min === -1 ? 0 : (filterValues.priceRange?.min as number ?? 0), filterValues.priceRange?.max as number ?? maxTicketPrice])
        setIsPriceFilterAdded(filterValues.priceRange ? true : false)
        setDate({
          from: filterValues.eventsDates?.from ? new Date(filterValues.eventsDates.from) : undefined,
          to: filterValues.eventsDates?.to ? new Date(filterValues.eventsDates.to) : undefined,
        });
        setSelectedCatogory(filterValues.catogories ?? []);
        setSelectedStatus(filterValues.status ?? "");
        setSelectedTicket(filterValues.ticketsTypes ?? "");
        setSelectedDurations(filterValues.durations ?? []);
        setIsLikedEvent(filterValues.likeEvent && filterValues.likeEvent === "true" ? true : false);
        setLocationRadius(filterValues.locationRadius ?? "");
      }

    }, [filterValues])


  const toggleCheckbox = (value: string) => {
    setSelectedDurations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const handleCheckboxChange = (checked: boolean, value: string) => {
    setSelectedCatogory((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCatogory(CATOGORIES_ITEMS_ARRAY.map((item) => item.value))
    } else {
      setSelectedCatogory([])
    }
  }
  const isAllSelected = selectedCatogory.length === CATOGORIES_ITEMS_ARRAY.length

  const visibleCategories = showAll ? CATOGORIES_ITEMS_ARRAY : CATOGORIES_ITEMS_ARRAY.slice(0, 3)
  
  const clearAllFilters = () => {
    const emptyDate = {
      from : undefined, to : undefined
    }

    setRangeVal([MIN,MAX])
    setDate(emptyDate)
    setSelectedStatus("")
    setSelectedTicket("")
    setSelectedCatogory([])
    setSelectedDurations([])
    setLocationRadius("")
    setIsLikedEvent(false)
    applyFilters(INITIAL_FILTER_VALUES)
  }

  const submitFilters = () => {
    const dateObj = {
       from : date.from !== undefined ? date.from : "",
       to : date.to !== undefined ? date.to :  "",
    }

    const priceObj = {
      max : rangeVal[1],
      min : rangeVal[0],
    }

    const filterValues: IApplyFiltersKey = {
      catogories: selectedCatogory,
      durations: selectedDurations,
      status: selectedStatus,
      ticketsTypes : selectedTicket,
      eventsDates : dateObj,
      ...isPriceFilterAdded && { priceRange : priceObj },
      ...(isUserRole && { likeEvent : isLikedEvent ? "true" : ""}),
      ...(isUserRole && { locationRadius : locationRadius}),
    };
    applyFilters(filterValues);
  };

  const ticketColorClasses = {
    green: {
      border: "border-green-500",
      text: "text-green-500",
      bg: "bg-green-600",
      hoverBg: "hover:bg-green-700",
      hoverLightBg: "hover:bg-green-100",
    },
    yellow: {
      border: "border-yellow-500",
      text: "text-yellow-500",
      bg: "bg-yellow-600",
      hoverBg: "hover:bg-yellow-700",
      hoverLightBg: "hover:bg-yellow-100",
    },
    red: {
      border: "border-red-500",
      text: "text-red-500",
      bg: "bg-red-600",
      hoverBg: "hover:bg-red-700",
      hoverLightBg: "hover:bg-red-100",
    },
    gray: {
      border: "border-gray-500",
      text: "text-gray-500",
      bg: "bg-gray-600",
      hoverBg: "hover:bg-gray-700",
      hoverLightBg: "hover:bg-gray-100",
    },
  };

  if (!isOpen) return null;
  
  const isDisabled = !localStorage.getItem("lat") || !localStorage.getItem("lng");
  
  return (
    <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/60 bg-opacity-40">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl relative">
        {/* Title Section Start */}
        <div className="flex justify-between items-center border-b-1 px-6 py-5 border-b-gray-300">
          <p className="font-bold text-2xl">Filters</p>
          <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer" />
        </div>
        {/* Title Section End */}

        <div className="max-h-96 overflow-auto scrollbar-none border-b-1 px-6 py-0 border-b-gray-300">
          {/* Content UI Start */}

          <div className="my-5">
            <p className="font-semibold text-lg">Price</p>

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
                  setIsPriceFilterAdded(true)
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
                  <label className="text-sm">Min Price</label>
                  <input
                    type="number"
                    className="w-full mt-1 border bg-gray-100 rounded-md px-3 py-1"
                    value={rangeVal[0]}
                    disabled
                    readOnly
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-sm">Max Price</label>
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
            <p className="font-semibold text-lg mb-4">Event Dates</p>

            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative w-full">
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 pr-10",
                        !date.from && !date.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                      {date.from ? (
                        date.to ? (
                          <>
                            {moment(date.from).format("MMM DD, YYYY")} -{" "}
                            {moment(date.to).format("MMM DD, YYYY")}
                          </>
                        ) : (
                          moment(date.from).format("MMM DD, YYYY")
                        )
                      ) : (
                        <span className="text-black">Select a date range</span>
                      )}
                    </Button>
                    {date.from && date.to && (
                      <X
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent popover from opening
                          setDate({ from: undefined, to: undefined });
                        }}
                      />
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="range"
                    className="selectDateClass"
                    selected={date}
                    onSelect={(range) => {
                      setDate({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="my-5">
            <p className="font-semibold text-lg mb-4">Catogory</p>

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

              {/* Categories */}
              {visibleCategories.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.value}
                    checked={selectedCatogory.includes(item.value)}
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

              {/* Toggle Link */}
              {CATOGORIES_ITEMS_ARRAY.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
                >
                  {showAll ? "See less" : "See more"}
                </button>
              )}
            </div>
          </div>

          <div className="my-5">
            <p className="font-semibold text-lg mb-4">Status</p>

            <div className="flex w-full gap-4">
              {STATUS_OPTIONS.map((item, index) => {
                const isSelected = selectedStatus === item.value;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedStatus(isSelected ? "" : item.value)}
                    className={`flex-1 border-[1px] border-blue-500 font-semibold px-4 py-2 rounded-md  transition cursor-pointer
                  ${
                    selectedStatus === item.value
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-white text-blue-500 hover:bg-blue-100"
                  }
                  `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-5">
            <p className="font-semibold text-lg mb-4">Tickets Availability</p>

            <div className="grid w-full gap-3 grid-cols-2 md:grid-cols-4">
              {TICKETS_OPTIONS.map((item, index) => {
                const classes =ticketColorClasses[item.colorKey as keyof typeof ticketColorClasses];
                const isSelected = selectedTicket === item.value;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTicket(isSelected ? "" : item.value)}
                    className={`flex-1 font-semibold p-2 rounded-md transition cursor-pointer
                      ${classes.border} border-[1px]
                      ${isSelected
                        ? `${classes.bg} text-white ${classes.hoverBg}`
                        : `${classes.text} ${classes.hoverLightBg}`
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-5">
            <p className="font-semibold text-lg mb-4">Duration</p>

            <div className="space-y-4">
              {durationOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedDurations.includes(option.value)}
                    onCheckedChange={() => toggleCheckbox(option.value)}
                    className="border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {isUserRole &&
            <>
              <div className="my-5">
                <p className="font-semibold text-lg mb-4">Liked Events</p>

              <div className="flex items-center justify-between gap-3">
                <span className="text-md text-gray-700">Show only liked events</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isLikedEvent}
                  onClick={() => setIsLikedEvent(!isLikedEvent)}
                  className={`relative cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isLikedEvent ? "bg-blue-600" : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isLikedEvent ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>

              </div>

              <div className="my-5">
                <p className="font-semibold text-lg mb-4">Events By Location</p>

                {isDisabled && <div className="text-sm text-red-500 mb-4 italic">*Please enable location to apply below filter</div>}

              <div className="space-y-4">
                {LOCATION_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={option.value === locationRadius}
                      disabled={isDisabled}
                      onCheckedChange={() => setLocationRadius(option.value)}
                      className="border border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <label
                      htmlFor={option.label}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              </div>
            </>
          }

          {/* Content UI End*/}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 p-6">
          <button
            onClick={clearAllFilters}
            className="w-full cursor-pointer px-4 py-2 rounded-[8px] font-bold border border-gray-500 text-gray-700 hover:bg-gray-100"
          >
            Clear All
          </button>
          <button
            onClick={submitFilters}
            className="w-full cursor-pointer px-4 py-2 rounded-[8px] font-bold bg-blue-500 text-white hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
