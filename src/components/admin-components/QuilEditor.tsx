"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { IQuilEditorProps } from "@/app/admin/event/types";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const QuilEditor: React.FC<IQuilEditorProps> = ({
  label,
  value,
  name,
  onChange,
  errorKey,
  errorMsg,
  placeholder,
  handleGenerateDescription,
  isDescriptionGenerating,
  iSGenerateButtonDisabled = false,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <div
        className={
          handleGenerateDescription
            ? "flex flex-row justify-between items-end mb-2"
            : ""
        }
      >
        <label
          htmlFor={name}
          className="block text-sm font-bold text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {handleGenerateDescription && (
          <button
            className="px-4 py-2 bg-amber-300 rounded-lg text-white cursor-pointer disabled:bg-amber-200"
            onClick={() => handleGenerateDescription()}
            disabled={isDescriptionGenerating || iSGenerateButtonDisabled}
          >
            {isDescriptionGenerating ? "Generating.." : "Generate By AI"}
          </button>
        )}
      </div>

      <ReactQuill
        theme="snow"
        placeholder={placeholder}
        className={name === "tc" ? "custom-tc-quill" : "custom-quill"}
        value={value}
        onChange={onChange}
      />

      {errorKey && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  );
};

export default QuilEditor;
