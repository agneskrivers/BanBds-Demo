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
} from '@interfaces';

// Function Type
type ApiWebMyPostRemove = (
    req: Request<
        IApiReqParamsPostID,
        unknown,
        unknown,
        unknown,
        IApiWebReqLocals
    >,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiWebMyPostRemove = async (req, res) => {
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

        const isRemove = await post.removePost();

        if (!isRemove) {
            const { status, message } = new createHttpError.BadRequest();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Post Remove', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
