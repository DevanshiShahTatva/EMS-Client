"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
import { ROUTES, API_ROUTES } from "@/utils/constant";
import { InitialLogInValues, LogInFormSchema } from "./helper";
import FormikTextField from "@/components/common/FormikTextField";
import Logo from "@/components/common/Logo";
import { apiCall } from "@/utils/helper";
import { toast } from "react-toastify";
import { ILogInFormValues } from "./types";

const LogInPage = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogInSubmit = async (values: ILogInFormValues, actions: FormikHelpers<ILogInFormValues>) => {
    actions.setSubmitting(false);

    const response = await apiCall({
      endPoint: API_ROUTES.AUTH.LOGIN,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const result = await response.json();

    if (result.success) {
      const { token, role } = result.data;
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        document.cookie = `token=${encodeURIComponent(token)}; path=/;`;
        document.cookie = `role=${role}; path=/;`;
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        document.cookie = `token=${encodeURIComponent(token)}; path=/;`;
        document.cookie = `role=${role}; path=/;`;
      }

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/events");
      }

      toast.success(result.message);
    } else {
      toast.error(result.message || "Login failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl grid lg:grid-cols-2 overflow-hidden">
        {/* Left: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-between h-full">
          {/* Top Section */}
          <div>
            <div className="mb-10">
              <Logo />
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-sm text-gray-500">Enter your email and password to access your account.</p>
            </div>

            <Formik initialValues={InitialLogInValues} validationSchema={LogInFormSchema} onSubmit={handleLogInSubmit}>
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <FormikTextField name="email" label="Email" type="email" />
                  <FormikTextField name="password" label="Password" type="password" />

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox accent-[#4F46E5] h-4 w-4"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      Remember Me
                    </label>
                    <Link href="#" className="text-[#4F46E5] hover:underline font-medium">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50">
                    {isSubmitting ? "Logging In..." : "Log In"}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Don’t have an account?{" "}
                    <Link href={ROUTES.SIGN_UP} className="text-[#4F46E5] font-medium hover:underline">
                      Register Now.
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
            src="https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-2242.jpg?semt=ais_hybrid&w=740"
            alt="dashboard preview"
            fill
            className="object-contain p-8"
          />
        </div>
      </div>
    </section>
  );
};

export default LogInPage;
