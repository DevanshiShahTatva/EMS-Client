"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Formik, Form } from "formik";
import FormikTextField from "../common/FormikTextField";
import { IAddEditTicketTypeModalProps, ITicketTypeFormValues } from "@/app/admin/dropdowns/types";
import { TicketTypeValidationSchema } from "@/app/admin/dropdowns/helper";

const AddEditTicketTypeModal: React.FC<IAddEditTicketTypeModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialValues,
    mode = "add",
    submitLoading = false
}) => {
    if (!isOpen) return null;

    const handleSubmit = async (
        values: ITicketTypeFormValues,
        // actions: FormikHelpers<ITicketTypeFormValues>
    ) => {
        await onSubmit(values);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white w-full max-w-xl rounded-lg shadow-xl relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b px-6 py-5 border-b-gray-300">
                    <p className="font-bold text-2xl">
                        {mode === "edit" ? "Edit Ticket Type" : "Add Ticket Type"}
                    </p>
                    <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer" />
                </div>

                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={TicketTypeValidationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {() => (
                        <Form className="flex flex-col gap-6 px-6 py-6">
                            {/* Hidden field for ID */}
                            {initialValues.id && (
                                <input type="hidden" name="id" value={initialValues.id} />
                            )}

                            {/* Name */}
                            <FormikTextField
                                name="name"
                                label="Ticket Type Name"
                                placeholder="Enter ticket type name"
                            />

                            {/* Description */}
                            <FormikTextField
                                name="description"
                                label="Description (optional)"
                                placeholder="Enter short description"
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full cursor-pointer px-4 py-2 rounded-[8px] font-bold border border-gray-500 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer px-4 py-2 rounded-[8px] font-bold bg-blue-500 text-white hover:bg-blue-600"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddEditTicketTypeModal;
