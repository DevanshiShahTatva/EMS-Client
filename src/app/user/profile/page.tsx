"use client"

import React, { useState } from 'react'

// Common constatns
import { PROFILE_TAB_OPTIONS } from '@/utils/constant';

// Helper Function imports
import { TAB_OPTIONS, InitialChangePasswordFormValues, ChangePasswordSchema, InitalNewEmailFormValues, ChangeEmailSchema, InitalOtpFormValues, VerifyOTPSchema, InitialProfileInfoValues, ProfileInfoSchema } from './helper';

// Third-party Libraries
import { Formik, Form, FormikHelpers } from "formik";

// Custom components
import FormikTextField from "@/components/common/FormikTextField";
import FormikFileUpload from '@/components/common/FormikFileUpload';

// Icons
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


// Types
import { IChangeNewEmailValues, IChangePasswordFormValues, IOtpValues, IProfileInfoValues } from './types';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState(TAB_OPTIONS.PERSONAL);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [changeEmail, setChangeEmail] = useState(false)
  const [isVerifyEmail, setIsVerifyEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")

  const openChangeEmail = () => {
    setChangeEmail(true);
  }

  const cancelButtonClick = () => {
    setNewEmail("")
    setIsVerifyEmail(false)
    setChangeEmail(false)
  }

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };


  // Change Password submit handler
  const handleChangePasswordSubmit = async (
    values: IChangePasswordFormValues,
    actions: FormikHelpers<IChangePasswordFormValues>
  ) => {
    actions.setSubmitting(true);
    actions.resetForm();
    actions.setSubmitting(false);
  }

  // Change Email submit handler
  const handleChangeEmailSubmit = async (
    values: IChangeNewEmailValues,
    actions: FormikHelpers<IChangeNewEmailValues>
  ) => {
    actions.setSubmitting(true);
    setNewEmail(values.email)
    setIsVerifyEmail(true)
    actions.setSubmitting(false);
  }

  // Verify OTP submit handler
  const handleVerifyOtpSubmit = async (
    values: IOtpValues,
    actions: FormikHelpers<IOtpValues>
  ) => {
    actions.setSubmitting(true);
    actions.resetForm();
    actions.setSubmitting(false);
    cancelButtonClick()
    
  }

  // Profile Info submit handler
  const handlePersonalInfoSubmit = async (
    values: IProfileInfoValues,
    actions: FormikHelpers<IProfileInfoValues>
  ) => {
    actions.setSubmitting(true);
    actions.resetForm();
    actions.setSubmitting(false);
  }

    return (
      <div className="mx-auto p-10">
        <div className="rounded-[12px] bg-white p-5 shadow-lg border-2 border-gray-200">
          <div className="w-full mx-auto">
            {/* Tabs Start  */}
            <div className="flex flex-col sm:flex-row sm:border-b  border-b-0 overflow-auto">
              {PROFILE_TAB_OPTIONS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 text-md sm:text-xl cursor-pointer flex-1 text-center font-bold focus:outline-none transition-colors duration-200 ${
                    activeTab === tab.value
                      ? "text-blue-600 border-b-0 underline sm:no-underline sm:border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tabs Ends */}

            <div className="mt-6">
              {/* Personal Info Tab Start */}
              {activeTab === TAB_OPTIONS.PERSONAL && (
                <div className='p-2'>
                  <p className="text-2xl font-bold mb-8">
                    Personal Information
                  </p>

                  <div className=''>
                    <Formik
                      initialValues={InitialProfileInfoValues}
                      validationSchema={ProfileInfoSchema}
                      onSubmit={handlePersonalInfoSubmit}
                    >
                      {( { isSubmitting }) => (
                        <Form className="space-y-5">
                          <FormikFileUpload
                            name="profileImage"
                            defaultImage='/assets/ProfileIcon.svg'
                          />

                          <FormikTextField
                            name="userName"
                            label="User Name"
                            placeholder="Enter your name"
                          />

                          <FormikTextField
                            name="address"
                            label="Address"
                            placeholder="Enter your address"
                          />

                          <div className="text-end">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer mb-2"
                            >
                              {isSubmitting ? "Updating..." : "Update"}
                            </button>
                        </div>
                        </Form>
                      )}
                    </Formik>
                  </div>

                </div>
              )}
              {/* Personal Info Tab End */}

              {/* Update Email tab Start  */}
              {activeTab === TAB_OPTIONS.EMAIL && (
                <div className='p-2'>
                  <p className="text-2xl font-bold mb-8">
                    Update Email
                  </p>

                  <div className='flex flex-col sm:flex-row gap-0 sm:gap-4 items-start sm:items-center'>
                    <div className="mb-4">
                      <label htmlFor={"email"} className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        id={"email"}
                        name={"email"}
                        type={"email"}
                        placeholder={"Enter your email"}
                        value={"email"}
                        readOnly
                        disabled
                        className="block w-auto sm:w-sm md:w-lg rounded-md px-4 py-2 text-md text-gray-500 placeholder-gray-400 border transition-all border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 disabled:bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    {!changeEmail ?
                      <button
                        onClick={openChangeEmail}
                        className='bg-blue-500 text-white font-bold mt-1 px-4 py-2 rounded-md cursor-pointer'
                      >
                        Change Email
                      </button>
                      : <button
                        onClick={cancelButtonClick}
                        className='border-blue-500 text-blue-500 border-1 font-semibold mt-1 px-4 py-2 rounded-md cursor-pointer'
                      >
                        Cancel
                      </button>
                    }
                    
                    
                  </div>

                 {changeEmail && <Formik
                    initialValues={InitalNewEmailFormValues}
                    validationSchema={ChangeEmailSchema}
                    onSubmit={handleChangeEmailSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-5">
                        <FormikTextField
                          name="email"
                          label="New Email"
                          type={"email"}
                          placeholder="Enter your new email"
                          readOnly={newEmail !== ""}
                          disabled={newEmail !== ""}
                        ></FormikTextField>

                        {newEmail ==="" && <div className="text-start">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer mb-2"
                          >
                            {isSubmitting ? "Verifying..." : "Verify Email"}
                          </button>
                        </div>}
                      </Form>
                    )}
                  </Formik>}

                  {isVerifyEmail && changeEmail && 
                      <Formik
                        initialValues={InitalOtpFormValues}
                        validationSchema={VerifyOTPSchema}
                        onSubmit={handleVerifyOtpSubmit}
                      >
                        {({ isSubmitting }) => (
                          <Form className="space-y-5 mt-4">
                            <FormikTextField
                              name="otp"
                              label="OTP (6-digit code)"
                              type="number"
                              maxLength={6}
                              placeholder="Enter OTP"
                            ></FormikTextField>

                            <div className='text-sm italic'>
                              Please provide the 6-digit verification code sent to your new email.
                            </div>

                            <div className="text-start">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer mb-2"
                              >
                                {isSubmitting ? "Saving..." : "Save"}
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                  }

                </div>
              )}
              {/* Update Email tab End  */}

              {/* Password Update Tab Start */}
              {activeTab === TAB_OPTIONS.PASSWORD && (
                <div className="p-2">
                  <p className="text-2xl font-bold mb-8">
                     Change Password
                  </p>
                  <Formik
                    initialValues={InitialChangePasswordFormValues}
                    validationSchema={ChangePasswordSchema}
                    onSubmit={handleChangePasswordSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-5">
                        <FormikTextField
                          name="oldPassword"
                          label="Old Password"
                          type={showPassword.oldPassword ? "text" : "password"}
                          placeholder="Enter your old password"
                          endIcon={
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("oldPassword")
                              }
                              className="text-gray-500 cursor-pointer"
                            >
                              {showPassword.oldPassword ? (
                                <EyeSlashIcon className="h-6 w-6 text-gray-500 mt-1" />
                              ) : (
                                <EyeIcon className="h-6 w-6 text-gray-500 mt-1" />
                              )}
                            </button>
                          }
                        ></FormikTextField>

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
                              className="text-gray-500 cursor-pointer"
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
                          placeholder="Enter your confirm new password"
                          type={
                            showPassword.confirmPassword ? "text" : "password"
                          }
                          endIcon={
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("confirmPassword")
                              }
                              className="text-gray-500 cursor-pointer"
                            >
                              {showPassword.confirmPassword ? (
                                <EyeSlashIcon className="h-6 w-6 text-gray-500 " />
                              ) : (
                                <EyeIcon className="h-6 w-6 text-gray-500 " />
                              )}
                            </button>
                          }
                        />

                        <div className="text-end">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer mt-3 mb-2"
                          >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
              {/* Password Update Tab End */}
            </div>
          </div>
        </div>
      </div>
    );
}

export default UserProfilePage