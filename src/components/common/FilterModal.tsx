"use client";

import React from "react";

// library support
import { XMarkIcon } from "@heroicons/react/24/solid";

// types suppor
import { IFilterModalProps } from "@/utils/types";

const FilterModal: React.FC<IFilterModalProps> = ({
  isOpen,
  onClose,
  applyFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/60 bg-opacity-40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl relative p-6 text-center">
        <div className="flex justify-between items-center border-b-1 py-2 border-b-gray-300">
            <p className="font-bold text-2xl">Filters</p>
            <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer"/>
        </div>

        <div className="h-40">

        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={onClose}
            className="w-full cursor-pointer px-4 py-2 rounded-[12px] font-bold border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            className="w-full cursor-pointer px-4 py-2 rounded-[12px] font-bold bg-blue-500 text-white hover:bg-blue-600"
          >
             Apply Filters 
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
