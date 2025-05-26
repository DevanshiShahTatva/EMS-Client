import React from "react";

// Library
import Select from "react-select";

// Constant 
import { PAGINATION_OPTIONS } from "@/utils/constant";

interface PaginationProps {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
}


const getPaginationRange = (current: number, total: number) => {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let l: number;
  let r: number;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  l = Math.max(2, current - delta);
  r = Math.min(total - 1, current + delta);

  if (l > 2) {
    rangeWithDots.push(1, "...");
  } else {
    rangeWithDots.push(1);
  }

  for (let i = l; i <= r; i++) {
    rangeWithDots.push(i);
  }

  if (r < total - 1) {
    rangeWithDots.push("...", total);
  } else {
    rangeWithDots.push(total);
  }

  return rangeWithDots;
};

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between p-4 flex-wrap gap-4">
      <span className="text-sm font-medium">Total items: {totalItems}</span>

      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrev}
          className="px-2 py-1 text-sm rounded border hover:bg-gray-200"
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {paginationRange.map((page, index) =>
          typeof page === "string" ? (
            <span key={`dots-${index}`} className="px-2 text-sm text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-sm rounded border ${
                currentPage === page
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={handleNext}
          className="px-2 py-1 text-sm rounded border hover:bg-gray-200"
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap hidden md:block">
          per page:
        </span>
        <Select
          menuPlacement="top"
          options={PAGINATION_OPTIONS}
          defaultValue={PAGINATION_OPTIONS.find(
            (opt) => opt.value === itemsPerPage
          )}
          onChange={(option) => {
            if (option) {
              onItemsPerPageChange(option.value);
              onPageChange(1);
            }
          }}
          className="w-20 text-sm"
          isSearchable={false}
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: "32px",
              height: "32px",
            }),
            indicatorsContainer: (provided) => ({
              ...provided,
              height: "32px",
            }),
            valueContainer: (provided) => ({
              ...provided,
              height: "32px",
              padding: "0 6px",
            }),
            input: (provided) => ({
              ...provided,
              margin: 0,
              padding: 0,
            }),
            singleValue: (provided) => ({
              ...provided,
              fontSize: "0.875rem",
            }),
          }}
        />
      </div>
    </div>
  );
};

export default Pagination;
