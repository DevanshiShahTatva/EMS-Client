import * as Yup from "yup";

export const ResetPassSchema = Yup.object({
  otp: Yup.number()
  .typeError("OTP must be a number")
  .required("OTP is required")
  .test("len", "OTP must be 6 digits", val => {
    if (val === undefined || val === null) return false;
    return val.toString().length === 6;
  }),

  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be no more than 50 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

export const InitialResetPassValues = {
    otp: "",
    newPassword: "",
    confirmPassword: "",
    email:""
  };