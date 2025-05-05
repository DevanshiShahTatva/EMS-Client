'use client';

import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type FilterType = 'overall' | 'monthly' | 'yearly';

interface FilterValue {
    type: FilterType;
    value: string;
}

interface Props {
    onChange: (filter: FilterValue) => void;
    allowedTypes?: FilterType[];
    initialType?: FilterType;
    initialValue?: string;
}

export default function DateRangeFilter({
    onChange,
    allowedTypes = ['overall', 'yearly', 'monthly'],
    initialType,
    initialValue,
}: Props) {
    const now = moment();

    const defaultType = useMemo(() => (
        initialType && allowedTypes.includes(initialType) ? initialType : allowedTypes[0]
    ), [initialType, allowedTypes]);

    const defaultValue = useMemo(() => {
        if (initialValue) return initialValue;
        if (defaultType === 'monthly') return now.format('YYYY-MM');
        if (defaultType === 'yearly') return now.format('YYYY');
        return 'all';
    }, [defaultType, initialValue, now]);

    const [type, setType] = useState<FilterType>(defaultType);
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        onChange({ type, value });
    }, [type, value, onChange]);

    const format = type === 'monthly' ? 'YYYY-MM' : 'YYYY';
    const current = moment(value, format);

    const handleChangeType = (val: FilterType) => {
        setType(val);
        if (val === 'monthly') {
            setValue(moment().format('YYYY-MM'));
        } else if (val === 'yearly') {
            setValue(moment().format('YYYY'));
        } else {
            setValue('all');
        }
    };

    const handlePrev = () => {
        if (type === 'monthly') {
            setValue(current.subtract(1, 'month').format('YYYY-MM'));
        } else if (type === 'yearly') {
            setValue(current.subtract(1, 'year').format('YYYY'));
        }
    };

    const handleNext = () => {
        if (type === 'monthly') {
            setValue(current.add(1, 'month').format('YYYY-MM'));
        } else if (type === 'yearly') {
            setValue(current.add(1, 'year').format('YYYY'));
        }
    };

    const isPrevDisabled = type === 'overall';
    const isNextDisabled = type === 'overall' || current.isSameOrAfter(now, type === 'monthly' ? 'month' : 'year');

    const displayValue = type === 'overall'
        ? 'All Time'
        : type === 'monthly'
            ? moment(value).format('MMMM YYYY')
            : value;

    return (
        <div>
            <p className="text-sm mb-1 font-bold">
                Filter By:
                <span className="ml-2 text-md text-black">{displayValue}</span>
            </p>

            <div className="flex text-black gap-2 items-center">
                {allowedTypes.length > 0 && (
                    <Select
                        value={type}
                        onValueChange={handleChangeType}
                        disabled={allowedTypes.length === 1}
                    >
                        <SelectTrigger className="w-[150px] focus:outline-none focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Select Range" />
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                            {allowedTypes.includes('monthly') && <SelectItem value="monthly">Monthly</SelectItem>}
                            {allowedTypes.includes('yearly') && <SelectItem value="yearly">Yearly</SelectItem>}
                            {allowedTypes.includes('overall') && <SelectItem value="overall">Overall</SelectItem>}
                        </SelectContent>
                    </Select>
                )}

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        className="bg-black text-white hover:bg-black/90 disabled:opacity-50 h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed"
                        onClick={handlePrev}
                        disabled={isPrevDisabled}
                        title="Previous"
                    >
                        <ChevronLeft className="h-4 w-4 text-white" />
                    </Button>

                    <Button
                        size="sm"
                        className="bg-black text-white hover:bg-black/90 disabled:opacity-50 h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed"
                        onClick={handleNext}
                        disabled={isNextDisabled}
                        title="Next"
                    >
                        <ChevronRight className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
