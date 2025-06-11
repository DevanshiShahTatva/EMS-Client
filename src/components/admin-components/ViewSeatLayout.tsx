"use client"

import React, { useState, useEffect } from 'react';
interface IBackendSeat {
  seatNumber: string | number; // Allowing for '0' as string or actual numbers
  isUsed: boolean;
  _id?: string; // Mongoose adds this automatically
}
interface IBackendRow {
  row: string;
  seats: IBackendSeat[];
  _id?: string; // Mongoose adds this automatically
}

interface IBackendSeatLayout {
  ticketType: string; // Assuming ObjectId comes as a string for ref display
  price: number;
  rows: IBackendRow[];
  _id?: string; // Optional if this is the top-level document ID
}
interface IFrontendSeat {
  id: string; // Mapped from seatNumber, always a string for display
  isUsed: boolean;
  type: 'Space' | 'Seat'; // Explicitly define possible types
  originalId: string; // Storing the backend _id
}

type IFrontendRows = IFrontendSeat[][];
interface ViewSeatLayoutProps {
  seatLayoutDataFromProps: IBackendSeatLayout[] | null; // It's an array of IBackendSeatLayout, or null initially
}

interface ITransformedLayout {
  ticketType: string;
  ticketPrice: number;
  rows: IFrontendRows;
}

const ViewSeatLayout: React.FC<ViewSeatLayoutProps> = ({ seatLayoutDataFromProps }) => {
  
  const [transformedLayouts, setTransformedLayouts] = useState<ITransformedLayout[]>([]);

  useEffect(() => {
    if (seatLayoutDataFromProps && seatLayoutDataFromProps.length > 0) {
      const allTransformedLayouts: ITransformedLayout[] = seatLayoutDataFromProps.map((layoutObject: IBackendSeatLayout) => {
        const transformedRows: IFrontendRows = layoutObject.rows.map((row: IBackendRow) => {
          return row.seats.map((seat: IBackendSeat) => ({
            id: String(seat.seatNumber), // Ensure it's always a string for display
            isUsed: seat.isUsed,
            type: String(seat.seatNumber) === '0' ? 'Space' : 'Seat',
            originalId: seat?._id || "" // Handle potential undefined _id
          }));
        });

        return {
          ticketType: layoutObject.ticketType,
          ticketPrice: layoutObject.price,
          rows: transformedRows,
        };
      });
      setTransformedLayouts(allTransformedLayouts);
    } else {
      setTransformedLayouts([]); // Reset if no data
    }
  }, [seatLayoutDataFromProps]);

  if (!transformedLayouts || transformedLayouts.length === 0) {
    return <div className="text-center text-gray-500">Loading seat layout...</div>;
  }

  return (
    <div className="flex justify-center w-full py-4">
      <div className="space-y-8 w-full max-w-7xl"> {/* Added max-width for better centering on large screens */}
        {transformedLayouts.map((layout, layoutIndex) => (
          <div key={layoutIndex} className="bg-white p-4 rounded-lg shadow-md">
            <div className='text-xl text-gray-800 font-bold mb-4'>
              Rs. {layout.ticketPrice} - {layout.ticketType}
            </div>

            {layout.rows.map((row: IFrontendSeat[], rowIndex: number) => (
              <div key={rowIndex}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold w-6">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {row.map((seat: IFrontendSeat, seatIndex: number) => (
                      <div key={seatIndex} className="relative">
                        <div
                          className={`w-10 h-10 rounded text-xs flex items-center justify-center border
                            ${seat.isUsed ? 'bg-white' : 'bg-gray-50 opacity-25'}
                            ${seat.type === 'Space' ? 'border-dashed bg-gray-400 text-gray-400' : 'border-gray-300'}
                          `}
                        >
                          {seat.id === '0' ? '' : seat.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <hr className="border-gray-300" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewSeatLayout;