import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { NewsModel, PostsModel } from '@server/models';

// Interfaces
import type {
    ResJSON,
    IApiWebNewsShortlist,
    IPostResultGetForNews,
} from '@interfaces';

// Request Interface
interface ReqQuery {
    page: string;
    list?: number[];
}

// Function Type
type ApiWebNewsShortlist = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IApiWebNewsShortlist>>
) => Promise<void>;

const Index: ApiWebNewsShortlist = async (req, res) => {
    const { page, list } = req.query;

    try {
        if (isNaN(parseInt(page))) {
            const { status, message } = new createHttpError.BadRequest();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const convertPage = parseInt(page);

        let posts: IPostResultGetForNews | null = null;

        const news = await NewsModel.getShortlistForWeb(convertPage - 1, list);

        if (!news) {
            const { status, message } = new createHttpError.BadRequest();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        if (convertPage > 0) {
            posts = await PostsModel.getForNews();
        }

        res.status(200).json({ status: 'Success', data: { news, posts } });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web News Shortlist', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
