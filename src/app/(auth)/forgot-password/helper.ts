import * as Yup from "yup";

export const InitialForgotPassValues = {
  email: "",
};

export const ForgotPassSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
});
