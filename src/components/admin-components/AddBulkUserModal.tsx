"use client";

import React from "react";

// custom componets
import ModalLayout from "../common/CommonModalLayout";
import DragDropFile from "../common/DragDrop";


interface IBulkUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddBulkUserModal: React.FC<IBulkUserModalProps> = ({ isOpen, onClose }) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
    
        e.target.value = "";
      };

    if (!isOpen) return null;

    return (
        <ModalLayout
            onClose={onClose}
            modalTitle='Upload Users'
            footerActions={[
                { label: "Cancel", onClick: () => onClose(), variant: "outlined" },
                { label: "Submit", onClick: () => onClose(), variant: "primary" }
            ]}

        >
            <div className="my-2 flex justify-between">
                <label className="block text-sm font-semibold text-gray-500 mb-1">
                    Upload csv file*
                </label>
                <p className="text-sm text-blue-500 underline">
                    Download Sample CSV
                </p>
            </div>
            <div className="my-5">
                <DragDropFile onFileInputChange={handleFileChange} />
            </div>
        </ModalLayout>
    )
}

export default AddBulkUserModal