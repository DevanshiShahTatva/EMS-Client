"use client";
import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface FormikTextFieldProps {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
}

const FormikTextField: React.FC<FormikTextFieldProps> = ({
    name,
    label = '',
    type = 'text',
    placeholder = ''
}) => {
    return (
        <div>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <Field
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-sm mt-1"
            />
        </div>
    );
};

export default FormikTextField;
