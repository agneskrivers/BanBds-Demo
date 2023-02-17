// Interfaces
import type {
    IRegionCompact,
    IDistrict,
    IWard,
    ILinkJSON,
    IProjectCompactForApp,
    IPostCompactForApp,
    INewsCompactForApp,
    IHotNewsCompactForApp,
} from '@interfaces';

// Interface
interface ApiAppLoginCheckResultNotCreated {
    isCreated: false;
}
interface ApiAppLoginCheckResultCreated {
    isCreated: true;
    token: string;
}

// Export Types
export type IApiAppDeviceDaily = Pick<
    IApiAppInitResult,
    'link' | 'regions' | 'remaps'
>;
export type IApiAppLoginCheckResult =
    | ApiAppLoginCheckResultCreated
    | ApiAppLoginCheckResultNotCreated;
export type IApiAppPostMyShortlistForAppResult = Omit<
    IApiAppPostShortlistForAppResult,
    'totals'
>;

// Export Interfaces
export interface IApiAppInitResult {
    deviceID: string;
    token: string;
    regions: IRegionCompact[];
    districts: IDistrict[];
    wards: IWard[];
    link: ILinkJSON;
    remaps: string;
}
export interface IApiAppDashboardResult {
    totals: number;
    projects: IProjectCompactForApp[];
    posts: IPostCompactForApp[];
}
export interface IApiAppNewsShortlist {
    hot: IHotNewsCompactForApp | null;
    news: INewsCompactForApp[];
    pages: number;
}
export interface IApiAppPostShortlistForAppResult {
    totals: number;
    pages: number;
    posts: IPostCompactForApp[];
}
export interface IApiAppPostUpdateResult {
    create: string[];
    remove: string[];
}
