"use client";

import { IDeleteModalProps } from "@/utils/types";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Trash2 } from "lucide-react"
import React from "react";
import CustomButton from "./CustomButton";


const DeleteModal: React.FC<IDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  description = "Are you sure you want to delete it?",
  loading = false,
  confirmLoading = false
}) => {
  if (!isOpen || loading) return null;

  return (
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] overflow-auto before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative z-10">

        <XMarkIcon onClick={onClose} className="w-6 h-6 cursor-pointer shrink-0 fill-black float-right" />

        <div className="mt-6 mb-2 text-center">
          <Trash2  className="w-20 h-20 text-red-500 inline"/>

          <h4 className="text-slate-900 text-base font-medium my-6">
            {description}
          </h4>

         {/* Buttons */}
        <div className="flex justify-center gap-3 space-x-2">
          <CustomButton
            variant="outlined"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={onConfirm}
            disabled={confirmLoading}
            variant="delete"
            className="w-full"
          >
              {confirmLoading ? "Deleting..." : "Delete"}
          </CustomButton>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
