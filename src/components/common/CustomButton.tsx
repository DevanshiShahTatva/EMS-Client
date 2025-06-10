"use client"

import React from "react";
import clsx from "clsx";

type variant = "primary" | "secondary" | "delete" | "outlined" | "disabled" | "success" | "warning";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: variant;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  startIcon,
  endIcon,
  children,
  className,
  ...props
}) => {
  const baseClasses = "px-4 py-2 font-bold transition duration-200";
  const typeClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-[8px] text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 cursor-pointer rounded-[8px] text-white",
    success: "bg-green-600 hover:bg-green-700 cursor-pointer rounded-[8px] text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 cursor-pointer rounded-[8px] text-white",
    delete: "bg-red-500 hover:bg-red-600 rounded-[8px] text-white cursor-pointer",
    outlined: "border border-gray-500 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-[8px]",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed rounded-[8px]"
  };

  return (
    <button
      className={clsx(baseClasses, typeClasses[variant], className)}
      {...props}
    >
      {startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </button>
  );
};

export default CustomButton;
