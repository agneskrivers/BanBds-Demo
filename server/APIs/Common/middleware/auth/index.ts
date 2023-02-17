import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { DevicesModel, UsersModel } from '@server/models';

// Interfaces
import type { ResJSON } from '@interfaces';

// Function Type
type ApiCommonMiddlewareAuth = (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response<ResJSON>,
    next: NextFunction
) => Promise<void>;

const Index: ApiCommonMiddlewareAuth = async (req, res, next) => {
    const user = req.headers['authorization'];
    const device = req.headers['x-banbds-device-token'];
    const session = req.sessionID;

    try {
        const { statusCode, message } = new createHttpError.Unauthorized();

        if (!user && !device && !session) {
            res.status(statusCode).json({ status: 'Unauthorized', message });

            return;
        }

        if (user) {
            const isToken = await UsersModel.checkToken(user);

            if (!isToken) {
                res.status(statusCode).json({
                    status: 'Unauthorized',
                    message,
                });

                return;
            }

            return next();
        }

        if (device) {
            if (typeof device !== 'string') {
                res.status(statusCode).json({
                    status: 'Unauthorized',
                    message,
                });

                return;
            }

            const isDevice = await DevicesModel.check(device);

            if (!isDevice) {
                res.status(statusCode).json({
                    status: 'Unauthorized',
                    message,
                });

                return;
            }

            return next();
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
