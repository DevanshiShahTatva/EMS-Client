"use client";

import { ICannotDeleteModalProps } from "@/utils/types";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Circle, Trash2 } from "lucide-react";
import React from "react";
import CustomButton from "../common/CustomButton";
import Link from "next/link";
import { formatDate } from "date-fns";

const CannotDeleteModal: React.FC<ICannotDeleteModalProps> = ({
  isOpen,
  onClose,
  title = "Cannot delete ticket type",
  description = "This ticket is currently linked to the following events.",
  eventList = [],
}) => {
  if (!isOpen) return null;
  console.log(eventList);
  return (
    <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] overflow-auto before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative z-10">
        <XMarkIcon
          onClick={onClose}
          className="w-6 h-6 cursor-pointer shrink-0 fill-black float-right"
        />

        <div className="mt-6 mb-2 text-center">
          <Trash2 className="w-20 h-20 text-red-500 inline" />

          <h4 className="text-slate-900 text-base font-medium my-6">{title}</h4>

          {description && (
            <p className="text-slate-500 text-sm mb-6">{description}</p>
          )}

          {eventList && (
            <div className="flex flex-col gap-2 items-start">
              {eventList.map((event) => (
                <Link key={event._id} href={`/admin/event/${event._id}`} className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-red-500 fill-red-500" /> {event.title} (till{" "}
                  {formatDate(new Date(event.endDateTime), "MMM d, yyyy")})
                </Link>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-3 space-x-2 mt-6">
            <CustomButton
              variant="outlined"
              onClick={onClose}
              className="w-full"
            >
              Close
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CannotDeleteModal;
