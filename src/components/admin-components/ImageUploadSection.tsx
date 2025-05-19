"use client";

import React from "react";

// Icons
import { TrashIcon } from "@heroicons/react/24/outline";

// Custom components
import DragDropFile from "./../common/DragDrop"; // adjust path if needed

type ImageUploadGridProps = {
  images: (File | { url: string })[];
  onRemoveImage: (index: number) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileError?: string | null;
  formValuesError?: { images: boolean };
  isEditMode?: boolean;
};

const ImageUploadGrid: React.FC<ImageUploadGridProps> = ({
  images,
  onRemoveImage,
  onFileInputChange,
  fileError,
  formValuesError,
  isEditMode = false,
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-700 mb-1">
        Images (Max 3 images allowed, each less than 2 MB.)
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((file, index) => {
          const imageUrl = "url" in file ? file.url : URL.createObjectURL(file);
          return (
            <div
              key={index}
              className="relative h-48 border rounded-lg overflow-hidden shadow"
            >
              <img
                src={imageUrl}
                alt={`preview-${index}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-white cursor-pointer text-red-500 rounded-full p-1 shadow hover:bg-red-100 transition"
              >
                <TrashIcon className="h-3 w-3" />
              </button>
            </div>
          );
        })}

        {images.length < 3 && (
          <div
            className={`h-48 ${
              images.length === 0
                ? "col-span-1 sm:col-span-2 md:col-span-3"
                : images.length === 1
                ? "col-span-1 sm:col-span-1 md:col-span-2"
                : "col-span-1"
            }`}
          >
            <DragDropFile onFileInputChange={onFileInputChange} />
          </div>
        )}
      </div>

      {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}

      {formValuesError?.images && (
        <p className="text-red-500 text-sm mt-1">
          At least one image is required
        </p>
      )}
    </div>
  );
};

export default ImageUploadGrid;
