import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { UsersModel } from '@server/models';

// Interfaces
import type { ResJSON, IUserUpdateInfo, IApiWebReqLocals } from '@interfaces';

// Function Type
type ApiWebUserUpdate = (
    req: Request<unknown, unknown, IUserUpdateInfo, unknown, IApiWebReqLocals>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiWebUserUpdate = async (req, res) => {
    try {
        if (!req.res) {
            const { statusCode, message } = new createHttpError.Unauthorized();

            res.status(statusCode).json({ status: 'Unauthorized', message });

            return;
        }

        const { userID } = req.res.locals;

        const user = await UsersModel.findOne({ userID });

        if (!user) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const isUpdate = await user.updateInfo(req.body);

        if (!isUpdate) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web User Update', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
