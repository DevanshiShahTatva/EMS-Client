"use client";

import React, { useState, useEffect } from "react";

interface IBackendSeat {
  seatNumber: string | number;
  isUsed: boolean;
  _id?: string;
  isBooked?: boolean
}

interface IBackendRow {
  row: string;
  seats: IBackendSeat[];
  _id?: string;
}

interface IBackendSeatLayout {
  ticketType: string;
  price: number;
  rows: IBackendRow[];
  _id?: string;
}

interface IFrontendSeat {
  id: string;
  isUsed: boolean;
  type: "Space" | "Seat";
  originalId: string;
}

type IFrontendRows = IFrontendSeat[][];

interface ViewSeatLayoutProps {
  seatLayoutDataFromProps: IBackendSeatLayout[] | null;
}

interface ITransformedLayout {
  ticketType: string;
  ticketPrice: number;
  rows: IFrontendRows;
}

const ViewSeatLayout: React.FC<ViewSeatLayoutProps> = ({
  seatLayoutDataFromProps,
}) => {
  const [transformedLayouts, setTransformedLayouts] = useState<ITransformedLayout[]>([]);

  useEffect(() => {
    if (seatLayoutDataFromProps && seatLayoutDataFromProps.length > 0) {
      const allTransformedLayouts: ITransformedLayout[] = seatLayoutDataFromProps.map((layoutObject) => {
        const transformedRows: IFrontendRows = layoutObject.rows.map((row) =>
          row.seats.map((seat) => ({
            id: String(seat.seatNumber),
            isUsed: seat.isBooked ? false : true,
            type: String(seat.seatNumber) === "0" ? "Space" : "Seat",
            originalId: seat._id || "",
          }))
        );

        return {
          ticketType: layoutObject.ticketType,
          ticketPrice: layoutObject.price,
          rows: transformedRows,
        };
      });

      setTransformedLayouts(allTransformedLayouts);
    } else {
      setTransformedLayouts([]);
    }
  }, [seatLayoutDataFromProps]);

  if (!transformedLayouts || transformedLayouts.length === 0) {
    return <div className="text-center text-gray-500 py-10">Loading seat layout...</div>;
  }

  return (
    <div className="w-full flex justify-center py-8 px-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg border border-gray-200 p-6 flex flex-col gap-6">
        {/* Scrollable Layout */}
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
          {transformedLayouts.map((layout, layoutIndex) => (
            <div key={layoutIndex} className="mb-10">
              {/* Section Title */}
              <h2 className="text-center text-lg font-bold text-gray-700 mb-4">
                {layout.ticketType} - ₹{layout.ticketPrice}
              </h2>

              {/* Seat Rows */}
              <div className="flex flex-col gap-4">
                {layout.rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center gap-4 w-full"
                  >
                    {/* Row Label */}
                    <div className="w-6 text-right text-sm font-medium text-gray-600">
                      {String.fromCharCode(65 + rowIndex)}
                    </div>

                    {/* Centered Seats */}
                    <div className="flex-1 flex justify-center gap-2 flex-wrap">
                      {row.map((seat, seatIndex) => (
                        <div key={seatIndex}>
                          <div
                            className={`
                          w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md text-xs font-semibold
                          ${
                            seat.type === "Space"
                              ? "bg-transparent border border-dashed border-gray-400 text-gray-400"
                              : seat.isUsed
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }
                        `}
                          >
                            {seat.id === "0" ? "" : seat.id}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* STAGE */}
        <div className="w-full flex justify-center">
          <div className="bg-gradient-to-b from-gray-800 to-gray-700 text-white font-bold text-sm rounded-t-2xl w-1/2 h-15 flex items-center justify-center shadow">
            STAGE/SCREEN
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 items-center flex-wrap justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-md"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
            <span className="text-sm text-gray-700">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-dashed border-gray-400 rounded-md"></div>
            <span className="text-sm text-gray-700">Empty Space</span>
          </div>
        </div>
      </div>
    </div>
  );


};

export default ViewSeatLayout;
