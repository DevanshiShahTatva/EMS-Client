export interface IEventFormProps {
    eventType: string
    isCloneEvent? : boolean
}

export interface IEventPageProps {
    params: Promise<{ eventType: string }>;
}

export interface IEventClonePageProps {
    params: Promise<{ eventId: string }>;
}
export interface ITicketType {
    type: string;
    price: string;
    max_qty: string;
    description: string;
};

export interface IEventLocation {
    address: string;
    lat: number;
    long: number;
};

export interface IEventFormData {
    title: string;
    description: string;
    location: IEventLocation;
    start_time: Date | null;
    end_time: Date | null;
    duration: string;
    category: string;
    ticket_type: ITicketType[];
    images: File[];
    points: string;
};

export interface IEventFormDataErrorTypes {
    title: boolean;
    description: boolean;
    location: boolean;
    start_time: boolean;
    end_time: boolean;
    duration: boolean;
    category: boolean;
    ticket_type: boolean;
    images: boolean;
    points: boolean;
};

export interface ILocationField {
    latitude: number,
    longitude: number,
    location: string
}

export type IOptionType = {
    label: string;
    value: string;
    icon: string;
};

export type ITicket = {
    id: string;
    type: string;
    price: string;
    maxQty: string;
    description: string;
    isEditing?: boolean;
    _id : string,
    isLayoutAdded?: boolean
    isDisabled?: boolean
};

export interface ITicketInfo {
    id: string;
    ticketType: string;
    ticketPrice: string;
    totalSeats: string;
};

export interface ISuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export interface IAddressAutoCompleteProps {
  getLocationData: (locationData: ILocationField) => void
  label: string,
  name: string,
  required?: boolean
  placeholder?: string;
  errorMsg?: string;
  errorKey?: boolean
  defaultValue?: IEventLocation; 
}

export type TValuePiece = Date | null;
export type TValue = TValuePiece | [TValuePiece, TValuePiece];

export interface IDateTimePickerFieldProps {
  label: string;
  name: string;
  value: TValue;
  onChange: (value: Date | null) => void;
  errorMsg?: string;
  errorKey?: boolean;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  minDate? : Date
};

export interface ITextFieldProps {
  label: string;
  name: string;
  errorKey : boolean;
  type?: string;
  placeholder?: string;
  value: string;
  errorMsg?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  required?: boolean;
  readOnly?:boolean;
  disabled?:boolean;
  multiple?: boolean;
};

export interface IQuilEditorProps {
  label: string;
  name : string
  value: string;
  onChange: (value : string) => void;
  errorKey : boolean;
  placeholder?: string;
  errorMsg?: string;
  required?: boolean;
  handleGenerateDescription?: () => void;
  isDescriptionGenerating?: boolean;
  iSGenerateButtonDisabled?: boolean;
};

export interface ISelectFieldsProps {
  label?: string;
  name: string;
  errorKey : boolean;
  options :  any[];
  value: string;
  onChange: (option: string) => void;
  placeholder?: string;
  errorMsg?: string;
  required?: boolean;
  readOnly?:boolean;
  disabled?:boolean;
  height?: string,
};

export interface ISeatLayout {
  ticketType: string; // ObjectId as string
  price: number;
  rows: ISeatRow[];
  id?:string
}

export interface ISeatRow {
  row: string; // e.g., "A", "B", etc.
  seats: ISeat[];
}

export interface ISeat {
  seatNumber: string | number; // e.g., "A1", "A2"
  isUsed: boolean;
}



interface ISeatApiResponse {
  seatNumber: string | number; // `0` is a string, others like "A1" are strings
  isUsed: boolean;
  _id?: string;
}

// Define the type for a row object within a seat layout
interface IRow {
  row: string;
  seats: ISeatApiResponse[];
  _id?: string;
}

// Define the type for the TicketType object (nested inside seatLayout)
interface ISeatTicketType {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the type for a single seat layout item
interface IEventSeatLayout {
  ticketType: ISeatTicketType; // This is now an object, not just an ID string
  price: number;
  rows: IRow[];
  _id: string;
}

// Define the type for a single data entry in the 'data' array
interface ISeactLayoutData {
  _id: string;
  event: string; // Assuming this is an event ID string
  seatLayout: IEventSeatLayout[]; // This is an array of seat layouts
  __v: number;
}

// Define the overall structure of the API response
export interface ISeatLayoutResponse {
  status: number;
  data: ISeactLayoutData[];
  success: boolean;
  message: string;
}
