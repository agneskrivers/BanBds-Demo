import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { UsersModel } from '@server/models';

// Interfaces
import type { ResJSON, IUserCreate } from '@interfaces';

// Function Type
type ApiWebUserCreate = (
    req: Request<unknown, unknown, IUserCreate>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiWebUserCreate = async (req, res) => {
    try {
        const data = await UsersModel.createUser(req.body, 'web');

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200)
            .cookie('user', data, {
                httpOnly: true,
                sameSite: 'lax',
                signed: true,
                secure: true,
            })
            .json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web User Create', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
