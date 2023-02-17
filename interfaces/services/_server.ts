// Interfaces
import type { IPostCoordinate } from '@interfaces';

// Export Type
export type IServerServiceCoordinate = (
    regionID: string,
    districtID: string,
    wardID: string
) => Promise<IPostCoordinate | null>;
export type IServerServiceSMS = (
    phoneNumber: string,
    otp: string
) => Promise<boolean>;
