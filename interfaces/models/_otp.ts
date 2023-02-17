// Export Types
export type IOtpTracking = Pick<IOtp, 'phoneNumber' | 'expiredAt'>;

// Export Interfaces
export interface IOtp {
    phoneNumber: string;
    otp: string;
    expiredAt: Date;
    failed: number;
    renew: number;
    lastSend: Date;
    isHash: boolean;
}
