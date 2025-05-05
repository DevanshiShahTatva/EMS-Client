export interface IRequestType {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    __v: number;
}

export interface IRequestResponse {
    success: boolean;
    data: IRequestType[];
}

export interface IDisabledTextFieldProps {
    label: string;
    name: string;
    value: string;
    type: string;
};