export interface IChangePasswordFormValues {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
};

export interface IChangeNewEmailValues {
    email : string
};

export interface IOtpValues {
    otp : string
};

export interface IProfileInfoValues {
    userName: string,
    address: string,
    profileImage: File | null,
    deleteImage?: string
};

export interface IUserInfo {
    _id: string;
    name: string;
    email: string;
    address: string;
    profileimage: string | null;
}