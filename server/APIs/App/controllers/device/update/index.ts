import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { DevicesModel } from '@server/models';

// Interfaces
import type { ResJSON, IDeviceCreate } from '@interfaces';

// Request Interface
interface ReqParams {
    deviceID: string;
}

// Function Type
type ApiAppDeviceUpdate = (
    req: Request<ReqParams, unknown, Partial<IDeviceCreate>>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiAppDeviceUpdate = async (req, res) => {
    const { deviceID } = req.params;

    try {
        const isUpdate = await DevicesModel.updateDevice(deviceID, req.body);

        if (!isUpdate) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Device Update', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
