import React, { useRef, useState, useEffect } from 'react';
import { useField, ErrorMessage } from 'formik';

// icons
import { PencilSquareIcon } from "@heroicons/react/24/outline"



interface Props {
    name: string;
    defaultImage?: string;
    label?: string
}

const FormikFileUpload: React.FC<Props> = ({ name, defaultImage, label = "" }) => {
    const [field, , helpers] = useField(name);
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            helpers.setValue(file);

            // Generate preview URL
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    };

    const handleImageClick = () => {
        inputRef.current?.click();
    };

    // Cleanup URL object on unmount or file change
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div className='my-4'>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-3">
                    {label}
                </label>
            )}
            <div className='relative'>
                <div
                    className="w-40 h-40 rounded-full overflow-hidden cursor-pointer border border-gray-900 flex items-center justify-center"
                >
                    <img
                        src={previewUrl || defaultImage}
                        alt="Upload"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Edit Icon */}
                <div className="absolute top-25 left-33 rounded-full p-2 bg-blue-500 cursor-pointer">
                    <PencilSquareIcon className="w-5 h-5 text-white font-bold" onClick={handleImageClick} />
                </div>
            </div>
            

            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                ref={inputRef}
                className="hidden"
            />

            <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
        </div>
    );
};

export default FormikFileUpload;
