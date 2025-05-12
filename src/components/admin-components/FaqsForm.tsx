"use client"
import React from 'react';

// Library support
import { useRouter } from 'next/navigation';
import { Formik, Form, FieldArray, FormikHelpers } from 'formik';
import {toast} from "react-toastify"

// Custom Components
import FormikTextField from '../common/FormikTextField';
import Breadcrumbs from '../common/BreadCrumbs';
import TitleSection from '../common/TitleSection';

// Constants & Helpers import
import { FaqsValidationSchema, InitialFaqsValues } from '@/app/admin/faqs/helper';
import { apiCall } from '@/utils/services/request';
import { API_ROUTES, BREAD_CRUMBS_ITEMS, ROUTES } from '@/utils/constant';

// types
import { IFAQsFormValues } from '@/app/admin/faqs/types';

// Icons
import {  TrashIcon } from "@heroicons/react/24/outline"

const FAQForm : React.FC = () => {

    const rounter = useRouter()

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
      }

  return (
      <div className="m-10">
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
                  {({ values, isSubmitting }) => (
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
                                                      Add Field
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

                                                  <FormikTextField
                                                      name={`faqs[${index}].answer`}
                                                      placeholder="Enter your answer"
                                                      label='Answer'
                                                      type='textarea'
                                                      rows={5}
                                                  />
                                              </div>

                                          </div>
                                      ))}
                                  </>
                              )}
                          </FieldArray>

                          <div className="text-end my-6">
                              <button
                                  disabled={isSubmitting}
                                  type='submit'
                                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium sm:w-max w-full py-3 px-6 rounded-[12px] disabled:opacity-50 transition disabled:cursor-not-allowed cursor-pointer"
                              >
                                  {isSubmitting ? "Submitting..." : "Submit"}
                              </button>
                          </div>
                      </Form>
                  )}
              </Formik>
          </div>
      </div>
    
  );
};

export default FAQForm;
