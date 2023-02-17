import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { NewsModel } from '@server/models';

// Interfaces
import type { ResJSON, IApiAppNewsShortlist } from '@interfaces';

// Request Interface
interface ReqQuery {
    page: string;
    region: string;
}

// Function Type
type ApiAppNewsShortlist = (
    req: Request<unknown, unknown, unknown, ReqQuery>,
    res: Response<ResJSON<IApiAppNewsShortlist>>
) => Promise<void>;

const Index: ApiAppNewsShortlist = async (req, res) => {
    const { page, region } = req.query;

    try {
        if (isNaN(parseInt(page))) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        const data = await NewsModel.getShortlistForApp(
            parseInt(page) - 1,
            region
        );

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App News Shortlist', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
