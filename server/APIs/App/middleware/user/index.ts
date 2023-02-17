import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { UsersModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiAppReqLocals } from '@interfaces';

// Function Type
type ApiAppMiddlewareUser = (
    req: Request<unknown, unknown, unknown, unknown>,
    res: Response<ResJSON, IApiAppReqLocals>,
    next: NextFunction
) => Promise<void>;

const Index: ApiAppMiddlewareUser = async (req, res, next) => {
    const token = req.headers['authorization'];

    try {
        if (!token) {
            const { statusCode, message } = new createHttpError.Unauthorized();

            res.status(statusCode).json({ status: 'Unauthorized', message });

            return;
        }

        const userID = await UsersModel.checkToken(token);

        if (!userID) {
            const { statusCode, message } = new createHttpError.Unauthorized();

            res.status(statusCode).json({ status: 'Unauthorized', message });

            return;
        }

        res.locals = { userID };

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
