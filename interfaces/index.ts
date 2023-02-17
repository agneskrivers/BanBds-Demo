import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';

// Helpers
export * from './helpers';

// Models
export * from './models';

// Requests
export * from './requests';

// Responses
export * from './responses';

// Services
export * from './services';

// Types
type LinkKey = 'HomePage' | 'Contact' | 'Guide' | 'Rules' | 'WebsiteName';
type ResultStatusSuccess<T = null> = T extends null
    ? ResultStatusSuccessNoData
    : ResultStatusSuccessData<T>;

// Interfaces
interface ResultStatusError {
    status: 'Error';
    error: string;
}
interface ResultStatusMessage {
    status: 'Not Process' | 'Unauthorized';
    message: string;
}
interface ResultStatusSuccessNoData {
    status: 'Success';
}
interface ResultStatusSuccessData<T> extends ResultStatusSuccessNoData {
    data: T;
}
interface ResultStatusImage {
    status: 'ImageFormat' | 'ImageToBig';
}
interface PropsServerError {
    status: 'error';
}
interface PropsServerSuccess {
    status: 'success';
}

// Export Types
export type IDeviceType = 'web' | 'app';
export type ILinkJSON = Record<LinkKey, string | null>;
export type ResJSON<T = null> =
    | ResultStatusSuccess<T>
    | ResultStatusError
    | ResultStatusMessage;
export type ResUploadImageJSON = ResJSON<string> | ResultStatusImage;
export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};
export type IPropsSeverSide<T> = PropsServerError | (PropsServerSuccess & T);

// Export Interfaces
export interface IDataUserToken {
    userID: number;
    timestamp: number;
}
export interface IDataDeviceToken {
    deviceID: string;
    timestamp: number;
}
export interface IVersionJSON {
    ver: string;
    mandatory: boolean;
    appStore: string;
    playStore: string;
}
export interface ISelectFilter {
    value: string;
    min: number;
    max: number;
}
export interface ISelect {
    value: string;
    label: string;
}
export interface IClientLocalStorage {
    data: {
        posts?: number[];
        projects?: number[];
        news?: number[];
    };
    expired: number;
}
