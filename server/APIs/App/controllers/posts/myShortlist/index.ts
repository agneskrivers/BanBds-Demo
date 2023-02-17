import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IPostType,
    IApiAppPostMyShortlistForAppResult,
    IApiAppReqLocals,
    IPostStatus,
} from '@interfaces';

// Request Interface
interface ReqQuery {
    page: string;
    status: Exclude<IPostStatus, 'sold'>;
    type: IPostType;
}

// Function Type
type ApiAppPostMyShortlist = (
    req: Request<unknown, unknown, unknown, ReqQuery, IApiAppReqLocals>,
    res: Response<ResJSON<IApiAppPostMyShortlistForAppResult>>
) => Promise<void>;

const Index: ApiAppPostMyShortlist = async (req, res) => {
    const { page, status, type } = req.query;

    try {
        if (!req.res) throw new Error('Response Locals Not Found!');

        if (isNaN(parseInt(page))) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const { userID } = req.res.locals;

        const data = await PostsModel.getMyShortlistForApp(
            parseInt(page) - 1,
            userID,
            type,
            status
        );

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App Post My Shortlist', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
