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
    IApiWebReqLocals,
    IPostUpdateForUser,
} from '@interfaces';

// Request Type
type ReqBody = IPostUpdateForUser;

// Response Interface
interface Result {
    create: string[];
    remove: string[];
}

// Function Type
type ApiWebPostUpdate = (
    req: Request<
        IApiReqParamsPostID,
        unknown,
        ReqBody,
        unknown,
        IApiWebReqLocals
    >,
    res: Response<ResJSON<Result | null>>
) => Promise<void>;

const Index: ApiWebPostUpdate = async (req, res) => {
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

        const post = await PostsModel.findOne({
            postID: parseInt(postID),
            userID,
        });

        if (!post) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const data = await post.updateByUser(req.body);

        if (typeof data !== 'boolean') {
            res.status(200).json({ status: 'Success', data });

            return;
        }

        if (!data) {
            const { status, message } = new createHttpError.BadRequest();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Post Update', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
