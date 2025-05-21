'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  allowedTypes: string[];
  handleNext: () => void;
  handlePrev: () => void;
  onChange: (filter: string) => void;
}

export default function CalenderDropdown({
  title,
  onChange,
  handleNext,
  handlePrev,
  allowedTypes,
}: Readonly<Props>) {
  const [value, setValue] = useState("dayGridMonth");

  useEffect(() => {
    onChange("dayGridMonth");
  }, []);

  const onValueChange = (value: string) => {
    setValue(value);
    onChange(value);
  }

  return (
    <div className='flex justify-between items-center mb-5'>
      <p className="text-sm mb-1">
        <h1 className="text-2xl font-bold">My Calendar</h1>
        <p className="text-gray-600">{title}</p>
      </p>
      <div className="flex text-black gap-2 items-center">
        {allowedTypes.length > 0 && (
          <Select
            value={value}
            onValueChange={onValueChange}
            disabled={allowedTypes.length === 1}
          >
            <SelectTrigger className="w-[150px] focus:outline-none focus:ring-0 focus:ring-offset-0 border-gray-300">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="listWeek">List View</SelectItem>
              <SelectItem value="timeGridWeek">Week View</SelectItem>
              <SelectItem value="dayGridMonth">Month View</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            title="Previous"
            className="bg-black text-white hover:bg-black/90 disabled:opacity-50 h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </Button>
          <Button
            size="sm"
            title="Next"
            className="bg-black text-white hover:bg-black/90 disabled:opacity-50 h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}