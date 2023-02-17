import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { UsersModel } from '@server/models';

// Interfaces
import type { ResJSON, IUserInfoForUser, IApiAppReqLocals } from '@interfaces';

// Function Type
type ApiAppUserInfo = (
    req: Request<unknown, unknown, unknown, unknown, IApiAppReqLocals>,
    res: Response<ResJSON<IUserInfoForUser>>
) => Promise<void>;

const Index: ApiAppUserInfo = async (req, res) => {
    try {
        if (!req.res) throw new Error('Response Locals Not Found!');

        const { userID } = req.res.locals;

        const data = await UsersModel.getInfoForUser(userID);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App User Info', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
