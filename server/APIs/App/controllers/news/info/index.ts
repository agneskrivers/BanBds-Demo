import { Request, Response } from 'express';
import createHttpError from 'http-errors';

// Helpers
import { handleError } from '@server/helpers';

// Models
import { NewsModel } from '@server/models';

// Interfaces
import type { ResJSON, INewsInfo } from '@interfaces';

// Request Interface
interface ReqParams {
    id: string;
}

// Function Type
type ApiAppNewsInfo = (
    req: Request<ReqParams>,
    res: Response<ResJSON<INewsInfo>>
) => Promise<void>;

const Index: ApiAppNewsInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await NewsModel.getInfoByID(id);

        if (!data) {
            const { statusCode, message } = new createHttpError.BadRequest();

            res.status(statusCode).json({ status: 'Not Process', message });

            return;
        }

        res.status(200).json({ status: 'Success', data });
    } catch (error) {
        const { message } = error as Error;

        handleError('API App News Info', message);

        const status = new createHttpError.InternalServerError();

        res.status(status.statusCode).json({
            status: 'Error',
            error: status.message,
        });
    }
};

export default Index;
