"use client"
import React, { useState } from 'react';

// Library support
import { useRouter } from 'next/navigation';
import { Formik, Form, FieldArray, FormikHelpers } from 'formik';
import {toast} from "react-toastify"

// Custom Components
import FormikTextField from '../common/FormikTextField';
import Breadcrumbs from '../common/BreadCrumbs';
import TitleSection from '../common/TitleSection';
import CustomButton from '../common/CustomButton';

// Constants & Helpers import
import { FaqsValidationSchema, InitialFaqsValues } from '@/app/admin/faqs/helper';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES, BREAD_CRUMBS_ITEMS, ROUTES } from '@/utils/constant';

// types
import { IFAQsFormValues } from '@/app/admin/faqs/types';

// Icons
import {  TrashIcon } from "@heroicons/react/24/outline";
import CommonAIButton from '../common/CommonAIButton';

const FAQForm : React.FC = () => {

    const rounter = useRouter();
    const [isGeneratingAns, setIsGeneratingAns] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleSubmit = async (
        values: IFAQsFormValues,
        actions: FormikHelpers<IFAQsFormValues>
      ) => {
        actions.setSubmitting(true);

        const result = await apiCall({
           endPoint: API_ROUTES.FAQs,
           method : "POST",
           body: values.faqs,
           withToken: true
        })
    
        if(result && result.success) {
          toast.success("FAQs Created successfully")
          actions.resetForm()
          rounter.push(ROUTES.ADMIN.FAQs)
        }
       
        actions.setSubmitting(false);
      };

    const handleGeneratAnswer = async (
        question: string,
        setFieldValue: (field: string, value: string) => void,
        index: number
    ) => {
        try {
            setCurrentIndex(index);
            setIsGeneratingAns(true);
            const res = await apiCall({
            method: "POST",
            endPoint: API_ROUTES.ADMIN.AI_GENERATE_FAQ_ANSWER,
            body: {
                question: question
            },
            });
    
            if (res.success) {
            const markdown = res.data.replace(/\\n/g, "\n");

            setFieldValue(`faqs[${index}].answer`, markdown);
            setIsGeneratingAns(false);
        }
        } catch(error) {
            console.error(error);
            toast.error("Something went wrong!");
            setCurrentIndex(0);
            setIsGeneratingAns(false);
        }
    };

  return (
      <div className="mx-8 my-5">

          <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.FAQs.CREATE_PAGE} />
          <div className="rounded-[12px] bg-white p-6 shadow-lg border-2 border-gray-200">

              <div className='mb-5'>
                  <TitleSection title='Create FAQs' />
              </div>

              <Formik
                  initialValues={InitialFaqsValues}
                  validationSchema={FaqsValidationSchema}
                  onSubmit={handleSubmit}
              >
                  {({ values, isSubmitting, setFieldValue }) => (
                      <Form className="space-y-6">
                          <FieldArray name="faqs">
                              {({ push, remove }) => (
                                  <>
                                      {values.faqs.map((faq, index) => (
                                          <div key={index} className='px-5'>
                                              <div className='flex items-center justify-between'>
                                                  <div className='text-xl font-bold'>
                                                      Qustion-{index + 1}
                                                  </div>

                                                  {index === 0 ? <button
                                                      type="button"
                                                      onClick={() => push({ question: '', answer: '' })}
                                                      className="underline text-blue-500 font-bold cursor-pointer"
                                                  >
                                                      Add Question
                                                  </button> : <button
                                                      type="button"
                                                      onClick={() => remove(index)}
                                                      className='cursor-pointer'
                                                  >
                                                      <TrashIcon className='h-5 w-5 text-gray-800' />
                                                  </button>}
                                              </div>
                                              <div className="flex flex-col gap-3 my-5">
                                                  <FormikTextField
                                                      name={`faqs[${index}].question`}
                                                      placeholder="Enter your question"
                                                      label='Question'
                                                  />

                                                  <div className='w-full flex flex-col items-end'>
                                                    <FormikTextField
                                                        name={`faqs[${index}].answer`}
                                                        placeholder="Enter your answer"
                                                        label='Answer'
                                                        type='textarea'
                                                        rows={5}
                                                    />
                                                    <CommonAIButton
                                                        handleButtonClick={() => handleGeneratAnswer(faq.question, setFieldValue, index)}
                                                        isDisabled={!faq.question}
                                                        isSubmitting={currentIndex == index && isGeneratingAns}
                                                    />
                                                  </div>
                                              </div>

                                          </div>
                                      ))}
                                  </>
                              )}
                          </FieldArray>

                          <div className="text-end my-6">
                              <CustomButton
                                  disabled={isSubmitting}
                                  type='submit'
                                  variant='primary'
                                  className="sm:w-max rounded-[12px] w-full py-3 px-6 disabled:opacity-50 transition disabled:cursor-not-allowed"
                              >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </CustomButton>
                          </div>
                      </Form>
                  )}
              </Formik>
          </div>
      </div>
    
  );
};

export default FAQForm;
