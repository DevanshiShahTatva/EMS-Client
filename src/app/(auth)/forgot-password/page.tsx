"use client";
// React and Next.js Core Imports
import React from "react";
import Image from "next/image"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

// Third-party Libraries
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";              

// Custom Components
import Logo from "@/components/common/Logo"; 
import FormikTextField from "@/components/common/FormikTextField";

// Constants Imports
import { API_ROUTES, ROUTES } from "@/utils/constant";

// Types & Interfaces (TypeScript)
import { IForgotPassValues } from "./types";

// Helper Functions and Schema Definitions
import { ForgotPassSchema, InitialForgotPassValues } from "./helper";
import { apiCall } from "@/utils/services/request"; 

function ForgotPasswordPage() {
  const router = useRouter();
  const handleForgotPassSubmit = async (
    values: IForgotPassValues,
    actions: FormikHelpers<IForgotPassValues>
  ) => {
    actions.setSubmitting(true);
    const response = await apiCall({
      endPoint: API_ROUTES.AUTH.FORGOT_PASSWORD,
      method: "POST",
      body: values,
    });
    if (response.success) {
      toast.success(response.message);
      router.push(ROUTES.RESET_PASSWORD);
      localStorage.setItem("resetPassEmail",values.email);
    }
    actions.setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
        <div className="p-8 lg:p-16 flex flex-col justify-between h-full">
          <div>
            <div className="mb-10">
              <Logo />
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500">
                Enter your email address and we’ll send you a One-Time Password
                (OTP) to reset your password.
              </p>
            </div>

            <Formik
              initialValues={InitialForgotPassValues}
              validationSchema={ForgotPassSchema}
              onSubmit={handleForgotPassSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <FormikTextField name="email" label="Email" type="email" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Remember your password?{" "}
                    <Link
                      href={ROUTES.LOGIN}
                      className="text-[#4F46E5] font-medium hover:underline"
                    >
                      Go back to login.
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>

          <p className="text-xs text-gray-400 text-center mt-10">
            Copyright © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>

        <div className="relative w-full h-full bg-[#fff] text-white">
          <Image
            src="https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-2242.jpg?semt=ais_hybrid&w=740"
            alt="forgot password illustration"
            fill
            className="object-contain p-8"
          />
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
