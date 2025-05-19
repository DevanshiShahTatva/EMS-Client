"use client";

import React from "react";

// library support
import { Formik, Form, FormikHelpers } from 'formik';

// Custom Components
import FormikTextField from '../common/FormikTextField';
import ModalLayout from "../common/CommonModalLayout";

// types support
import { IEditFaqsModalProps, IFAQsItem } from "@/app/admin/faqs/types";

// helpers imports
import { FaqsEditValidationSchema } from "@/app/admin/faqs/helper";

const EditFaqModal: React.FC<IEditFaqsModalProps> = ({
  isOpen,
  onClose,
  saveChnages,
  faqsValues
}) => {

  if (!isOpen) return null;

    const handleSubmit = async (
        values: IFAQsItem,
        actions: FormikHelpers<IFAQsItem>
    ) => {
        saveChnages(values)
        actions.resetForm()
    }
  
  
  return (
    <Formik
      initialValues={faqsValues}
      validationSchema={FaqsEditValidationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex gap-8 items-start md:flex-row flex-col">

          <ModalLayout
            onClose={onClose}
            modalTitle="Edit FAQ"
            footerActions={[
              { label: "Cancel", onClick: () => onClose(), variant: "outlined" },
              { label: "Update", type: "submit", variant: "primary" }
            ]}
          >
            <div className="w-full">
              {/* Content UI Start */}
              <div className="w-full space-y-5 my-6">
                <FormikTextField
                  name="question"
                  label="Question"
                  placeholder="Enter question here"
                />

                <FormikTextField
                  name="answer"
                  label="Answer"
                  type="textarea"
                  rows={5}
                  placeholder="Enter answer here"
                />
              </div>
              {/* Content UI End*/}
            </div>
          </ModalLayout>

        </Form>
      )}
    </Formik>
  );
};

export default EditFaqModal;
