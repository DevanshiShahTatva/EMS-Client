"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  tooltip: string;
  children: React.ReactNode;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltip,
  children,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-block">{children}</div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-white">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipWrapper;
