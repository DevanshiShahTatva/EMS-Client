'use client';

import React, { useState, useMemo, useEffect } from 'react';

// types
import { ISeatLayout, ITicketInfo } from '@/app/admin/event/types';

// Custom components
import CustomButton from '../common/CustomButton';

// Library
import { Plus, Undo, Redo } from 'lucide-react';

interface Seat {
  id: string;
  row: number;
  col: number;
  type: string;
}

interface Move {
  rows: Seat[][];
}

interface LayoutProps {
  ticketItems: ITicketInfo
  onSave: (layoutArray: ISeatLayout[]) => void
  savedLayout?: ISeatLayout[]
  isEditable? : boolean
}

type SeatInput = {
  category: string;
  row: string;
  seats: {
    seat: string | number;
    isUsed: boolean;
  }[];
};

type SeatOutput = {
  category: string;
  rows: {
    row: string;
    seats: {
      seatNumber: string | number;
      isUsed: boolean;
    }[];
  }[];
};

const transformSeatingData = (input: SeatInput[]): SeatOutput[] => {
  const rowMap = new Map<
    string,
    {
      category: string;
      seats: { seatNumber: string | number; isUsed: boolean }[];
    }
  >();

  input.forEach(({ category, row, seats }) => {
    const key = row;
    const formattedSeats = seats.map((s) => ({
      seatNumber: s.seat.toString(),
      isUsed: s.isUsed,
    }));

    if (category === "Space") {
      if (rowMap.has(key)) {
        rowMap.get(key)!.seats.push(...formattedSeats);
      }
    } else {
      rowMap.set(key, {
        category,
        seats: [...(rowMap.get(key)?.seats || []), ...formattedSeats],
      });
    }
  });

  // Convert to final output format grouped by category
  const categoryMap: Record<
    string,
    {
      row: string;
      seats: { seatNumber: string | number; isUsed: boolean }[];
    }[]
  > = {};

  for (const [row, { category, seats }] of rowMap.entries()) {
    if (!categoryMap[category]) categoryMap[category] = [];
    categoryMap[category].push({ row, seats });
  }

  return Object.entries(categoryMap).map(([category, rows]) => ({
    category,
    rows,
  }));
};



const AddEditSeatLayout: React.FC<LayoutProps> = ({ ticketItems, onSave, savedLayout= [], isEditable = false }) => {
  const [rows, setRows] = useState<Seat[][]>([[]]);
  const [addCount, setAddCount] = useState<number>(1);
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);
  const [history, setHistory] = useState<Move[]>([]);

  const saveToHistory = (newRows: Seat[][]) => {
    setHistory((prev) => [...prev, { rows: JSON.parse(JSON.stringify(rows)) }]);
    setRows(newRows);
  };

  const handleAddRow = () => {
    saveToHistory([...rows, []]);
    setActiveRowIndex(rows.length);
  };

  const handleAddSeats = () => {
    const currentRealSeatCount = rows.reduce(
      (count, row) => count + row.filter((seat) => seat.type !== 'Space').length,
      0
    );
    const remaining = Number(ticketItems.totalSeats) - currentRealSeatCount;

    if (remaining <= 0) return;

    const newRows = [...rows];
    const row = [...newRows[activeRowIndex]];
    const seatsToAdd = Math.min(addCount, remaining);

    for (let i = 0; i < seatsToAdd; i++) {
      row.push({
        id: `${String.fromCharCode(65 + activeRowIndex)}${row.filter(s => s.type !== 'Space').length + 1}`,
        row: activeRowIndex,
        col: row.length,
        type: ticketItems.ticketType,
      });
    }

    newRows[activeRowIndex] = row;
    saveToHistory(newRows);
  };


  const handleAddSpace = () => {
    const newRows = [...rows];
    const row = [...newRows[activeRowIndex]];

    row.push({
      id: '',
      row: activeRowIndex,
      col: row.length,
      type: 'Space',
    });

    newRows[activeRowIndex] = row;
    saveToHistory(newRows);
  };

  const handleRemoveSeat = (rowIndex: number, seatIndex: number) => {
    const newRows = [...rows];
    const newRow = [...newRows[rowIndex]];

    newRow[seatIndex] = {
      ...newRow[seatIndex],
      type: 'Space',
      id: '',
    };

    let seatNumber = 1;
    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i].type !== 'Space') {
        newRow[i].id = `${String.fromCharCode(65 + rowIndex)}${seatNumber++}`;
      } else {
        newRow[i].id = '';
      }
    }

    newRows[rowIndex] = newRow;
    saveToHistory(newRows);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastMove = history[history.length - 1];
    setRows(lastMove.rows);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleSaveLayout = () => {
    const layoutMap: Record<
      string,
      {
        category: string;
        row: string;
        seats: { seat: string | number; isUsed: boolean }[];
      }
    > = {};

    rows.forEach((row, rowIndex) => {
      const rowName = String.fromCharCode(65 + rowIndex);

      let actualCategory = ""; // used to group this row under one actual category (e.g., VIP)

      const seatsForThisRow: { seat: string | number; isUsed: boolean }[] = [];

      row.forEach((seat) => {
        if (seat.type === "Space") {
          seatsForThisRow.push({
            seat: 0,
            isUsed: false,
          });
        } else {
          actualCategory = seat.type; // assume all real seats in this row are of same type
          seatsForThisRow.push({
            seat: seat.id,
            isUsed: true,
          });
        }
      });

      // Only save rows that have real seats
      if (actualCategory) {
        layoutMap[`${actualCategory}-${rowName}`] = {
          category: actualCategory,
          row: rowName,
          seats: seatsForThisRow,
        };
      }
    });

    const layout = Object.values(layoutMap);

    const modifiedArray = transformSeatingData(layout)
    const finalArray: ISeatLayout[] = modifiedArray.map(item => {
      return {
        ticketType : ticketItems.id,
        price: parseInt(ticketItems.ticketPrice),
        rows: item.rows
      }
    }) 

    console.log("first", rows)
    
    onSave(finalArray)
    
  };

  const remainingSeats = useMemo(() => {
    const realSeatsCount = rows.reduce(
      (count, row) => count + row.filter((seat) => seat.type !== 'Space').length,
      0
    );
    return Number(ticketItems.totalSeats) - realSeatsCount;
  }, [rows, ticketItems.totalSeats]);

  useEffect(() => {
    if (isEditable && savedLayout.length > 0) {
      const initialRows: Seat[][] = savedLayout.flatMap((layoutObject) => {
        return layoutObject.rows.map((row) => {
          return row.seats.map((seat, seatIndex) => ({
            id: String(seat.seatNumber),
            row: 0, // You'll need to calculate this based on the savedLayout structure
            col: seatIndex,
            type: String(seat.seatNumber) === '0' ? 'Space' : layoutObject.ticketType, // Or determine the type based on your data
          }));
        });
      });


      const structuredRows: Seat[][] = [];
      savedLayout.forEach((layoutObject) => {
        layoutObject.rows.forEach((rowObject, rowIndex) => {
          const rowName = rowObject.row; // e.g., "A", "B", etc.
          const actualRowIndex = rowName.charCodeAt(0) - 65; // Convert "A" to 0, "B" to 1, etc.

          if (!structuredRows[actualRowIndex]) {
            structuredRows[actualRowIndex] = []; // Initialize the row if it doesn't exist
          }

          rowObject.seats.forEach((seat, seatIndex) => {
            structuredRows[actualRowIndex].push({
              id: String(seat.seatNumber),
              row: actualRowIndex,
              col: seatIndex,
              type: String(seat.seatNumber) === '0' ? 'Space' : layoutObject.ticketType,
            });
          });
        });
      });

      setRows(structuredRows); // Set the structured array of rows to state
      // --- FIX ENDS HERE ---
    } else {
      setRows([[]]); // Initialize with a single empty row
    }
  }, [savedLayout, isEditable, ticketItems.ticketType]);


  return (
    <div className="p-6 space-y-6 mx-auto">

      {/* grid layout */}

      <div className="grid grid-cols-12 gap-8">
        {/* Seat Layout Section (8 columns) */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          <div className='text-xl text-gray-800 font-bold mb-4'>
            Rs. {ticketItems.ticketPrice} - {ticketItems.ticketType}
          </div>

          {rows.map((row, rowIndex) => (
            <div key={rowIndex}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold w-6">
                  {String.fromCharCode(65 + rowIndex)}
                </span>
                <div className="flex gap-2 flex-wrap mt-2">
                  {row.map((seat, seatIndex) => (
                    <div key={seatIndex} className="relative">
                      <div className="w-10 h-10 rounded text-xs flex items-center justify-center border">
                        {seat.id}
                      </div>
                      {seat.type !== 'Space' && (
                        <button
                          onClick={() => handleRemoveSeat(rowIndex, seatIndex)}
                          className="absolute -top-1.5 -right-1.5 text-xs text-white bg-red-600 rounded-full w-4 h-4 flex items-center justify-center z-10 shadow-md"
                          title="Delete Seat"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-gray-300" />
            </div>
          ))}
        </div>

        {/* Info & Action Section (4 columns) */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          {/* Info Section */}
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <label className="block text-lg">Seat Type:</label>
              <input
                value={ticketItems.ticketType}
                className="border px-2 py-1 rounded w-40 bg-gray-200 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>

            <div className="flex gap-4 items-center">
              <label className="block text-lg">Price:</label>
              <input
                value={ticketItems.ticketPrice}
                className="border px-2 py-1 rounded w-40 bg-gray-200 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>

            <div className="flex gap-4 items-center">
              <label className="block text-lg">Total Seats:</label>
              <input
                value={ticketItems.totalSeats}
                className="border px-2 py-1 rounded w-40 bg-gray-200 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>

            <div className="flex gap-4 items-center">
              <label className="block text-lg">Remaining Seats:</label>
              <input
                value={remainingSeats}
                className="border px-2 py-1 rounded w-40 bg-gray-200 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Controls Section */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Seats to Add</label>
              <input
                type="number"
                min={1}
                value={addCount}
                onChange={(e) => setAddCount(Number(e.target.value))}
                className="border px-2 py-1 rounded w-full"
              />
            </div>

            <div>
              <label className="block font-medium">Active Row</label>
              <select
                value={activeRowIndex}
                onChange={(e) => setActiveRowIndex(Number(e.target.value))}
                className="border px-2 py-1 rounded w-full"
              >
                {rows.map((_, index) => (
                  <option key={index} value={index}>
                    {String.fromCharCode(65 + index)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-4">
              <CustomButton variant="primary" className='flex gap-2 items-center' startIcon={<Plus className='h-5 w-5' />} onClick={handleAddSeats}>
                Seats
              </CustomButton>

              <CustomButton onClick={handleAddSpace} className='flex gap-2 items-center' startIcon={<Plus className='h-5 w-5' />} variant="secondary">
                Space
              </CustomButton>

              <CustomButton className='flex gap-2 items-center' startIcon={<Plus className='h-5 w-5' />} onClick={handleAddRow} variant="success">
                 Row
              </CustomButton>

              <CustomButton
                onClick={handleUndo}
                disabled={history.length === 0}
                variant={history.length === 0 ? "disabled" : "warning"}
                className='flex gap-2 items-center' 
                startIcon={<Undo className='h-5 w-5' />}
              >
                Undo
              </CustomButton>

              <CustomButton
                onClick={handleUndo}
                disabled={history.length === 0}
                variant={history.length === 0 ? "disabled" : "warning"}
                className='flex gap-2 items-center' 
                startIcon={<Redo className='h-5 w-5' />}
              >
                Redo
              </CustomButton>

            </div>

            <CustomButton onClick={handleSaveLayout} className='w-full mt-10' variant="primary">
              Save Layout
            </CustomButton>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AddEditSeatLayout;
