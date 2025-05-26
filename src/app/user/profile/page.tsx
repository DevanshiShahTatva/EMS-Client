"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { City, Country, State } from "country-state-city";

// Common constatns & helpers
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
import FormikSelectField from "@/components/common/FormikSelectField";
import CustomButton from "@/components/common/CustomButton";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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

// Constant
import { API_ROUTES, ROUTES } from "@/utils/constant";
import VoucherItem from "./VoucherItem";


const UserProfilePage = () => {
  const router = useRouter();

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
    const body = { newPassword: values.newPassword, oldPassword: values.oldPassword };

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
        points: receivedObj.current_points,
        currentBadge: receivedObj.current_badge,
        lifetimeEarnedPoints: receivedObj.total_earned_points,
        address: receivedObj.address ? receivedObj.address : "",
        country: receivedObj.country ? receivedObj.country : "",
        state: receivedObj.state ? receivedObj.state : "",
        city: receivedObj.city ? receivedObj.city : "",
        zipcode: receivedObj.zipcode ? receivedObj.zipcode : "",
        profileimage:
          receivedObj.profileimage !== null
            ? receivedObj.profileimage.url
            : null,
        vouchers: receivedObj.vouchers
      };

      const initialProfileVal = {
        userName: receivedObj.name,
        address: receivedObj.address || "",
        country: receivedObj.country || "",
        state: receivedObj.state || "",
        city: receivedObj.city || "",
        zipcode: receivedObj.zipcode || "",
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

  const getIconColor = () => {
    const badgeColors: Record<string, string> = {
      Bronze: "#cd7f32",
      Silver: "#c0c0c0",
      Gold: "#ffd700",
    };
    return badgeColors[userInfo.currentBadge];
  };

  const navToRewardPoint = () => {
    router.push(ROUTES.USER_REWARDED_HISTORY);
  }

  return (
    <div>
      <div className="mx-auto flex flex-row gap-10 p-3 md:p-10 lg:max-h-svh">
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
                        points={userInfo.points}
                        currentBadge={userInfo.currentBadge}
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
        <div className="w-full lg:w-3/4 flex flex-col gap-8 lg:overflow-auto scrollbar-none">
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
                          points={userInfo.points}
                          currentBadge={userInfo.currentBadge}
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
          <div className="rounded-3xl bg-white shadow-lg p-5 md:p-8">
            {loading ? (
              <Skeleton className="h-30 w-full aspect-square" />
            ) : (
              <>
                <p className="text-xl font-bold mb-8 md:text-2xl">Your total points rewarded</p>
                <div className="flex items-center justify-between md:mr-[50px]">
                  <button
                    onClick={() => navToRewardPoint()}
                    className="flex flex-col items-center cursor-pointer w-[50px] h-[50px] md:w-[74px] md:h-[83px]"
                  >
                    <svg width="74" height="83" viewBox="0 0 74 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5.51974H66C70.1421 5.51974 73.5 8.87761 73.5 13.0197V61.5637C73.5 64.6142 71.6524 67.3608 68.8269 68.5106L39.8269 80.3114C38.0144 81.0489 35.9856 81.0489 34.1731 80.3114L5.17315 68.5106C2.34763 67.3608 0.5 64.6142 0.5 61.5637V13.0197C0.5 8.87761 3.85786 5.51974 8 5.51974Z" fill="#FBFBFB" stroke="#009BE2" />
                      <path d="M31.8879 43.5585L9.88132 7.05084L23.5042 6.95096L41.6971 37.6834L31.8879 43.5585Z" fill="#009BE2" stroke="white" />
                      <path d="M42.1121 43.5585L64.1074 7.06954L50.6505 7.25359L32.3063 37.6855L42.1121 43.5585Z" fill="#009BE2" stroke="white" />
                      <ellipse cx="35.6266" cy="45.915" rx="14.137" ry="14.0917" fill={getIconColor()} />
                      <path fillRule="evenodd" clipRule="evenodd" d="M35.8376 50.6541L30.3806 53.6122L31.5167 47.5248L27.008 43.2656L33.1671 42.4615L35.8376 36.8711L38.5082 42.4615L44.6673 43.2656L40.1586 47.5248L41.2947 53.6122L35.8376 50.6541Z" fill="white" />
                    </svg>
                  </button>
                  <div className="flex flex-col items-center">
                    <div className="text-blue-600 font-bold text-xl md:text-3xl">{userInfo.points}</div>
                    <div className="text-sm text-gray-500 mt-1 text-center">
                      Current Point Balance
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-black font-bold text-xl md:text-3xl">{userInfo.lifetimeEarnedPoints}</div>
                    <div className="text-sm text-gray-500 mt-1 text-center">
                      Points earned lifetime
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-black font-bold text-xl md:text-3xl">{userInfo.lifetimeEarnedPoints - userInfo.points}</div>
                    <div className="text-sm text-gray-500 mt-1 text-center">
                      Used points
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="rounded-3xl bg-white shadow-lg p-5 md:p-8">
            {loading ? (
              <Skeleton className="h-30 w-full aspect-square" />
            ) : (
              <>
                <p className="text-xl font-bold mb-6 md:text-2xl">My vouchers</p>
                <div className="flex flex-wrap gap-4 items-center">
                  {userInfo.vouchers.length > 0 ?
                    userInfo.vouchers.map((voucher, index: number) => {
                      return (
                        <div key={`${index + 1}`}>
                          <VoucherItem voucher={voucher} />
                        </div>
                      )
                    })
                    :
                    <div>No voucher available!</div>
                  }
                </div>
              </>
            )}
          </div>
          {/* Personal Info Tab Start */}
          <div className="rounded-3xl bg-white shadow-lg p-5 md:p-8">
            {loading ? (
              <Skeleton className="h-80 w-full aspect-square" />
            ) : (
              <>
                <p className="text-xl font-bold mb-8 md:text-2xl">Personal Information</p>
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
                              options={State.getStatesOfCountry(
                                values.country
                              ).map((s) => ({
                                label: s.name,
                                value: s.isoCode,
                              }))}
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
          {/* Personal Info Tab End */}

          {/* Update Email tab Start  */}
          <div className="rounded-3xl bg-white shadow-lg p-5 md:p-8">
            {loading ? (
              <Skeleton className="h-80 w-full aspect-square" />
            ) : (
              <>
                <p className="text-xl font-bold mb-8 md:text-2xl">Update Email</p>

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
                    <CustomButton
                      type="submit"
                      variant={"primary"}
                      onClick={openChangeEmail}
                      className="mt-3 mb-2 whitespace-nowrap"
                    >
                      Change Email
                    </CustomButton>
                  ) : (

                    <CustomButton
                      onClick={cancelButtonClick}
                      variant="outlined"
                      className="mt-1 font-medium"
                    >
                      Cancel
                    </CustomButton>
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
                            <CustomButton
                              type="submit"
                              variant={isSubmitting ? "disabled" : "primary"}
                              disabled={isSubmitting}
                              className="py-3 px-5 mt-3 mb-2"
                            >
                              {isSubmitting ? "Verifying..." : "Verify Email"}
                            </CustomButton>
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
                )}
              </>
            )}
          </div>
          {/* Update Email tab End  */}

          {/* Password Update Tab Start */}
          <div className="rounded-3xl bg-white shadow-lg p-5 md:p-8">
            {loading ? (
              <Skeleton className="h-80 w-full aspect-square" />
            ) : (
              <>
                <p className="text-xl font-bold mb-8 md:text-2xl">Change Password</p>
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
          {/* Password Update Tab End */}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
