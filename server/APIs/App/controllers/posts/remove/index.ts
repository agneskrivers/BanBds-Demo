import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IApiAppReqLocals,
    IApiReqParamsPostID,
} from '@interfaces';

// Function Type
type ApiAppPostRemove = (
    req: Request<
        IApiReqParamsPostID,
        unknown,
        unknown,
        unknown,
        IApiAppReqLocals
    >,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiAppPostRemove = async (req, res) => {
    const { postID } = req.params;

    try {
        if (!req.res) throw new Error('Response Locals Not Found!');

        if (isNaN(parseInt(postID))) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const { userID } = req.res.locals;

        const post = await PostsModel.findOne({
            postID: parseInt(postID),
            userID,
        });

        if (!post) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const isRemove = await post.removePost();

        if (!isRemove) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Post Remove', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
