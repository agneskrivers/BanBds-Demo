// Address
export * from './_address';

// Analytics
export * from './_analytics';

// Brokers
export * from './_brokers';

// Devices
export * from './_device';

// Investors
export * from './_investors';

// News
export * from './_news';

// OTPs
export * from './_otp';

// Posts
export * from './_post';

// Projects
export * from './_projects';

// Requests
export * from './_requests';

// Users
export * from './_users';

// Type
type ImagePathType = Exclude<IImagePathType, 'avatars'>;
type Image = Partial<Record<ImagePathType, number>>;

// Export Type
export type IImagePathType = 'avatars' | 'news' | 'posts' | 'projects';

// Export Interfaces
export interface IImage extends Image {
    fileName: string;
    userID: number;
}
export interface ITotalsByAreas {
    name: string;
    totals: number;
    id: string;
}
