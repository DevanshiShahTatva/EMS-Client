"use client";

import React from "react";

// Types Support
import { IDisabledTextFieldProps } from "@/app/admin/contact-us/types";

const DisabledTextField: React.FC<IDisabledTextFieldProps> = ({
  label,
  name,
  value,
  type,
}) => {
  return (
      <div className="my-4">
          <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-1">
              {label}
          </label>
          {type === "textarea" ?
              <textarea
                  id={name}
                  name={name}
                  value={value}
                  rows={5}
                  readOnly
                  disabled
                  className={`block w-full disabled:bg-gray-100 bg-[#f8f8f8] font-normal cursor-not-allowed rounded-md px-4 py-2 text-md border transition-all border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1`}

              />
              :
              <input
                  id={name}
                  name={name}
                  type={type}
                  value={value}
                  readOnly
                  disabled
                  className={`block w-full disabled:bg-gray-100 bg-[#f8f8f8] font-normal cursor-not-allowed rounded-md px-4 py-2 text-md h-12 border transition-all border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1`}
              />
          }
          
          
      </div>
  );
};

export default DisabledTextField;
