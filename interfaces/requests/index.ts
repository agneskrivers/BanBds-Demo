// Interfaces
import type {
    IPostType,
    IPostCategory,
    IPostSortValue,
    IProjectStatus,
    IProjectType,
} from '@interfaces';

// Export Interfaces

// TODO: App
export interface IServerServiceESmsReqBody {
    ApiKey: string;
    SecretKey: string;
    Phone: string;
    Content: string;
    SmsType: number;
}
export interface IApiReqParamsPhoneNumber {
    phoneNumber: string;
}
export interface IApiLoginCheckReqBody {
    otp: string;
}

export interface IApiAppReqLocals {
    userID: number;
}

export interface IApiReqParamsPostID {
    postID: string;
}
export interface IApiAppPostShortlistReqQuery {
    type: IPostType;
    page: string;
    region?: string;
    district?: string;
    search?: string;
    category?: IPostCategory;
    pricesMin?: string;
    pricesMax?: string;
    acreagesMin?: string;
    acreagesMax?: string;
    prices?: IPostSortValue;
    acreages?: IPostSortValue;
    createdAt?: IPostSortValue;
}

// TODO: Web
export interface IApiWebReqLocals {
    userID: number;
}
export interface IApiWebPostShortlistReqQuery {
    type: IPostType;
    page: string;
    region?: string;
    district?: string;
    project?: string;
    search?: string;
    category?: IPostCategory;
    pricesMin?: string;
    pricesMax?: string;
    acreagesMin?: string;
    acreagesMax?: string;
    prices?: IPostSortValue;
    acreages?: IPostSortValue;
    createdAt?: IPostSortValue;
}
export interface IApiWebProjectShortlistReqQuery {
    page: string;
    region?: string;
    district?: string;
    search?: string;
    type?: IProjectType;
    status?: IProjectStatus;
    pricesMin?: string;
    pricesMax?: string;
}
