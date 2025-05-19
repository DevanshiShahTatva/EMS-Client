export interface IEventFormProps {
    eventType: string
}

export interface IEventPageProps {
    params: Promise<{ eventType: string }>;
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
    maxQty: number;
    description: string;
    isEditing?: boolean;
    _id : string,
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
  label: string;
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
};