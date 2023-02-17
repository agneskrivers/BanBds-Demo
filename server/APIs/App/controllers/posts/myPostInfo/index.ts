import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IApiReqParamsPostID,
    IApiAppReqLocals,
    IMyPostInfo,
} from '@interfaces';

// Function Type
type ApiAppMyPostInfo = (
    req: Request<
        IApiReqParamsPostID,
        unknown,
        unknown,
        unknown,
        IApiAppReqLocals
    >,
    res: Response<ResJSON<IMyPostInfo>>
) => Promise<void>;

const Index: ApiAppMyPostInfo = async (req, res) => {
    const { postID } = req.params;

    try {
        if (!req.res) throw new Error('Response Locals Not Found!');

        if (isNaN(parseInt(postID))) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const { userID } = req.res.locals;

        const data = await PostsModel.getMyPostInfo(parseInt(postID), userID);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App My Post Info', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
