"use client"

import React from "react";
import clsx from "clsx";

type variant = "primary" | "secondary" | "delete" | "outlined";

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
    secondary: "bg-gray-500 hover:bg-gray-600 cursor-pointer rounded-[8px]",
    delete: "bg-red-500 hover:bg-red-600 rounded-[8px] text-white",
    outlined: "border border-gray-500 text-gray-700 hover:bg-gray-100 cursor-pointer rounded-[8px]"
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
