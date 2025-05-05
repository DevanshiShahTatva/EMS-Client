'use client';

import { Boxes } from 'lucide-react';
import React from 'react';

interface ChartCardProps {
    title?: string;
    children: React.ReactNode;
}
export const chartTitle = (title: string) => {
    return (
        <div className="mb-6 flex items-center gap-[8px]">
            <Boxes />
            <h2 className="text-xl text-black font-semibold">{title}</h2>
        </div>
    )
}
const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
    return (
        <div className="flex flex-col bg-white p-6 border-2 border-gray-200 rounded-lg w-full shadow-lg">
            {title ? chartTitle(title) : <></>}
            {children}
        </div>
    );
};

export default ChartCard;
