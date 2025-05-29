"use client";

import React from "react";

// Custom Components
import ModalLayout from "../common/CommonModalLayout";
import CustomButton from "@/components/common/CustomButton";
import FormikSelectField from "@/components/common/FormikSelectField";
import FormikTextField from "@/components/common/FormikTextField";

// Other library support
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";

// helper
import { InitialSingleUserValues, SingleUserFormSchema } from "@/app/admin/users/helper";

// constants
import { USER_ROLES } from "@/utils/constant";

// Icons
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Types
import { ISingleUserFormValues } from "@/app/admin/users/types";


interface ISingleUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddSingleUserModal: React.FC<ISingleUserModalProps> = ({ isOpen, onClose }) => {

    const handleSubmit = async (values: ISingleUserFormValues, actions: FormikHelpers<ISingleUserFormValues>) => {
        actions.setSubmitting(true);
        actions.setSubmitting(false)
        onClose()
    };

    if (!isOpen) return null;

    return (

        <div>
            <Formik
                initialValues={InitialSingleUserValues}
                validationSchema={SingleUserFormSchema}
                onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className="">
                        <ModalLayout
                            onClose={onClose}
                            modalTitle='Add User'
                            footerActions={[
                                { label: "Cancel", onClick: () => onClose(), variant: "outlined" },
                                { label: isSubmitting ? "Submitting...." : "Submit", type: "submit", variant: "primary" }
                            ]}

                        >
                            <div className="my-5 space-y-5">
                                <FormikTextField name="name" label="Name" placeholder="Enter name" type="text" />
                                <FormikTextField name="email" label="Email" placeholder="Enter email" type="email" />
                                <FormikSelectField
                                    label="Role"
                                    name="role"
                                    options={USER_ROLES}
                                    placeholder="Select role"
                                    endIcon={
                                        <ChevronDownIcon className="h-5 w-5 mt-0.5" />
                                    }
                                />
                            </div>
                        </ModalLayout>

                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddSingleUserModal