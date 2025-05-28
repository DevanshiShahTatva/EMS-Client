"use client";

import React from "react";

// custom componets
import ModalLayout from "../common/CommonModalLayout";


interface ISingleUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSingleUserModal: React.FC<ISingleUserModalProps> = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    return (
        <ModalLayout
            onClose={onClose}
            modalTitle='Add User'
            footerActions={[
                { label: "Cancel", onClick: () => onClose(), variant: "outlined" },
                { label: "Submit", onClick: () => onClose(), variant: "primary" }
            ]}

        >
            <div className="my-2 h-60">
                Single User
            </div>
        </ModalLayout>
    )
}

export default AddSingleUserModal