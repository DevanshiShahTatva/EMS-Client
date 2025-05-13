"use client";

import React, { useState, useEffect } from "react";
import { City, Country, State } from "country-state-city";

// Common constatns & helpers
import { API_ROUTES } from "@/utils/constant";
import { setUserLogo } from "@/utils/helper";

// Helper Function imports
import {
  InitialChangePasswordFormValues,
  ChangePasswordSchema,
  InitalNewEmailFormValues,
  ChangeEmailSchema,
  InitalOtpFormValues,
  VerifyOTPSchema,
  InitialProfileInfoValues,
  ProfileInfoSchema,
  INITIAL_USER_INFO,
} from "./helper";

// Third-party Libraries
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";

// Custom components
import FormikTextField from "@/components/common/FormikTextField";
import FormikFileUpload from "@/components/common/FormikFileUpload";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Types
import {
  IChangeNewEmailValues,
  IChangePasswordFormValues,
  IOtpValues,
  IProfileInfoValues,
  IUserInfo,
} from "./types";

// API Services
import { apiCall } from "@/utils/services/request";
import Footer from "@/components/common/Footer";
import FormikSelectField from "@/components/common/FormikSelectField";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const UserProfilePage = () => {
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [changeEmail, setChangeEmail] = useState(false);
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [userInfo, setUserInfo] = useState<IUserInfo>(INITIAL_USER_INFO);
  const [initialProfileInfoValues, setInitialProfileInfoValues] =
    useState<IProfileInfoValues>(InitialProfileInfoValues);

  const openChangeEmail = () => {
    setChangeEmail(true);
  };

  const cancelButtonClick = () => {
    setNewEmail("");
    setIsVerifyEmail(false);
    setChangeEmail(false);
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Change Password submit handler
  const handleChangePasswordSubmit = async (
    values: IChangePasswordFormValues,
    actions: FormikHelpers<IChangePasswordFormValues>
  ) => {
    actions.setSubmitting(true);
    const body = { newPassword: values.newPassword };

    const result = await apiCall({
      endPoint: API_ROUTES.USER.PROFILE.RESET_PASSWORD,
      method: "PUT",
      body: body,
      withToken: true,
    });

    if (result && result.success) {
      toast.success("Password updated successfully");
      actions.resetForm();
    } else {
      const msg = result?.message ?? "Someting went wrong. Try again later";
      toast.error(msg);
    }
    actions.setSubmitting(false);
  };

  // Change Email submit handler
  const handleChangeEmailSubmit = async (
    values: IChangeNewEmailValues,
    actions: FormikHelpers<IChangeNewEmailValues>
  ) => {
    actions.setSubmitting(true);

    const body = { email: values.email };

    const result = await apiCall({
      endPoint: API_ROUTES.USER.PROFILE.RESET_EMAIL,
      method: "PUT",
      body: body,
      withToken: true,
    });

    if (result && result.success) {
      toast.success("OTP send to your new email");
      setNewEmail(values.email);
      setIsVerifyEmail(true);
    }

    if (!result.success && result.message) {
      toast.error(result.message);
    }
    actions.setSubmitting(false);
  };

  // Verify OTP submit handler
  const handleVerifyOtpSubmit = async (
    values: IOtpValues,
    actions: FormikHelpers<IOtpValues>
  ) => {
    actions.setSubmitting(true);

    const body = {
      email: newEmail,
      otp: String(values.otp),
    };

    const result = await apiCall({
      endPoint: API_ROUTES.USER.PROFILE.VERIFY_EMAIL,
      method: "PUT",
      body: body,
      withToken: true,
    });

    if (result && result.success) {
      toast.success("Email verified successfully");
      setUserInfo({ ...userInfo, email: newEmail });
      cancelButtonClick();
    }

    actions.setSubmitting(false);
  };

  // Profile Info submit handler
  const handlePersonalInfoSubmit = async (
    values: IProfileInfoValues,
    actions: FormikHelpers<IProfileInfoValues>
  ) => {
    actions.setSubmitting(true);

    const formData = new FormData();

    formData.append("name", values.userName);
    formData.append("address", values.address);
    formData.append("country", values.country);
    formData.append("state", values.state);
    formData.append("city", values.city);
    formData.append("zipcode", values.zipcode);

    const cityData = City.getCitiesOfState(values.country, values.state).find(c => c.name === values.city);
    formData.append("latitude", cityData?.latitude || "");
    formData.append("longitude", cityData?.longitude || "");
    
    if (values.profileImage) {
      formData.append("profileimage", values.profileImage);
    }

    const result = await apiCall({
      headers: {},
      endPoint: API_ROUTES.USER.PROFILE.UPDATE_USER_INFO,
      method: "PUT",
      body: formData,
      isFormData: true,
      withToken: true,
    });

    if (result && result.success) {
      toast.success("Profile Updated successfully");
      fetchUserInfo();
    }
    actions.setSubmitting(false);
  };

  const fetchUserInfo = async () => {
    const result = await apiCall({
      method: "GET",
      endPoint: API_ROUTES.USER.USER_DETAILS,
      withToken: true,
    });

    if (result && result.success) {
      const receivedObj = result.data[0];

      const userInfo = {
        _id: receivedObj._id,
        name: receivedObj.name,
        email: receivedObj.email,
        address: receivedObj.address ? receivedObj.address : "",
        country: receivedObj.country ? receivedObj.country : "",
        state: receivedObj.state ? receivedObj.state : "",
        city: receivedObj.city ? receivedObj.city : "",
        zipcode: receivedObj.zipcode ? receivedObj.zipcode : "",
        profileimage:
          receivedObj.profileimage !== null
            ? receivedObj.profileimage.url
            : null,
      };

      const initialProfileVal = {
        userName: receivedObj.name,
        address: receivedObj.address,
        country: receivedObj.country,
        state: receivedObj.state,
        city: receivedObj.city,
        zipcode: receivedObj.zipcode,
        profileImage: null,
      };

      const imgUrl =
        receivedObj.profileimage !== null ? receivedObj.profileimage.url : "";
      setUserLogo(imgUrl);
      setInitialProfileInfoValues(initialProfileVal);
      setUserInfo(userInfo);
      setIsLoading(false);
      window.dispatchEvent(new Event("userLogoUpdated"));
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div>
      <div className="mx-auto p-10 flex flex-row gap-10">
        <div className="rounded-3xl bg-white shadow-lg w-1/4 lg:block hidden">
          <Formik
            initialValues={initialProfileInfoValues}
            validationSchema={ProfileInfoSchema}
            onSubmit={handlePersonalInfoSubmit}
          >
            {() => (
              <Form className={loading ? "p-8 h-full" : ""}>
                {loading ? (
                  <Skeleton className="h-full w-full aspect-square" />
                ) : (
                  <>
                    <div className="h-32 w-full bg-[#4F46E5] rounded-t-3xl" />
                    <div className="mx-auto mt-[-100px]">
                      <FormikFileUpload
                        name="profileImage"
                        defaultImage={userInfo.profileimage || undefined}
                        fetchUserInfo={fetchUserInfo}
                        userName={userInfo.name}
                      />
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </div>
        <div className="w-full lg:w-3/4 flex flex-col gap-8">
          <div className="rounded-3xl bg-white shadow-lg lg:hidden block pb-8">
            <Formik
              initialValues={initialProfileInfoValues}
              validationSchema={ProfileInfoSchema}
              onSubmit={handlePersonalInfoSubmit}
            >
              {() => (
                <Form className={loading ? "p-8 h-full" : ""}>
                  {loading ? (
                    <Skeleton className="h-full w-full aspect-square" />
                  ) : (
                    <>
                      <div className="h-32 w-full bg-[#4F46E5] rounded-t-3xl" />
                      <div className="mx-auto mt-[-100px]">
                        <FormikFileUpload
                          name="profileImage"
                          defaultImage={userInfo.profileimage || undefined}
                          fetchUserInfo={fetchUserInfo}
                          userName={userInfo.name}
                        />
                      </div>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </div>
          {/* Personal Info Tab Start */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            {loading ? (
              <Skeleton className="h-80 w-full aspect-square" />
            ) : (
              <>
                <p className="text-2xl font-bold mb-8">Personal Information</p>
                <div className="">
                  <Formik
                    initialValues={initialProfileInfoValues}
                    validationSchema={ProfileInfoSchema}
                    onSubmit={handlePersonalInfoSubmit}
                  >
                    {({ isSubmitting, values }) => (
                      <Form className="flex gap-8 items-start md:flex-row flex-col">
                        <div className="w-full space-y-5">
                          <FormikTextField
                            name="userName"
                            label="User Name"
                            placeholder="Enter your name"
                          />

                          <FormikTextField
                            name="address"
                            label="Street Address"
                            placeholder="Enter your street address"
                          />

                          <div className="flex flex-row gap-4">
                            <FormikSelectField
                              name="country"
                              label="Country"
                              placeholder="Select your country"
                              options={Country.getAllCountries().map((c) => ({
                                label: c.name,
                                value: c.isoCode,
                              }))}
                              endIcon={
                                <ChevronDownIcon className="h-6 w-6 mt-1" />
                              }
                            />

                            <FormikSelectField
                              name="state"
                              label="State"
                              placeholder="Select your state"
                              options={State.getStatesOfCountry(
                                values.country
                              ).map((s) => ({
                                label: s.name,
                                value: s.isoCode,
                              }))}
                              disabled={!values.country}
                              endIcon={
                                <ChevronDownIcon className="h-6 w-6 mt-1" />
                              }
                            />
                          </div>

                          <div className="flex flex-row gap-4">
                            <FormikSelectField
                              name="city"
                              label="City"
                              placeholder="Select your city"
                              options={City.getCitiesOfState(
                                values.country,
                                values.state
                              ).map((c) => ({ label: c.name, value: c.name }))}
                              disabled={!values.country || !values.state}
                              endIcon={
                                <ChevronDownIcon className="h-6 w-6 mt-1" />
                              }
                            />

                            <FormikTextField
                              name="zipcode"
                              label="Zip Code"
                              placeholder="Enter your zipcode"
                            />
                          </div>

                          <div className="text-end">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer mb-2"
                            >
                              {isSubmitting ? "Updating..." : "Update"}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </>
            )}
          </div>
          {/* Personal Info Tab End */}

          {/* Update Email tab Start  */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            {loading ? (
              <Skeleton className="h-80 w-full aspect-square" />
            ) : (
              <>
                <p className="text-2xl font-bold mb-8">Update Email</p>

                <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 items-start sm:items-center">
                  <div className="mb-4 w-full">
                    <label
                      htmlFor={"email"}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id={"email"}
                      name={"email"}
                      type={"email"}
                      placeholder={"Enter your email"}
                      value={userInfo.email}
                      readOnly
                      disabled
                      className="block w-full rounded-md px-4 py-2 text-md text-gray-500 placeholder-gray-400 border transition-all border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 disabled:bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  {!changeEmail ? (
                    <button
                      onClick={openChangeEmail}
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold mt-1 px-4 py-2 rounded-md cursor-pointer whitespace-nowrap"
                    >
                      Change Email
                    </button>
                  ) : (
                    <button
                      onClick={cancelButtonClick}
                      className="border-[#4F46E5] text-[#4F46E5] border-1 font-semibold mt-1 px-4 py-2 rounded-md cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {changeEmail && (
                  <Formik
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

                        {newEmail === "" && (
                          <div className="text-start">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer mb-2"
                            >
                              {isSubmitting ? "Verifying..." : "Verify Email"}
                            </button>
                          </div>
                        )}
                      </Form>
                    )}
                  </Formik>
                )}

                {isVerifyEmail && changeEmail && (
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

                        <div className="text-sm italic">
                          Please provide the 6-digit verification code sent to
                          your new email.
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
                )}
              </>
            )}
          </div>
          {/* Update Email tab End  */}

          {/* Password Update Tab Start */}
          <div className="rounded-3xl bg-white shadow-lg p-8">
            {loading ? (
              <Skeleton className="h-80 w-full aspect-square" />
            ) : (
              <>
                <p className="text-2xl font-bold mb-8">Change Password</p>
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
              </>
            )}
          </div>
          {/* Password Update Tab End */}
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default UserProfilePage;
