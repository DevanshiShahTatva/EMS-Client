// Formik helpers
import * as Yup from "yup";

export const InitialContactFormValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
};

export const ContactFormSchema = Yup.object({
    name: Yup.string().trim().required('Your name is required'),
    email: Yup.string().trim().email('Invalid email address').required('Email is required'),
    subject: Yup.string().trim().required('Subject is required'),
    message: Yup.string().trim().required('Message is required'),
});