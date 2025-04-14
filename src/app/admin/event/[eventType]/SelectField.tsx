"use client";

import React from 'react';
import Select from 'react-select';
import { OptionType } from './helper';



type SelectFieldsProps = {
  label: string;
  name: string;
  errorKey : boolean;
  options :  any[];
  value: OptionType | null;
  onChange: (option: OptionType | null) => void;
  placeholder?: string;
  errorMsg?: string;
  required?: boolean;
  readOnly?:boolean;
  disabled?:boolean;
};

const CustomSelectField: React.FC<SelectFieldsProps> = ({
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
        fontSize: "0.875rem",
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
        fontSize: "0.875rem",
      }),
    };

    const optionsData = options.map((item) => ({
      label: `${item.icon} ${item.label}`,
      value: item.value,
      icon: item.icon,
    }));
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Select
        value={value}
        onChange={onChange}
        options={optionsData}
        placeholder={placeholder}
        styles={customStyles}
        isClearable
      />
      {errorKey && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  );
};

export default CustomSelectField;
