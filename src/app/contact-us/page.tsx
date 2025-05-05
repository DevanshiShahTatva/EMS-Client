'use client';

import { useState } from 'react';

// Third-party Libraries
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from 'react-toastify';

// Constant & Helpers import 
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';

// Custom components
import FormikTextField from "@/components/common/FormikTextField";

// Helper supports
import { ContactFormSchema, InitialContactFormValues } from './helper';

// Types
import { TContactFormValues } from './types';

export default function ContactUsPage() {

  const handleSubmit = async (
      values: TContactFormValues,
      actions: FormikHelpers<TContactFormValues>
    ) => {
      actions.setSubmitting(true);

      const body = values
  
      const result = await apiCall({
         endPoint: API_ROUTES.CONNNTACT_US,
         method : "POST",
         body: values,
      })
  
      if(result && result.success) {
        const msg = result?.message ?? "Form submitted successfully";
        toast.success(msg)
        actions.resetForm();
      } else {
         const msg = result?.message ?? "Someting went wrong. Try again later";
         toast.error(msg)
      }
      actions.setSubmitting(false);
    }

  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12">
          Have questions, feedback, or partnership inquiries? We'd love to hear from you!
        </p>

        <Formik
          initialValues={InitialContactFormValues}
          validationSchema={ContactFormSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5 bg-white rounded-lg shadow-lg border-2 border-gray-100 p-8">
              <FormikTextField
                name="name"
                placeholder="Enter your name"
                label="Name *"
              />

              <FormikTextField
                name="email"
                label="Email *"
                placeholder="Enter email address"
              />

              <FormikTextField
                name="subject"
                placeholder="Enter subject"
                label="Subject *"
              />

              <FormikTextField
                name="message"
                label="Message *"
                placeholder="Enter message"
                type='textarea'
                rows={8}
              />

              <div className="text-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer mb-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
