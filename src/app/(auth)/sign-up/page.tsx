"use client";
import React, { useState } from "react";

// Next library support
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Other library support
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";

// Constant imports
import { ROUTES, API_ROUTES, SIGN_UP_IMAGE_BANNER_LINK } from "@/utils/constant";
import { apiCall } from "@/utils/services/request";
import FormikTextField from "@/components/common/FormikTextField";
import { InitialSignupValues, SignupFormSchema, TITLE } from "./helper";

// Logo image & Icons
import Logo from "@/components/common/Logo";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Type support
import { ISignupFormValues } from "./types";

const SignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignupSubmit = async (values: ISignupFormValues, actions: FormikHelpers<ISignupFormValues>) => {
    actions.setSubmitting(true);

    const response = await apiCall({
      endPoint: API_ROUTES.AUTH.SIGNUP,
      method: "POST",
      body: values,
    });

    actions.setSubmitting(false);

    if (response.success) {
      router.push(ROUTES.LOGIN);
      toast.success(response.message);
    } else {
      toast.error(response.message || "Signup failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
        {/* Left: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-between h-full">
          <div>
            <div className="mb-10">
              <Link href={ROUTES.HOME}>
                <Logo />
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{TITLE.FORM_TITLE}</h2>
              <p className="text-sm text-gray-500">{TITLE.FORM_SUBTITLE}</p>
            </div>

            <Formik
              initialValues={InitialSignupValues}
              validationSchema={SignupFormSchema}
              onSubmit={handleSignupSubmit}>
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <FormikTextField name="name" label="Your Name" placeholder="Enter your name" type="text" />
                  <FormikTextField name="email" label="Email" placeholder="Enter your email" type="email" />
                  <FormikTextField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    endIcon={
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="text-gray-500 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-6 w-6 text-gray-500 mt-1" />
                        ) : (
                          <EyeIcon className="h-6 w-6 text-gray-500 mt-1" />
                        )}
                      </button>
                    }
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link href={ROUTES.LOGIN} className="text-[#4F46E5] font-medium hover:underline">
                      Log In
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

        {/* Right: Illustration */}
        <div className="relative w-full h-full bg-[#fff] text-white">
          <Image
            src={SIGN_UP_IMAGE_BANNER_LINK}
            alt="signup illustration"
            fill
            className="object-contain p-8"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
