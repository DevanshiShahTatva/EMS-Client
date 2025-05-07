export interface IFAQsItem {
    question: string;
    answer: string;
}

export interface IFAQsFormValues {
    faqs: IFAQsItem[];
}

export interface IFaqData {
    _id: string;
    question: string;
    answer: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface IFaqApiResponse {
    success: boolean;
    data: IFaqData[];
    message: string;
  }
  