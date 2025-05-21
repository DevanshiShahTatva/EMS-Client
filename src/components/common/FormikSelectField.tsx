"use client";

import React, { useState, useRef, useEffect } from "react";
import { useField, ErrorMessage } from "formik";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import SearchInput from "./CommonSearchBar";

interface Option {
  label: string;
  value: string | number;
}

interface FormikSelectFieldProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  endIcon?: React.ReactNode;
  searchable? : boolean
}

const FormikSelectField: React.FC<FormikSelectFieldProps> = ({
  name,
  label,
  options,
  placeholder = "Select an option",
  disabled = false,
  endIcon,
  searchable = false
}) => {
  const [field, , helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === field.value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    String(opt.value).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg text-left bg-white focus:outline-none ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isOpen
              ? "border-blue-500"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => {
            if (!disabled) {
              setIsOpen((prev) => !prev);
              setSearch(""); // reset search each open
            }
          }}
        >
          <span className={`${!selected ? "text-gray-400" : ""}`}>
            {selected ? selected.label : placeholder}
          </span>
          {endIcon ? (
            <div className="absolute right-3 top-2.5 text-gray-500">{endIcon}</div>
          ) : (
            <ChevronDownIcon className="w-4 h-4 absolute right-3 top-2.5 text-gray-400" />
          )}
        </button>

        {isOpen && (
          <div className="absolute mt-0.5 z-10 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-64 overflow-auto">
            {searchable && 
            <div>
              <SearchInput
                value={search}
                onChange={(value) => setSearch(value)}
                placeholder="Search"
                wrapperClassName="p-2 border-b border-gray-100 sticky top-0 bg-white z-10"
                inputClassName="w-full px-4 py-2 text-sm"
                hideIcon
              />
            </div>
            }
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 ${
                    field.value === opt.value ? "bg-blue-50 font-medium" : ""
                  }`}
                  onClick={() => {
                    helpers.setValue(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">No results</div>
            )}
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

