import React from "react";

import { XMarkIcon } from "@heroicons/react/24/solid";

type CommonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  fullScreen?: boolean;
};

const SeatingModal: React.FC<CommonModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  fullScreen = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative bg-white rounded-lg shadow-lg overflow-auto ${
          fullScreen
            ? "w-full h-full"
            : "w-[90%] max-w-2xl max-h-[90vh] p-6"
        }`}
      >
        {/* Close Button */}
              <div className="flex justify-between items-center border-b-1 px-6 py-5 border-b-gray-300">
                 {title && <p className="font-bold text-2xl">{title}</p>}
                  <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer" />
              </div>

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default SeatingModal;
