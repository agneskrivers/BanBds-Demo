import path from 'path';

// Interfaces
import type { ILinkJSON, IVersionJSON } from '@interfaces';

export const MongoURI = process.env.MONGO_URI as string;
export const MongoStoreURI = process.env.MONGO_STORE_URI as string;
export const SecretJWT = process.env.SECRET_JWT as string;
export const SecretCookie = process.env.SECRET_COOKIE as string;
export const SecretSession = process.env.SECRET_SESSION as string;
export const LimitRenewOTP = parseInt(
    process.env.NEXT_PUBLIC_LIMIT_RENEW_OTP as string
);
export const LimitFailedOTP = parseInt(
    process.env.NEXT_PUBLIC_LIMIT_FAILED_OTP as string
);
export const ESmsApiKey = process.env.ESMS_API_KEY as string;
export const ESmsSecretKey = process.env.ESMS_SECRET_KEY as string;

export const pathPublic = path.join(process.cwd(), 'public');
export const pathImages = path.join(pathPublic, 'images');
export const pathTemp = path.join(process.cwd(), 'uploads');
export const pathData = path.join(process.cwd(), 'data');

export const pathJS = path.join(pathPublic, 'js');
export const pathCSS = path.join(pathPublic, 'css');

export const LinkDefault: ILinkJSON = {
    Contact: null,
    Guide: null,
    HomePage: null,
    Rules: null,
    WebsiteName: null,
};
export const VersionDefault: IVersionJSON = {
    appStore: '',
    mandatory: false,
    playStore: '',
    ver: '1.0.0',
};
export const ESmsCodeResponse: Record<string, string> = {
    '104': 'BrandName does not exist or has been canceled',
    '118': 'Invalid message type',
    '119': 'Brand name advertising must send at least 20 phone numbers',
    '131': 'The maximum length of advertising BrandName messages is 422 characters',
    '132': 'No permission to send text messages with fixed number 8755',
    '99': 'An unknown error',
    '177': 'BrandName has no direction',
    '159': 'RequestId more than 120 characters',
    '145': 'Wrong social media template',
};
export const ValidExtname = ['.png', '.jpg', '.jpeg', '.heic'];
