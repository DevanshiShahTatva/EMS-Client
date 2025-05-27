"use client";

import { useState } from "react";
import moment from "moment";
import {
  Tooltip, TooltipContent, TooltipTrigger
} from "@/components/ui/tooltip";
import { IVoucher } from "./types";

const statusColor: Record<string, string> = {
  "Available": "bg-blue-500",
  "Expired": "bg-pink-500",
  "Used": "bg-teal-600",
};

const badgeColors: Record<string, string> = {
  Bronze: "#cd7f32",
  Silver: "#c0c0c0",
  Gold: "#ffd700",
};

const VoucherItem = ({ voucher }: { voucher: IVoucher }) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  let status = "Available";
  if (voucher.used) {
    status = "Used";
  } else if (moment(voucher.expireTime).isBefore(moment())) {
    status = "Expired";
  }

  const isExpired = status === "Expired" || status === "Used";
  const badgeType = voucher.percentage === 25 ? "Silver" : "Gold";

  const getTimeLeft = (date: string) => {
    const now = moment();
    const target = moment(date);

    const diffInMs = target.diff(now);

    if (diffInMs <= 0) return "Expired";

    const diffInMinutes = target.diff(now, 'minutes');
    const diffInHours = target.diff(now, 'hours');
    const diffInDays = target.diff(now, 'days');

    if (diffInDays > 0) {
      return `${diffInDays} DAY${diffInDays > 1 ? 'S' : ''} LEFT`;
    } else if (diffInHours > 0) {
      return `${diffInHours} HOUR${diffInHours > 1 ? 'S' : ''} LEFT`;
    } else {
      return `${diffInMinutes} MINUTE${diffInMinutes > 1 ? 'S' : ''} LEFT`;
    }
  };

  const handleCopy = (expired: boolean, promoCode: string) => {
    if (expired) return;

    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setOpen(true);

    setTimeout(() => {
      setOpen(false);
      setTimeout(() => setCopied(false), 300);
    }, 2000);
  };

  return (
    <div className={`flex rounded-lg border bg-white transition-transform duration-80 ${isExpired ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[104%]'}`}>
      <div className={`text-white w-13 flex items-center justify-center relative rounded-l-lg ${statusColor[status]}`}>
        <div className="text-md font-bold rotate-[-90deg] whitespace-nowrap tracking-wider">% DISCOUNT</div>
        {[22, 39, 56, 73].map((top, i) => (
          <div
            key={`${i + 1}`}
            className="absolute left-0 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${top}%` }}
          />
        ))}
      </div>
      <div className="p-4 flex-1 rounded-r-lg hover:shadow-lg">
        <div className="flex items-center space-x-3">
          <svg width="25" height="25" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill={badgeColors[badgeType]}></circle>
            <polygon fill="white" points="50,15 58,38 82,38 62,54 70,77 50,62 30,77 38,54 18,38 42,38"></polygon>
          </svg>
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger
              onClick={() => handleCopy(isExpired, voucher.promoCode)}
              className={`text-md font-bold ${isExpired ? 'text-gray-400 line-through cursor-not-allowed' : 'text-gray-800 cursor-pointer hover:underline'}`}
            >
              {voucher.promoCode}
            </TooltipTrigger>
            {!isExpired && (
              <TooltipContent>
                <p className="text-white font-bold">
                  {copied ? "Copied!" : "Copy to clipboard"}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
        <p className="text-gray-500 text-sm mt-2">{voucher.description}</p>
        <div className="flex items-center text-red-500 text-xs font-semibold mt-2 space-x-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 1m6-1a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{getTimeLeft(voucher.expireTime)}</span>
        </div>
        <div className="border-t-2 border-dashed mt-3 pt-3 flex items-center space-x-2">
          <span className="font-bold text-gray-800">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoucherItem;