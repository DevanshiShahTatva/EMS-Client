"use client";

import React from "react";
import { XIcon } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  eventDetails: any; // Add event details prop
}

const CancelTicketModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  eventDetails,
}) => {
  if (!isOpen) return null;

  // Calculate refund amount (example: 90% refund policy)
  const refundAmount = eventDetails.eventTicketPrice;
  const totalPaid = eventDetails.eventTicketPrice;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <XIcon className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Cancel Ticket
        </h2>

        <div className="space-y-4">
          {/* Event Details */}
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900 mb-2">Event Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
          <div className="text-sm">
            <p className="text-gray-600">
              Booked on: {eventDetails.eventBookedOn}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelTicketModal;
