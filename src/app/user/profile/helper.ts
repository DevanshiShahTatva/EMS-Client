// Formik helpers
import * as Yup from "yup";

// Constants
export const ALLOWED_FILE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];
export const MAX_FILE_SIZE_MB = 2; // in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const TAB_OPTIONS = {
    PERSONAL : "personal",
    EMAIL : "email",
    PASSWORD : "password"
}

export const InitialChangePasswordFormValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export const InitalNewEmailFormValues = {
    email : ""
}

export const InitalOtpFormValues = {
   otp : ""
}

export const InitialProfileInfoValues = {
    userName: '',
    address: '',
    profileImage: null as File | null,
  };


export const ChangePasswordSchema = Yup.object({
    oldPassword: Yup.string()
        .required("Old Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be no more than 50 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character"
        ),
    newPassword: Yup.string()
        .required("New Password is required")
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

export const ChangeEmailSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),
});

export const VerifyOTPSchema = Yup.object({
  otp: Yup.number()
  .typeError("OTP must be a number")
  .required("OTP is required")
  .test("len", "OTP must be 6 digits", val => {
    if (val === undefined || val === null) return false;
    return val.toString().length === 6;
  }),
});

export const ProfileInfoSchema = Yup.object({
    userName: Yup.string().required('User Name is required'),
    address: Yup.string().required('Address is required'),
    profileImage: Yup.mixed()
        .required('Profile Image is required')
        .test('fileSize', 'File size must be less than 2MB', (value) =>
            value instanceof File ? value.size <= MAX_FILE_SIZE_BYTES : false
        )
        .test('fileFormat', 'Unsupported file format', (value) =>
            value instanceof File ? ALLOWED_FILE_FORMATS.includes(value.type.split('/')[1]) : false
        ),
});