// Export Types
export type IDeviceCreate = Omit<IDevice, 'lastUpdate' | 'deviceID'>;

// Export Interfaces
export interface IDevice {
    deviceID: string;
    brand: string | null;
    model: string | null;
    device: string | null;
    os: string; // name - version - buildID;
    mac: string;
    lastUpdate: number | null;
}
