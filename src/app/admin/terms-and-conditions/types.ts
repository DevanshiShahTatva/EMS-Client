export interface ITermsResponse {
    success: boolean;
    data: {
        _id: string;
        content: string;
        createdAt: string; // ISO date string
        updatedAt: string; // ISO date string
        __v: number;
    };
    message: string;
};