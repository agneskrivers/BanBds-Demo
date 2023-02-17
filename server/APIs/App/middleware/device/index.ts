import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { DevicesModel } from '@server/models';

// Interfaces
import type { ResJSON } from '@interfaces';

// Function Type
type ApiAppMiddlewareDevice = (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response<ResJSON>,
    next: NextFunction
) => Promise<void>;

const Index: ApiAppMiddlewareDevice = async (req, res, next) => {
    const token = req.headers['x-banbds-device-token'];

    try {
        if (!token || typeof token !== 'string') {
            res.status(401).json({ status: 'Unauthorized', message: 'device' });

            return;
        }

        const isDevice = await DevicesModel.check(token);

        if (!isDevice) {
            res.status(401).json({ status: 'Unauthorized', message: 'device' });

            return;
        }

        next();
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Middleware Device', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
