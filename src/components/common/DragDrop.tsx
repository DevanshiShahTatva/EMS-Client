"use client"

import React, { useCallback, useRef, useState } from "react";

interface DragDropFileProps {
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DragDropFile: React.FC<DragDropFileProps> = ({ onFileInputChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const dt = new DataTransfer();
    Array.from(e.dataTransfer.files).forEach((file) => dt.items.add(file));

    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files;

      // Trigger change event
      const changeEvent = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`h-48 flex items-center justify-center mx-auto border-dashed rounded-[12px] border-2 bg-gray-50 hover:bg-gray-100 transition ${
        isDragging ? "border-blue-500" : "border-gray-300"
      }`}
    >
          <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-sm md:text-lg font-semibold text-gray-500">
                  Drag & Drop files or{" "}
                  <label
                      htmlFor="image-upload"
                      className="hover:underline text-blue-500 cursor-pointer"
                  >
                      Click to Upload
                  </label>
              </p>
              <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  ref={fileInputRef}
                  onChange={onFileInputChange}
                  className="hidden"
              />
          </div>
    </div>
  );
};

export default DragDropFile;
