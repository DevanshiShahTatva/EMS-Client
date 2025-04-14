"use client";

import React from "react";

type TextFieldProps = {
  label: string;
  name: string;
  errorKey : boolean;
  type?: string;
  placeholder?: string;
  value: string;
  errorMsg?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  required?: boolean;
  readOnly?:boolean;
  disabled?:boolean;
  multiple?: boolean;
};

const CustomTextField: React.FC<TextFieldProps> = ({
  label,
  name,
  placeholder,
  value,
  errorMsg,
  onChange,
  onBlur,
  required = false,
  errorKey,
  type = "text",
  readOnly = false,
  disabled = false,
  multiple = false
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        disabled={disabled}
        multiple={multiple}
        className={`
          block w-full rounded-md px-4 py-2 text-md h-12
          placeholder-gray-400 border transition-all
          ${errorKey
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}
          focus:outline-none focus:ring-1
        `}
      />
      {errorKey && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  );
};

export default CustomTextField;
