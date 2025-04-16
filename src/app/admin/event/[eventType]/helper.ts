export type TicketType = {
    type: string;
    price: string;
    max_qty: string;
    description: string;
};

export type EventLocation = {
    address: string;
    lat: number;
    long: number;
};

export type EventFormData = {
    title: string;
    description: string;
    location: EventLocation;
    start_time: Date | null;
    end_time: Date | null;
    duration: string;
    category: OptionType | null;
    ticket_type: TicketType[];
    images: File[];
};

export type EventFormDataErrorTypes = {
    title: boolean;
    description: boolean;
    location: boolean;
    start_time: boolean;
    end_time: boolean;
    duration: boolean;
    category: boolean;
    ticket_type: boolean;
    images: boolean;
};

export interface LocationField {
    latitude: number,
    longitude: number,
    location: string
}


export const InitialEventFormDataValues: EventFormData = {
    title: "",
    description: "",
    location: {
        address: "Ahmedabad",
        lat: 23.022505,
        long: 72.5713621,
    },
    start_time: null,
    end_time: null,
    duration: "",
    category: null,
    ticket_type: [
        {
            type: "",
            price: "",
            max_qty: "",
            description: "",
        },
    ],
    images: [],
}

export const InitialEventFormDataErrorTypes = {
    title: false,
    description: false,
    location: false,
    start_time: false,
    end_time: false,
    duration: false,
    category: false,
    ticket_type: false,
    images: false,
};

export type OptionType = {
    label: string;
    value: string;
    icon: string;
};


export type Ticket = {
    id: string;
    type: string;
    price: string;
    maxQty: number;
    description: string;
    isEditing?: boolean;
};