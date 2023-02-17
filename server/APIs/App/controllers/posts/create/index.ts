import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type { ResJSON, IPostCreate, IApiAppReqLocals } from '@interfaces';

// Function Type
type ApiAppPostCreate = (
    req: Request<unknown, unknown, IPostCreate, unknown, IApiAppReqLocals>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiAppPostCreate = async (req, res) => {
    try {
        if (!req.res) throw new Error('Response Locals Not Found!');

        const { userID } = req.res.locals;

        const isCreate = await PostsModel.createPost(userID, req.body);

        if (!isCreate) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Post Create', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
