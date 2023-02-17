import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { DevicesModel } from '@server/models';

// Interfaces
import type { ResJSON } from '@interfaces';

// Request Interface
interface ReqParams {
    deviceID: string;
}

// Function Type
type ApiAppRenewDeviceID = (
    req: Request<ReqParams>,
    res: Response<ResJSON<string>>
) => Promise<void>;

const Index: ApiAppRenewDeviceID = async (req, res) => {
    const { deviceID } = req.params;

    try {
        const data = await DevicesModel.renewTokenByDeviceID(deviceID);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Renew Device ID', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
