"use client";

import React from "react";

// Custom Components
import ModalLayout from "../common/CommonModalLayout";
import FormikSelectField from "@/components/common/FormikSelectField";
import FormikTextField from "@/components/common/FormikTextField";

// Other library support
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";

// helper
import { InitialSingleUserValues, SingleUserFormSchema } from "@/app/admin/users/helper";

// constants
import { API_ROUTES, USER_ROLES } from "@/utils/constant";

// Icons
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Types
import { ISingleUserFormValues } from "@/app/admin/users/types";

// services
import { apiCall } from "@/utils/services/request";


interface ISingleUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit : () => void
}

const AddSingleUserModal: React.FC<ISingleUserModalProps> = ({ isOpen, onClose, onSubmit }) => {

    const handleSubmit = async (values: ISingleUserFormValues, actions: FormikHelpers<ISingleUserFormValues>) => {
        actions.setSubmitting(true); 
        
        try {

            const result = await apiCall({
                method: "POST",
                endPoint: API_ROUTES.ADMIN.SINGLE_USER_CREATION,
                body: values,
                withToken: true
            })

            if (result && result.success) {
                toast.success(result?.message || "Something went wrong. please try again later.")
                onSubmit()
                actions.setSubmitting(false)
            }
        } catch (error) {
            console.error(error)
        } 
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
                                { label: isSubmitting ? "Submitting...." : "Submit", type: "submit", variant: isSubmitting ? "disabled" : "primary" }
                            ]}

                        >
                            <div className="my-5 space-y-5">
                                <FormikSelectField
                                    label="Role"
                                    name="role"
                                    options={USER_ROLES}
                                    placeholder="Select role"
                                    endIcon={
                                        <ChevronDownIcon className="h-5 w-5 mt-0.5" />
                                    }
                                />
                                <FormikTextField name="name" label="Name" placeholder="Enter name" type="text" />
                                <FormikTextField name="email" label="Email" placeholder="Enter email" type="email" />
                            </div>
                        </ModalLayout>

                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddSingleUserModal