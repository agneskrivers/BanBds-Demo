import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type { ResJSON, IPostCreate, IApiWebReqLocals } from '@interfaces';

// Request Type
type ReqBody = IPostCreate;

// Function Type
type ApiWebPostCreate = (
    req: Request<unknown, unknown, ReqBody, unknown, IApiWebReqLocals>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiWebPostCreate = async (req, res) => {
    try {
        if (!req.res) {
            const { statusCode, message } = new createHttpError.Unauthorized();

            res.status(statusCode).json({ status: 'Unauthorized', message });

            return;
        }

        const { userID } = req.res.locals;

        const postID = await PostsModel.createPost(userID, req.body);

        if (postID === null) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Post Create', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
