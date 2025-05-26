'use client';

import { useEffect, useState } from 'react';

// Third-party Libraries
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from 'react-toastify';
import Cookie from 'js-cookie'
import { jwtVerify } from "jose";

// Constant & Helpers import 
import { API_ROUTES, CONTACT_US_IMAGE_BANNER_LINK } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';

// Custom components
import FormikTextField from "@/components/common/FormikTextField";
import CustomButton from '@/components/common/CustomButton';

// Helper supports
import { ContactFormSchema, InitialContactFormValues } from './helper';

// Types
import { TContactFormValues } from './types';

export default function ContactUsPage() {

  const [initialValues, setInitialValues] = useState(InitialContactFormValues)

  const handleSubmit = async (
    values: TContactFormValues,
    actions: FormikHelpers<TContactFormValues>
  ) => {
    actions.setSubmitting(true);

    const result = await apiCall({
      endPoint: API_ROUTES.CONNNTACT_US,
      method: "POST",
      body: values,
    })

    if (result && result.success) {
      const msg = result?.message ?? "Form submitted successfully";
      toast.success(msg)
      actions.resetForm();
    } else {
      const msg = result?.message ?? "Someting went wrong. Try again later";
      toast.error(msg)
    }
    actions.setSubmitting(false);
  }

  const fetchToken = async (token: string) => {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userName = payload.name as string;
    const userEmail = payload.email as string;
    const savedUserContactFormValues = {
      name: userName,
      email: userEmail,
      subject: '',
      message: '',
    };

    setInitialValues(savedUserContactFormValues)

  }

  useEffect(() => {
    const token = Cookie.get("authToken")
    if (token) {
      fetchToken(token)
    }
  }, [])

  return (
    <section className="bg-gray-100 py-10 px-4 sm:px-6 md:px-8">
      <div className="mx-auto flex flex-col lg:flex-row gap-10 items-stretch">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={CONTACT_US_IMAGE_BANNER_LINK}
            alt="Contact Banner"
            className="w-full h-full rounded-xl object-contain"
          />
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-1/2">
          <Formik
            initialValues={initialValues}
            validationSchema={ContactFormSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5 bg-white rounded-lg shadow-lg border border-gray-200 p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl text-center font-bold text-gray-900">
                  Contact Our Team
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Whether you're hosting a conference, music festival, or private gathering, our team of seasoned event professionals is here to help every step of the way — from planning to post-event analytics.
                </p>

                <FormikTextField
                  name="name"
                  label="Name*"
                  placeholder="Enter your name"
                  disabled={initialValues.name !== ""}
                />

                <FormikTextField
                  name="email"
                  label="Email*"
                  placeholder="Enter email address"
                  disabled={initialValues.email !== ""}
                />

                <FormikTextField
                  name="subject"
                  label="Subject*"
                  placeholder="Enter subject"
                />

                <FormikTextField
                  name="message"
                  label="Message*"
                  placeholder="Enter message"
                  type="textarea"
                  rows={6}
                />

                <div className="text-end">
                  <CustomButton
                    type="submit"
                    disabled={isSubmitting}
                    variant={isSubmitting ? "disabled" : "primary"}
                    className="py-3 px-5"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </CustomButton>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
}
