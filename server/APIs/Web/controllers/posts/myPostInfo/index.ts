import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IMyPostInfo,
    IApiReqParamsPostID,
    IApiWebReqLocals,
} from '@interfaces';

// Function Type
type ApiWebMyPostInfo = (
    req: Request<
        IApiReqParamsPostID,
        unknown,
        unknown,
        unknown,
        IApiWebReqLocals
    >,
    res: Response<ResJSON<IMyPostInfo>>
) => Promise<void>;

const Index: ApiWebMyPostInfo = async (req, res) => {
    const { postID } = req.params;

    try {
        if (isNaN(parseInt(postID))) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        if (!req.res) {
            const { statusCode, message } = new createHttpError.Unauthorized();

            res.status(statusCode).json({ status: 'Unauthorized', message });

            return;
        }

        const { userID } = req.res.locals;

        const data = await PostsModel.getMyPostInfo(parseInt(postID), userID);

        if (!data) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web My Post Info', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
