"use client";
import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface FormikTextFieldProps {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    maxLength?:number;
    endIcon?:React.ReactNode; 
}

const FormikTextField: React.FC<FormikTextFieldProps> = ({
    name,
    label = '',
    type = 'text',
    placeholder = '',
    maxLength ,
    endIcon
}) => {
    return (
        <div>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className='relative'>
            <Field
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all no-spinner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                maxLength={maxLength}
            />
            {endIcon && (
                <div className="absolute right-3 top-[60%] transform -translate-y-[60%]">
                    {endIcon}
                </div>
            )}
            </div>
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-sm mt-1"
            />
        </div>
    );
};

export default FormikTextField;
