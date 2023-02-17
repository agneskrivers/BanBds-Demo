import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiReqParamsPostID } from '@interfaces';

// Function Type
type ApiWebPostCount = (
    req: Request<IApiReqParamsPostID>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiWebPostCount = async (req, res) => {
    const { postID } = req.params;

    try {
        if (isNaN(parseInt(postID))) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const post = await PostsModel.countViews(parseInt(postID));

        if (!post) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Post Count', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
