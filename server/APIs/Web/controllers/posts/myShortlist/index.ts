import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IApiWebReqLocals,
    IPostStatus,
    IApiWebPostMyShortlist,
} from '@interfaces';

// Request Interface
interface ReqQuery {
    page: string;
    status?: IPostStatus;
}

// Function Type
type ApiWebMyPosts = (
    req: Request<unknown, unknown, unknown, ReqQuery, IApiWebReqLocals>,
    res: Response<ResJSON<IApiWebPostMyShortlist>>
) => Promise<void>;

const Index: ApiWebMyPosts = async (req, res) => {
    const { page, status } = req.query;

    try {
        if (isNaN(parseInt(page))) {
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

        const data = await PostsModel.getMyShortlistForWeb(
            parseInt(page) - 1,
            userID,
            status
        );

        if (!data) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web My Posts', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
