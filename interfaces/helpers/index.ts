// Helpers
export type IServerJwtGenerate = <T>(
    data: T,
    secret: string,
    expired?: string | number
) => Promise<string | null>;
export type IServerJwtVerify = <T>(
    token: string,
    secret: string
) => Promise<T | null>;
export type IServerHandleError = (location: string, error: string) => void;
export type IServerGenerateID = () => Promise<number | null>;
export type IServerGetAddress = (
    regionID: string,
    districtID: string,
    wardID: string,
    address?: string
) => Promise<string | null>;
export type IServerGetPages = (totals: number, item?: number) => number;

// Common
export type IServerCommonConvertHEIC = (
    fileName: string
) => Promise<string | null>;
export type IServerCommonConvertSize = (
    pathFile: string,
    isAvatar: boolean
) => Promise<string | null>;
export type IServerCommonGenerateFileName = (fileName: string) => string;
