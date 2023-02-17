// Export Types
export type IBrokerInfoForWeb = Omit<IBroker, 'note' | 'createdBy'>;

// Export Interfaces
export interface IBroker {
    name: string;
    phoneNumber: string[];
    avatar: string | null;
    zalo: string | null;
    facebook: string | null;
    note: string | null;
    createdBy: string;
}
