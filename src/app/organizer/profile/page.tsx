"use client";

import React, { useEffect, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import {
  ChangePasswordSchema,
  InitialChangePasswordFormValues,
  InitialProfileInfoValues,
  ProfileInfoSchema,
} from "@/app/user/profile/helper";
import {
  IChangePasswordFormValues,
  IProfileInfoValues,
} from "@/app/user/profile/types";
import { Skeleton } from "@/components/ui/skeleton";
import { City, Country, State } from "country-state-city";
import { apiCall } from "@/utils/services/request";
import { API_ROUTES } from "@/utils/constant";
import { toast } from "react-toastify";
import FormikTextField from "@/components/common/FormikTextField";
import FormikSelectField from "@/components/common/FormikSelectField";
import { ChevronDownIcon } from "lucide-react";
import CustomButton from "@/components/common/CustomButton";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const OrganizerDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [initialProfileInfoValues, setInitialProfileInfoValues] =
    useState<IProfileInfoValues>(InitialProfileInfoValues);

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const fetchUserInfo = async () => {
    const result = await apiCall({
      method: "GET",
      endPoint: API_ROUTES.USER.USER_DETAILS,
      withToken: true,
    });

    if (result && result.success) {
      const receivedObj = result.data[0];

      const initialProfileVal = {
        userName: receivedObj.name,
        address: receivedObj.address || "",
        country: receivedObj.country || "",
        state: receivedObj.state || "",
        city: receivedObj.city || "",
        zipcode: receivedObj.zipcode || "",
        profileImage: null,
      };

      setInitialProfileInfoValues(initialProfileVal);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

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

    const cityData = City.getCitiesOfState(values.country, values.state).find(
      (c) => c.name === values.city
    );
    formData.append("latitude", cityData?.latitude || "");
    formData.append("longitude", cityData?.longitude || "");

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

  const handleChangePasswordSubmit = async (
    values: IChangePasswordFormValues,
    actions: FormikHelpers<IChangePasswordFormValues>
  ) => {
    actions.setSubmitting(true);
    const body = {
      newPassword: values.newPassword,
      oldPassword: values.oldPassword,
    };

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

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="p-10 flex flex-col gap-10">
      <div className="rounded-3xl bg-white shadow-lg p-5 md:p-8">
        {loading ? (
          <Skeleton className="h-80 w-full aspect-square" />
        ) : (
          <>
            <p className="text-xl font-bold mb-8 md:text-2xl">
              Personal Information
            </p>
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
                          searchable
                          options={Country.getAllCountries().map((c) => ({
                            label: c.name,
                            value: c.isoCode,
                          }))}
                          endIcon={
                            <ChevronDownIcon className="h-5 w-5 mt-0.5" />
                          }
                        />

                        <FormikSelectField
                          name="state"
                          label="State"
                          placeholder="Select your state"
                          searchable
                          options={State.getStatesOfCountry(values.country).map(
                            (s) => ({
                              label: s.name,
                              value: s.isoCode,
                            })
                          )}
                          disabled={!values.country}
                          endIcon={
                            <ChevronDownIcon className="h-5 w-5 mt-0.5" />
                          }
                        />
                      </div>

                      <div className="flex flex-row gap-4">
                        <FormikSelectField
                          name="city"
                          label="City"
                          placeholder="Select your city"
                          searchable
                          options={City.getCitiesOfState(
                            values.country,
                            values.state
                          ).map((c) => ({ label: c.name, value: c.name }))}
                          disabled={!values.country || !values.state}
                          endIcon={
                            <ChevronDownIcon className="h-5 w-5 mt-0.5" />
                          }
                        />

                        <FormikTextField
                          name="zipcode"
                          label="Zip Code"
                          placeholder="Enter your zipcode"
                        />
                      </div>

                      <div className="text-end">
                        <CustomButton
                          type="submit"
                          variant={isSubmitting ? "disabled" : "primary"}
                          disabled={isSubmitting}
                          className="py-3 px-5 mb-2"
                        >
                          {isSubmitting ? "Updating..." : "Update"}
                        </CustomButton>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </>
        )}
      </div>

      <div className="rounded-3xl bg-white shadow-lg p-5 md:p-8">
        {loading ? (
          <Skeleton className="h-80 w-full aspect-square" />
        ) : (
          <>
            <p className="text-xl font-bold mb-8 md:text-2xl">
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
                        onClick={() => togglePasswordVisibility("oldPassword")}
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
                        onClick={() => togglePasswordVisibility("newPassword")}
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
                    type={showPassword.confirmPassword ? "text" : "password"}
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
                    <CustomButton
                      type="submit"
                      variant={isSubmitting ? "disabled" : "primary"}
                      disabled={isSubmitting}
                      className="py-3 px-5 mt-3 mb-2"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </CustomButton>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
