// Formik helpers
import * as Yup from "yup";

// types
import { IFaqData, IFAQsFormValues, IFAQsItem } from "./types";


export const InitialFaqsValues: IFAQsFormValues = {
    faqs: [{ question: '', answer: '' }],
  };

export const FaqsValidationSchema = Yup.object({
    faqs: Yup.array().of(
        Yup.object().shape({
            question: Yup.string().trim().required('Question is required'),
            answer: Yup.string().trim().required('Answer is required'),
        })
    ),
})

export const getPaginatedData = (dataArray: IFaqData[], currentPage: number, itemsPerPage: number) => {
    const result = dataArray.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return result
}

export const getSearchResults = (
    faqs: IFaqData[],
    keyword: string
) => {
    const lowerKeyword = keyword.toString().toLowerCase();
    return faqs.filter(faq =>
      faq.answer.toLowerCase().includes(lowerKeyword) ||
      faq.question.toLowerCase().includes(lowerKeyword)
    );
}


export const InitialEditFaqsValues : IFAQsItem = {
     question: '', answer: '' 
  };

export const FaqsEditValidationSchema = Yup.object({
    question: Yup.string().trim().required('Question is required'),
    answer: Yup.string().trim().required('Answer is required'),
})
