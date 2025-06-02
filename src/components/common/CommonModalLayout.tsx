"use client";

import React from "react";

// library support
import { XMarkIcon } from "@heroicons/react/24/solid";
import CustomButton from "./CustomButton";
import clsx from "clsx";

// types support
type TModalFooterActions = {
  label: string;
  variant : "primary" | "secondary" | "delete" | "outlined";
  onClick?: () => void;
  type?: "button" | "submit"; // optional
  disabled?: boolean 
};

interface ICustomModalProps {
    onClose : () => void
    modalTitle : string,
    children : React.ReactNode,
    footerActions?: TModalFooterActions[]
    maxHeight?: string
}

const ModalLayout: React.FC<ICustomModalProps> = ({
  onClose,
  modalTitle, 
  children,
  footerActions = [],
  maxHeight,
}) => {

    const gridCols =
        footerActions.length === 1 ? "grid-cols-1" : "grid-cols-2";
    const contentMaxHeigh = maxHeight ? `max-h-[${maxHeight}]` : "max-h-96";

  return (
    <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/60 bg-opacity-40 px-8 md:px-0">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl relative">
        {/* Title Section Start */}
        <div className="flex justify-between items-center border-b-1 px-6 py-5 border-b-gray-300">
          <p className="font-bold text-2xl">{modalTitle}</p>
          <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer" />
        </div>
        {/* Title Section End */}

        <div className={clsx(`${contentMaxHeigh} overflow-auto scrollbar-none ${footerActions.length > 0 ? "border-b-1" : "border-none"} px-6 py-0 border-b-gray-300`)}>
          {/* Content UI Start */}
            {children}
          {/* Content UI End*/}
        </div>

        {/* Footer Buttons Start */}
        {footerActions.length > 0 && (
          <div className={`grid ${gridCols} gap-4 p-6`}>
            {footerActions.map((btn, idx) => (
              <CustomButton
                key={idx}
                type={btn.type || "button"}
                onClick={btn.onClick}
                variant={btn.variant}
                className={btn.disabled ? "bg-gray-300 cursor-not-allowed" : "w-full normal-case first-letter:uppercase"}
                disabled={btn.disabled}
              >
                {btn.label}
              </CustomButton>
            ))}
          </div>
        )}
              {/* Footer Buttons Ends */}
      </div>
    </div>
  );
};

export default ModalLayout;
