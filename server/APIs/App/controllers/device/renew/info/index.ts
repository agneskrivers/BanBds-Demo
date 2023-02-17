import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { DevicesModel } from '@server/models';

// Interfaces
import type { ResJSON, IDeviceCreate } from '@interfaces';

// Function Type
type ApiAppRenewInfo = (
    req: Request<unknown, unknown, IDeviceCreate>,
    res: Response<ResJSON<string>>
) => Promise<void>;

const Index: ApiAppRenewInfo = async (req, res) => {
    try {
        const data = await DevicesModel.renewTokenByInfo(req.body);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Renew Info', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
