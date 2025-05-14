/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import Select from 'react-select';
import { ISelectFieldsProps } from '@/app/admin/event/types';
import Image from 'next/image';




const CustomSelectField: React.FC<ISelectFieldsProps> = ({
  label,
  name,
  placeholder,
  value,
  options,
  errorMsg,
  onChange,
  required = false,
  errorKey,
  readOnly = false,
  disabled = false,
}) => {

    const customStyles = {
      control: (base: any, state: any) => ({
        ...base,
        borderColor: state.isFocused
          ? "#3b82f6" // Tailwind blue-500
          : state.selectProps.menuIsOpen
          ? "#3b82f6"
          : state.selectProps.error || errorKey
          ? "#ef4444" // red-500
          : "#d1d5db", // gray-300
        boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
        "&:hover": {
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
        },
        padding: "2px",
        height: "3rem",
        borderRadius: "0.375rem",
        fontSize: "1rem",
        minHeight: "2.5rem",
      }),
      option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected
          ? "#3b82f6"
          : state.isFocused
          ? "#eff6ff"
          : "white",
        color: state.isSelected ? "white" : "#1f2937", // gray-800
        fontSize: "1rem",
      }),
      placeholder: (base: any) => ({
        ...base,
        fontSize: "1rem", // Tailwind's text-md
        fontFamily: "'DM Sans', 'DM Sans Fallback', sans-serif",
        color: "#9ca3af",
      }),
      singleValue: (base: any) => ({
        ...base,
        display: 'flex',
        alignItems: 'center',
      }),
    };

    const optionsData = options.map((item) => ({
      label: item.name,
      value: item._id,
      icon: item.icon?.url || "",
      color: item?.color,
      bgColor: item?.bgColor,
    }));

  const formatOptionLabel = ({ label, icon }: { label: string; icon?: string, color: string, bgColor: string }) => (
    <div className="flex items-center gap-2"
    // style={{ backgroundColor: bgColor, color: color }}
    >
      {icon && (
        <Image
          src={icon}
          alt={label}
          width={16}
          height={16}
          className="object-contain"
        />
      )}
      <span>{label}</span>
    </div>
  );

  // Format the current value to match the options structure
  const formattedValue = optionsData.find(option => option.value === value);

  const handleChange = (selectedOption: any) => {
    onChange(selectedOption ? selectedOption.value : null);
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Select
        value={formattedValue}
        onChange={handleChange}
        options={optionsData}
        placeholder={placeholder}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        isClearable
        isDisabled={disabled || readOnly}
      />
      {errorKey && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  );
};

export default CustomSelectField;
