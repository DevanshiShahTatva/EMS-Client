"use client";

import React from "react";
import { Formik, Form } from "formik";
import FormikTextField from "../common/FormikTextField";
import { IAddEditTicketTypeModalProps, ITicketTypeFormValues } from "@/app/admin/dropdowns/types";
import { TicketTypeValidationSchema } from "@/app/admin/dropdowns/helper";
import ModalLayout from "../common/CommonModalLayout";

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
        <div>
                {/* Form */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={TicketTypeValidationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {() => (
                        <Form>
                            <ModalLayout
                               onClose={onClose}
                               modalTitle={mode === "edit" ? "Edit Ticket Type" : "Add Ticket Type"}
                                footerActions={[
                                    { label: "Cancel", onClick: () => onClose(), variant: "outlined" },
                                    { label: submitLoading ? "Saving..." : "Save", type: "submit", variant: "primary" }
                                ]}
                            >
                                <div className="flex flex-col gap-6 py-6">
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
                                </div>
                            </ModalLayout>
                        </Form>
                    )}
                </Formik>
        </div>
    );
};

export default AddEditTicketTypeModal;
