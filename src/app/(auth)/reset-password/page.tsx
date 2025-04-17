"use client";
// React and Next.js Core Imports
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Third-party Libraries
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";

// Constants
import { ROUTES, API_ROUTES } from "@/utils/constant";

// Helper Functions and Schemas
import { apiCall } from "@/utils/services/request";
import { ResetPassSchema, InitialResetPassValues } from "./helper";

// Custom Components
import FormikTextField from "@/components/common/FormikTextField";
import Logo from "@/components/common/Logo";

// Types
import { IResetPassValues } from "./types";

// Icons
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  
  const togglePasswordVisibility = (field: "newPassword" | "confirmPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleResetPassSubmit = async (
    values: IResetPassValues,
    actions: FormikHelpers<IResetPassValues>
  ) => {
    actions.setSubmitting(true);
    const response = await apiCall({
      endPoint: API_ROUTES.AUTH.RESET_PASSWORD,
      method: "POST",
      body: {
        password:values.confirmPassword,
        email:localStorage.getItem("resetPassEmail"),
        otp:values.otp.toString()
      },
    });

    if (response.success) {
      toast.success(response.message);
      router.push(ROUTES.LOGIN);
      localStorage.removeItem("resetPassEmail");
    }
    actions.setSubmitting(false);
  }

    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
          <div className="p-8 lg:p-16 flex flex-col justify-between h-full">
            <div>
              <div className="mb-10">
                <Logo />
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Your Password
                </h2>
                <p className="text-sm text-gray-500">
                  Enter the OTP sent to your email, then set your new password.
                </p>
              </div>

              <Formik
                initialValues={InitialResetPassValues}
                validationSchema={ResetPassSchema}
                onSubmit={handleResetPassSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    <FormikTextField
                      name="otp"
                      label="OTP (6-digit code)"
                      type="number"
                      maxLength={6}
                      placeholder="Enter OTP"
                    />

                    <FormikTextField
                      name="newPassword"
                      label="New Password"
                      type={showPassword.newPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      endIcon={
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("newPassword")
                          }
                          className="text-gray-500"
                        >
                          {showPassword.newPassword ? (
                            <EyeSlashIcon className="h-6 w-6 text-gray-500 mt-1" />
                          ) : (
                            <EyeIcon className="h-6 w-6 text-gray-500 mt-1" />
                          )}
                        </button>
                      }
                    ></FormikTextField>

                    <FormikTextField
                      name="confirmPassword"
                      label="Confirm New Password"
                      type={showPassword.confirmPassword ? "text" : "password"}
                      endIcon={
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                          className="text-gray-500"
                        >
                          {showPassword.confirmPassword ? (
                            <EyeSlashIcon className="h-6 w-6 text-gray-500 " />
                          ) : (
                            <EyeIcon className="h-6 w-6 text-gray-500 " />
                          )}
                        </button>
                      }
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Resetting Password..."
                        : "Reset Password"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Remembered your password?{" "}
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
              alt="reset password illustration"
              fill
              className="object-contain p-8"
            />
          </div>
        </div>
      </section>
    );
  };

  export default ResetPasswordPage;
