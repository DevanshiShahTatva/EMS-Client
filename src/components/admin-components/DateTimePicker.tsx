"use client";

import DateTimePicker from "react-datetime-picker";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import { IDateTimePickerFieldProps } from "@/app/admin/event/types";



const CustomDateTimePicker: React.FC<IDateTimePickerFieldProps> = ({
  label,
  name,
  value,
  onChange,
  errorMsg,
  errorKey = false,
  onBlur,
  required = false,
  disabled = false,
  minDate = new Date()
}) => {
  return (
    <div className="flex flex-col gap-1 w-full mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <DateTimePicker
        onChange={onChange}
        value={value}
        format="y-MM-dd h:mm a"
        minDate={minDate}
        onCalendarClose={onBlur}
        calendarIcon={null}
        clearIcon={null}
        disabled={disabled}
        className={`
          block w-full rounded-md px-4 py-2 text-md h-12
          border transition-all
          ${errorKey ? "border-red-500" : "border-gray-300"}
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          focus:outline-none
        `}
      />

      {errorMsg && errorKey && (
        <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
      )}
    </div>
  );
};

export default CustomDateTimePicker;
