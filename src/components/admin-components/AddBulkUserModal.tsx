"use client";

import React, { useState } from "react";

// custom componets
import ModalLayout from "../common/CommonModalLayout";
import DragDropFile from "../common/DragDrop";
import Loader from "../common/Loader";

// services
import { exportToExcel } from "@/utils/helper";

// constant
import { API_ROUTES, SAMPLE_USER_DATA } from "@/utils/constant";

// Icons
import { X, FileCheck, TriangleAlert } from "lucide-react";

// Services
import { apiCall } from "@/utils/services/request";

// Types
import { IBulkUploadResponse, IBulkUploadsFileFields } from "@/app/admin/users/types"

// Library
import { toast } from "react-toastify";

interface IBulkUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit : () => void
}

const AddBulkUserModal: React.FC<IBulkUserModalProps> = ({ isOpen, onClose, onSubmit }) => {

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorFileArray, setErrorFileArray] = useState<IBulkUploadsFileFields[]>([])
    const [uploadedFileArray, setUploadedFileArray] = useState<IBulkUploadsFileFields[]>([])
    const [loading,setLoading] = useState(false)


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const file = files[0];

        if (!file) {
            setErrorMsg("No file selected.");
            return;
        }

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "text/csv", // .csv
            "application/vnd.ms-excel", // also covers old .xls/.csv sometimes
        ];

        if (files.length > 1) {
            setErrorMsg("Only one file is allowed.");
            e.target.value = "";
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setErrorMsg("Only .xlsx or .csv files are allowed.");
            e.target.value = "";
            return;
        }

        setErrorMsg(null);
        setSelectedFile(file);
        e.target.value = "";
    };

    const downloadSampleFile = () => {
        exportToExcel(SAMPLE_USER_DATA, "Sample_File.xlsx")
    }

    const downloadErrorFile = () => {
        const data = [...uploadedFileArray, ...errorFileArray]
        exportToExcel(data, "Error_File.xlsx")
    }

    const handleSubmit = async () => {
        if (!selectedFile) {
            setErrorMsg("Please upload a valid file before submitting.");
            return;
        }

        setLoading(true)
        try {

            const formData = new FormData()
            formData.append("file", selectedFile)

            const result: IBulkUploadResponse = await apiCall({
                method: "POST",
                endPoint: API_ROUTES.ADMIN.BULK_USER_CREATION,
                body: formData,
                headers: {},
                isFormData: true,
                withToken: true
            })

            if (result && result.success) {

                const modifiedUploadedArray = result.data.uploaded
                const modifiedErrorArray = result.data.errors.map(item => {
                    return {
                        name: item.errors.name ? item.errors.name : item.name,
                        email: item.errors.email ? item.errors.email : item.email,
                        role: item.errors.role ? item.errors.role : item.role,
                    }
                })

                setUploadedFileArray(modifiedUploadedArray)
                setErrorFileArray(modifiedErrorArray)

                if(modifiedErrorArray.length === 0) {
                    toast.success("Users have been added successfully")
                    onSubmit()
                    setSelectedFile(null)
                }

            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    };

    const handleClose = () => {
        setErrorMsg(null)
        setSelectedFile(null)
        setErrorFileArray([])
        setUploadedFileArray([])
        onClose()
    }

    const handleReupload = () => {
        setErrorMsg(null)
        setSelectedFile(null)
        setErrorFileArray([])
        setUploadedFileArray([])
    }

    const renderErrorSection = () => {
        return (
            <div className="flex flex-col items-center justify-center my-10">
                <TriangleAlert className="h-25 w-25 text-red-500" />
                <p className="text-2xl text-red-500 font-bold my-2">Error in uploading</p>
                <p className="text-md my-2 font-semibold text-gray-500 text-center px-15">Total {uploadedFileArray.length} out of { uploadedFileArray.length + errorFileArray.length } users have been validated correctly.Please check below File with errors.</p>
                <p className="underline text-red-500 font-semibold cursor-pointer" onClick={downloadErrorFile}>users.xlsx</p>
            </div>
        )
    }

    const renderDragDropSection = () => {
        return (
            <div>
                <div className="my-5 flex justify-between">
                    <label className="block text-sm font-semibold text-gray-500 mb-1">
                        Upload file*
                    </label>
                    <p className="text-sm text-blue-500 underline cursor-pointer" onClick={downloadSampleFile}>
                        Download Sample File
                    </p>
                </div>
                <div className="my-5">
                    {selectedFile ? (
                        <div className="flex items-center mt-3 bg-gray-100 p-4 rounded-md shadow-sm justify-between">
                            <div className="flex gap-3 items-center">
                                <FileCheck className="h-5 w-5" />
                                <p className=" text-gray-900 flex-1 truncate text-md">{selectedFile.name}</p>
                            </div>
                            <button
                                className="ml-2 text-gray-700 hover:text-gray-800 cursor-pointer"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setErrorMsg(null);
                                }}
                                title="Remove file"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ) :
                        <DragDropFile onFileInputChange={handleFileChange} />
                    }

                    {errorMsg && (
                        <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
                    )}

                </div>
            </div>
        )
    }

    if (!isOpen) return null;

    return (
        <ModalLayout
            onClose={handleClose}
            modalTitle='Upload Users'
            footerActions={[
                { label: "Cancel", onClick: () => handleClose(), variant: "outlined" },
                errorFileArray.length > 0 
                ?
                { label: "Reupload", onClick: () => handleReupload(), variant: "delete" }
                :
                { label: "Submit", onClick: () => handleSubmit(), variant: "primary" }
            ]}

        >
            {loading && <Loader /> }
            {errorFileArray.length > 0 ? renderErrorSection() : renderDragDropSection() }    
        </ModalLayout>
    )
}

export default AddBulkUserModal