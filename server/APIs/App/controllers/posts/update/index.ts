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
    IPostUpdateForUser,
    IApiAppPostUpdateResult,
} from '@interfaces';

// Function Type
type ApiAppPostUpdate = (
    req: Request<
        IApiReqParamsPostID,
        unknown,
        IPostUpdateForUser,
        unknown,
        IApiAppReqLocals
    >,
    res: Response<ResJSON<IApiAppPostUpdateResult | null>>
) => Promise<void>;

const Index: ApiAppPostUpdate = async (req, res) => {
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

        const data = await post.updateByUser(req.body);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        if (data === true) {
            res.status(200).json({ status: 'Success' });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Post Update', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
