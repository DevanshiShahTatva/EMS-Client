"use client";

import React, { useState, useEffect } from "react";

interface IBackendSeat {
  seatNumber: string | number;
  isUsed: boolean;
  _id?: string;
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
            isUsed: seat.isUsed,
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
    <div className="w-full flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-7xl overflow-auto space-y-10">
        {transformedLayouts.map((layout, layoutIndex) => (
          <div
            key={layoutIndex}
            className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white"
          >
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {layout.ticketType} - ₹{layout.ticketPrice}
              </h2>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              {layout.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-4">
                  <div className="w-6 text-right text-sm font-medium text-gray-700">
                    {String.fromCharCode(65 + rowIndex)}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {row.map((seat, seatIndex) => (
                      <div key={seatIndex}>
                        <div
                          className={`
                          w-10 h-10 flex items-center justify-center rounded-md text-xs font-semibold
                          ${seat.type === "Space"
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

        {/* Full-width screen */}
        <div className="w-full  mt-10">
          <div className="w-full h-10 bg-gray-800 rounded-md text-white flex items-center justify-center text-sm font-semibold">
            SCREEN
          </div>
        </div>

        {/* Legend / Marker */}
        <div className="mt-6 flex gap-6 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-md"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
            <span className="text-sm text-gray-700">Not Available</span>
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
