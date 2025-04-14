import * as Yup from "yup";

export const LogInFormSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),

        password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be no more than 50 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter") 
        .matches(/\d/, "Password must contain at least one number") 
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character") 
});