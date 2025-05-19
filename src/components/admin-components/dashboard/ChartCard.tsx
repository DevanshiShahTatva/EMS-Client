'use client';

import TooltipWrapper from '@/components/common/TooltipWrapper';
import { Boxes, BadgeHelp } from 'lucide-react';
import React from 'react';
interface ChartCardProps {
    title?: string;
    children: React.ReactNode;
    tooltip?: string
}
export const chartTitle = (title: string, tooltip?: string) => {
    return (
        <div className="px-6 py-4 bg-blue-100 rounded-tl-lg rounded-tr-lg w-full">
            <div className='flex items-center gap-2'>
                <Boxes className='text-gray-700' />
                <h2 className="text-lg font-bold text-gray-700 ">
                    {title}
                </h2>
                {tooltip && (
                    <TooltipWrapper tooltip={tooltip}>
                        <BadgeHelp size={16} className='cursor-pointer text-gray-400 hover:text-gray-600' />
                    </TooltipWrapper>
                )}
            </div>
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

interface CardWithTitleProps {
    title?: string;
    children: React.ReactNode;
    tooltip?: string
}
export const CardWithTitle: React.FC<CardWithTitleProps> = ({ title, children, tooltip }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg w-full">
            {title ? chartTitle(title, tooltip) : <></>}
            <div className='px-6 pb-6'>
                {children}
            </div>
        </div>
    );
};
interface CardTitleProps {
    title: string;
    right?: React.ReactNode;
    tooltip?: string
}
export const CardTitle: React.FC<CardTitleProps> = ({ title, right, tooltip }) => {
    return (
        <div className="px-6 py-4 bg-blue-100 rounded-tl-lg rounded-tr-lg flex justify-between items-center">
            <div className='flex items-center gap-2'>
                <Boxes className='text-gray-700' />
                <h2 className="text-lg text-gray-700 font-bold">
                    {title}
                </h2>
                {tooltip && (
                    <TooltipWrapper tooltip={tooltip}>
                        <BadgeHelp size={16} className='cursor-pointer text-gray-400 hover:text-gray-600' />
                    </TooltipWrapper>
                )}
            </div>
            {right ? right : <></>}
        </div>
    );
};
export default ChartCard;
