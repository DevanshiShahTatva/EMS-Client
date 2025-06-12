import React, { useEffect, useState } from "react";
import ModalLayout from "../CommonModalLayout";
import { apiCall } from "@/utils/services/request";
import clsx from "clsx";
import { SelectSeat } from "@/utils/types";

interface Props {
  eventId: string;
  onClose: () => void;
  ticketType: string | null;
  selectedQty: number;
  onConfirmSeat: (selectedSeats: SelectSeat[]) => void;
}

interface Seat {
  seatNumber: string;
  isBooked: boolean;
  user: any;
  _id: string;
}

interface Row {
  row: string;
  seats: Seat[];
  _id: string;
}

interface TicketType {
  _id: string;
  name: string;
  description: string;
}

interface SeatLayoutSection {
  ticketType: TicketType;
  price: number;
  rows: Row[];
  _id: string;
}

const SeatBookingModal = ({
  eventId,
  onClose,
  ticketType,
  selectedQty,
  onConfirmSeat,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [seatLayout, setSeatLayout] = useState<SeatLayoutSection[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SelectSeat[]>([]);

  useEffect(() => {
    if (eventId) fetchSeatLayout();
  }, []);

  const fetchSeatLayout = async () => {
    try {
      setLoading(true);
      const res = await apiCall({
        method: "GET",
        endPoint: `events/event-seat-layout/${eventId}`,
      });
      if (res.success && res.data.length > 0) {
        setSeatLayout(res.data[0].seatLayout);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seatId: string, seatNumber: string) => {
    const findIsSeatSelected = selectedSeats.find((seat) => seat.id === seatId);
    if (findIsSeatSelected) {
      const updateSeats = selectedSeats.filter((seat) => seat.id === seatId);
      setSelectedSeats(updateSeats);
    } else {
      if (selectedSeats.length < selectedQty) {
        const obj = {
          id: seatId,
          seatNumber: seatNumber,
        };
        const updateSeats = [...selectedSeats, obj];
        setSelectedSeats(updateSeats);
      }
    }
  };

  const renderSeats = (seats: Seat[], ticketId: string) =>
    seats.map((seat, index) => {
      if (seat.seatNumber === "0") {
        return <div key={`gap-${index}`} className="w-8 h-8" />;
      }

      const isSelected = selectedSeats.find(
        (seatItem) => seatItem.id === seat._id
      );
      const isCurrentType = ticketId === ticketType;
      const isSelectable =
        isCurrentType &&
        !seat.isBooked &&
        (isSelected || selectedSeats.length < selectedQty);

      return (
        <button
          key={seat._id}
          disabled={!isSelectable}
          onClick={() => handleSeatSelect(seat._id, seat.seatNumber)}
          className={clsx(
            "w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all",
            {
              "bg-green-500 text-white scale-105": isSelected,
              "bg-gray-200 border border-gray-300 hover:bg-green-400 hover:text-white":
                !seat.isBooked && !isSelected && isSelectable,
              "bg-gray-600 text-white cursor-not-allowed": seat.isBooked,
            }
          )}
        >
          {seat.seatNumber}
        </button>
      );
    });

  const renderLayout = () => (
    <div className="space-y-8 py-4">
      {/* Stage */}
      <div className="text-center mb-6">
        <div className="bg-gradient-to-t from-gray-800 to-gray-700 text-white py-3 px-8 rounded-t-lg mx-auto max-w-md">
          <span className="font-bold tracking-wider">STAGE</span>
        </div>
      </div>

      {/* Seat Sections */}
      <div className="space-y-10">
        {seatLayout.map((section) => (
          <div
            key={section._id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="mb-4 flex gap-2 items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {section.ticketType.name}
              </h3>
              <p className="text-md font-semibold text-indigo-600">
                ₹{section.price.toLocaleString()}
              </p>
            </div>

            <div className="space-y-3">
              {section.rows.map((row) => (
                <div key={row._id} className="flex items-center">
                  <span className="w-8 text-center font-medium text-sm text-gray-600">
                    {row.row}
                  </span>
                  <div className="flex gap-1.5 ml-2">
                    {renderSeats(row.seats, section.ticketType._id)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ModalLayout
      onClose={onClose}
      modalTitle="Select Your Seats"
      maxWidth="max-w-[60vw]"
      footerActions={[
        {
          label: "Cancel",
          onClick: onClose,
          variant: "outlined",
        },
        {
          label: "Confirm Seats",
          onClick: () => {
            console.log("Selected seats:", selectedSeats);
            onConfirmSeat(selectedSeats);
            onClose();
          },
          variant: "primary",
          disabled: selectedSeats.length !== selectedQty,
        },
      ]}
    >
      <div className="py-4">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading seat layout...</p>
          </div>
        ) : seatLayout.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No seating layout available for this event
            </p>
          </div>
        ) : (
          <>
            <div className="">{renderLayout()}</div>

            {/* Legend */}
            <div className="flex justify-center mt-6 space-x-6 text-sm">
              <LegendBox color="bg-green-500" label="Selected" />
              <LegendBox
                color="bg-gray-200 border border-gray-300"
                label="Available"
              />
              <LegendBox color="bg-gray-600" label="Booked" />
            </div>
          </>
        )}
      </div>
    </ModalLayout>
  );
};

const LegendBox = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center">
    <div className={`w-5 h-5 rounded-md mr-2 ${color}`} />
    <span className="text-gray-600">{label}</span>
  </div>
);

export default SeatBookingModal;
