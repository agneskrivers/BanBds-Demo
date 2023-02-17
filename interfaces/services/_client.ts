import type {
    IApiWebDashboard,
    IApiWebNewsInfo,
    IApiWebNewsShortlist,
    IPostCreate,
    IPostInfoForWeb,
    IMyPostInfo,
    IApiWebPostMyShortlist,
    IPostStatus,
    IApiWebPostShortlist,
    IPostType,
    IPostCategory,
    IPostSortValue,
    IPostUpdateForUser,
    IApiWebProjectInfo,
    IApiWebProjectShortlist,
    IProjectType,
    IProjectStatus,
    IRequestCreate,
    IUserCreate,
    IUserInfoForUser,
    IUserUpdateInfo,
    IApiWebDistrict,
    IApiWebRegion,
    IPostResultGetForDashboardWeb,
    IDistrictInfo,
    IWardInfo,
    IApiWebFirst,
} from '@interfaces';

// Types
type ResultDashboard = IApiWebDashboard | null;
type ResultDistrict = IApiWebDistrict | null;
type ResultLoginCheck = 'BadRequest' | 'Token' | boolean | null;
type ResultLoginSend =
    | 'Renew'
    | 'Failed'
    | 'BadRequest'
    | null
    | { otp: string };
type ResultNewsInfo = IApiWebNewsInfo | 'NotFound' | null;
type ResultNewsShortlist = IApiWebNewsShortlist | 'BadRequest' | null;
type ResultPostCreate = 'Unauthorized' | 'BadRequest' | boolean;
type ResultPostsDashboard = 'BadRequest' | IPostResultGetForDashboardWeb | null;
type ResultPostInfo = IPostInfoForWeb | 'NotFound' | null;
type ResultMyPostInfo = IMyPostInfo | 'NotFound' | 'Unauthorized' | null;
type ResultPostMyShortlist =
    | IApiWebPostMyShortlist
    | 'NotFound'
    | 'Unauthorized'
    | null;
type ResultPostRemove = boolean | 'NotFound' | 'Unauthorized' | 'BadRequest';
type ResultPostShortlist = IApiWebPostShortlist | 'BadRequest' | null;
type ResultPostSold = boolean | 'NotFound' | 'Unauthorized' | 'BadRequest';
type ResultPostUpdate =
    | boolean
    | 'NotFound'
    | 'Unauthorized'
    | 'BadRequest'
    | null
    | ResultPostUpdateFailed;
type ResultProjectInfo = IApiWebProjectInfo | 'NotFound' | null;
type ResultProjectShortlist = IApiWebProjectShortlist | 'BadRequest' | null;
type ResultRegion = IApiWebRegion | null;
type ResultRequest = boolean | 'Unauthorized' | 'BadRequest';
type ResultUserCreate = boolean | 'BadRequest';
type ResultUserInfo = IUserInfoForUser | 'Unauthorized' | 'BadRequest' | null;
type ResultUserUpdate = boolean | 'Unauthorized' | 'BadRequest';
type ResultCommonAddressDistricts = IDistrictInfo[] | null | 'BadRequest';
type ResultCommonAddressWards = IWardInfo[] | null | 'BadRequest';
type ResultCommonImageUpload =
    | 'ImageFormat'
    | 'ImageToBig'
    | 'NotFound'
    | 'Unauthorized'
    | { data: string }
    | null;

// Interface
interface ResultPostUpdateFailed {
    create: string[];
    remove: string[];
}

// Export Types
export type IClientServiceDashboard = () => Promise<ResultDashboard>;
export type IClientServiceDistrict = (
    regionID: string,
    district: string
) => Promise<ResultDistrict>;
export type IClientServiceLoginCheck = (
    signal: AbortSignal,
    phoneNumber: string,
    otp: string
) => Promise<ResultLoginCheck>;
export type IClientServiceLoginSend = (
    signal: AbortSignal,
    phoneNumber: string
) => Promise<ResultLoginSend>;
export type IClientServiceNewsInfo = (
    newsID: number
) => Promise<ResultNewsInfo>;
export type IClientServiceNewsShortlist = (
    page: number,
    list?: number[],
    signal?: AbortSignal
) => Promise<ResultNewsShortlist>;
export type IClientServicePostCreate = (
    signal: AbortSignal,
    body: IPostCreate
) => Promise<ResultPostCreate>;
export type IClientServicePostInfo = (
    postID: number
) => Promise<ResultPostInfo>;
export type IClientServicePostDashboard = (
    signal: AbortSignal,
    type: IPostType,
    page: number
) => Promise<ResultPostsDashboard>;
export type IClientServiceMyPostInfo = (
    signal: AbortSignal,
    postID: number
) => Promise<ResultMyPostInfo>;
export type IClientServicePostMyShortlist = (
    signal: AbortSignal,
    page: number,
    status?: IPostStatus
) => Promise<ResultPostMyShortlist>;
export type IClientServicePostRemove = (
    signal: AbortSignal,
    postID: number
) => Promise<ResultPostRemove>;
export type IClientServicePostShortlist = (
    type: IPostType,
    page: number,
    region?: string,
    district?: string,
    project?: string,
    search?: string,
    category?: IPostCategory,
    pricesMin?: number,
    pricesMax?: number,
    acreagesMin?: number,
    acreagesMax?: number,
    prices?: IPostSortValue,
    acreages?: IPostSortValue,
    createdAt?: IPostSortValue,
    signal?: AbortSignal
) => Promise<ResultPostShortlist>;
export type IClientServicePostSold = (
    signal: AbortSignal,
    postID: number
) => Promise<ResultPostSold>;
export type IClientServicePostUpdate = (
    signal: AbortSignal,
    postID: number,
    body: IPostUpdateForUser
) => Promise<ResultPostUpdate>;
export type IClientServiceProjectInfo = (
    projectID: number
) => Promise<ResultProjectInfo>;
export type IClientServiceProjectShortlist = (
    page: number,
    region?: string,
    district?: string,
    search?: string,
    type?: IProjectType,
    status?: IProjectStatus,
    pricesMin?: number,
    pricesMax?: number,
    signal?: AbortSignal
) => Promise<ResultProjectShortlist>;
export type IClientServiceRegion = (region: string) => Promise<ResultRegion>;
export type IClientServiceRequest = (
    signal: AbortSignal,
    body: Omit<IRequestCreate, 'userID' | 'status'>
) => Promise<ResultRequest>;
export type IClientServiceUserCreate = (
    signal: AbortSignal,
    body: IUserCreate
) => Promise<ResultUserCreate>;
export type IClientServiceUserInfo = (
    signal: AbortSignal
) => Promise<ResultUserInfo>;
export type IClientServiceUserUpdate = (
    signal: AbortSignal,
    body: IUserUpdateInfo
) => Promise<ResultUserUpdate>;
export type IClientServiceCommonAddressDistricts = (
    signal: AbortSignal,
    regionID: string
) => Promise<ResultCommonAddressDistricts>;
export type IClientServiceCommonAddressWards = (
    signal: AbortSignal,
    districtID: string
) => Promise<ResultCommonAddressWards>;
export type IClientServiceCommonImageRemove = (
    signal: AbortSignal,
    fileName: string
) => Promise<boolean>;
export type IClientServiceCommonImageUpload = (
    signal: AbortSignal,
    body: FormData
) => Promise<ResultCommonImageUpload>;
export type IClientServiceFirst = (
    signal: AbortSignal
) => Promise<IApiWebFirst>;
export type IClientServiceCount = (
    signal: AbortSignal,
    id: number
) => Promise<boolean>;
