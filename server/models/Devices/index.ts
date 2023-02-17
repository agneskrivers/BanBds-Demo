import { model, Model, Schema } from 'mongoose';
import uniqid from 'uniqid';

// Configs
import { SecretJWT } from '@server/configs';

// Enums
import { TokenExpired } from '@server/enums';

// Helpers
import { handleError, jwt } from '@server/helpers';

// Interfaces
import type { IDataDeviceToken, IDeviceCreate, IDevice } from '@interfaces';

// Interface
interface CreateDeviceResult {
    deviceID: string;
    token: string;
}

// Model Interface
interface DeviceModel extends Model<IDevice> {
    createDevice(device: IDeviceCreate): Promise<CreateDeviceResult | null>;
    check(token: string): Promise<boolean>;
    renewTokenByDeviceID(deviceID: string): Promise<string | null>;
    renewTokenByInfo(info: IDeviceCreate): Promise<string | null>;
    updateDevice(
        deviceID: string,
        info: Partial<IDeviceCreate>
    ): Promise<boolean>;
}

// Schema
const DeviceSchema = new Schema<IDevice, DeviceModel>(
    {
        deviceID: {
            type: String,
            required: true,
            immutable: true,
            unique: true,
        },
        os: { type: String, required: true },

        brand: { type: String, default: null },
        model: { type: String, default: null },
        device: { type: String, default: null },
        lastUpdate: { type: Number, default: null },
        mac: { type: String, unique: true, required: true },
    },
    {
        timestamps: false,
    }
);

// Statics
DeviceSchema.statics.createDevice = async function (
    device: IDeviceCreate
): Promise<CreateDeviceResult | null> {
    const generateID = async (): Promise<string> => {
        const id = uniqid();

        const checkID = await this.findOne({ deviceID: id });

        if (checkID) return generateID();

        return id;
    };

    let deviceID: string | null = null;

    try {
        const checkDevice = await this.findOne(device);

        if (checkDevice) {
            deviceID = checkDevice.deviceID;
        } else {
            deviceID = await generateID();

            const deviceNew = new this({ ...device, deviceID });

            await deviceNew.save();
        }

        const data: IDataDeviceToken = {
            deviceID,
            timestamp: Date.now(),
        };

        const token = await jwt.generate<IDataDeviceToken>(
            data,
            SecretJWT,
            TokenExpired.device
        );

        if (!token) return null;

        return {
            token,
            deviceID,
        };
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Devices Static Create', message);

        return null;
    }
};
DeviceSchema.statics.check = async function (token: string): Promise<boolean> {
    try {
        const verify = await jwt.verify<IDataDeviceToken>(token, SecretJWT);

        if (!verify) return false;

        const { deviceID } = verify;

        const device = await this.findOne({ deviceID });

        if (device) return true;

        return false;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Devices Static Check', message);

        return false;
    }
};
DeviceSchema.statics.renewTokenByDeviceID = async function (
    deviceID: string
): Promise<string | null> {
    try {
        const device = await this.findOne({ deviceID });

        if (!device) return null;

        const data: IDataDeviceToken = {
            deviceID,
            timestamp: Date.now(),
        };

        const token = await jwt.generate<IDataDeviceToken>(
            data,
            SecretJWT,
            TokenExpired.device
        );

        return token;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Devices Static Renew Token By Device ID', message);

        return null;
    }
};
DeviceSchema.statics.renewTokenByInfo = async function (
    info: IDeviceCreate
): Promise<string | null> {
    try {
        const device = await this.findOne({ ...info });

        if (!device) return null;

        const { deviceID } = device.toObject();

        const data: IDataDeviceToken = {
            deviceID,
            timestamp: Date.now(),
        };

        const token = await jwt.generate<IDataDeviceToken>(
            data,
            SecretJWT,
            TokenExpired.device
        );

        return token;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Devices Static Renew Token By Info', message);

        return null;
    }
};
DeviceSchema.statics.updateDevice = async function (
    deviceID: string,
    info: Partial<IDeviceCreate>
): Promise<boolean> {
    try {
        const device = await this.findOne({ deviceID });

        if (!device) return false;

        if (info.brand) {
            device.brand = info.brand;
        }

        if (info.model) {
            device.model = info.model;
        }

        if (info.os) {
            device.os = info.os;
        }

        if (info.device) {
            device.device = info.device;
        }

        await device.save();

        return true;
    } catch (error) {
        const { message } = error as Error;

        handleError('Model Devices Static Update', message);

        return false;
    }
};

// Models
const Index = model<IDevice, DeviceModel>('Devices', DeviceSchema);

export default Index;
