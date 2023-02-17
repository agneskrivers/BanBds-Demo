import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IPostInfoForWeb,
    IApiReqParamsPostID,
} from '@interfaces';

// Function Type
type ApiWebPostInfo = (
    req: Request<IApiReqParamsPostID>,
    res: Response<ResJSON<IPostInfoForWeb>>
) => Promise<void>;

const Index: ApiWebPostInfo = async (req, res) => {
    const { postID } = req.params;

    try {
        if (isNaN(parseInt(postID))) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const data = await PostsModel.getInfoForWeb(parseInt(postID));

        if (!data) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Post Info', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
