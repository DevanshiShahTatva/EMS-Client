"use client";

import React from "react";

// library support
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Formik, Form, FormikHelpers } from 'formik';

// Custom Components
import FormikTextField from '../common/FormikTextField';
import CustomButton from "../common/CustomButton";

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
    <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/60 bg-opacity-40">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl relative">
        {/* Title Section Start */}
        <div className="flex justify-between items-center border-b-1 px-6 py-5 border-b-gray-300">
          <p className="font-bold text-2xl">Edit FAQ</p>
          <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer" />
        </div>
        {/* Title Section End */}

              <Formik
                  initialValues={faqsValues}
                  validationSchema={FaqsEditValidationSchema}
                  onSubmit={handleSubmit}
              >
                  {() => (
                      <Form className="flex gap-8 items-start md:flex-row flex-col">
                          <div className="w-full">
                              <div className="max-h-96 overflow-auto scrollbar-none border-b-1 px-6 py-0 border-b-gray-300">
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

                              {/* Buttons */}
                              <div className="flex justify-center gap-3 p-6">
                                <CustomButton
                                   variant="outlined"
                                   className="w-full rounded-[8px]"
                                   onClick={onClose}
                                 >
                                    Cancel
                                </CustomButton>
                                <CustomButton
                                   variant="primary"
                                   className="w-full"
                                   type="submit"
                                 >
                                    Update
                                </CustomButton>
                              </div>
                          </div>
                      </Form>
                  )}
              </Formik>

      </div>
    </div>
  );
};

export default EditFaqModal;
