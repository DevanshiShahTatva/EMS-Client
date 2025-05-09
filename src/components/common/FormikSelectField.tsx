"use client";
import React from "react";
import { Field, ErrorMessage, useField } from "formik";

interface FormikSelectFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  endIcon?: React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  rows?: number;
  options: { label: string; value: string | number }[];
}

const FormikSelectField: React.FC<FormikSelectFieldProps> = ({
  name,
  label = "",
  type = "text",
  placeholder = "",
  maxLength,
  endIcon,
  readOnly = false,
  disabled = false,
  rows,
  options,
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Field
          {...field}
          as="select"
          type={type}
          name={name}
          id={name}
          rows={rows}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border disabled:bg-gray-100 disabled:text-gray-500
                    ${
                      hasError
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } 
                      rounded-lg focus:outline-none focus:ring-1 appearance-none
                    outline-none transition-all no-spinner [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Field>
        {endIcon && (
          <div className="absolute right-3 top-[55%] transform -translate-y-[60%]">
            {endIcon}
          </div>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default FormikSelectField;
