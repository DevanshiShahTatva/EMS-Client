import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React from 'react';

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode
    placeholder?: string;
    inputClassName?: string; // custom input styling
    wrapperClassName?: string; // custom wrapper styling
    iconPositionClassName?: string;
    hideIcon? : boolean
};

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = 'Search...',
    inputClassName,
    wrapperClassName,
    icon,
    iconPositionClassName,
    hideIcon = false
}) => {
    return (
        <div className={clsx('relative w-full', wrapperClassName)}>
            {!hideIcon && (
                <div className={clsx(
                    'absolute',
                    icon ? iconPositionClassName : 'left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                )}>
                    {icon ?? <MagnifyingGlassIcon className="h-6 w-6" />}
                </div>
            )}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={clsx(
                    'border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    inputClassName
                )}
            />
        </div>
    );
};

export default SearchInput;
