export interface ITicketBookingResponse {
  status: number;
  success: boolean;
  message: string;
  data: ITicketBooking[];
}

export interface ITicketBooking {
  _id: string;
  user: IUser;
  event: IEvent;
  ticket: string;
  seats: number;
  discount: number;
  totalAmount: number;
  paymentId: string;
  isAttended: boolean;
  bookingStatus: string;
  cancelledAt: string | null;
  bookingDate: string;
  __v: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profileimage: IImage;
  current_badge: string;
  current_points: number;
  total_earned_points: number;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  latitude: string;
  longitude: string;
  role: 'user' | 'organizer';
}

export interface IImage {
  imageId: string;
  url: string;
  _id: string;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  duration: string;
  category: ICategory;
  tickets: ITicketType[];
  images: IImage[];
  location: Location;
  likes: string[];
  isLiked: boolean;
  likesCount: number;
  numberOfPoint: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICategory {
  _id: string;
  name: string;
  isActive: boolean;
  color: string;
  bgColor: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  icon: {
    url: string;
    imageId: string;
  };
}

export interface ITicketType {
  _id: string;
  type: {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  price: number;
  totalSeats: number;
  totalBookedSeats: number;
  description: string;
}

export interface ILocation {
  address: string;
  lat: number;
  lng: number;
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}


export interface IPaymentHistory {
    id : string,
    title: string,
    noSeats: number,
    totalAmount : number,
    refundedAmount : number,
    bookingDate : string,
    cancelledDate : string
    staus : string,
}