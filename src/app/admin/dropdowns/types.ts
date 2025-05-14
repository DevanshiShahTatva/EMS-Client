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


export interface IEventCategoryResp {
    success: boolean
    data: IEventCategory[]
    message: string
}

export interface IEventCategory {
    _id: string
    name: string
    isActive: boolean
    color: string
    bgColor: string
    icon: Icon
    createdAt: string
    updatedAt: string
    __v: number
}

export interface Icon {
    url: string
    imageId: string
}

export type TLoadingState = {
    getApi: boolean;
    createApi: boolean;
    updateApi: boolean;
    deleteApi: boolean;
};


export type TCategoryFormValues = {
    id: string;
    name: string;
    color: string;
    bgColor: string;
    icon: {
        previewUrl?: string;
        file?: File | null;
        url: string;
        imageId: string;
    };
};
