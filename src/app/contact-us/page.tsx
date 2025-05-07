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
    <section className="p-8">

      <div className="grid grid-cols-12 gap-10 py-16 px-4 md:px-4">
        {/* Left Side: Office Info */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <img
            src={CONTACT_US_IMAGE_BANNER_LINK}
            alt="Event support team in office"
            className="w-full h-auto rounded-lg object-contain"
          />
        </div>

        {/* Right Side: Contact Form */}
        <div className="col-span-12 lg:col-span-6">
          {/* Insert your form here */}
          <div className="max-w-6xl mx-auto">
            <Formik
              initialValues={initialValues}
              validationSchema={ContactFormSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5 bg-white rounded-lg shadow-lg border-2 border-gray-100 p-8">
                  <h1 className="text-4xl text-center font-bold text-gray-900">
                    Contact Our Team
                  </h1>
                  <p className="text-gray-600">
                    Whether you're hosting a conference, music festival, or private gathering, our team of seasoned event professionals is here to help you every step of the way — from planning to post-event analytics. Connect with us and turn your event vision into reality.
                  </p>
                  <FormikTextField
                    name="name"
                    placeholder="Enter your name"
                    label="Name"
                    disabled={initialValues.name !== ""}
                  />

                  <FormikTextField
                    name="email"
                    label="Email"
                    placeholder="Enter email address"
                    disabled={initialValues.email !== ""}
                  />

                  <FormikTextField
                    name="subject"
                    placeholder="Enter subject"
                    label="Subject"
                  />

                  <FormikTextField
                    name="message"
                    label="Message"
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
        </div>
      </div>

    </section>
  );
}
