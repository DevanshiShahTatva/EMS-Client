"use client";
import React from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type QuilEditorProps = {
  label: string;
  name : string
  value: string;
  onChange: (value : string) => void;
  errorKey : boolean;
  placeholder?: string;
  errorMsg?: string;
  required?: boolean;
};

const QuilEditor: React.FC<QuilEditorProps> = ({
  label,
  value,
  name,
  onChange,
  errorKey,
  errorMsg,
  placeholder,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {errorKey}

      <ReactQuill
        theme="snow"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {errorKey && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  );
};

export default QuilEditor;
