import type {
    IPostCompactModeEditorForWeb,
    ISelect,
    IResultGetShortlistForWeb,
    INewsResultGetForDashboardWeb,
    IPostResultGetForDashboardWeb,
    IProjectCompactForWebDashboard,
    IPostTotalsByAreaDashboardWeb,
    IProjectInfo,
    IPostCompactModeVerticalForWeb,
    ITotalsByAreas,
    IProjectResultGetShortlistForWeb,
    INewsResultGetShortlistForWeb,
    IPostResultGetForNews,
    INewsResultGetInfoForWeb,
    IUserInfoForUser,
} from '@interfaces';

// Interfaces
interface IApiWebFirstNoLogin {
    mode: 'notLogin';
    regions: ISelect[];
}
interface IApiWebFirstLogin {
    mode: 'login';
    regions: ISelect[];
    user: IUserInfoForUser;
}

// Export Types
export type IApiWebFirst = IApiWebFirstLogin | IApiWebFirstNoLogin;

// Export Interfaces
export interface IApiWebPostMyShortlist {
    posts: IPostCompactModeEditorForWeb[];
    pages: number;
}
export interface IApiWebPostShortlist extends IResultGetShortlistForWeb {
    projects: ISelect[];
    areas: ITotalsByAreas[] | null;
}

export interface IApiWebDashboard {
    projects: IProjectCompactForWebDashboard[] | null;
    news: INewsResultGetForDashboardWeb | null;
    sell: IPostResultGetForDashboardWeb | null;
    rent: IPostResultGetForDashboardWeb | null;
    areas: IPostTotalsByAreaDashboardWeb | null;
}
export interface IApiWebProjectInfo {
    data: IProjectInfo;
    posts: IPostCompactModeVerticalForWeb[] | null;
}
export interface IApiWebProjectShortlist
    extends IProjectResultGetShortlistForWeb {
    areas: ITotalsByAreas[] | null;
}
export interface IApiWebNewsShortlist {
    news: INewsResultGetShortlistForWeb;
    posts: IPostResultGetForNews | null;
}
export interface IApiWebNewsInfo extends INewsResultGetInfoForWeb {
    posts: IPostResultGetForNews | null;
}
export interface IApiWebRegion {
    regionID: string;
    name: string;
}
export interface IApiWebDistrict {
    districtID: string;
    name: string;
}
