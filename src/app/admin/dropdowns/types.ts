export interface ITicketType {
    _id: string
    name: string
    description: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

export interface ITicketTypeItem {
    name: "",
    description: "",
}
export interface ITicketTypesResp {
    "success": boolean,
    "data": ITicketType[],
    "message": string
}

export interface ITicketTypeFormValues {
    id?: string;
    name: string;
    description: string;
}

export interface IAddEditTicketTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: ITicketTypeFormValues) => void;
    initialValues: ITicketTypeFormValues;
    mode?: "add" | "edit";
    submitLoading?: boolean;
}