import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IPostResultGetForDashboardWeb,
    IPostType,
} from '@interfaces';

// Request Interface
interface ReqQuery {
    type: IPostType;
    page: string;
}

// Function Type
type ApiWebPostsForDashboard = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IPostResultGetForDashboardWeb>>
) => Promise<void>;

const Index: ApiWebPostsForDashboard = async (req, res) => {
    const { page, type } = req.query;

    try {
        if (isNaN(parseInt(page))) {
            const { status, message } = new createHttpError.BadRequest();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const data = await PostsModel.getForDashboardWeb(
            type,
            parseInt(page) - 1
        );

        if (!data) {
            const { status, message } = new createHttpError.BadRequest();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web Posts For Dashboard', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
