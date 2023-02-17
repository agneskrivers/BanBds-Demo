import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { PostsModel, NewsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiWebNewsInfo } from '@interfaces';

// Request Interface
interface ReqParams {
    id: string;
}

// Function Type
type ApiWebNewsInfo = (
    req: Request<ReqParams>,
    res: Response<ResJSON<IApiWebNewsInfo>>
) => Promise<void>;

const Index: ApiWebNewsInfo = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(parseInt(id))) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const newsID = parseInt(id);

        const result = await NewsModel.getInfoByNewsID(newsID);

        if (!result) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const posts = await PostsModel.getForNews();

        res.status(200).json({ status: 'Success', data: { ...result, posts } });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web News Info', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
