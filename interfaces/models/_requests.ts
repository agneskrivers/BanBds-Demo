// Types
type RequestInfo = Omit<
    IRequest,
    'userID' | 'editor' | 'createdAt' | 'updatedAt'
>;

// Export Types
export type IRequestStatus = 'pending' | 'accept';
export type IRequestCreate = Omit<
    IRequest,
    'editor' | 'createdAt' | 'updatedAt'
>;

// Export Interfaces
export interface IRequest {
    userID: number;
    content: string;
    region: string;
    district: string;
    ward: string;
    min: number;
    max: number;
    status: IRequestStatus;

    editor: string | null;

    createdAt: Date;
    updatedAt: Date;
}
export interface IRequestInfo extends RequestInfo {
    id: string;
}
