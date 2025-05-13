import * as Yup from "yup";

export const SignupFormSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be no more than 50 characters")
        .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

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
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    role: Yup.string().oneOf(["user", "organizer"]).required("Role is required"),
});

export const InitialSignupValues = {
    name: "",
    email: "",
    password: "",
    role : "user"
}

export const TITLE = {
    FORM_TITLE: "Create an account",
    FORM_SUBTITLE: "Simplify Event Planning!"
}

export const style = {
    signupImgStyle: {
        objectFit: "cover",
        height: "100%",
    } as React.CSSProperties
}