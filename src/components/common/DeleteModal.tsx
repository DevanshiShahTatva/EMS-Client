"use client";

import { IDeleteModalProps } from "@/utils/types";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";
import React from "react";


const DeleteModal: React.FC<IDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this event? This action cannot be undone.",
  loading = false
}) => {
  if (!isOpen || loading) return null;

  return (
    <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/60 bg-opacity-40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl relative p-6 text-center">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 font-bold text-black cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Trash icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <TrashIcon className="h-10 w-10 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>

        {/* Description */}
        <p className="text-sm font-semibold text-gray-600 mb-6">{description}</p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full cursor-pointer px-4 py-2 rounded-[8px] font-bold border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full cursor-pointer px-4 py-2 rounded-[8px] font-bold bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
