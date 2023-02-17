import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { NewsModel } from '@server/models';

// Interfaces
import type { ResJSON } from '@interfaces';

// Request Interface
interface ReqParams {
    id: string;
}

// Function Type
type ApiWebNewsCount = (
    req: Request<ReqParams>,
    res: Response<ResJSON>
) => Promise<void>;

const Index: ApiWebNewsCount = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(parseInt(id))) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        const newsID = parseInt(id);

        const result = await NewsModel.countViews(newsID);

        if (!result) {
            const { status, message } = new createHttpError.NotFound();

            res.status(status).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success' });
    } catch (error) {
        const { message } = error as Error;

        handleError('API Web News Count', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
