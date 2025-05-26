"use client";

import React, { useState, useEffect, useMemo } from "react";
import { XIcon } from "lucide-react";
import { apiCall } from "@/utils/services/request";
import { API_ROUTES } from "@/utils/constant";
import ModalLayout from "../common/CommonModalLayout";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  eventDetails: any; // Add event details prop
}

const CancelTicketModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  eventDetails,
}) => {
  if (!isOpen) return null;

  const [charge, setCharge] = useState<number>(0);

  useEffect(() => {
    const fetchChargeInfo = async () => {
      const res = await apiCall({
        method: "GET",
        endPoint: API_ROUTES.ADMIN.CANCEL_CHARGE,
      });
      if (res.success) {
        setCharge(res.data.charge);
      }
    };

    fetchChargeInfo();
  }, []);

  const taxCharge = useMemo(
    () => (charge / 100) * eventDetails.eventTicketPrice,
    [charge]
  );

  const refundAmount =  Math.trunc(eventDetails.eventTicketPrice - taxCharge);
  const totalPaid = eventDetails.eventTicketPrice;

  return (
    <div>
        <ModalLayout
          onClose={onClose}
          modalTitle="Cancel Ticket"
          maxHeight="410px"
          footerActions={[
            { label: "Cancel", onClick: () => onClose(), variant: "outlined" },
            { label: isSubmitting ? "Cancelling" : "Confirm", onClick: () => onSubmit(), variant: "delete" }
          ]}
        >
          <div className="space-y-4">
            {/* Event Details */}
            <div className="border-b pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                <div className="space-y-1">
                  <p className="text-gray-600">Event</p>
                  <p className="text-gray-900 font-medium">
                    {eventDetails.eventName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-600">Date & Time</p>
                  <p className="text-gray-900">{eventDetails.eventStartTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-600">Location</p>
                  <p className="text-gray-900">{eventDetails.eventLocation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-600">Ticket Type</p>
                  <p className="text-gray-900">
                    {eventDetails.eventTicketType} (
                    {eventDetails.eventTicketCount}x)
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Information */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">Refund Details</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-700">Total Paid:</span>
                  <span className="text-red-900 font-medium">₹{totalPaid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Platform Fees:</span>
                  <span className="text-red-900 font-medium">
                    ₹{taxCharge.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Refund Amount:</span>
                  <span className="text-red-900 font-medium">
                    ₹{refundAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-red-700 text-xs mt-2">
                  *Refunds will be processed within 7-10 business days to your
                  original payment method. Service fees may not be refundable.
                </p>
              </div>
            </div>

            {/* Booking Information */}
            <div className="text-sm mb-2">
              <p className="text-gray-600">
                Booked on: {eventDetails.eventBookedOn}
              </p>
            </div>
          </div>
        </ModalLayout>
    </div>
  );
};

export default CancelTicketModal;
