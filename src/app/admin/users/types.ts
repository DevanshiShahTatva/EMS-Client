export interface IProfileImage {
  imageId: string;
  url: string;
  _id: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profileimage: IProfileImage | null;
  current_badge: string;
  current_points: number;
  total_earned_points: number;
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zipcode: string | null;
  latitude: string | null;
  longitude: string | null;
  role: 'user' | 'organizer';
  email_otp?: string;
  email_otp_expiry?: string;
}

export interface IUsersApiResponse {
  status: number;
  data: IUser[];
  success: boolean;
  message: string;
}


export interface IUserData { 
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    badge: string;
    address: string;
    points : number
    role: string;
}

export interface ISingleUserFormValues {
    name: string
    email: string
    role: string
}